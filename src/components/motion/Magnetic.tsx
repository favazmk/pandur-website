"use client";

import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { spring } from "@/lib/motion";
import { HoverSweep } from "@/components/motion/Hover";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/useMedia";

/**
 * Magnetic wrapper — pulls toward the cursor once within ~80px.
 * Inert on touch and under reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.35,
  radius = 80,
  className,
}: {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useIsTouch();
  const reduced = usePrefersReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring.snap);
  const sy = useSpring(y, spring.snap);

  const onMove = (e: React.PointerEvent) => {
    if (touch || reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const falloff = Math.max(0, 1 - dist / (radius + r.width / 2));
    x.set(dx * strength * falloff);
    y.set(dy * strength * falloff);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className ?? ""}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}

/**
 * The benchmark's button trick: the label is duplicated and the pair rolls
 * vertically on hover, so the text swaps for an identical copy.
 */
export function RollLabel({ label }: { label: string }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="sr-only">{label}</span>
      <span aria-hidden className="block transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full">
        {label}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0"
      >
        {label}
      </span>
    </span>
  );
}

export function MagneticButton({
  label,
  href,
  onClick,
  variant = "solid",
  type = "button",
  className,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "outline";
  type?: "button" | "submit";
  className?: string;
}) {
  const base =
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full text-sm font-extrabold uppercase tracking-[0.16em] transition-colors duration-400";
  const styles =
    variant === "solid"
      ? // red-deep, not red: the label is 14px bold, which WCAG counts as small
        // text, and white on the brand red is only 4.36:1.
        "bg-red-deep text-white"
      : "border-2 border-ink text-ink group-hover:text-cream";

  // Two effects stacked: the ink background sweeps up from the bottom while the
  // label rolls to its duplicate.
  const inner = (
    <HoverSweep fill="bg-ink" className="w-full px-9 py-4">
      <RollLabel label={label} />
    </HoverSweep>
  );

  return (
    <Magnetic className={className}>
      {href ? (
        <a href={href} data-cursor="grow" className={`${base} ${styles}`}>
          {inner}
        </a>
      ) : (
        <button
          type={type}
          onClick={onClick}
          data-cursor="grow"
          className={`${base} ${styles}`}
        >
          {inner}
        </button>
      )}
    </Magnetic>
  );
}
