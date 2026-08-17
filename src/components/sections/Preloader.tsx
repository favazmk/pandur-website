"use client";

import { useEffect, useState } from "react";
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
  const [pct, setPct] = useState(0);

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
      setPct(Math.round(t * 100));
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
            className="mt-8 font-display text-2xl tabular-nums text-ink/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {pct}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
