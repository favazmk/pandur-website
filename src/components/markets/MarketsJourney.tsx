"use client";

import { useTransform, motion, type MotionValue } from "motion/react";
import {
  UAE_JOURNEY_MARKETS,
  DESKTOP_JOURNEY_PATH,
  MOBILE_JOURNEY_PATH,
  STAGE_HEIGHT,
  type JourneyMarket,
  JOURNEY_PROGRESS_STOPS,
  DESKTOP_PATH_FRACTIONS,
  MOBILE_PATH_FRACTIONS,
} from "@/lib/uaeJourney";
import { SCENE_MAP } from "@/components/markets/MarketScenes";
import MarketCard from "@/components/markets/MarketCard";
import MarketNode from "@/components/markets/MarketNode";
import MarketProgress from "@/components/markets/MarketProgress";
import MarketMiniMap from "@/components/markets/MarketMiniMap";
import TravellingCookie from "@/components/markets/TravellingCookie";
import { MUTED } from "@/lib/assets";

export default function MarketsJourney({
  progress,
}: {
  progress: MotionValue<number>;
  reduced?: boolean;
}) {
  // Background Tint Morphing across the 8 markets
  const bgTint = useTransform(
    progress,
    [0.0, 0.12, 0.23, 0.34, 0.45, 0.56, 0.67, 0.78, 0.89, 0.96, 1.0],
    [
      "#FBF5EC", // Intro Cream
      "#FBF4E8", // Sharjah
      "#FAF1E0", // Ajman
      "#F5EFE4", // RAK
      "#F7EFE6", // Masafi
      "#EDF4F2", // Dibba
      "#EAF3F2", // Khorfakkan
      "#F4EFEA", // Fujairah
      "#EDF3EA", // Kalba
      "#FBF5EC", // Finale
      "#FBF5EC",
    ]
  );

  // Progressive SVG Path Drawing
  const desktopPathLength = useTransform(progress, JOURNEY_PROGRESS_STOPS, DESKTOP_PATH_FRACTIONS, { clamp: true });
  const mobilePathLength = useTransform(progress, JOURNEY_PROGRESS_STOPS, MOBILE_PATH_FRACTIONS, { clamp: true });

  // Virtual Stage Y Translation to keep active market centered in viewport
  // Stage starts at top-1/2 (viewport center), so stageY = -market.y centers it
  const desktopStageY = useTransform(
    progress,
    [0.0, 0.12, 0.23, 0.34, 0.45, 0.56, 0.67, 0.78, 0.89, 0.96, 1.0],
    [
      0,
      -520,  // Sharjah (y=520)
      -880,  // Ajman (y=880)
      -1240, // RAK (y=1240)
      -1600, // Masafi (y=1600)
      -1960, // Dibba (y=1960)
      -2320, // Khorfakkan (y=2320)
      -2680, // Fujairah (y=2680)
      -3040, // Kalba (y=3040)
      -3200, // Finale
      -3200,
    ]
  );

  const mobileStageY = useTransform(
    progress,
    [0.0, 0.12, 0.23, 0.34, 0.45, 0.56, 0.67, 0.78, 0.89, 0.96, 1.0],
    [
      0,
      -520,  // Sharjah
      -880,  // Ajman
      -1240, // RAK
      -1600, // Masafi
      -1960, // Dibba
      -2320, // Khorfakkan
      -2680, // Fujairah
      -3040, // Kalba
      -3200, // Finale
      -3200,
    ]
  );

  // Intro Overlay Opacity (Fades out before first market at 0.12)
  const introOpacity = useTransform(progress, [0.0, 0.02, 0.06], [1, 1, 0], { clamp: true });
  const introY = useTransform(progress, [0.0, 0.06], [0, -30], { clamp: true });

  // Finale Banner Opacity (Fades in well after Kalba at 0.89 has been shown)
  const finaleOpacity = useTransform(progress, [0.95, 0.99, 1.0], [0, 1, 1], { clamp: true });
  const finaleY = useTransform(progress, [0.95, 1.0], [40, 0], { clamp: true });

  return (
    <motion.div
      style={{ backgroundColor: bgTint }}
      className="sticky top-0 isolate flex h-screen w-full flex-col justify-between overflow-hidden transition-colors duration-500"
    >
      {/* Subtle Radial Atmosphere Wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(255,255,255,0.4),transparent_70%)]"
      />



      {/* --- Main Interactive Stage Container --- */}
      <div className="relative z-10 my-auto h-full w-full overflow-hidden flex items-center justify-center">
        {/* Intro Screen (0.0 -> 0.12) */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center select-none"
        >
          <div className="max-w-2xl bg-white/60 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-ink/8 shadow-sm">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.24em] text-red-deep block mb-2">
              UAE Retail Presence
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-ink">
              Already on the shelf.
            </h2>
            <p className="mt-3 text-sm sm:text-base md:text-lg font-medium text-ash max-w-lg mx-auto leading-relaxed">
              Four flavours, facing out, in stores across the northern Emirates.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-xs font-extrabold uppercase tracking-widest text-cream">
              <span>Eight markets · One taste</span>
            </div>
          </div>
        </motion.div>

        {/* ----------------- DESKTOP VERTICAL JOURNEY STAGE ----------------- */}
        <motion.div
          style={{ y: desktopStageY }}
          className="hidden md:block absolute top-1/2 w-full max-w-6xl h-[3600px] pointer-events-none will-change-transform"
        >
          {/* HTML Overlay Layers: 8 Pairs of (MarketCard, MarketScene) */}
          <div className="absolute inset-0 z-10">
            {UAE_JOURNEY_MARKETS.map((market) => (
              <DesktopMarketPair
                key={market.id}
                market={market}
                progress={progress}
              />
            ))}
          </div>

          <svg
            viewBox={`0 0 1000 ${STAGE_HEIGHT}`}
            className="w-full h-full overflow-visible relative z-20"
            fill="none"
          >
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C5221F" />
                <stop offset="25%" stopColor="#8A5A2B" />
                <stop offset="50%" stopColor="#4A6B2E" />
                <stop offset="75%" stopColor="#C5221F" />
                <stop offset="100%" stopColor="#8A5A2B" />
              </linearGradient>
            </defs>

            {/* Inactive Background Route (Dotted Guide Track) */}
            <path
              d={DESKTOP_JOURNEY_PATH}
              stroke="#5E3720"
              strokeWidth="2.5"
              strokeOpacity="0.15"
              strokeDasharray="6 8"
              fill="none"
            />

            {/* Active Drawing Route */}
            <motion.path
              d={DESKTOP_JOURNEY_PATH}
              stroke="url(#routeGradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              style={{ pathLength: desktopPathLength }}
            />

            {/* 8 Circular Destination Waypoint Nodes */}
            {UAE_JOURNEY_MARKETS.map((m) => (
              <MarketNode key={m.id} market={m} progress={progress} isMobile={false} />
            ))}

            {/* Travelling Cookie with Angle Tangent Following & Crumbs */}
            <TravellingCookie progress={progress} isMobile={false} />
          </svg>
        </motion.div>

        {/* ----------------- MOBILE VERTICAL JOURNEY STAGE ----------------- */}
        <motion.div
          style={{ y: mobileStageY }}
          className="block md:hidden absolute top-1/2 w-full max-w-sm h-[3600px] pointer-events-none will-change-transform"
        >
          {/* Mobile Overlay: Stacked Compact Cards & Scenes */}
          <div className="absolute inset-0 z-10">
            {UAE_JOURNEY_MARKETS.map((market) => (
              <MobileMarketPair
                key={market.id}
                market={market}
                progress={progress}
              />
            ))}
          </div>

          <svg
            viewBox={`0 0 400 ${STAGE_HEIGHT}`}
            className="w-full h-full overflow-visible relative z-20"
            fill="none"
          >
            <path
              d={MOBILE_JOURNEY_PATH}
              stroke="#5E3720"
              strokeWidth="2"
              strokeOpacity="0.15"
              strokeDasharray="4 6"
              fill="none"
            />

            <motion.path
              d={MOBILE_JOURNEY_PATH}
              stroke="#C5221F"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              style={{ pathLength: mobilePathLength }}
            />

            {UAE_JOURNEY_MARKETS.map((m) => (
              <MarketNode key={m.id} market={m} progress={progress} isMobile={true} />
            ))}

            <TravellingCookie progress={progress} isMobile={true} />
          </svg>
        </motion.div>

        {/* ----------------- FINALE OUTRO SCREEN (0.90 -> 1.0) ----------------- */}
        <motion.div
          style={{ opacity: finaleOpacity, y: finaleY }}
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center select-none"
        >
          <div className="max-w-2xl bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-ink/10 shadow-lg">
            <span className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.24em] text-red-deep block mb-2">
              The UAE Standard
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-ink">
              Eight markets. One taste.
            </h2>
            <p className="mt-3 text-xs sm:text-sm md:text-base font-medium text-ash max-w-md mx-auto leading-relaxed">
              From Khorfakkan bakery ovens with 45 years of craft, facing out across every premier shelf in the Emirates.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {UAE_JOURNEY_MARKETS.map((m) => (
                <span
                  key={m.id}
                  className="rounded-full bg-cream px-3 py-1 text-[0.65rem] sm:text-xs font-extrabold uppercase tracking-wider text-ink border border-ink/8"
                >
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Footer Note (Moved from bottom) */}
      <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 z-40 shrink-0 flex items-center justify-center text-center">
        <span className="text-[0.6rem] sm:text-[0.68rem] font-bold tracking-widest text-ink/40 uppercase">
          Scroll to explore the route
        </span>
      </div>

      {/* --- Bottom Chrome Bar --- */}
      <div className="absolute bottom-0 left-0 w-full z-40 flex items-end justify-between px-4 pb-6 sm:px-8 sm:pb-8 md:px-12 pointer-events-none">
        <div className="flex items-center gap-3 mb-2 sm:mb-4 pointer-events-auto">
          <span className={`text-eyebrow ${MUTED} text-[0.65rem] sm:text-xs drop-shadow-sm`}>
            In store
          </span>
          <MarketProgress progress={progress} />
        </div>

        {/* Mini UAE Radar Outline */}
        <div className="pointer-events-auto">
          <MarketMiniMap progress={progress} />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Desktop Market Pair: (MarketCard on one side, MarketScene on the opposite side)
 */
function DesktopMarketPair({
  market,
  progress,
}: {
  market: JourneyMarket;
  progress: MotionValue<number>;
}) {
  const SceneComponent = SCENE_MAP[market.id];
  const isLeft = market.side === "left";

  // Fade in early, hold at full opacity for a long plateau, fade out late
  const fadeIn = market.progress - 0.08;
  const fullStart = market.progress - 0.03;
  const fullEnd = market.progress + 0.06;
  const fadeOut = market.progress + 0.14;

  const opacity = useTransform(
    progress,
    [fadeIn, fullStart, fullEnd, fadeOut],
    [0, 1, 1, 0],
    { clamp: true }
  );

  const cardX = useTransform(
    progress,
    [fadeIn, fullStart, fullEnd, fadeOut],
    [isLeft ? -40 : 40, 0, 0, isLeft ? -40 : 40],
    { clamp: true }
  );

  const sceneX = useTransform(
    progress,
    [fadeIn, fullStart, fullEnd, fadeOut],
    [isLeft ? 40 : -40, 0, 0, isLeft ? 40 : -40],
    { clamp: true }
  );

  // Position relative to stage coordinate Y
  const topPercent = (market.desktop.y / STAGE_HEIGHT) * 100;

  return (
    <motion.div
      style={{
        top: `${topPercent}%`,
        opacity,
      }}
      className="absolute inset-x-0 -translate-y-1/2 flex items-center justify-between px-8 lg:px-14 pointer-events-none"
    >
      {/* Left Slot: Card if left side, Scene if right side */}
      <motion.div style={{ x: isLeft ? cardX : sceneX }} className="w-[42%] max-w-md pointer-events-auto">
        {isLeft ? (
          <MarketCard market={market} />
        ) : SceneComponent ? (
          <div className="flex items-center justify-center p-2">
            <SceneComponent accent={market.accent} />
          </div>
        ) : null}
      </motion.div>

      {/* Right Slot: Scene if left side, Card if right side */}
      <motion.div style={{ x: isLeft ? sceneX : cardX }} className="w-[42%] max-w-md flex justify-end pointer-events-auto">
        {isLeft ? (
          SceneComponent ? (
            <div className="flex items-center justify-center p-2 w-full">
              <SceneComponent accent={market.accent} />
            </div>
          ) : null
        ) : (
          <MarketCard market={market} />
        )}
      </motion.div>
    </motion.div>
  );
}

/**
 * Mobile Market Pair: Compact stacked Card & Scene
 */
function MobileMarketPair({
  market,
  progress,
}: {
  market: JourneyMarket;
  progress: MotionValue<number>;
}) {
  const SceneComponent = SCENE_MAP[market.id];
  const isLeft = market.side === "left";

  const fadeIn = market.progress - 0.08;
  const fullStart = market.progress - 0.03;
  const fullEnd = market.progress + 0.06;
  const fadeOut = market.progress + 0.14;

  const opacity = useTransform(
    progress,
    [fadeIn, fullStart, fullEnd, fadeOut],
    [0, 1, 1, 0],
    { clamp: true }
  );

  const y = useTransform(progress, [fadeIn, fullStart, fullEnd, fadeOut], [20, 0, 0, -20], { clamp: true });

  const topPercent = (market.mobile.y / STAGE_HEIGHT) * 100;

  return (
    <motion.div
      style={{
        top: `${topPercent}%`,
        opacity,
        y,
      }}
      className={`absolute -translate-y-1/2 w-full px-4 pointer-events-none flex flex-col ${
        isLeft ? "items-end pr-2" : "items-start pl-2"
      }`}
    >
      <div className="w-[78%] max-w-[260px] pointer-events-auto space-y-2">
        <MarketCard market={market} className="p-4" />
        {SceneComponent && (
          <div className="flex items-center justify-center p-1">
            <SceneComponent accent={market.accent} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
