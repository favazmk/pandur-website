"use client";

import { useRef } from "react";
import { useScroll } from "motion/react";
import GrowthMapDesktop from "./illustrations/GrowthMapDesktop";
import GrowthMapMobile from "./illustrations/GrowthMapMobile";

export default function GrowthStory() {
  const container = useRef<HTMLElement>(null);
  
  // Track scroll progress through this section to drive the SVG paths
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.7", "end 0.8"],
  });

  return (
    <section 
      ref={container}
      className="relative bg-ink py-24 md:py-48 overflow-hidden"
    >
      <div className="mx-auto max-w-6xl px-6 relative z-10 w-full text-center mb-8">
        <p className="text-red-deep font-bold tracking-widest uppercase text-sm mb-4">Future Ambition</p>
        <h2 className="text-3xl md:text-5xl font-display font-black text-cream uppercase tracking-tight">
          A Growing Footprint.
        </h2>
      </div>

      <div className="relative w-full px-6">
        {/* Desktop Interactive SVG */}
        <div className="hidden md:block">
          <GrowthMapDesktop progress={scrollYProgress} />
        </div>

        {/* Mobile Interactive SVG */}
        <div className="block md:hidden">
          <GrowthMapMobile progress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}
