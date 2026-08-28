"use client";

import { motion, MotionValue, useTransform } from "motion/react";
import { useIsMobile } from "@/lib/useMedia";

type PartnershipNetworkProps = {
  progress: MotionValue<number>;
};

export default function PartnershipNetwork({ progress }: PartnershipNetworkProps) {
  // Network visibility
  const networkOpacity = useTransform(
    progress,
    [0, 0.02, 0.10, 0.12, 0.92, 0.96, 1],
    [0, 1, 1, 0, 0, 1, 1]
  );

  const pathLength = useTransform(
    progress,
    [0.02, 0.10],
    [0, 1]
  );

  // Desktop paths: radiating outward
  const desktopPaths = [
    "M 50 50 Q 30 20 15 20", // Top Left
    "M 50 50 Q 70 20 85 20", // Top Right
    "M 50 50 Q 30 80 15 80", // Bottom Left
    "M 50 50 Q 70 80 85 80", // Bottom Right
  ];

  // Mobile paths: vertical branching
  const mobilePaths = [
    "M 50 50 Q 20 40 20 20",
    "M 50 50 Q 80 40 80 20",
    "M 50 50 Q 20 60 20 80",
    "M 50 50 Q 80 60 80 80",
  ];

  const isMobile = useIsMobile();
  const paths = isMobile ? mobilePaths : desktopPaths;

  const nodeOpacity = useTransform(progress, [0.05, 0.10], [0, 1]);

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: networkOpacity }}
    >
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/*
         * Only this breakpoint's paths are built. Both sets used to be drawn
         * with CSS hiding one, which meant every node and every stroke in the
         * unused layout still had a live `pathLength` / `opacity` driven off
         * the scroll — animation work for something no one could see.
         */}
        {paths.map((d, i) => (
          <motion.path
            key={`path-${i}`}
            d={d}
            fill="none"
            stroke="var(--color-ash)"
            strokeWidth="0.1"
            strokeLinecap="round"
            style={{ pathLength }}
          />
        ))}

        {paths.map((d, i) => {
          const parts = d.split(" ");
          const endX = parts[parts.length - 2];
          const endY = parts[parts.length - 1];
          return (
            <motion.circle
              key={`node-${i}`}
              cx={endX} cy={endY} r="0.5"
              fill="var(--color-ink)"
              style={{ opacity: nodeOpacity }}
            />
          );
        })}
      </svg>
    </motion.div>
  );
}
