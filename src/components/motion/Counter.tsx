"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { ease } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/useMedia";

/**
 * Odometer-style counter. Rolls to `value` the first time it enters view.
 * Under reduced motion it renders the final figure immediately — the number is
 * information, so it must never depend on the animation running.
 */
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  className,
  duration = 1.6,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduced = usePrefersReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduced || !inView) return;
    const controls = animate(0, value, {
      duration,
      ease: ease.expo,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduced]);

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
