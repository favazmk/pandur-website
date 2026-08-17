"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ease, spring } from "@/lib/motion";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/useMedia";

/**
 * Custom cursor with three states:
 *   default          small dot
 *   grow             ring, over any link or button
 *   labelled         filled disc carrying a word, via data-cursor-label="Read"
 *
 * Purely decorative — the real cursor still shows, and nothing here is the only
 * signal that something is interactive. Never rendered on coarse pointers or
 * under reduced motion.
 */
export default function Cursor() {
  const touch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
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

      const target = e.target as HTMLElement | null;
      const labelled = target?.closest?.("[data-cursor-label]") as HTMLElement | null;
      if (labelled) {
        setLabel(labelled.dataset.cursorLabel ?? null);
        setActive(true);
        return;
      }
      setLabel(null);
      setActive(!!target?.closest?.('[data-cursor="grow"], a, button'));
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

  const size = label ? 84 : active ? 56 : 14;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[70] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.span
        className={`flex items-center justify-center rounded-full border-2 ${
          label ? "border-red-deep bg-red-deep" : "border-ink"
        } ${label ? "" : "mix-blend-difference"}`}
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor: label
            ? "#CE1419"
            : active
              ? "rgba(236,33,38,0)"
              : "#221F1F",
          x: -size / 2,
          y: -size / 2,
        }}
        transition={{ type: "spring", ...spring.snap }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-white"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25, ease: ease.pop }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </motion.div>
  );
}
