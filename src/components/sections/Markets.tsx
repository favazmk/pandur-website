"use client";

import { useRef, useState } from "react";
import {
  useScroll,
  useSpring,
  useTransform,
  motion,
} from "motion/react";
import UaeMap from "@/components/showcase/UaeMap";
import MarketInfoCard from "@/components/showcase/MarketInfoCard";
import MarketPackages from "@/components/showcase/MarketPackages";
import { MARKETS_DATA, type Market } from "@/lib/markets";
import { useClientValue, usePrefersReducedMotion } from "@/lib/useMedia";
import { MUTED } from "@/lib/assets";

export default function Markets() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const mounted = useClientValue(() => true, false);

  const [hoveredMarket, setHoveredMarket] = useState<Market | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const damped = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 38,
    mass: 0.25,
    restDelta: 0.0001,
  });

  const progress = reduced ? scrollYProgress : damped;

  // Heading transition: starts with "Already on the shelf." and culminates into "Eight markets. One taste."
  const headingFadeOut = useTransform(progress, [0.7, 0.78], [1, 0], { clamp: true });
  const headingFadeIn = useTransform(progress, [0.78, 0.86], [0, 1], { clamp: true });

  // Progress percentage indicator
  const progressWidth = useTransform(progress, [0.1, 0.9], ["0%", "100%"], { clamp: true });

  /* ---------- Reduced Motion Fallback ---------- */
  if (!mounted || reduced) {
    return (
      <section id="markets" className="relative overflow-hidden bg-cream py-16 md:py-28 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className={`text-eyebrow ${MUTED}`}>In store</span>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl md:text-5xl">
              Eight markets. One taste.
            </h2>
            <p className="text-lead mt-3 text-ash text-sm sm:text-base">
              Four flavours, facing out, in stores across the northern Emirates.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 items-center gap-8 lg:mt-14 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
            <UaeMap
              progress={scrollYProgress}
              hoveredMarket={hoveredMarket}
              selectedMarket={selectedMarket}
              onHoverMarket={setHoveredMarket}
              onSelectMarket={setSelectedMarket}
              reduced={true}
            />

            <div className="space-y-4 md:space-y-6">
              <MarketInfoCard
                progress={scrollYProgress}
                selectedMarket={selectedMarket ?? MARKETS_DATA[0]}
                hoveredMarket={hoveredMarket}
                reduced={true}
              />
              <MarketPackages progress={scrollYProgress} reduced={true} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- Desktop & Mobile Pinned Interactive Experience ---------- */
  return (
    <section
      ref={ref}
      id="markets"
      aria-label="Pandur UAE Shelf Presence and Distribution Map"
      className="relative h-[340vh] md:h-[400vh] bg-cream"
    >
      <div className="sticky top-0 isolate flex h-screen w-full flex-col justify-between overflow-hidden px-4 py-4 sm:px-6 sm:py-6 md:px-12 md:py-8 lg:px-16 lg:py-10">
        {/* Subtle Ambient Radial Wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_45%,rgba(223,206,124,0.18),transparent_70%)]"
        />

        {/* --- Top Chrome Bar --- */}
        <div className="relative z-10 flex shrink-0 items-center justify-between">
          <span className={`text-eyebrow ${MUTED} text-[0.65rem] sm:text-xs`}>In store</span>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[0.58rem] sm:text-[0.65rem] font-black uppercase tracking-[0.16em] sm:tracking-[0.2em] text-ink/60">
              UAE Distribution
            </span>
            <div className="h-1 w-14 sm:w-20 overflow-hidden rounded-full bg-ink/10">
              <motion.div
                className="h-full origin-left bg-red-deep"
                style={{ width: progressWidth }}
              />
            </div>
          </div>
        </div>

        {/* --- Center Main Stage: Editorial Copy + Map Centerpiece --- */}
        <div className="relative z-10 my-auto grid w-full grid-cols-1 items-center gap-4 sm:gap-6 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
          {/* Left Column (Desktop) / Top Area (Mobile) */}
          <div className="flex flex-col justify-center">
            {/* Title container with responsive height */}
            <div className="relative min-h-[4rem] sm:min-h-[4.8rem] lg:min-h-[6.5rem]">
              {/* Initial Title */}
              <motion.div
                style={{ opacity: headingFadeOut }}
                className="absolute inset-0"
              >
                <h2 className="font-display text-2xl font-black tracking-tight text-ink sm:text-3xl md:text-4xl lg:text-5xl">
                  Already on the shelf.
                </h2>
                <p className="text-lead mt-1 sm:mt-2 max-w-md text-xs sm:text-sm md:text-base text-ash">
                  Four flavours, facing out, in stores across the northern Emirates.
                </p>
              </motion.div>

              {/* Culminating Title */}
              <motion.div
                style={{ opacity: headingFadeIn }}
                className="pointer-events-none absolute inset-0"
              >
                <h2 className="font-display text-2xl font-black tracking-tight text-ink sm:text-3xl md:text-4xl lg:text-5xl">
                  Eight markets. One taste.
                </h2>
                <p className="text-lead mt-1 sm:mt-2 max-w-md text-xs sm:text-sm md:text-base text-red-deep font-bold">
                  From Khorfakkan bakery ovens across every premier UAE shelf.
                </p>
              </motion.div>
            </div>

            {/* Active Market Info Card (Desktop & Tablet) */}
            <div className="hidden lg:block mt-6">
              <MarketInfoCard
                progress={progress}
                selectedMarket={selectedMarket}
                hoveredMarket={hoveredMarket}
                reduced={reduced}
              />
            </div>

            {/* 4-Flavour Package Group (Desktop) */}
            <div className="hidden lg:block mt-4">
              <MarketPackages progress={progress} reduced={reduced} />
            </div>
          </div>

          {/* Right Column: Stylized Interactive UAE Map */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-[460px] sm:max-w-[540px] lg:max-w-none max-h-[38vh] sm:max-h-[44vh] lg:max-h-none flex items-center justify-center">
              <UaeMap
                progress={progress}
                hoveredMarket={hoveredMarket}
                selectedMarket={selectedMarket}
                onHoverMarket={setHoveredMarket}
                onSelectMarket={setSelectedMarket}
                reduced={reduced}
              />
            </div>

            {/* Mobile/Tablet Info Card & Packages Below Map */}
            <div className="block lg:hidden mt-2 sm:mt-4 w-full max-w-md">
              <MarketInfoCard
                progress={progress}
                selectedMarket={selectedMarket}
                hoveredMarket={hoveredMarket}
                reduced={reduced}
                compact={true}
              />
              <MarketPackages progress={progress} reduced={reduced} className="mt-2" />
            </div>
          </div>
        </div>

        {/* --- Bottom Navigation Market Ticks --- */}
        <div className="relative z-10 shrink-0 flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-2 border-t border-ink/8">
          <span className="shrink-0 mr-1 text-[0.58rem] sm:text-[0.62rem] font-bold uppercase tracking-widest text-ink/40">
            Markets:
          </span>
          {MARKETS_DATA.map((m) => {
            const isTarget =
              (hoveredMarket?.id ?? selectedMarket?.id) === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMarket(m)}
                onPointerEnter={() => setHoveredMarket(m)}
                onPointerLeave={() => setHoveredMarket(null)}
                className={`shrink-0 flex items-center gap-1 sm:gap-1.5 rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-[0.6rem] sm:text-[0.68rem] font-extrabold uppercase tracking-wider transition-all ${
                  isTarget
                    ? "bg-ink text-cream shadow-xs"
                    : "bg-white/60 text-ink/75 hover:bg-white hover:text-ink border border-ink/10"
                }`}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: m.accent }}
                />
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
