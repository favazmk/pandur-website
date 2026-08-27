"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SplitLine } from "@/components/motion/Text";

export default function FranchiseGrowth() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Animation sequence:
  // 1. Origin (UAE) scales up
  const uaeScale = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const uaeOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  
  // 2. Expansion line draws outward
  const pathLength = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  
  // 3. GCC region fades in
  const gccOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const gccScale = useTransform(scrollYProgress, [0.5, 0.7], [0.9, 1]);

  // 4. Outer expansion rings pulse
  const ring1Opacity = useTransform(scrollYProgress, [0.7, 0.8], [0, 0.5]);
  const ring1Scale = useTransform(scrollYProgress, [0.7, 0.9], [1, 1.5]);
  
  const ring2Opacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 0.3]);
  const ring2Scale = useTransform(scrollYProgress, [0.8, 1], [1, 2]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[250vh] bg-cream-deep overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center">
        
        <div className="absolute top-20 text-center z-30 px-6">
          <SplitLine 
            as="h2"
            text="UAE TO GCC & BEYOND"
            className="text-eyebrow text-red-deep tracking-widest uppercase mb-4"
          />
          <p className="text-ash max-w-lg mx-auto text-sm md:text-base">
            From our established footprint in the UAE to expanding distribution networks across the entire Gulf region.
          </p>
        </div>

        {/* Map Visualization Container */}
        <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center mt-20">
          
          {/* Background expanding rings (Beyond GCC) */}
          <motion.div 
            className="absolute inset-0 rounded-full border border-red-deep/20"
            style={{ scale: ring2Scale, opacity: ring2Opacity }}
          />
          <motion.div 
            className="absolute inset-4 rounded-full border border-red-deep/40"
            style={{ scale: ring1Scale, opacity: ring1Opacity }}
          />

          {/* SVG Connection paths */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <motion.path 
                d="M 50 50 L 20 20" 
                fill="none" stroke="#A95324" strokeWidth="0.5" strokeDasharray="2 2"
                style={{ pathLength }}
              />
              <motion.path 
                d="M 50 50 L 80 30" 
                fill="none" stroke="#A95324" strokeWidth="0.5" strokeDasharray="2 2"
                style={{ pathLength }}
              />
              <motion.path 
                d="M 50 50 L 30 80" 
                fill="none" stroke="#A95324" strokeWidth="0.5" strokeDasharray="2 2"
                style={{ pathLength }}
              />
            </svg>
          </div>

          {/* GCC Region */}
          <motion.div 
            className="absolute inset-10 rounded-full bg-white/50 backdrop-blur-sm border border-ink/10 flex items-center justify-center shadow-2xl z-20"
            style={{ opacity: gccOpacity, scale: gccScale }}
          >
            <div className="absolute top-10 left-10 text-xs font-bold text-ink/40 tracking-widest">KSA</div>
            <div className="absolute top-20 right-10 text-xs font-bold text-ink/40 tracking-widest">OMAN</div>
            <div className="absolute bottom-10 left-20 text-xs font-bold text-ink/40 tracking-widest">KUWAIT</div>
          </motion.div>

          {/* UAE Origin Point */}
          <motion.div 
            className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-cream shadow-inner border-2 border-white flex flex-col items-center justify-center z-30"
            style={{ opacity: uaeOpacity, scale: uaeScale }}
          >
            <span className="font-display font-black text-ink text-lg md:text-xl">UAE</span>
            <span className="text-[10px] text-red-deep font-bold tracking-widest mt-1 uppercase">Origin</span>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
