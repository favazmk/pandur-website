"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { spring } from "@/lib/motion";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/useMedia";

/**
 * Custom cursor. Grows and inverts over anything marked `data-cursor="grow"`.
 * Never rendered on coarse pointers or under reduced motion.
 */
export default function Cursor() {
  const touch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, spring.snap);
  const sy = useSpring(y, spring.snap);

  useEffect(() => {
    if (touch || reduced) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const el = (e.target as HTMLElement)?.closest?.(
        '[data-cursor="grow"], a, button'
      );
      setActive(!!el);
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [touch, reduced, x, y]);

  if (touch || reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[70] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.span
        className="block rounded-full border-2 border-ink mix-blend-difference"
        animate={{
          width: active ? 56 : 14,
          height: active ? 56 : 14,
          opacity: visible ? 1 : 0,
          backgroundColor: active ? "rgba(236,33,38,0)" : "#221F1F",
          x: active ? -28 : -7,
          y: active ? -28 : -7,
        }}
        transition={{ type: "spring", ...spring.snap }}
      />
    </motion.div>
  );
}
