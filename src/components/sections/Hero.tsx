"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import Marquee from "@/components/motion/Marquee";
import { SplitLine } from "@/components/motion/Text";
import { CookieDoodle } from "@/components/brand/Marks";
import SceneFallback from "@/components/three/SceneFallback";
import { ease } from "@/lib/motion";
import { useIsMobile, useIsTouch, usePrefersReducedMotion } from "@/lib/useMedia";

/** three + R3F + drei stay out of the first load entirely. */
const HeroScene = dynamic(() => import("@/components/three/scenes/HeroScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

const TICKER = "MADE IN KHORFAKKAN · UAE · 45 YEARS · MADE TO GROW · ";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const touch = useIsTouch();
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  // 0 at rest, 1 once the hero has fully scrolled away.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Copy lifts and dissolves ahead of the 3D, so the layers separate in depth.
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const copyBlur = useTransform(scrollYProgress, [0, 0.7], ["blur(0px)", "blur(10px)"]);
  const tickerX = useTransform(scrollYProgress, [0, 1], [0, -160]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      <HeroScene
        mobile={mobile}
        interactive={!touch && !reduced}
        progress={reduced ? undefined : scrollYProgress}
      />

      {/* --- headline --- */}
      <motion.div
        className="relative z-content flex flex-1 flex-col items-center justify-center px-6 pt-28 text-center md:pt-32"
        style={
          reduced
            ? undefined
            : { y: copyY, opacity: copyOpacity, filter: copyBlur }
        }
      >
        <motion.p
          className="text-eyebrow mb-6 text-ash"
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          animate={{ opacity: 1, letterSpacing: "0.28em" }}
          transition={{ delay: 0.5, duration: 1.2, ease: ease.expo }}
        >
          Royal Quality Bakes · Khorfakkan
        </motion.p>

        <h1 className="text-hero font-display font-black text-ink">
          <SplitLine text="Our Signature Taste." delay={0.35} stagger={0.05} once />
          <SplitLine
            text="Made to Grow."
            delay={0.55}
            stagger={0.05}
            accentLast
            once
          />
        </h1>
      </motion.div>

      {/* --- scroll cue --- */}
      <motion.div
        className="relative z-10 flex justify-center pb-4"
        style={reduced ? undefined : { opacity: copyOpacity }}
      >
        <motion.div
          className="animate-bob"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.8, ease: ease.pop }}
        >
          <CookieDoodle className="h-9 w-9 text-ink/45" strokeWidth={5} />
        </motion.div>
      </motion.div>

      {/* --- ticker --- */}
      <motion.div
        className="relative z-10"
        style={reduced ? undefined : { x: tickerX }}
      >
        <Marquee
          speed={80}
          className="border-y border-ink/12 py-3"
          itemClassName="text-eyebrow whitespace-pre text-ink/55"
          repeat={3}
        >
          {TICKER}
        </Marquee>
      </motion.div>
    </section>
  );
}
