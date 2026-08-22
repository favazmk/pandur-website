"use client";

import { useRef } from "react";
import Image from "next/image";
import { useScroll, useSpring, useTransform, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/useMedia";
import { CONSISTENCY_STAGES } from "@/lib/consistencyJourney";

// Sub-stages
import OvenStage from "./OvenStage";
import CloneStage from "./CloneStage";
import QualityStage from "./QualityStage";
import ShelfLifeStage from "./ShelfLifeStage";

export default function ConsistencyJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Master timeline for the entire section (600vh height)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const damped = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 36,
    mass: 0.2,
    restDelta: 0.0001,
  });

  const progress = reduced ? scrollYProgress : damped;

  // Persistent Cookie Animation: continuously rotates based on scroll, stays exactly centered
  const cookieRotate = useTransform(progress, [0, 1], [0, 360 * 3]); // 3 full rotations over the entire section

  return (
    <section
      ref={ref}
      id="consistency-journey"
      aria-label="Pandur Production and Consistency Journey"
      className="relative h-[1500vh] bg-cream"
    >
      <div className="sticky top-0 isolate flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        
        {/* PERSISTENT CENTRAL HERO COOKIE (NEVER FADES) */}
        {!reduced && (
          <motion.div 
            style={{ rotate: cookieRotate }}
            className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
          >
            <Image
              src="/products/gcc-cookie.png"
              alt="Pandur Cookie"
              width={280}
              height={280}
              // Fixed size mapping across breakpoints to match exactly what the clones/stages expect
              className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        )}
        {/* Stage 01 — 45 Years in the Oven */}
        <OvenStage progress={progress} reduced={reduced} />

        {/* Stage 02 — Every Batch (Clones) */}
        <CloneStage progress={progress} reduced={reduced} />

        {/* Stage 03 — Quality Checkpoints & Destinations */}
        <QualityStage progress={progress} reduced={reduced} />

        {/* Stage 04 — Six Months on Shelf */}
        <ShelfLifeStage progress={progress} reduced={reduced} />

      </div>
    </section>
  );
}
