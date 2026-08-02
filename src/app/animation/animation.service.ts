import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

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

  private staggerIndex = 0;
  private lastEnterAt = 0;

  get prefersReducedMotion(): boolean {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }

  /** Fades and lifts a gadget into place. No-op under reduced motion. */
  gadgetEnter(element: HTMLElement): void {
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
