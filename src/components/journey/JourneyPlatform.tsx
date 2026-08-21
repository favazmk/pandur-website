"use client";

import { useTransform, motion, type MotionValue } from "motion/react";

export default function JourneyPlatform({
  progress,
  reduced = false,
}: {
  progress: MotionValue<number>;
  reduced?: boolean;
}) {
  // Reveal curves during active scroll
  const opacity = useTransform(progress, [0.05, 0.15, 0.8, 0.9], [0, 0.85, 0.85, 0]);

  return (
    <motion.svg
      style={reduced ? undefined : { opacity }}
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full select-none z-10"
      aria-hidden
    >
      <defs>
        <linearGradient id="rampStroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5E3720" stopOpacity="0.15" />
          <stop offset="25%" stopColor="#7A4718" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#4A6B2E" stopOpacity="0.2" />
          <stop offset="75%" stopColor="#C5221F" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#221F1F" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Coconut -> Peanut curved guide ramp */}
      <path
        d="M 120 480 Q 280 430 450 380 T 750 420"
        fill="none"
        stroke="url(#rampStroke)"
        strokeWidth="3"
        strokeDasharray="6 8"
      />

      {/* Cardamom -> Butter swoop curve */}
      <path
        d="M 320 340 C 420 460, 560 440, 720 390"
        fill="none"
        stroke="url(#rampStroke)"
        strokeWidth="2.5"
        strokeDasharray="4 6"
      />
    </motion.svg>
  );
}
