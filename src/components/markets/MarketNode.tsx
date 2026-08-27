"use client";

import { useTransform, motion, type MotionValue } from "motion/react";
import { type JourneyMarket } from "@/lib/uaeJourney";

export default function MarketNode({
  market,
  progress,
  isMobile = false,
}: {
  market: JourneyMarket;
  progress: MotionValue<number>;
  isMobile?: boolean;
}) {
  const coord = isMobile ? market.mobile : market.desktop;
  const targetP = market.progress;

  // Window calculations
  const approachStart = targetP - 0.07;
  const activeWindow = targetP;
  const completeStart = targetP + 0.05;

  // Node scale
  const scale = useTransform(
    progress,
    [approachStart, activeWindow, completeStart],
    [0.85, 1.25, 1.0],
    { clamp: true }
  );

  // Pulse ring opacity (only visible around active window)
  const ringOpacity = useTransform(
    progress,
    [approachStart, activeWindow - 0.02, activeWindow, activeWindow + 0.04, completeStart],
    [0, 0.4, 0.85, 0.3, 0],
    { clamp: true }
  );
  const ringScale = useTransform(
    progress,
    [approachStart, activeWindow, completeStart],
    [0.9, 1.7, 1.0],
    { clamp: true }
  );

  // Core fill
  const coreFill = useTransform(
    progress,
    [approachStart, activeWindow, 1.0],
    ["#FFFFFF", market.accent, market.accent],
    { clamp: true }
  );

  const strokeColor = useTransform(
    progress,
    [approachStart, activeWindow, 1.0],
    ["#9E938B", "#221F1F", "#221F1F"],
    { clamp: true }
  );

  return (
    <g transform={`translate(${coord.x}, ${coord.y})`}>
      {/* Soft Pulse Ripple Ring */}
      <motion.circle
        r={isMobile ? 22 : 28}
        fill="none"
        stroke={market.accent}
        strokeWidth="2"
        style={{ opacity: ringOpacity, scale: ringScale }}
      />

      {/* Main Circular Marker Group */}
      <motion.g style={{ scale }}>
        {/* Outer Shadow Circle */}
        <circle r={isMobile ? 14 : 17} fill="#221F1F" fillOpacity="0.08" cy="2" />

        {/* Base Circle */}
        <motion.circle
          r={isMobile ? 12 : 15}
          style={{ fill: coreFill, stroke: strokeColor }}
          strokeWidth="2.5"
        />

        {/* Center Inner Dot */}
        <circle r={isMobile ? 4 : 5} fill="#FFFDF9" />
      </motion.g>

    </g>
  );
}
