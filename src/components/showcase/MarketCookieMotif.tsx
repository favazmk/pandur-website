"use client";

import { useTransform, motion, type MotionValue } from "motion/react";
import { CookieDoodle } from "@/components/brand/Marks";
import { MARKETS_DATA } from "@/lib/markets";

export default function MarketCookieMotif({
  progress,
  reduced,
}: {
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // Input scroll checkpoints matching the 8 market milestones
  const stops = [
    0,
    0.16, // Market 1: Sharjah
    0.26, // Market 2: Ajman
    0.36, // Market 3: Ras Al Khaimah
    0.46, // Market 4: Masafi
    0.56, // Market 5: Dibba
    0.66, // Market 6: Khorfakkan
    0.76, // Market 7: Fujairah
    0.86, // Market 8: Kalba
    1.0,
  ];

  // Coordinates array for cookie position
  const xPositions = [
    MARKETS_DATA[0].x - 18,
    MARKETS_DATA[0].x - 16,
    MARKETS_DATA[1].x - 16,
    MARKETS_DATA[2].x - 16,
    MARKETS_DATA[3].x - 16,
    MARKETS_DATA[4].x - 16,
    MARKETS_DATA[5].x - 16,
    MARKETS_DATA[6].x - 16,
    MARKETS_DATA[7].x - 16,
    MARKETS_DATA[7].x - 16,
  ];

  const yPositions = [
    MARKETS_DATA[0].y - 20,
    MARKETS_DATA[0].y - 20,
    MARKETS_DATA[1].y - 20,
    MARKETS_DATA[2].y - 20,
    MARKETS_DATA[3].y - 20,
    MARKETS_DATA[4].y - 20,
    MARKETS_DATA[5].y - 20,
    MARKETS_DATA[6].y - 20,
    MARKETS_DATA[7].y - 20,
    MARKETS_DATA[7].y - 20,
  ];

  const cookieX = useTransform(progress, stops, xPositions);
  const cookieY = useTransform(progress, stops, yPositions);

  // Rotation as the cookie travels along the route
  const rotation = useTransform(
    progress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, 45, -30, 60, 15]
  );

  // Gentle float scale
  const scale = useTransform(
    progress,
    [0, 0.1, 0.85, 1],
    [0, 1, 1, 0.95]
  );

  const opacity = useTransform(
    progress,
    [0, 0.08, 0.95, 1],
    [0, 1, 1, 0.9]
  );

  if (reduced) {
    return (
      <g transform={`translate(${MARKETS_DATA[5].x - 16}, ${MARKETS_DATA[5].y - 20})`}>
        <foreignObject width={32} height={32} className="overflow-visible pointer-events-none">
          <div className="h-8 w-8 text-amber-900/80 drop-shadow-[0_3px_6px_rgba(58,35,24,0.3)]">
            <CookieDoodle strokeWidth={4.5} className="h-full w-full" />
          </div>
        </foreignObject>
      </g>
    );
  }

  return (
    <motion.g style={{ x: cookieX, y: cookieY, opacity, scale }}>
      {/* 3 Trailing crumbs */}
      <motion.circle
        cx={-8}
        cy={12}
        r={1.8}
        fill="#8A5A2B"
        opacity={0.65}
        className="blur-[0.3px]"
      />
      <motion.circle
        cx={-14}
        cy={18}
        r={1.2}
        fill="#C5221F"
        opacity={0.5}
        className="blur-[0.2px]"
      />
      <motion.circle
        cx={-4}
        cy={16}
        r={1.4}
        fill="#8A6A3A"
        opacity={0.55}
        className="blur-[0.3px]"
      />

      {/* Floating Bitten Cookie Asset */}
      <foreignObject
        width={32}
        height={32}
        className="overflow-visible pointer-events-none"
      >
        <motion.div
          style={{ rotate: rotation }}
          className="h-8 w-8 text-amber-900 drop-shadow-[0_4px_8px_rgba(58,35,24,0.35)]"
        >
          <CookieDoodle strokeWidth={4.5} className="h-full w-full" />
        </motion.div>
      </foreignObject>
    </motion.g>
  );
}
