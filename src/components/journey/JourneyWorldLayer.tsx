"use client";

import Image from "next/image";
import { useTransform, motion, type MotionValue } from "motion/react";
import { FLAVOUR_WORLDS, type FlavourWorld } from "@/lib/cookieJourney";
import { useIsMobile } from "@/lib/useMedia";

export default function JourneyWorldLayer({
  progress,
  reduced = false,
}: {
  progress: MotionValue<number>;
  reduced?: boolean;
}) {
  const isMobile = useIsMobile();

  // Enhanced colour tint overlay for optimal text readability and brand contrast
  const tintColor = useTransform(
    progress,
    [0.0, 0.18, 0.22, 0.38, 0.42, 0.58, 0.62, 0.78, 0.82, 1.0],
    [
      "rgba(244, 231, 211, 0.46)", // Coconut warm tint
      "rgba(244, 231, 211, 0.46)",
      "rgba(247, 233, 201, 0.46)", // Peanut golden tint
      "rgba(247, 233, 201, 0.46)",
      "rgba(233, 240, 226, 0.46)", // Cardamom herbal tint
      "rgba(233, 240, 226, 0.46)",
      "rgba(245, 240, 214, 0.46)", // Butter dairy tint
      "rgba(245, 240, 214, 0.46)",
      "rgba(251, 245, 236, 0.52)", // Tea finale tint
      "rgba(251, 245, 236, 0.52)",
    ]
  );

  return (
    <div className="absolute inset-0 overflow-hidden select-none bg-[#F4E7D3]">
      {/*
       * One background, chosen by breakpoint.
       *
       * Both cuts used to be mounted with CSS hiding the wrong one, and both
       * carried `priority` — so every visitor preloaded a portrait background
       * and a landscape one, and threw one away. The section sits several
       * screens down the page, so `priority` was also competing with the hero
       * for the connection at the moment the hero needed it most. It is gone
       * on both counts: one file, and lazily, when the scroll approaches.
       */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <Image
          src={isMobile ? "/ingredient/journey-bg-mobile.webp" : "/ingredient/journey-bg.webp"}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center pointer-events-none select-none"
        />
      </div>

      {/* Dynamic Flavour World Tint Morphing Layer (Enhanced Readability Overlay) */}
      <motion.div
        style={{ backgroundColor: tintColor }}
        className="absolute inset-0 pointer-events-none select-none transition-colors duration-300"
      />

      {/* Subtle radial vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_65%_at_50%_40%,rgba(255,255,255,0.25),transparent_75%)]"
      />

      {/* Render all flavour world typography as cookie journeys through them */}
      {FLAVOUR_WORLDS.map((world, index) => (
        <WorldTextItem
          key={world.id}
          world={world}
          index={index}
          progress={progress}
          reduced={reduced}
        />
      ))}
    </div>
  );
}

function WorldTextItem({
  world,
  index,
  progress,
  reduced,
}: {
  world: FlavourWorld;
  index: number;
  progress: MotionValue<number>;
  reduced?: boolean;
}) {
  const { start, end } = world;
  const isFirst = index === 0;
  const isLast = index === FLAVOUR_WORLDS.length - 1;

  // Fade in at the start of the world, hold at 1 (full opacity), fade out at end (or hold for finale)
  const opacity = useTransform(
    progress,
    isFirst
      ? [0.0, end - 0.03, end]
      : isLast
      ? [start - 0.02, start + 0.02, 1.0]
      : [start - 0.02, start + 0.02, end - 0.03, end],
    isFirst
      ? [1, 1, 0]
      : isLast
      ? [0, 1, 1]
      : [0, 1, 1, 0]
  );

  const yParallax = useTransform(
    progress,
    [start, end],
    [10, -6]
  );

  const eyebrow = isLast ? "The Finale" : `Flavour 0${index + 1}`;

  return (
    <motion.div
      style={reduced ? (isFirst ? { opacity: 1 } : { opacity: 0 }) : { opacity, y: yParallax }}
      className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center p-6 pt-24 sm:pt-28 md:pt-30 lg:pt-32 select-none"
    >
      {/* Centered Top Flavour Information Card */}
      <div className="max-w-lg mx-auto flex flex-col items-center text-center">
        <span
          className="text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.24em] text-red-deep block mb-1 drop-shadow-sm"
        >
          {eyebrow}
        </span>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-ink drop-shadow-sm text-balance">
          {world.subtitle}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm font-medium text-ink/85 max-w-md drop-shadow-sm leading-relaxed text-balance">
          {world.tagline}
        </p>
      </div>
    </motion.div>
  );
}
