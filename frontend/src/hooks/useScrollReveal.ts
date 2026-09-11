'use client';

import { useEffect, useRef } from 'react';

/**
 * Attaches an IntersectionObserver to a container ref.
 * When the element enters the viewport, the CSS class `is-visible` is added
 * (which triggers the .reveal-section transition in globals.css).
 *
 * Only fires once per element — once visible, stays visible.
 * Uses transform/opacity only → GPU-accelerated, no layout jank.
 */
export function useScrollReveal<T extends HTMLElement>(
  threshold = 0.01
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If IntersectionObserver is not supported, reveal immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return;
    }

    // Respect prefers-reduced-motion — add class immediately if user prefers
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            observer.unobserve(el); // fire once only
          }
        });
      },
      { threshold, rootMargin: '100px 0px 100px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
