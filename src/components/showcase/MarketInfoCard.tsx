"use client";

import { useTransform, motion, type MotionValue, AnimatePresence } from "motion/react";
import { MARKETS_DATA, type Market, MARKET_SCROLL_STOPS } from "@/lib/markets";

export default function MarketInfoCard({
  progress,
  selectedMarket,
  hoveredMarket,
  reduced,
  compact = false,
}: {
  progress: MotionValue<number>;
  selectedMarket: Market | null;
  hoveredMarket: Market | null;
  reduced: boolean;
  compact?: boolean;
}) {
  // If user hovered or clicked a market, lock info card to that market
  const manual = hoveredMarket || selectedMarket;

  // Otherwise calculate active market index based on scroll progress
  const activeIndex = useTransform(progress, (p) => {
    for (let i = MARKET_SCROLL_STOPS.length - 1; i >= 0; i--) {
      if (p >= MARKET_SCROLL_STOPS[i].in - 0.03) {
        return i;
      }
    }
    return 0;
  });

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {manual ? (
          <MarketCardView
            key={`manual-${manual.id}`}
            market={manual}
            isInteractive
            compact={compact}
          />
        ) : (
          <ScrollMarketCardView
            activeIndex={activeIndex}
            reduced={reduced}
            compact={compact}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ScrollMarketCardView({
  activeIndex,
  reduced,
  compact,
}: {
  activeIndex: MotionValue<number>;
  reduced: boolean;
  compact?: boolean;
}) {
  return (
    <div className="relative">
      {MARKETS_DATA.map((m, i) => {
        return (
          <MarketCardItem
            key={m.id}
            market={m}
            index={i}
            activeIndex={activeIndex}
            reduced={reduced}
            compact={compact}
          />
        );
      })}
    </div>
  );
}

function MarketCardItem({
  market,
  index,
  activeIndex,
  reduced,
  compact,
}: {
  market: Market;
  index: number;
  activeIndex: MotionValue<number>;
  reduced: boolean;
  compact?: boolean;
}) {
  const opacity = useTransform(activeIndex, (curr) => (curr === index ? 1 : 0));
  const y = useTransform(activeIndex, (curr) => (curr === index ? 0 : curr > index ? -10 : 10));
  const pointerEvents = useTransform(activeIndex, (curr) => (curr === index ? "auto" : "none"));

  if (reduced && index !== 0) return null;

  return (
    <motion.div
      style={
        reduced
          ? undefined
          : {
              opacity,
              y,
              pointerEvents: pointerEvents as unknown as "auto" | "none",
              position: index === 0 ? "relative" : "absolute",
              top: 0,
              left: 0,
              right: 0,
            }
      }
      className={`rounded-2xl border border-ink/10 bg-cream/95 shadow-[0_10px_24px_rgba(58,35,24,0.07)] backdrop-blur-md transition-shadow ${
        compact ? "p-3.5" : "p-4 md:p-5"
      }`}
    >
      <CardContent market={market} compact={compact} />
    </motion.div>
  );
}

function MarketCardView({
  market,
  isInteractive,
  compact,
}: {
  market: Market;
  isInteractive?: boolean;
  compact?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`rounded-2xl border bg-cream/95 shadow-[0_14px_32px_rgba(58,35,24,0.1)] backdrop-blur-md ${
        compact ? "p-3.5" : "p-4 md:p-5"
      } ${
        isInteractive ? "border-red-deep/30 ring-2 ring-red-deep/15" : "border-ink/10"
      }`}
    >
      <CardContent market={market} compact={compact} />
    </motion.div>
  );
}

function CardContent({ market, compact }: { market: Market; compact?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.62rem] md:text-[0.68rem] font-black uppercase tracking-widest text-white shadow-xs"
          style={{ backgroundColor: market.accent }}
        >
          <span>Market</span>
          <span>{market.orderStr}</span>
        </span>
        <span className="text-[0.62rem] md:text-[0.68rem] font-bold tracking-wider text-ink/50 uppercase truncate">
          {market.region}
        </span>
      </div>

      <h3
        className={`mt-1.5 md:mt-2.5 font-display font-black tracking-tight text-ink ${
          compact ? "text-xl" : "text-xl md:text-2xl"
        }`}
      >
        {market.name}
      </h3>

      <p
        className={`mt-1 font-medium text-ink/75 leading-snug ${
          compact ? "text-xs line-clamp-2" : "text-xs md:text-sm"
        }`}
      >
        {market.description}
      </p>

      {market.flavourTag && (
        <div className="mt-2.5 md:mt-3.5 flex items-center gap-2 border-t border-ink/10 pt-2 text-[0.7rem] md:text-xs text-ink/65">
          <span className="h-1.5 w-1.5 rounded-full bg-red-deep shrink-0" />
          <span className="truncate">{market.flavourTag}</span>
        </div>
      )}
    </div>
  );
}
