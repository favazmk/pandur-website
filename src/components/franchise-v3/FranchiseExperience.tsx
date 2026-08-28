"use client";

import { useRef, ReactNode } from "react";
import { useScroll } from "motion/react";
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
import PartnershipNetwork from "./PartnershipNetwork";



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

        {/* GLOBAL NETWORK OVERLAY */}
        <PartnershipNetwork progress={scrollYProgress} />

      </div>
    </section>
  );
}
