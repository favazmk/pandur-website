"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SplitLine } from "@/components/motion/Text";

const NODES = [
  { id: "pandur", label: "PANDUR", desc: "Production & Supply", align: "right" },
  { id: "partner", label: "PARTNER", desc: "Distribution & Logistics", align: "left" },
  { id: "business", label: "YOUR BUSINESS", desc: "Retail or HORECA", align: "right" },
  { id: "customer", label: "CUSTOMER", desc: "The end consumer", align: "left" },
  { id: "growth", label: "GROWTH", desc: "Shared success", align: "right" },
];

export default function FranchiseFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  
  // Package travels vertically down the container
  const packageY = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);
  // Package zig-zags horizontally
  const packageX = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.4, 0.6, 0.8], 
    ["0%", "-50%", "50%", "-50%", "0%"]
  );

  return (
    <section 
      ref={containerRef} 
      className="relative h-[300vh] bg-cream"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center py-20 px-6">
        
        <div className="text-center z-10 mb-10">
          <SplitLine 
            as="h2"
            text="HOW THE PARTNERSHIP FITS"
            className="text-3xl md:text-5xl font-display font-black text-ink mb-4"
          />
          <p className="text-ash max-w-md mx-auto">
            A continuous flow from our ovens to your customers.
          </p>
        </div>

        <div className="relative flex-1 w-full max-w-2xl mx-auto mt-10">
          
          {/* SVG Route */}
          <div className="absolute inset-0 z-0">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              <motion.path 
                // A vertical zig-zag curve
                d="M 50 0 C 50 10, 10 15, 10 25 C 10 35, 90 40, 90 50 C 90 60, 10 65, 10 75 C 10 85, 50 90, 50 100"
                fill="none" 
                stroke="rgba(169,83,36,0.3)" 
                strokeWidth="0.5"
                strokeLinecap="round"
              />
              <motion.path 
                d="M 50 0 C 50 10, 10 15, 10 25 C 10 35, 90 40, 90 50 C 90 60, 10 65, 10 75 C 10 85, 50 90, 50 100"
                fill="none" 
                stroke="#A95324" 
                strokeWidth="1"
                strokeLinecap="round"
                style={{ pathLength }}
              />
            </svg>
          </div>

          {/* Traveling Package */}
          <motion.div 
            className="absolute left-1/2 top-0 z-20 w-16 h-16 -ml-8 -mt-8"
            style={{ 
              top: packageY,
              x: packageX,
            }}
          >
            <div className="w-full h-full bg-white rounded-xl shadow-lg border border-red-deep/20 p-2 flex items-center justify-center rotate-12">
              <img 
                src="/products/hero-cardamom-sachet.png" 
                alt="Traveling Product"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
          </motion.div>

          {/* Nodes */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between py-[0%]">
            {NODES.map((node, i) => {
              const start = i * 0.2;
              const startOffset = Math.max(0, start - 0.1);
              const opacity = useTransform(scrollYProgress, [startOffset, start + 0.05], [0.3, 1]);
              const scale = useTransform(scrollYProgress, [startOffset, start + 0.05], [0.9, 1]);
              
              return (
                <motion.div 
                  key={node.id}
                  className={`flex w-full items-center ${node.align === 'left' ? 'justify-start' : node.align === 'right' ? 'justify-end' : 'justify-center'}`}
                  style={{ opacity, scale }}
                >
                  <div className={`bg-white/80 backdrop-blur-sm border border-ink/10 p-4 rounded-2xl shadow-sm w-40 md:w-56 ${node.align === 'left' ? 'ml-4 md:ml-12' : 'mr-4 md:mr-12'} mt-[-20px]`}>
                    <h3 className="font-display font-black text-ink text-lg">{node.label}</h3>
                    <p className="text-ash text-xs uppercase tracking-wider mt-1">{node.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
