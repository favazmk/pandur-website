"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { SplitLine } from "@/components/motion/Text";
import { CookieDoodle } from "@/components/brand/Marks";

const NODES = [
  { id: "retail", label: "RETAIL STOCKIST", x: 15, y: 20 },
  { id: "distribution", label: "DISTRIBUTION", x: 85, y: 20 },
  { id: "food-service", label: "FOOD SERVICE", x: 15, y: 80 },
  { id: "territory", label: "TERRITORY", x: 85, y: 80 },
];

export default function FranchiseEcosystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Center node fades in early
  const centerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const centerScale = useTransform(scrollYProgress, [0, 0.1], [0.8, 1]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[250vh] bg-white"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        <div className="absolute top-20 text-center z-20 px-6">
          <SplitLine 
            as="h2"
            text="PARTNERSHIP ECOSYSTEM"
            className="text-eyebrow text-red-deep tracking-widest uppercase mb-4"
          />
          <p className="text-ash max-w-md mx-auto text-sm">
            Four targeted routes to market, all connected to one core brand.
          </p>
        </div>

        <div className="relative w-full max-w-4xl aspect-video md:aspect-square lg:aspect-video flex items-center justify-center mt-10">
          
          {/* SVG Connection Lines */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {NODES.map((node, i) => {
                const start = 0.1 + (i * 0.2);
                const end = start + 0.15;
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const pathLength = useTransform(scrollYProgress, [start, end], [0, 1]);
                
                return (
                  <motion.path 
                    key={`line-${node.id}`}
                    d={`M 50 50 L ${node.x} ${node.y}`}
                    fill="none" 
                    stroke="rgba(169,83,36,0.2)" 
                    strokeWidth="0.5"
                    style={{ pathLength }}
                  />
                );
              })}
            </svg>
          </div>

          {/* Center Node */}
          <motion.div 
            className="absolute z-20 w-32 h-32 md:w-48 md:h-48 rounded-full bg-cream-deep border border-ink/10 flex flex-col items-center justify-center shadow-xl"
            style={{ opacity: centerOpacity, scale: centerScale }}
          >
            <CookieDoodle className="w-12 h-12 md:w-16 md:h-16 text-red-deep mb-2" />
            <span className="font-display font-black text-ink tracking-widest">PANDUR</span>
          </motion.div>

          {/* Surrounding Nodes */}
          {NODES.map((node, i) => {
            const start = 0.2 + (i * 0.2);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const opacity = useTransform(scrollYProgress, [start, start + 0.1], [0, 1]);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const y = useTransform(scrollYProgress, [start, start + 0.1], [10, 0]);

            return (
              <motion.div 
                key={node.id}
                className="absolute z-10 bg-white border border-ink/10 shadow-lg rounded-2xl p-4 md:p-6 w-36 md:w-48 text-center flex flex-col items-center justify-center"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  x: "-50%",
                  y: `calc(-50% + ${y.get()}px)`, // This relies on the transform below anyway
                  opacity
                }}
              >
                <div className="w-8 h-8 rounded-full bg-cream-deep mb-3 flex items-center justify-center text-red-deep text-xs font-bold">
                  0{i + 1}
                </div>
                <h3 className="font-display font-black text-ink text-sm md:text-base leading-tight">
                  {node.label}
                </h3>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
