"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import ProductionEnvironment from "./illustrations/ProductionEnvironment";

export default function TechnicalManufacturing() {
  const container = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // MIX: 0 - 0.16
  const mixOpacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.22], [1, 1, 0, 0]);
  
  // BAKE: 0.16 - 0.33
  const bakeOpacity = useTransform(scrollYProgress, [0.10, 0.18, 0.31, 0.39], [0, 1, 1, 0]);
  
  // COOL: 0.33 - 0.50
  const coolOpacity = useTransform(scrollYProgress, [0.27, 0.35, 0.48, 0.56], [0, 1, 1, 0]);
  
  // QUALITY: 0.50 - 0.66
  const qualityOpacity = useTransform(scrollYProgress, [0.44, 0.52, 0.64, 0.72], [0, 1, 1, 0]);
  
  // PACK: 0.66 - 0.83
  const packOpacity = useTransform(scrollYProgress, [0.60, 0.68, 0.81, 0.89], [0, 1, 1, 0]);

  // MAGNETIC TESTING: 0.83 - 1.0
  const magneticOpacity = useTransform(scrollYProgress, [0.77, 0.85, 1, 1], [0, 1, 1, 1]);

  return (
    <section 
      ref={container}
      className="relative bg-[#F3EEE4] h-[600vh]"
    >
      {/* Header Title (Mobile: Scrolls away) */}
      <div className="md:hidden absolute top-12 left-6 right-6 z-50">
        <p className="text-[#33412B] font-bold tracking-widest uppercase text-xs mb-2">The Process</p>
        <h2 className="text-3xl font-display font-black text-[#33412B] uppercase tracking-tight">
          Technical Manufacturing
        </h2>
        <p className="text-[#33412B]/70 mt-2 text-sm max-w-sm">
          From carefully controlled production to reliable packaging.
        </p>
      </div>

      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden">
        
        {/* Header Title (Desktop: Sticky) */}
        <div className="hidden md:block absolute top-12 left-12 z-50">
          <p className="text-[#33412B] font-bold tracking-widest uppercase text-xs mb-2">The Process</p>
          <h2 className="text-3xl md:text-5xl font-display font-black text-[#33412B] uppercase tracking-tight">
            Technical Manufacturing
          </h2>
          <p className="text-[#33412B]/70 mt-2 text-sm md:text-base max-w-sm">
            From carefully controlled production to reliable packaging.
          </p>
        </div>

        {/* The Continuous Production Environment (Master SVG/HTML Cutaway) */}
        <div className="absolute inset-0 w-full h-full z-10 flex items-center justify-center pt-24 md:pt-0">
          <ProductionEnvironment progress={scrollYProgress} />
        </div>



        {/* Progress Indicator */}
        <div className="absolute bottom-12 left-4 right-4 sm:left-6 sm:right-6 md:left-12 md:right-12 z-50 flex items-center justify-between text-[8px] min-[375px]:text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#33412B]/40">
          
          <motion.span className="whitespace-nowrap" style={{ color: useTransform(mixOpacity, [0, 1], ["rgba(51, 65, 43, 0.4)", "rgba(51, 65, 43, 1)"]) }}>Mix</motion.span>
          <div className="flex-1 h-px bg-[#33412B]/20 mx-1 sm:mx-2 md:mx-4" />
          
          <motion.span className="whitespace-nowrap" style={{ color: useTransform(bakeOpacity, [0, 1], ["rgba(51, 65, 43, 0.4)", "rgba(51, 65, 43, 1)"]) }}>Bake</motion.span>
          <div className="flex-1 h-px bg-[#33412B]/20 mx-1 sm:mx-2 md:mx-4" />
          
          <motion.span className="whitespace-nowrap" style={{ color: useTransform(coolOpacity, [0, 1], ["rgba(51, 65, 43, 0.4)", "rgba(51, 65, 43, 1)"]) }}>Cool</motion.span>
          <div className="flex-1 h-px bg-[#33412B]/20 mx-1 sm:mx-2 md:mx-4" />
          
          <motion.span className="whitespace-nowrap" style={{ color: useTransform(qualityOpacity, [0, 1], ["rgba(51, 65, 43, 0.4)", "rgba(51, 65, 43, 1)"]) }}>Quality</motion.span>
          <div className="flex-1 h-px bg-[#33412B]/20 mx-1 sm:mx-2 md:mx-4" />
          
          <motion.span className="whitespace-nowrap" style={{ color: useTransform(packOpacity, [0, 1], ["rgba(51, 65, 43, 0.4)", "rgba(51, 65, 43, 1)"]) }}>Pack</motion.span>
          <div className="flex-1 h-px bg-[#33412B]/20 mx-1 sm:mx-2 md:mx-4" />

          <motion.span className="whitespace-nowrap" style={{ color: useTransform(magneticOpacity, [0, 1], ["rgba(51, 65, 43, 0.4)", "rgba(51, 65, 43, 1)"]) }}>Magnetic Testing</motion.span>
          
        </div>

      </div>
    </section>
  );
}
