"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import {
  HeroScene,
  FourCardsScene,
  WhyPartnerScene,
  BusinessFlowScene,
  EcosystemScene,
  GrowthScene,
  JourneyScene,
  CTAScene,
} from "./FranchiseScenes";

/**
 * PROTAGONIST COOKIE
 * Transforms smoothly across all 8 scenes using the normalized scroll progress.
 */
function ProtagonistCookie({ progress }: { progress: MotionValue<number> }) {
  // We define keyframes for each section's start and end.
  // 0.00-0.15: Hero
  // 0.15-0.30: Cards
  // 0.30-0.48: Why Partner
  // 0.48-0.63: Business Flow
  // 0.63-0.75: Ecosystem
  // 0.75-0.88: Growth
  // 0.88-0.95: Journey
  // 0.95-1.00: CTA

  const input = [
    0.00, 0.15, // Hero
    0.16, 0.29, // Cards
    0.30, 0.48, // Why Partner
    0.49, 0.52, 0.55, 0.58, 0.63, // Business Flow (zig-zag points)
    0.64, 0.75, // Ecosystem
    0.76, 0.88, // Growth
    0.89, 0.95, // Journey
    0.96, 1.00  // CTA
  ];

  // X position
  const x = useTransform(progress, input, [
    "0%", "0%",       // Hero
    "0%", "0%",       // Cards
    "0%", "0%",       // Why
    "-30vw", "30vw", "-30vw", "30vw", "0%", // Business Flow
    "0%", "0%",       // Ecosystem
    "0%", "20vw",     // Growth
    "0%", "0%",       // Journey
    "0%", "0%"        // CTA
  ]);

  // Y position
  const y = useTransform(progress, input, [
    "0%", "0%",       // Hero
    "-35vh", "-35vh", // Cards (moves above cards)
    "0%", "0%",       // Why
    "-40vh", "-20vh", "0vh", "20vh", "40vh", // Business Flow (moves down)
    "0%", "0%",       // Ecosystem
    "0%", "-10vh",    // Growth (moves up slightly)
    "-20vh", "10vh",  // Journey (moves from top to shelf)
    "0%", "0%"        // CTA
  ]);

  // Scale (using raw numbers for scale transform)
  const scale = useTransform(progress, input, [
    1, 0.9,           // Hero
    0.5, 0.5,         // Cards
    1, 1,             // Why
    0.3, 0.3, 0.3, 0.3, 0.3, // Business Flow
    0.8, 0.8,         // Ecosystem
    0.5, 0.3,         // Growth
    0.4, 0.4,         // Journey
    0.6, 1.2          // CTA (ends large)
  ]);

  // Rotation (Z)
  const rotateZ = useTransform(progress, input, [
    0, 45,            // Hero
    45, 45,           // Cards
    0, 360,           // Why (rotates around)
    0, 90, 180, 270, 360, // Business Flow
    0, 0,             // Ecosystem
    0, 90,            // Growth
    0, 0,             // Journey
    0, 30             // CTA
  ]);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 z-30 pointer-events-none"
      style={{
        // Combine centering translation with our animated coordinates
        x: useTransform(() => `calc(-50% + ${x.get()})`),
        y: useTransform(() => `calc(-50% + ${y.get()})`),
        scale,
        rotate: rotateZ,
      }}
    >
      <div 
        className="w-[40vh] h-[40vh] md:w-[50vh] md:h-[50vh] flex items-center justify-center drop-shadow-2xl"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/products/gcc-cookie.png"
          alt="Pandur Cookie"
          className="w-full h-full object-contain"
        />
      </div>
    </motion.div>
  );
}

export default function FranchiseExperience({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // One master scroll progress for the entire 1200vh section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={containerRef} className="relative w-full h-[1200vh] bg-cream">
      {/* Sticky Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center perspective-[1200px]">
        
        {/* SCENES */}
        <HeroScene progress={scrollYProgress} />
        <FourCardsScene progress={scrollYProgress} cards={children} />
        <WhyPartnerScene progress={scrollYProgress} />
        <BusinessFlowScene progress={scrollYProgress} />
        <EcosystemScene progress={scrollYProgress} />
        <GrowthScene progress={scrollYProgress} />
        <JourneyScene progress={scrollYProgress} />
        <CTAScene progress={scrollYProgress} />

        {/* PROTAGONIST COOKIE */}
        <ProtagonistCookie progress={scrollYProgress} />

      </div>
    </section>
  );
}
