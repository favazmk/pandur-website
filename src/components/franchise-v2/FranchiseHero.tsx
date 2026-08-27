"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SplitLine } from "@/components/motion/Text";
import { CookieDoodle } from "@/components/brand/Marks";

export default function FranchiseHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Headline stays longer, scales up slightly
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 1, 0]);
  const headlineScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const headlineY = useTransform(scrollYProgress, [0, 0.5], [0, -40]);

  // Network lines expanding
  const pathLength = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const pathsOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Center node
  const nodeScale = useTransform(scrollYProgress, [0, 0.4], [0.8, 1.2]);
  const nodeOpacity = useTransform(scrollYProgress, [0, 0.5, 0.7], [1, 1, 0]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[150vh] bg-cream"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* SVG Connection Lines flowing outward */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"
          style={{ opacity: pathsOpacity }}
        >
          <svg className="w-full h-full max-w-[1200px]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            {/* Draw paths that branch out from the center */}
            <motion.path 
              d="M 50 50 Q 20 20 5 40" 
              fill="none" stroke="rgba(169,83,36,0.15)" strokeWidth="0.3"
              style={{ pathLength }}
            />
            <motion.path 
              d="M 50 50 Q 80 20 95 40" 
              fill="none" stroke="rgba(169,83,36,0.15)" strokeWidth="0.3"
              style={{ pathLength }}
            />
            <motion.path 
              d="M 50 50 Q 20 80 10 100" 
              fill="none" stroke="rgba(169,83,36,0.2)" strokeWidth="0.4"
              style={{ pathLength }}
            />
            <motion.path 
              d="M 50 50 Q 40 90 30 100" 
              fill="none" stroke="rgba(169,83,36,0.2)" strokeWidth="0.4"
              style={{ pathLength }}
            />
            <motion.path 
              d="M 50 50 Q 60 90 70 100" 
              fill="none" stroke="rgba(169,83,36,0.2)" strokeWidth="0.4"
              style={{ pathLength }}
            />
            <motion.path 
              d="M 50 50 Q 80 80 90 100" 
              fill="none" stroke="rgba(169,83,36,0.2)" strokeWidth="0.4"
              style={{ pathLength }}
            />
            
            {/* Concentric rings */}
            <motion.circle cx="50" cy="50" r="15" fill="none" stroke="rgba(169,83,36,0.05)" strokeWidth="0.2" style={{ pathLength }} />
            <motion.circle cx="50" cy="50" r="30" fill="none" stroke="rgba(169,83,36,0.05)" strokeWidth="0.2" style={{ pathLength }} />
          </svg>
        </motion.div>

        {/* Center Graphic */}
        <motion.div 
          className="absolute z-10 flex items-center justify-center opacity-20"
          style={{ scale: nodeScale, opacity: nodeOpacity }}
        >
          <CookieDoodle className="w-64 h-64 md:w-96 md:h-96 text-red-deep" strokeWidth={1} />
        </motion.div>

        {/* Headline */}
        <motion.div 
          className="relative z-20 text-center w-full px-6 pointer-events-none mt-10"
          style={{ opacity: headlineOpacity, y: headlineY, scale: headlineScale }}
        >
          <SplitLine 
            as="h1"
            text="LET'S GROW TOGETHER."
            className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-ink mb-6 tracking-tight drop-shadow-sm"
          />
          <p className="text-ash text-lg md:text-2xl font-medium max-w-2xl mx-auto bg-cream/50 backdrop-blur-sm p-4 rounded-2xl">
            Choose the partnership model that fits your business.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
