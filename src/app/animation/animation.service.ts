import { Injectable } from '@angular/core';
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
   */
  beginLayoutFlip(): void {
    if (this.prefersReducedMotion) return;

    this.layoutState = Flip.getState(`[${AnimationService.FLIP_ID_ATTR}]`);
    this.setSuppressEnter(true);
  }

  /**
   * Animates gadgets from their recorded positions to wherever the re-render
   * put them. Must be called after the DOM has actually updated.
   */
  completeLayoutFlip(): void {
    const state = this.layoutState;
    this.layoutState = null;

    if (!state) {
      this.setSuppressEnter(false);
      return;
    }

    Flip.from(state, {
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
      onComplete: () => this.setSuppressEnter(false),
    });
  }

  /**
   * Flip's onComplete does not fire when there was nothing to animate, so the
   * suppression is also released on a timer — otherwise one no-op layout
   * change would silently disable every later enter animation.
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
