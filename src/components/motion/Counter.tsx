"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { ease } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useMedia";

/**
 * Odometer-style counter.
 *
 * Rolls up when it enters view and unwinds back to zero when it leaves, so it
 * matches the bidirectional reveals around it — a counter frozen on its final
 * value while everything else re-animates looks broken.
 *
 * Under reduced motion it renders the final figure immediately: the number is
 * information, so it must never depend on the animation running.
 */
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  className,
  duration = 1.6,
  replay = true,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
  replay?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: !replay, margin: "-15%" });
  const reduced = usePrefersReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduced) return;

    if (inView) {
      const controls = animate(0, value, {
        duration,
        ease: ease.expo,
        onUpdate: (v) => setN(Math.round(v)),
      });
      return () => controls.stop();
    }

    if (!replay) return;
    // Unwind on exit, faster than the roll-up so it feels like a reset.
    const controls = animate(value, 0, {
      duration: 0.4,
      ease: ease.expo,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduced, replay]);

  // Derived rather than pushed through state — the reduced-motion case must not
  // depend on an effect running to show the correct figure.
  const shown = reduced ? value : n;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
