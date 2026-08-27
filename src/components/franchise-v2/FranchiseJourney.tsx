"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { SplitLine } from "@/components/motion/Text";

const STAGES = [
  { id: "discover", title: "DISCOVER", desc: "Find the right fit for your market." },
  { id: "connect", title: "CONNECT", desc: "Align on terms, territories, and volumes." },
  { id: "stock", title: "STOCK", desc: "Receive your first wholesale shipment." },
  { id: "grow", title: "GROW", desc: "Expand your margins as velocity increases." },
];

function useStageState(progress: MotionValue<number>, index: number, total: number) {
  const segment = 1 / total;
  const start = index * segment;
  const end = start + segment;
  const active = start + segment / 2;
  
  // Opacity peaks in the middle of the segment
  const opacity = useTransform(
    progress,
    [start, active, end],
    [0.3, 1, 0.3]
  );
  
  // Is it currently the active segment?
  const isActive = useTransform(progress, (v) => v >= start && v < end);

  return { opacity, isActive };
}

function StageItem({ stage, index, total, scrollYProgress }: { stage: any, index: number, total: number, scrollYProgress: MotionValue<number> }) {
  const { opacity } = useStageState(scrollYProgress, index, total);
  
  return (
    <motion.div style={{ opacity }}>
      <div className="text-xs font-bold text-red-deep mb-2">0{index + 1}</div>
      <h3 className="font-display font-black text-ink text-2xl md:text-3xl mb-2">
        {stage.title}
      </h3>
      <p className="text-ash text-sm md:text-base hidden md:block">
        {stage.desc}
      </p>
    </motion.div>
  );
}

export default function FranchiseJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // DISCOVER (0 - 0.25): Package fades in and scales up
  const discoverOpacity = useTransform(scrollYProgress, [0, 0.125, 0.25], [0, 1, 0]);
  const discoverScale = useTransform(scrollYProgress, [0, 0.25], [0.8, 1]);

  // CONNECT (0.25 - 0.5): Package and connection line
  const connectOpacity = useTransform(scrollYProgress, [0.25, 0.375, 0.5], [0, 1, 0]);
  const connectLineLength = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);

  // STOCK (0.5 - 0.75): Package drops onto shelf
  const stockOpacity = useTransform(scrollYProgress, [0.5, 0.625, 0.75], [0, 1, 0]);
  const stockY = useTransform(scrollYProgress, [0.5, 0.65], [-50, 0]);
  const shelfOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);

  // GROW (0.75 - 1.0): Multiple packages
  const growOpacity = useTransform(scrollYProgress, [0.75, 0.875, 1], [0, 1, 0]);
  const growSpreadLeft = useTransform(scrollYProgress, [0.75, 0.9], [0, -100]);
  const growSpreadRight = useTransform(scrollYProgress, [0.75, 0.9], [0, 100]);
  const growOpacitySides = useTransform(scrollYProgress, [0.75, 0.85], [0, 0.5]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[400vh] bg-cream"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Text Navigation */}
        <div className="w-full md:w-1/3 h-1/3 md:h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 z-20">
          <SplitLine 
            as="h2"
            text="THE PARTNER JOURNEY"
            className="text-eyebrow text-red-deep tracking-widest uppercase mb-12"
          />
          
          <div className="flex flex-col gap-8 md:gap-16">
            {STAGES.map((stage, i) => (
              <StageItem key={stage.id} stage={stage} index={i} total={STAGES.length} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>

        {/* Right Side: Visuals */}
        <div className="w-full md:w-2/3 h-2/3 md:h-full relative flex items-center justify-center bg-cream-deep/50 border-l border-ink/5">
          
          {/* Phase 1: DISCOVER */}
          <motion.div 
            className="absolute flex items-center justify-center w-64 h-64"
            style={{ opacity: discoverOpacity, scale: discoverScale }}
          >
            <img src="/products/hero-cardamom-box.png" alt="Discover" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" />
          </motion.div>

          {/* Phase 2: CONNECT */}
          <motion.div 
            className="absolute flex items-center justify-between w-full max-w-md px-10"
            style={{ opacity: connectOpacity }}
          >
            <div className="w-32 h-32 relative">
              <img src="/products/hero-cardamom-box.png" alt="Pandur" className="w-full h-full object-contain mix-blend-multiply drop-shadow-md" />
            </div>
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none">
              <motion.line 
                x1="30%" y1="50%" x2="70%" y2="50%" 
                stroke="#A95324" strokeWidth="2" strokeDasharray="5 5"
                style={{ pathLength: connectLineLength }}
              />
            </svg>

            <div className="w-20 h-20 bg-white rounded-2xl border border-ink/10 shadow-lg flex flex-col items-center justify-center z-20">
              <div className="w-8 h-8 border-2 border-red-deep rounded-full mb-1" />
              <span className="text-[10px] font-bold text-ink">PARTNER</span>
            </div>
          </motion.div>

          {/* Phase 3: STOCK */}
          <motion.div 
            className="absolute flex flex-col items-center justify-center w-full h-full"
            style={{ opacity: stockOpacity }}
          >
            <motion.div className="w-48 h-48 z-10" style={{ y: stockY }}>
              <img src="/products/hero-cardamom-box.png" alt="Stock" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" />
            </motion.div>
            <motion.div 
              className="w-64 h-4 bg-ink/10 rounded-full mt-[-20px] blur-[2px]"
              style={{ opacity: shelfOpacity }}
            />
            <motion.div 
              className="w-80 h-2 bg-ink/20 mt-2"
              style={{ opacity: shelfOpacity }}
            />
          </motion.div>

          {/* Phase 4: GROW */}
          <motion.div 
            className="absolute flex items-center justify-center w-full h-full"
            style={{ opacity: growOpacity }}
          >
            {/* Center Package */}
            <div className="absolute w-48 h-48 z-20">
              <img src="/products/hero-cardamom-box.png" alt="Grow" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" />
            </div>
            
            {/* Left Expanding Package */}
            <motion.div 
              className="absolute w-40 h-40 z-10 mix-blend-multiply"
              style={{ x: growSpreadLeft, opacity: growOpacitySides }}
            >
              <img src="/products/hero-butter-box-scene.png" alt="Grow Left" className="w-full h-full object-contain blur-[1px]" />
            </motion.div>

            {/* Right Expanding Package */}
            <motion.div 
              className="absolute w-40 h-40 z-10 mix-blend-multiply"
              style={{ x: growSpreadRight, opacity: growOpacitySides }}
            >
              <img src="/products/hero-coconut-box-scene.png" alt="Grow Right" className="w-full h-full object-contain blur-[1px]" />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
