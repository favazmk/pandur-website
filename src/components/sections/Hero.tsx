"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import Marquee from "@/components/motion/Marquee";
import { SplitLine } from "@/components/motion/Text";
import { CookieDoodle } from "@/components/brand/Marks";
import SceneFallback from "@/components/three/SceneFallback";
import { useIsMobile, useIsTouch, usePrefersReducedMotion } from "@/lib/useMedia";

/** three + R3F + drei stay out of the first load entirely. */
const HeroScene = dynamic(() => import("@/components/three/scenes/HeroScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

const TICKER = "MADE IN KHORFAKKAN · UAE · 45 YEARS · MADE TO GROW · ";

export default function Hero() {
  const touch = useIsTouch();
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <HeroScene mobile={mobile} interactive={!touch && !reduced} />

      {/* --- headline --- */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-28 text-center md:pt-32">
        <motion.p
          className="text-eyebrow mb-6 text-ash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Royal Quality Bakes · Khorfakkan
        </motion.p>

        <h1 className="text-hero font-display font-black text-ink">
          <SplitLine text="Our Signature Taste." delay={0.35} stagger={0.05} />
          <SplitLine text="Made to Grow." delay={0.55} stagger={0.05} accentLast />
        </h1>
      </div>

      {/* --- scroll cue --- */}
      <div className="relative z-10 flex justify-center pb-4">
        <motion.div
          className="animate-bob"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <CookieDoodle className="h-9 w-9 text-ink/45" strokeWidth={5} />
        </motion.div>
      </div>

      {/* --- ticker --- */}
      <Marquee
        speed={80}
        className="relative z-10 border-y border-ink/12 py-3"
        itemClassName="text-eyebrow whitespace-pre text-ink/55"
        repeat={3}
      >
        {TICKER}
      </Marquee>
    </section>
  );
}
