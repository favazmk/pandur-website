"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SplitLine } from "@/components/motion/Text";
import { usePrefersReducedMotion } from "@/lib/useMedia";

/**
 * Restraint section. One line, one expanding ring. The spec calls for holding
 * back here — the emptiness is what makes it land.
 */
export default function Vision() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.55, 2.6]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.5, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[70svh] items-center justify-center overflow-hidden bg-ink py-32"
    >
      {!reduced && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[42vmin] w-[42vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream"
          style={{ scale, opacity }}
        />
      )}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[26vmin] w-[26vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/25"
      />

      <div className="relative z-10 px-6 text-center">
        <p className="text-eyebrow text-cream/50">The Ambition</p>
        <SplitLine
          as="h2"
          text="Next: the GCC."
          className="text-display mt-6 font-display font-black text-cream"
        />
      </div>
    </section>
  );
}
