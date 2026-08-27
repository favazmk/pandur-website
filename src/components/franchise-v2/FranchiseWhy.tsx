"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { SplitLine } from "@/components/motion/Text";
import { CookieDoodle } from "@/components/brand/Marks";

const STATEMENTS = [
  {
    title: "45 YEARS OF EXPERIENCE",
    desc: "A production base with decades of manufacturing excellence behind it."
  },
  {
    title: "QUALITY & CONSISTENCY",
    desc: "Controlled processes and repeatable batches for a reliable product."
  },
  {
    title: "SIX-MONTH SHELF LIFE",
    desc: "Long enough for real distribution economics and extended supply chains."
  },
  {
    title: "DISTINCTIVE TASTE",
    desc: "Premium ingredients crafted into a rich, memorable flavour profile."
  },
  {
    title: "GROWING UAE PRESENCE",
    desc: "Already moving in eight UAE markets with increasing brand recognition."
  },
  {
    title: "GCC GROWTH POTENTIAL",
    desc: "Designed to travel and scale across the entire region."
  }
];

// Helper to determine active state of a statement based on scroll progress
function useStatementState(progress: MotionValue<number>, index: number, total: number) {
  const segment = 1 / total;
  const start = index * segment;
  const active = start + segment / 2;
  const end = start + segment;
  
  // Opacity: fades in, stays active, fades out
  const opacity = useTransform(
    progress,
    [start, active, end],
    [0, 1, 0]
  );
  
  // Scale: slight zoom in when active
  const scale = useTransform(
    progress,
    [start, active, end],
    [0.9, 1, 0.9]
  );

  // Position: drifts upward slightly
  const y = useTransform(
    progress,
    [start, active, end],
    [20, 0, -20]
  );

  return { opacity, scale, y };
}

function StatementItem({ item, index, total, progress }: { 
  item: typeof STATEMENTS[0], 
  index: number, 
  total: number, 
  progress: MotionValue<number> 
}) {
  const { opacity, scale, y } = useStatementState(progress, index, total);
  
  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
      style={{ opacity, scale, y }}
    >
      <h3 className="text-3xl md:text-5xl font-display font-black text-ink mb-4 max-w-2xl drop-shadow-sm">
        {item.title}
      </h3>
      <p className="text-ash text-lg md:text-xl max-w-lg">
        {item.desc}
      </p>
    </motion.div>
  );
}

export default function FranchiseWhy() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Product gently rotates in center throughout the entire sequence
  const rotateY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [5, -5]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[400vh] bg-cream-deep"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        <div className="absolute top-20 w-full text-center z-10 px-6">
          <SplitLine 
            as="h2"
            text="WHY PARTNER WITH PANDUR?"
            className="text-eyebrow text-red-deep tracking-widest uppercase"
          />
        </div>

        {/* Central Graphic Background/Anchor */}
        <motion.div 
          className="absolute z-0 w-[90vw] md:w-[60vw] max-w-[800px] aspect-square flex items-center justify-center opacity-10"
          style={{ 
            rotateX, 
            rotateY,
            transformPerspective: 1200 
          }}
        >
          <CookieDoodle className="w-full h-full max-w-md max-h-md text-red-deep" strokeWidth={1} />
        </motion.div>

        {/* Statements overlaid on top */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {STATEMENTS.map((item, index) => (
            <StatementItem 
              key={index} 
              item={item} 
              index={index} 
              total={STATEMENTS.length} 
              progress={scrollYProgress} 
            />
          ))}
        </div>

      </div>
    </section>
  );
}
