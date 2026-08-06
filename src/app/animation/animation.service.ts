import { ApplicationRef, Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

/**
 * Central home for GSAP motion so timings and easing stay consistent, and so
 * the reduced-motion check lives in exactly one place rather than at each
 * call site.
 *
 * Durations are deliberately short — this is a dashboard people keep open all
 * day, so motion should read as polish and never as something to wait for.
 */
@Injectable({
  providedIn: 'root',
})
export class AnimationService {
  private readonly ENTER_DURATION = 0.32;
  private readonly LEAVE_DURATION = 0.22;
  private readonly STAGGER = 0.05;

  /**
   * Gadgets are created independently by their own host components, so there
   * is no single place that knows "this is the 3rd of 5". Any enters landing
   * within this window are treated as one batch and stepped, which turns a
   * board load into a stagger while a single add still animates immediately.
   */
  private readonly STAGGER_WINDOW_MS = 60;

  private readonly LAYOUT_DURATION = 0.45;

  /** Attribute Flip uses to match a gadget across a full re-render. */
  static readonly FLIP_ID_ATTR = 'data-flip-id';

  private staggerIndex = 0;
  private lastEnterAt = 0;

  private layoutState: Flip.FlipState | null = null;
  private suppressEnter = false;
  private suppressTimer: any = null;

  constructor(private appRef: ApplicationRef) {}

  get prefersReducedMotion(): boolean {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }

  /** Fades and lifts a gadget into place. No-op under reduced motion. */
  gadgetEnter(element: HTMLElement): void {
    // During a layout flip the gadgets are destroyed and rebuilt, so every
    // one of them would fire its enter animation and fight the flip that is
    // already moving them from their old positions.
    if (this.suppressEnter) return;
    if (this.prefersReducedMotion || !element) return;

    const now = Date.now();
    this.staggerIndex =
      now - this.lastEnterAt < this.STAGGER_WINDOW_MS ? this.staggerIndex + 1 : 0;
    this.lastEnterAt = now;

    gsap.from(element, {
      opacity: 0,
      y: 12,
      duration: this.ENTER_DURATION,
      delay: this.staggerIndex * this.STAGGER,
      ease: 'power2.out',
      // Leaving a transform behind would fight cdkDrag, which positions
      // dragged cards with transforms of its own.
      clearProps: 'opacity,transform',
    });
  }

  /**
   * Records where every gadget currently sits, ahead of a change that will
   * move them — a row's column count changing, a row being added, removed,
   * or reordered.
   *
   * Angular rebuilds the gadget components on these changes rather than
   * moving the existing DOM, so Flip matches the new elements back to the
   * recorded positions via the FLIP_ID_ATTR the gadget factory stamps on
   * each one. Without that they would be treated as unrelated elements.
   *
   * `{ kill: false }` matters here specifically because a person previewing
   * layouts clicks through several before settling — by default Flip.getState
   * force-completes (snaps) any Flip tween still running on these elements
   * before capturing a new state, so a second change mid-animation would cut
   * the first one short. This opts out of that snap and instead captures
   * wherever the elements currently, visually are — mid-flight or at rest —
   * so the next flip continues smoothly instead of restarting from a jump.
   */
  beginLayoutFlip(): void {
    if (this.prefersReducedMotion) return;

    // `kill` is a real, documented Flip.getState option that GSAP's bundled
    // Flip.d.ts just doesn't declare — the cast is working around a gap in
    // their types, not weakening ours.
    this.layoutState = Flip.getState(
      `[${AnimationService.FLIP_ID_ATTR}]`,
      { kill: false } as Flip.FlipStateVars
    );
    this.setSuppressEnter(true);
  }

  /**
   * Animates gadgets from their recorded positions to wherever the re-render
   * put them. Must be called after the DOM has actually updated.
   *
   * Two things have to be true for this to actually animate anything, and
   * neither is true by default:
   *
   * 1. `Flip.from(state, vars)` only re-matches elements by FLIP_ID_ATTR
   *    against a fresh `vars.targets` selector. Leave `targets` unset and it
   *    falls back to `state.targets` — the *original* elements captured in
   *    beginLayoutFlip — which Angular has by now destroyed and replaced, so
   *    the tween runs against detached, unrendered nodes and produces no
   *    visible motion.
   * 2. Gadgets are loaded via a dynamic `import()` (see
   *    GadgetGridCellHostComponent), which is asynchronous even for an
   *    already-cached chunk. detectChanges() only rebuilds the column
   *    structure synchronously; the new gadget elements — and the
   *    FLIP_ID_ATTR they stamp on themselves once loaded — don't exist yet
   *    by the time this runs. Re-querying the DOM immediately would just
   *    match zero elements.
   */
  completeLayoutFlip(): void {
    const state = this.layoutState;
    this.layoutState = null;

    if (!state) {
      this.setSuppressEnter(false);
      return;
    }

    this.waitForGadgetElements(state.targets.length).then(() => {
      Flip.from(state, {
        // Forces GSAP to re-query the live DOM and match by FLIP_ID_ATTR
        // instead of reusing the stale (by now destroyed) captured elements.
        targets: `[${AnimationService.FLIP_ID_ATTR}]`,
        duration: this.LAYOUT_DURATION,
        ease: 'power2.inOut',
        // Takes the gadgets out of flow while they move, so a card travelling
        // between columns of different widths doesn't drag the layout with it.
        absolute: true,
        nested: true,
        // Gadgets with no recorded position are genuinely new (or gone) rather
        // than moving, so they get a plain fade instead of a flight path.
        onEnter: (elements) =>
          gsap.fromTo(
            elements,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1, duration: this.ENTER_DURATION, ease: 'power2.out' }
          ),
        onLeave: (elements) =>
          gsap.to(elements, {
            opacity: 0,
            scale: 0.96,
            duration: this.LEAVE_DURATION,
            ease: 'power2.in',
          }),
        onComplete: () => {
          this.setSuppressEnter(false);
          this.notifyChartsToResize();
        },
      });
    });
  }

  /**
   * ngx-charts has no ResizeObserver — BaseChartComponent only re-measures
   * its container on a real `window` 'resize' event (debounced 200ms) or a
   * bound @Input change (see @swimlane/ngx-charts' bindWindowResizeEvent/
   * update). Flip moves and resizes gadget cards purely via transforms and
   * temporary absolute positioning, neither of which fires that event, so a
   * chart's <svg> is left sized against whatever it measured before the flip
   * started — visibly overflowing its card — until something nudges it.
   *
   * Dispatching the event alone isn't sufficient here, though: ngx-charts'
   * resize subscription recomputes its width/height correctly and calls
   * ChangeDetectorRef.markForCheck(), but — same gap EventService documents
   * for its own emits — a subscribe() callback reacting to an RxJS stream
   * doesn't qualify as one of the triggers zoneless Angular auto-schedules a
   * tick for, so the component's internal state updates while its <svg>
   * never actually re-renders. An explicit tick is what flushes it — but it
   * has to land *after* ngx-charts' own debounced subscription has actually
   * called markForCheck(), or it checks the component while it's still
   * clean and does nothing. Ticking twice, comfortably past the 200ms
   * debounce and then again shortly after, covers that race without
   * depending on either firing at exactly the expected moment; a tick when
   * nothing is dirty is a harmless no-op.
   */
  private notifyChartsToResize(): void {
    window.dispatchEvent(new Event('resize'));
    setTimeout(() => this.appRef.tick(), 350);
    setTimeout(() => this.appRef.tick(), 700);
  }

  /**
   * Every current layout mutation (row add/remove/move, column layout
   * change, width change) preserves the total gadget count — it only
   * relocates them — so the count recorded at beginLayoutFlip is exactly
   * what should exist again once every dynamic import above has resolved.
   * Resolves early if they're already there; otherwise waits for the
   * FLIP_ID_ATTR mutations that mark each gadget as mounted, capped by a
   * timeout so a failed gadget load can't hang the suppression indefinitely
   * (the existing setSuppressEnter fallback timer still releases it either
   * way).
   */
  private waitForGadgetElements(expectedCount: number): Promise<void> {
    const selector = `[${AnimationService.FLIP_ID_ATTR}]`;

    if (document.querySelectorAll(selector).length >= expectedCount) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      const finish = () => {
        clearTimeout(timeoutId);
        observer.disconnect();
        resolve();
      };

      const observer = new MutationObserver(() => {
        if (document.querySelectorAll(selector).length >= expectedCount) {
          finish();
        }
      });

      observer.observe(document.body, {
        attributes: true,
        attributeFilter: [AnimationService.FLIP_ID_ATTR],
        subtree: true,
      });

      const timeoutId = setTimeout(finish, 2000);
    });
  }

  /**
   * Flip's onComplete does not fire when there was nothing to animate, so the
   * suppression is also released on a timer — otherwise one no-op layout
   * change would silently disable every later enter animation. This is also
   * the safety net for the resize nudge below: if a tween gets superseded by
   * a later layout change and never reaches its own onComplete, this timer
   * still fires once the dust settles, so charts recover without needing a
   * manual refresh.
   */
  private setSuppressEnter(value: boolean): void {
    this.suppressEnter = value;

    if (this.suppressTimer) {
      clearTimeout(this.suppressTimer);
      this.suppressTimer = null;
    }

    if (value) {
      this.suppressTimer = setTimeout(() => {
        this.suppressEnter = false;
        this.suppressTimer = null;
        this.notifyChartsToResize();
      }, (this.LAYOUT_DURATION + 0.5) * 1000);
    }
  }

  /**
   * Fades a gadget out. Resolves when the element is safe to remove, or
   * immediately under reduced motion so removal is never delayed.
   */
  gadgetLeave(element: HTMLElement): Promise<void> {
    if (this.prefersReducedMotion || !element) return Promise.resolve();

    return new Promise<void>((resolve) => {
      gsap.to(element, {
        opacity: 0,
        y: -8,
        scale: 0.98,
        duration: this.LEAVE_DURATION,
        ease: 'power2.in',
        onComplete: () => resolve(),
      });
    });
  }
}
