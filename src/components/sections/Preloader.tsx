"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CookieRingDraw } from "@/components/brand/Marks";
import { ease } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useMedia";

/**
 * Preloader — the logo's bitten ring drawing itself.
 *
 * Hard-capped at ~1.8s and skipped entirely under reduced motion. It must never
 * invent delay: a fast connection should get past this almost immediately.
 */
export default function Preloader() {
  const reduced = usePrefersReducedMotion();
  const [elapsed, setElapsed] = useState(false);

  /*
   * The counter is written to the DOM, not held in state.
   *
   * It used to `setPct` on every animation frame, which is ~110 React renders
   * in the 1.8s the preloader is up — and that is the single worst moment on
   * the page to be re-rendering, because it is competing with hydration, the
   * hero video's first bytes and the font swap. The number is a leaf that
   * nothing else reads, so a ref writes it straight to the text node and React
   * is left out of the loop entirely.
   */
  const pctRef = useRef<HTMLSpanElement>(null);

  // Derived, not stored — reduced motion skips the preloader without needing an
  // effect to have run first.
  const done = reduced || elapsed;

  useEffect(() => {
    if (reduced) return;

    document.documentElement.style.overflow = "hidden";

    const start = performance.now();
    const CAP = 1800;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / CAP);
      const node = pctRef.current;
      if (node) node.textContent = String(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setElapsed(true);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, [reduced]);

  useEffect(() => {
    if (done) document.documentElement.style.overflow = "";
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-preloader flex flex-col items-center justify-center bg-cream"
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.7, ease: ease.expo }}
        >
          <CookieRingDraw
            className="h-32 w-32 text-ink md:h-44 md:w-44"
            strokeWidth={4}
            duration={1.5}
          />
          <motion.span
            ref={pctRef}
            className="mt-8 font-display text-2xl tabular-nums text-ink/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            0
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
