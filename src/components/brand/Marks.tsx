"use client";

import { motion } from "motion/react";
import { ease } from "@/lib/motion";

/* ------------------------------------------------------------------
   The logo PDF converts to *filled* outlines, which cannot stroke-draw.
   These monoline marks are re-authored as true stroked paths in the same
   line-art language as the logo's cookie ring and doodles, so they can be
   animated with stroke-dashoffset.
   ------------------------------------------------------------------ */

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (cx: number, cy: number, r: number, deg: number) =>
  [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))] as const;

/**
 * A circle with a scalloped bite removed — the logo's core motif.
 * Returns one continuous path so it draws in a single sweep.
 */
function ringWithBite({
  cx = 100,
  cy = 100,
  r = 82,
  biteStart = 205,
  biteEnd = 288,
  scallops = 5,
  depth = 0.66,
} = {}) {
  const [sx, sy] = pt(cx, cy, r, biteStart);
  const [ex, ey] = pt(cx, cy, r, biteEnd);

  // Long way round, from the bite's end back to its start.
  const sweepSpan = biteStart + 360 - biteEnd;
  const largeArc = sweepSpan > 180 ? 1 : 0;

  let d = `M ${ex.toFixed(2)} ${ey.toFixed(2)} `;
  d += `A ${r} ${r} 0 ${largeArc} 1 ${sx.toFixed(2)} ${sy.toFixed(2)} `;

  // Then eat back across the bite in alternating scallops.
  const span = biteEnd - biteStart;
  for (let i = 1; i <= scallops; i++) {
    const t0 = biteStart + (span * (i - 1)) / scallops;
    const t1 = biteStart + (span * (i - 0.5)) / scallops;
    const t2 = biteStart + (span * i) / scallops;
    const ctrlR = i % 2 === 1 ? r * depth : r * (depth + 0.16);
    const [qx, qy] = pt(cx, cy, ctrlR, t1);
    const [px, py] = pt(cx, cy, i === scallops ? r : r * 0.94, t2);
    void t0;
    d += `Q ${qx.toFixed(2)} ${qy.toFixed(2)} ${px.toFixed(2)} ${py.toFixed(2)} `;
  }
  return d.trim();
}

const RING_PATH = ringWithBite();

type MarkProps = {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
};

/** Static bitten-cookie ring. */
export function CookieRing({
  className,
  stroke = "currentColor",
  strokeWidth = 5,
}: MarkProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden>
      <path
        d={RING_PATH}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Bitten ring that draws itself — used by the preloader. */
export function CookieRingDraw({
  className,
  stroke = "currentColor",
  strokeWidth = 5,
  duration = 1.5,
  delay = 0,
}: MarkProps & { duration?: number; delay?: number }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden>
      <motion.path
        d={RING_PATH}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration, delay, ease: ease.expo }}
      />
    </svg>
  );
}

/* --- chip placement: hand-tuned so it reads scattered, never gridded --- */
const CHIPS: Array<[number, number, number, number]> = [
  // x, y, rx, rotation
  [78, 72, 9, 18],
  [118, 64, 7, -24],
  [61, 108, 8, 40],
  [104, 112, 10, -12],
  [138, 100, 6.5, 30],
  [86, 141, 7.5, -35],
  [126, 138, 6, 12],
  [52, 78, 5.5, -8],
];

/**
 * Monoline chocolate-chip cookie with a bite — the logo's decorative accent.
 * Used as drifting background furniture and as the scroll cue.
 */
export function CookieDoodle({
  className,
  stroke = "currentColor",
  strokeWidth = 4,
}: MarkProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden>
      <path
        d={RING_PATH}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {CHIPS.map(([x, y, r, rot], i) => (
        <rect
          key={i}
          x={x - r / 2}
          y={y - r / 2}
          width={r}
          height={r * 0.86}
          rx={r * 0.32}
          transform={`rotate(${rot} ${x} ${y})`}
          stroke={stroke}
          strokeWidth={strokeWidth * 0.8}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

/** Full logo lockup: bitten ring behind the hand-lettered wordmark. */
export function Logo({ className }: { className?: string }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/brand/pandur-logo.svg"
      alt="Pandur"
      className={className}
      draggable={false}
    />
  );
}

/** Wordmark only — tighter, for the sticky header. */
export function Wordmark({ className }: { className?: string }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/brand/pandur-wordmark.svg"
      alt="Pandur"
      className={className}
      draggable={false}
    />
  );
}
