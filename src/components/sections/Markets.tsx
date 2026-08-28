"use client";

import { useRef } from "react";
import { useScroll, useSpring } from "motion/react";
import MarketsJourney from "@/components/markets/MarketsJourney";
import { UAE_JOURNEY_MARKETS } from "@/lib/uaeJourney";
import { SCENE_MAP } from "@/components/markets/MarketScenes";
import MarketCard from "@/components/markets/MarketCard";
import { useClientValue, usePrefersReducedMotion } from "@/lib/useMedia";
import { MUTED } from "@/lib/assets";

export default function Markets() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const mounted = useClientValue(() => true, false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const damped = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 38,
    mass: 0.22,
    restDelta: 0.0001,
  });

  const progress = reduced ? scrollYProgress : damped;

  /* ---------- Reduced Motion Fallback ---------- */
  if (!mounted || reduced) {
    return (
      <section
        id="markets"
        aria-label="Pandur UAE Shelf Presence"
        className="relative overflow-hidden bg-cream py-16 md:py-28 lg:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className={`text-eyebrow ${MUTED}`}>In store</span>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl md:text-5xl">
              Already on the shelf.
            </h2>
            <p className="text-lead mt-3 text-ash text-sm sm:text-base">
              Four flavours, facing out, in stores across the northern Emirates.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-deep px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white">
              Seven emirates · One taste
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {UAE_JOURNEY_MARKETS.map((market) => {
              const Scene = SCENE_MAP[market.id];
              return (
                <div
                  key={market.id}
                  className="flex flex-col sm:flex-row items-center gap-4 rounded-3xl bg-white/92 md:bg-white/70 md:backdrop-blur-md p-4 border border-ink/10 shadow-xs"
                >
                  <div className="w-full sm:w-1/2">
                    <MarketCard market={market} className="max-w-none shadow-none" />
                  </div>
                  {Scene && (
                    <div className="w-full sm:w-1/2 flex items-center justify-center p-2">
                      <Scene accent={market.accent} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  /* ---------- Interactive Pinned Vertical Journey ---------- */
  return (
    <section
      ref={ref}
      id="markets"
      aria-label="Pandur UAE Vertical Market Journey"
      className="relative h-[740vh] md:h-[820vh] bg-cream"
    >
      <MarketsJourney progress={progress} reduced={reduced} />
    </section>
  );
}
