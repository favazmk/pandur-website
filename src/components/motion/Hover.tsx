"use client";

import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { spring } from "@/lib/motion";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/useMedia";

/* ------------------------------------------------------------------
   Hover vocabulary.

   Every effect here is decorative: the underlying content is always
   present and readable without hovering, all of it is inert on touch
   and under reduced motion, and none of it is the only way to reach
   information.
   ------------------------------------------------------------------ */

/** Shared guard — hover effects never run on touch or for reduced-motion users. */
function useHoverEnabled() {
  const touch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  return !touch && !reduced;
}

/* ---------------------------------------------------------------- 1 */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>*#%";

/**
 * Characters shuffle through random glyphs and resolve left-to-right.
 * The real string stays in the DOM for screen readers; only an aria-hidden
 * layer scrambles.
 */
export function HoverScramble({
  text,
  className,
  speed = 28,
  settleEvery = 2,
}: {
  text: string;
  className?: string;
  speed?: number;
  settleEvery?: number;
}) {
  const enabled = useHoverEnabled();
  // null = idle. Derived rather than synced, so a changing `text` prop needs no
  // effect to keep the rendered string in step with it.
  const [scrambled, setScrambled] = useState<string | null>(null);
  const display = scrambled ?? text;
  const frame = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setScrambled(null);
  }, []);

  useEffect(() => stop, [stop]);

  const start = () => {
    if (!enabled) return;
    frame.current = 0;
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      frame.current += 1;
      const settled = Math.floor(frame.current / settleEvery);
      if (settled >= text.length) {
        stop();
        return;
      }
      setScrambled(
        text
          .split("")
          .map((c, i) => {
            if (i < settled || c === " ") return c;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );
    }, speed);
  };

  return (
    <span
      className={className}
      onPointerEnter={start}
      onPointerLeave={stop}
      onFocus={start}
      onBlur={stop}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden className="tabular-nums">
        {display}
      </span>
    </span>
  );
}

/* ---------------------------------------------------------------- 2 */

/**
 * A soft light follows the pointer across the surface. Implemented with CSS
 * custom properties so there is no per-frame React work.
 */
export function HoverSpotlight({
  children,
  className,
  colour = "rgba(236,33,38,0.14)",
  size = 260,
}: {
  children: ReactNode;
  className?: string;
  colour?: string;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useHoverEnabled();

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !enabled) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--spot", "1");
  };

  const onLeave = () => ref.current?.style.setProperty("--spot", "0");

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative isolate overflow-hidden ${className ?? ""}`}
      style={
        {
          "--spot": 0,
          "--mx": "50%",
          "--my": "50%",
        } as React.CSSProperties
      }
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-under transition-opacity duration-500"
        style={{
          opacity: "var(--spot)",
          background: `radial-gradient(${size}px circle at var(--mx) var(--my), ${colour}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- 3 */

/** Each character lifts in sequence — a wave across the word. */
export function HoverLetters({
  text,
  className,
  lift = -6,
  stagger = 24,
}: {
  text: string;
  className?: string;
  lift?: number;
  stagger?: number;
}) {
  const enabled = useHoverEnabled();
  if (!enabled) return <span className={className}>{text}</span>;

  return (
    <span className={`group/letters inline-flex ${className ?? ""}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex">
        {[...text].map((c, i) => (
          <span
            key={i}
            className="inline-block transition-transform duration-300 ease-[var(--ease-pop)] group-hover/letters:[transform:translateY(var(--lift))]"
            style={
              {
                transitionDelay: `${i * stagger}ms`,
                "--lift": `${lift}px`,
              } as React.CSSProperties
            }
          >
            {c === " " ? " " : c}
          </span>
        ))}
      </span>
    </span>
  );
}

/* ---------------------------------------------------------------- 4 */

/** Inner content drifts opposite the pointer, so the frame gains depth. */
export function HoverDrift({
  children,
  className,
  amount = 14,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useHoverEnabled();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring.soft);
  const sy = useSpring(y, spring.soft);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !enabled) return;
    const r = el.getBoundingClientRect();
    x.set(-((e.clientX - r.left) / r.width - 0.5) * amount * 2);
    y.set(-((e.clientY - r.top) / r.height - 0.5) * amount * 2);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`overflow-hidden ${className ?? ""}`}
    >
      <motion.div style={enabled ? { x: sx, y: sy } : undefined}>
        {children}
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------- 5 */

/**
 * Rule that draws in from the left and retracts to the right on exit.
 *
 * `on="group"` makes it respond to the nearest ancestor marked `group` instead
 * of its own hover — needed when the real target is a whole card, not the text.
 */
export function HoverRule({
  children,
  className,
  colour = "bg-red-deep",
  on = "self",
}: {
  children: ReactNode;
  className?: string;
  colour?: string;
  on?: "self" | "group";
}) {
  const trigger =
    on === "group"
      ? "group-hover:origin-left group-hover:scale-x-100"
      : "group-hover/rule:origin-left group-hover/rule:scale-x-100";

  return (
    <span
      className={`${on === "self" ? "group/rule" : ""} relative inline-block ${className ?? ""}`}
    >
      {children}
      <span
        aria-hidden
        className={`absolute -bottom-1 left-0 h-[2px] w-full origin-right scale-x-0 ${colour} transition-transform duration-500 ease-[var(--ease-expo)] ${trigger}`}
      />
    </span>
  );
}

/* ---------------------------------------------------------------- 6 */

/** Background sweeps up behind the label and the text inverts. */
export function HoverSweep({
  children,
  className,
  fill = "bg-ink",
}: {
  children: ReactNode;
  className?: string;
  fill?: string;
}) {
  return (
    <span
      className={`group/sweep relative isolate inline-flex items-center justify-center overflow-hidden ${className ?? ""}`}
    >
      <span
        aria-hidden
        className={`absolute inset-0 -z-10 origin-bottom translate-y-full ${fill} transition-transform duration-500 ease-[var(--ease-expo)] group-hover/sweep:translate-y-0`}
      />
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- 7 */

/** Dashed outline that draws itself around the element on hover. */
export function HoverOutline({
  children,
  className,
  radius = 32,
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
}) {
  const enabled = useHoverEnabled();

  return (
    <span className={`group/outline relative block ${className ?? ""}`}>
      {children}
      {enabled && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          fill="none"
          preserveAspectRatio="none"
        >
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx={radius}
            stroke="currentColor"
            strokeWidth="2"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
            className="opacity-0 transition-all duration-700 ease-[var(--ease-expo)] group-hover/outline:opacity-100 group-hover/outline:[stroke-dashoffset:0]"
          />
        </svg>
      )}
    </span>
  );
}
