"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import Marquee from "@/components/motion/Marquee";
import { usePrefersReducedMotion } from "@/lib/useMedia";

/**
 * Full-bleed red band. The only place red is allowed to fill a whole area —
 * everywhere else it stays an accent.
 *
 * Two bands, opposite directions, different speeds (40s / 60s), per the rule
 * that neighbouring bands must never share a tempo. The whole slab is also
 * rotated in 3D by scroll position, so it tips toward you on approach and away
 * on exit rather than sliding flat past the viewport.
 */
export default function MarqueeBand() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [18, 0, -18]),
    { stiffness: 120, damping: 28 }
  );
  const skewY = useTransform(scrollYProgress, [0, 0.5, 1], [-2.5, 0, 2.5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.92]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-red-deep py-10 text-white md:py-14"
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={
          reduced ? undefined : { rotateX, skewY, scale, transformStyle: "preserve-3d" }
        }
      >
        <Marquee
          speed={40}
          itemClassName="text-band whitespace-pre font-display font-black"
          repeat={3}
        >
          {"MADE TO GROW · "}
        </Marquee>

        <Marquee
          speed={60}
          reverse
          className="mt-4"
          itemClassName="text-eyebrow whitespace-pre text-white"
          repeat={6}
        >
          {"OUR SIGNATURE TASTE · "}
        </Marquee>
      </motion.div>
    </section>
  );
}
