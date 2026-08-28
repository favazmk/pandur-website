"use client";

import { useTransform, motion, type MotionValue } from "motion/react";
import { UAE_JOURNEY_MARKETS } from "@/lib/uaeJourney";

export default function MarketProgress({
  progress,
  className = "",
}: {
  progress: MotionValue<number>;
  className?: string;
}) {
  const barWidth = useTransform(progress, [0.08, 0.94], ["0%", "100%"], { clamp: true });

  return (
    <div
      className={`flex items-center gap-3 sm:gap-4 rounded-full bg-white/92 md:bg-white/75 md:backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 border border-ink/10 shadow-xs select-none ${className}`}
    >
      {/* City Title Swapper */}
      <div className="relative h-4 sm:h-5 overflow-hidden min-w-[90px] sm:min-w-[120px]">
        {UAE_JOURNEY_MARKETS.map((m) => (
          <MarketLabelItem key={m.id} market={m} progress={progress} />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="h-1 w-16 sm:w-24 overflow-hidden rounded-full bg-ink/10">
        <motion.div
          className="h-full origin-left bg-red-deep rounded-full"
          style={{ width: barWidth }}
        />
      </div>

      <span className="font-mono text-[0.62rem] sm:text-xs font-semibold tracking-wider text-ink/40 w-4 select-none">
        07
      </span>
    </div>
  );
}

function MarketLabelItem({
  market,
  progress,
}: {
  market: (typeof UAE_JOURNEY_MARKETS)[0];
  progress: MotionValue<number>;
}) {
  const start = market.progress - 0.05;
  const end = market.progress + 0.05;

  const opacity = useTransform(
    progress,
    [start, market.progress - 0.01, market.progress + 0.04, end + 0.02],
    [0, 1, 1, 0],
    { clamp: true }
  );

  const y = useTransform(
    progress,
    [start, market.progress, end + 0.02],
    [10, 0, -10],
    { clamp: true }
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center gap-1.5"
    >
      <span className="text-[0.6rem] sm:text-[0.68rem] font-black text-red-deep">
        {market.orderStr}
      </span>
      <span className="text-[0.6rem] sm:text-[0.68rem] font-extrabold uppercase tracking-wider text-ink">
        {market.name}
      </span>
    </motion.div>
  );
}
