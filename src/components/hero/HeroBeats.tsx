"use client";

import { type ReactNode } from "react";
import { useTransform, motion, type MotionValue } from "motion/react";

export type Beat = {
  text: string;
  note: string;
  in: number;
  out: number;
};

export default function HeroBeats({
  progress,
  beats,
  active,
  footer,
  className = "",
  footerClassName = "",
}: {
  progress: MotionValue<number>;
  beats: Beat[];
  active: boolean;
  footer?: ReactNode;
  className?: string;
  footerClassName?: string;
}) {
  return (
    <>
      <div className={className}>
        {beats.map((b, i) => (
          <BeatItem
            key={b.text}
            beat={b}
            index={i}
            progress={progress}
            active={active}
          />
        ))}
      </div>

      {footer ? (
        <div className={`relative z-20 ${footerClassName}`}>
          {footer}
        </div>
      ) : null}
    </>
  );
}

function BeatItem({
  beat,
  index,
  progress,
  active,
}: {
  beat: Beat;
  index: number;
  progress: MotionValue<number>;
  active: boolean;
}) {
  const opacity = useTransform(progress, (p) => {
    if (!active) {
      return index === 0 ? 1 : 0;
    }
    
    let o = 0;
    if (p >= beat.in && p <= beat.out) {
      // the first line is already up at rest; the last one never leaves
      const rising = index === 0 ? 1 : (p - beat.in) / 0.12;
      const falling = index === 2 ? 1 : (beat.out - p) / 0.12;
      o = Math.max(0, Math.min(1, rising, falling));
    }
    return o;
  });

  const visibility = useTransform(opacity, (o) => (o < 0.01 ? "hidden" : "visible"));
  const pointerEvents = useTransform(opacity, (o) => (o > 0 ? "auto" : "none"));

  return (
    <motion.div
      style={{ opacity, visibility, pointerEvents }}
      className="absolute inset-x-0 top-0"
    >
      <p className="text-hero-split font-display font-black text-balance text-ink drop-shadow-sm whitespace-pre-line">
        {beat.text}
      </p>
      <p className="text-eyebrow mt-4 font-bold tracking-[0.24em] text-ink drop-shadow-sm">
        {beat.note}
      </p>
    </motion.div>
  );
}
