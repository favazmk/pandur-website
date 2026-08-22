"use client";

import { type JourneyMarket } from "@/lib/uaeJourney";

export default function MarketCard({
  market,
  className = "",
}: {
  market: JourneyMarket;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] rounded-3xl bg-[#FFFDF9]/95 backdrop-blur-xl p-5 sm:p-6 md:p-7 border border-ink/10 shadow-[0_16px_36px_rgba(34,31,31,0.08)] select-none transition-all ${className}`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-ink/8 pb-3">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: market.accent }}
          />
          <span className="text-[0.62rem] sm:text-xs font-black uppercase tracking-[0.22em] text-red-deep">
            Market {market.orderStr}
          </span>
        </div>
        <span className="text-[0.58rem] sm:text-[0.65rem] font-bold uppercase tracking-wider text-ash">
          {market.region}
        </span>
      </div>

      {/* Destination Name */}
      <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-ink mt-3 sm:mt-4">
        {market.name}
      </h3>

      {/* Description */}
      <p className="mt-2 text-xs sm:text-sm font-medium text-ink/80 leading-relaxed">
        {market.description}
      </p>

    </div>
  );
}
