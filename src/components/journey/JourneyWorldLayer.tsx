"use client";

import Image from "next/image";
import { useTransform, motion, type MotionValue } from "motion/react";
import { FLAVOUR_WORLDS, type FlavourWorld } from "@/lib/cookieJourney";

export default function JourneyWorldLayer({
  progress,
  reduced = false,
}: {
  progress: MotionValue<number>;
  reduced?: boolean;
}) {
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
      {/* Desktop Background Texture */}
      <div className="hidden md:block absolute inset-0 pointer-events-none select-none">
        <Image
          src="/ingredient/journey-bg.png"
          alt="Pandur Cookie Journey Background"
          fill
          sizes="100vw"
          className="object-cover object-center pointer-events-none select-none"
          priority
        />
      </div>

      {/* Mobile Dedicated Portrait Background Texture */}
      <div className="block md:hidden absolute inset-0 pointer-events-none select-none">
        <Image
          src="/ingredient/journey-bg-mobile.png"
          alt="Pandur Cookie Journey Mobile Background"
          fill
          sizes="100vw"
          className="object-cover object-center pointer-events-none select-none"
          priority
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

      {/* Only render the finale typography for "THE PERFECT PAIR" */}
      {FLAVOUR_WORLDS.filter((w) => w.id === "tea").map((world) => (
        <FinaleTextItem
          key={world.id}
          world={world}
          progress={progress}
          reduced={reduced}
        />
      ))}
    </div>
  );
}

function FinaleTextItem({
  world,
  progress,
  reduced,
}: {
  world: FlavourWorld;
  progress: MotionValue<number>;
  reduced?: boolean;
}) {
  const { start, end } = world;

  // Fade in during the finale phase (0.80 -> 1.0)
  const opacity = useTransform(
    progress,
    [start - 0.02, start + 0.05, end],
    [0, 1, 1]
  );

  const yParallax = useTransform(
    progress,
    [start, end],
    [14, -6]
  );

  if (reduced) return null;

  return (
    <motion.div
      style={reduced ? undefined : { opacity, y: yParallax }}
      className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-12 lg:p-16 select-none"
    >
      {/* Top Finale Tagline */}
      <div className="max-w-md">
        <span
          className="text-[0.65rem] md:text-xs font-black uppercase tracking-[0.24em] text-red-deep block mb-1 drop-shadow-sm"
        >
          The Finale
        </span>
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-ink drop-shadow-sm">
          {world.subtitle}
        </h3>
        <p className="mt-1 text-xs md:text-sm font-medium text-ink/80 max-w-sm">
          {world.tagline}
        </p>
      </div>

      {/* Massive Background Watermark Typography for THE PERFECT PAIR */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center overflow-hidden pointer-events-none">
        <span
          className="font-display font-black tracking-tighter text-[11vw] leading-none opacity-[0.06] block uppercase select-none text-ink"
        >
          {world.name}
        </span>
      </div>
    </motion.div>
  );
}
