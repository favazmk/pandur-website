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

  // Editorial Labels Opacity logic
  // MIX: 0 - 0.2 (peak at 0.1)
  const mixOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.25], [1, 1, 0, 0]);
  
  // BAKE: 0.2 - 0.4
  const bakeOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.35, 0.45], [0, 1, 1, 0]);
  
  // COOL: 0.4 - 0.6
  const coolOpacity = useTransform(scrollYProgress, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0]);
  
  // QUALITY: 0.6 - 0.8
  const qualityOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.85], [0, 1, 1, 0]);
  
  // PACK: 0.8 - 1.0
  const packOpacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1], [0, 1, 1, 1]);

  return (
    <section 
      ref={container}
      className="relative bg-[#F3EEE4] h-[500vh]"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden">
        
        {/* Header Title */}
        <div className="absolute top-12 left-6 right-6 md:left-12 z-50">
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
        <div className="absolute bottom-12 left-6 right-6 md:left-12 md:right-12 z-50 flex items-center justify-between text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#33412B]/40">
          
          <motion.span style={{ color: useTransform(mixOpacity, [0, 1], ["rgba(51, 65, 43, 0.4)", "rgba(51, 65, 43, 1)"]) }}>Mix</motion.span>
          <div className="flex-1 h-px bg-[#33412B]/20 mx-2 md:mx-4" />
          
          <motion.span style={{ color: useTransform(bakeOpacity, [0, 1], ["rgba(51, 65, 43, 0.4)", "rgba(51, 65, 43, 1)"]) }}>Bake</motion.span>
          <div className="flex-1 h-px bg-[#33412B]/20 mx-2 md:mx-4" />
          
          <motion.span style={{ color: useTransform(coolOpacity, [0, 1], ["rgba(51, 65, 43, 0.4)", "rgba(51, 65, 43, 1)"]) }}>Cool</motion.span>
          <div className="flex-1 h-px bg-[#33412B]/20 mx-2 md:mx-4" />
          
          <motion.span style={{ color: useTransform(qualityOpacity, [0, 1], ["rgba(51, 65, 43, 0.4)", "rgba(51, 65, 43, 1)"]) }}>Quality</motion.span>
          <div className="flex-1 h-px bg-[#33412B]/20 mx-2 md:mx-4" />
          
          <motion.span style={{ color: useTransform(packOpacity, [0, 1], ["rgba(51, 65, 43, 0.4)", "rgba(51, 65, 43, 1)"]) }}>Pack</motion.span>
          
        </div>

      </div>
    </section>
  );
}
