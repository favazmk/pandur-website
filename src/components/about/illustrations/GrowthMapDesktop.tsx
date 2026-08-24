"use client";

import { motion, MotionValue, useTransform } from "motion/react";

interface Props {
  progress: MotionValue<number>;
}

const NODE_DATA = {
  uae: {
    title: "UAE",
    subtitle: "Our Origin & Hub",
    description: "Established on the eastern coast, our state-of-the-art facility in Khorfakkan serves as the central hub.",
  },
  gcc: {
    title: "GCC",
    subtitle: "Regional Expansion",
    description: "Actively scaling distribution networks across the Gulf, bringing premium baked goods to neighboring markets.",
  },
  int: {
    title: "International",
    subtitle: "Global Ambition",
    description: "Preparing for international logistics and compliance to share the Pandur experience globally.",
  }
};

export default function GrowthMapDesktop({ progress }: Props) {
  // Animation values derived from scroll progress
  const uaeOpacity = useTransform(progress, [0, 0.1], [0, 1]);
  
  const pathLength = useTransform(progress, [0.1, 0.6], [0, 1]);
  
  const gccOpacity = useTransform(progress, [0.4, 0.6], [0, 1]);
  const gccScale = useTransform(progress, [0.4, 0.6], [0.8, 1]);
  
  const intOpacity = useTransform(progress, [0.7, 0.9], [0, 1]);
  const intScale = useTransform(progress, [0.7, 0.9], [0.8, 1]);

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-[16/9]">
      <svg
        viewBox="0 0 900 500"
        className="w-full h-full"
        role="img"
        aria-label="Pandur growth from the UAE toward GCC and international markets"
      >
        <defs>
          <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-red-deep, #9c2727)" />
            <stop offset="100%" stopColor="var(--color-cream, #f5f2eb)" />
          </linearGradient>
        </defs>

        {/* Abstract Region Silhouettes */}
        <motion.g 
          id="uae-region" 
          style={{ opacity: uaeOpacity }}
          className="transition-opacity duration-500"
        >
          <path d="M 280 270 Q 320 220 350 260 T 380 320 T 300 350 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        </motion.g>

        <motion.g 
          id="gcc-region" 
          style={{ opacity: gccOpacity, scale: gccScale, transformOrigin: "480px 250px" }}
        >
          <path d="M 400 150 Q 550 100 600 200 T 550 400 T 350 450 T 200 300 Z" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 8" />
        </motion.g>

        {/* International Ring */}
        <motion.circle
          cx="450"
          cy="250"
          r="240"
          fill="none"
          stroke="rgba(255,255,255,0.02)"
          strokeWidth="1"
          style={{ opacity: intOpacity, scale: intScale, transformOrigin: "450px 250px" }}
        />

        {/* Connecting Growth Path */}
        <motion.path
          id="growthPath"
          d="M 320 280 Q 400 200 480 220 T 700 150"
          fill="none"
          stroke="url(#growthGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength }}
        />

        {/* Nodes */}
        <motion.g style={{ opacity: uaeOpacity }}>
          <circle cx="320" cy="280" r="6" fill="var(--color-red-deep, #9c2727)" />
        </motion.g>

        <motion.g style={{ opacity: gccOpacity }}>
          <circle cx="480" cy="220" r="5" fill="var(--color-cream, #f5f2eb)" opacity="0.8" />
        </motion.g>

        <motion.g style={{ opacity: intOpacity }}>
          <circle cx="700" cy="150" r="5" fill="var(--color-cream, #f5f2eb)" opacity="0.5" />
        </motion.g>

      </svg>

      {/* HTML Labels overlay triggered by Scroll Progress */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* UAE Label */}
        <motion.div 
          style={{ opacity: uaeOpacity }}
          className="absolute left-[32%] top-[60%] w-56"
        >
          <div className="text-sm font-bold text-red-deep tracking-widest uppercase mb-1">{NODE_DATA.uae.title}</div>
          <div className="text-sm font-display font-black text-cream mb-1">{NODE_DATA.uae.subtitle}</div>
          <div className="text-[11px] text-cream/70 leading-relaxed">{NODE_DATA.uae.description}</div>
        </motion.div>

        {/* GCC Label */}
        <motion.div 
          style={{ opacity: gccOpacity }}
          className="absolute left-[54%] top-[40%] w-56"
        >
          <div className="text-sm font-bold text-cream tracking-widest uppercase mb-1">{NODE_DATA.gcc.title}</div>
          <div className="text-sm font-display font-black text-cream mb-1">{NODE_DATA.gcc.subtitle}</div>
          <div className="text-[11px] text-cream/70 leading-relaxed">{NODE_DATA.gcc.description}</div>
        </motion.div>

        {/* Int Label */}
        <motion.div 
          style={{ opacity: intOpacity }}
          className="absolute left-[78%] top-[25%] w-56"
        >
          <div className="text-sm font-bold text-cream/70 tracking-widest uppercase mb-1">{NODE_DATA.int.title}</div>
          <div className="text-sm font-display font-black text-cream mb-1">{NODE_DATA.int.subtitle}</div>
          <div className="text-[11px] text-cream/50 leading-relaxed">{NODE_DATA.int.description}</div>
        </motion.div>
        
      </div>
    </div>
  );
}
