"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import SceneFallback from "@/components/three/SceneFallback";
import { SplitLine } from "@/components/motion/Text";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/useMedia";

const BiteScene = dynamic(() => import("@/components/three/scenes/BiteScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

export default function Bite() {
  const ref = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const stat = reduced || mobile;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const copyOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, 0.75],
    [0, 1, 1, 0]
  );

  return (
    <div
      ref={ref}
      style={{ height: stat ? "auto" : "320vh" }}
      className="relative bg-cocoa"
    >
      <div
        className={
          stat
            ? "relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden py-20"
            : "sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden"
        }
      >
        <BiteScene progress={scrollYProgress} scrub={!stat} mobile={mobile} />

        <motion.div
          className="relative z-10 max-w-3xl px-6 text-center"
          style={stat ? undefined : { opacity: copyOpacity }}
        >
          <SplitLine
            as="h2"
            text="Six months on shelf."
            className="text-title block font-display font-black text-cream"
          />
          {/* Tailwind's reset zeroes block margins, so without this the two
              lines sit flush and their glyphs touch. */}
          <SplitLine
            as="p"
            text="Tastes like it left the oven this morning."
            className="text-title mt-3 block font-display font-black text-dough md:mt-4"
            delay={0.12}
          />
        </motion.div>
      </div>
    </div>
  );
}
