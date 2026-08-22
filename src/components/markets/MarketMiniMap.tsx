"use client";

import { useTransform, motion, type MotionValue } from "motion/react";
import { UAE_LANDMASS_PATH, HAJAR_MOUNTAIN_PATH } from "@/lib/markets";
import { UAE_JOURNEY_MARKETS } from "@/lib/uaeJourney";

export default function MarketMiniMap({
  progress,
  className = "",
}: {
  progress: MotionValue<number>;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl bg-white/70 backdrop-blur-md p-2.5 sm:p-3 border border-ink/10 shadow-xs select-none ${className}`}
      aria-label="UAE Regional Progress Radar"
    >
      <div className="flex items-center justify-between gap-2 mb-1.5 px-0.5">
        <span className="text-[0.58rem] sm:text-[0.62rem] font-black uppercase tracking-[0.18em] text-ink/70">
          UAE Radar
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-red-deep animate-ping" />
      </div>

      <svg
        viewBox="100 30 500 540"
        className="w-20 sm:w-24 md:w-28 h-auto overflow-visible"
        fill="none"
      >
        {/* Landmass Silhouette */}
        <path
          d={UAE_LANDMASS_PATH}
          fill="#F2E6D4"
          stroke="#5E3720"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Mountain Ridge */}
        <path
          d={HAJAR_MOUNTAIN_PATH}
          stroke="#8A5A2B"
          strokeWidth="1.2"
          strokeDasharray="2 3"
          strokeOpacity="0.5"
          fill="none"
        />

        {/* 8 Market Mini Radar Nodes */}
        {UAE_JOURNEY_MARKETS.map((m) => (
          <MiniMapNode key={m.id} market={m} progress={progress} />
        ))}
      </svg>
    </div>
  );
}

function MiniMapNode({
  market,
  progress,
}: {
  market: (typeof UAE_JOURNEY_MARKETS)[0];
  progress: MotionValue<number>;
}) {
  // Approximate UAE map coordinates
  const mapCoords: Record<string, { cx: number; cy: number }> = {
    sharjah: { cx: 250, cy: 395 },
    ajman: { cx: 288, cy: 355 },
    "ras-al-khaimah": { cx: 375, cy: 195 },
    masafi: { cx: 435, cy: 320 },
    dibba: { cx: 505, cy: 165 },
    khorfakkan: { cx: 540, cy: 295 },
    fujairah: { cx: 546, cy: 380 },
    kalba: { cx: 536, cy: 460 },
  };

  const { cx, cy } = mapCoords[market.id] ?? { cx: 300, cy: 300 };

  const start = market.progress - 0.05;
  const end = market.progress + 0.06;

  const scale = useTransform(progress, [start, market.progress, end], [1, 2.2, 1.3], {
    clamp: true,
  });
  const fill = useTransform(
    progress,
    [start, market.progress, 1.0],
    ["#9E938B", "#C5221F", "#C5221F"],
    { clamp: true }
  );

  return (
    <g>
      <motion.circle
        cx={cx}
        cy={cy}
        r="4.5"
        style={{ scale, fill }}
        className="origin-center"
      />
      <circle cx={cx} cy={cy} r="1.5" fill="#FFFFFF" />
    </g>
  );
}
