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

export default function GrowthMapMobile({ progress }: Props) {
  const uaeOpacity = useTransform(progress, [0, 0.1], [0, 1]);
  const pathLength = useTransform(progress, [0.1, 0.8], [0, 1]);
  const gccOpacity = useTransform(progress, [0.3, 0.5], [0, 1]);
  const intOpacity = useTransform(progress, [0.6, 0.8], [0, 1]);

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4] flex justify-center mt-4 pb-24">
      
      {/* SVG Path Background */}
      <svg
        viewBox="0 0 200 400"
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Pandur vertical growth route"
      >
        <defs>
          <linearGradient id="growthGradientMobile" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-red-deep, #9c2727)" />
            <stop offset="100%" stopColor="var(--color-cream, #f5f2eb)" />
          </linearGradient>
        </defs>

        <motion.path
          d="M 50 50 Q 80 150 50 200 T 50 350"
          fill="none"
          stroke="url(#growthGradientMobile)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength }}
        />

        {/* Nodes */}
        <motion.g style={{ opacity: uaeOpacity }}>
          <circle cx="50" cy="50" r="6" fill="var(--color-red-deep, #9c2727)" />
        </motion.g>

        <motion.g style={{ opacity: gccOpacity }}>
          <circle cx="50" cy="200" r="5" fill="var(--color-cream, #f5f2eb)" opacity="0.8" />
        </motion.g>

        <motion.g style={{ opacity: intOpacity }}>
          <circle cx="50" cy="350" r="5" fill="var(--color-cream, #f5f2eb)" opacity="0.5" />
        </motion.g>
      </svg>

      {/* HTML Labels revealed on scroll */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* UAE */}
        <motion.div 
          style={{ opacity: uaeOpacity }}
          className="absolute left-[40%] top-[10%] w-[55%]"
        >
          <div className="text-sm font-bold text-red-deep tracking-widest uppercase mb-1">{NODE_DATA.uae.title}</div>
          <div className="text-sm font-display font-black text-cream mb-1">{NODE_DATA.uae.subtitle}</div>
          <div className="text-[11px] text-cream/70 leading-relaxed">{NODE_DATA.uae.description}</div>
        </motion.div>

        {/* GCC */}
        <motion.div 
          style={{ opacity: gccOpacity }}
          className="absolute left-[40%] top-[47%] w-[55%]"
        >
          <div className="text-sm font-bold text-cream tracking-widest uppercase mb-1">{NODE_DATA.gcc.title}</div>
          <div className="text-sm font-display font-black text-cream mb-1">{NODE_DATA.gcc.subtitle}</div>
          <div className="text-[11px] text-cream/70 leading-relaxed">{NODE_DATA.gcc.description}</div>
        </motion.div>

        {/* INT */}
        <motion.div 
          style={{ opacity: intOpacity }}
          className="absolute left-[40%] top-[85%] w-[55%]"
        >
          <div className="text-sm font-bold text-cream/70 tracking-widest uppercase mb-1">{NODE_DATA.int.title}</div>
          <div className="text-sm font-display font-black text-cream mb-1">{NODE_DATA.int.subtitle}</div>
          <div className="text-[11px] text-cream/50 leading-relaxed">{NODE_DATA.int.description}</div>
        </motion.div>
      </div>

    </div>
  );
}
