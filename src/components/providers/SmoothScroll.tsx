"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/lib/useMedia";

/**
 * Lenis smooth scroll — the same foundation the benchmark uses.
 * Disabled entirely under prefers-reduced-motion so native scrolling is
 * restored rather than merely shortened.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Native scrolling on touch — smoothing hurts more than it helps there.
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    /**
     * Lenis does not handle in-page anchors, and because it owns the scroll
     * position a native jump gets dragged straight back. Route them through
     * Lenis so the skip link and any #section links actually work.
     */
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  /**
   * Reset scroll on navigation.
   *
   * Without this the App Router swaps the page but Lenis still holds the old
   * scroll target, and on the next frame it pulls the viewport back down — the
   * URL and content change while the view appears stuck, which reads as
   * "navigation is broken". `resize()` matters too: the new page is a different
   * height, and Lenis caches the old one.
   */
  useEffect(() => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      lenis.resize();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  /*
   * The prefers-reduced-motion block in globals.css only neutralises CSS
   * animations — Motion drives its animations in JS and ignores it entirely.
   * `reducedMotion="user"` makes every motion component on the site respect the
   * OS setting: transform and layout animations are dropped while opacity still
   * cross-fades, so content appears without flying around.
   */
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
