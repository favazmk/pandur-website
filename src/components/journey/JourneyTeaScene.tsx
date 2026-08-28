"use client";

import Image from "next/image";
import { useTransform, motion, type MotionValue } from "motion/react";
import { DESKTOP_PLATE_CENTER, MOBILE_PLATE_CENTER } from "@/lib/cookieJourney";

export default function JourneyTeaScene({
  progress,
  isMobile = false,
  reduced = false,
}: {
  progress: MotionValue<number>;
  isMobile?: boolean;
  reduced?: boolean;
}) {
  // Fade in during final 0.78 -> 0.88 window
  const opacity = useTransform(progress, [0.78, 0.88], [0, 1], { clamp: true });
  const y = useTransform(progress, [0.78, 0.88], [24, 0], { clamp: true });

  const plateCenter = isMobile ? MOBILE_PLATE_CENTER : DESKTOP_PLATE_CENTER;

  return (
    <motion.div
      style={reduced ? undefined : { opacity, y }}
      className="pointer-events-none absolute inset-0 z-20 select-none overflow-hidden"
    >
      {/* 
        Compact Plate & Teacup Stage:
        Center of ceramic plate inside image: x = 39.44%, y = 51.23%.
        Setting left: plateCenter.x%, top: plateCenter.y% with transform: translate(-39.44%, -51.23%)
        positions the ceramic plate's exact center at plateCenter coordinates.
      */}
      <div
        className="absolute will-change-transform pointer-events-none select-none"
        style={{
          left: `${plateCenter.x}%`,
          top: `${plateCenter.y}%`,
          transform: "translate(-39.44%, -51.23%)",
          width: isMobile ? "68vw" : "36vw",
          maxWidth: isMobile ? "290px" : "520px",
        }}
      >
        <div className="relative aspect-3/2 w-full select-none pointer-events-none drop-shadow-[0_16px_32px_rgba(58,35,24,0.16)]">
          <Image
            src="/ingredient/tea-plate-empty.webp"
            alt="Pandur Tea Plate and Karak Chai Cup"
            width={1536}
            height={1024}
            className="h-full w-full object-contain pointer-events-none select-none"
            priority={false}
          />
        </div>
      </div>

      {/* Editorial Narrative Section */}
      <div
        className={`absolute pointer-events-none select-none ${
          isMobile
            ? "left-6 right-6 bottom-24 text-center"
            : "right-10 lg:right-16 top-1/2 -translate-y-1/2 max-w-md text-right"
        }`}
      >
        <span className="text-[0.65rem] md:text-xs font-black uppercase tracking-[0.24em] text-red-deep block mb-1.5">
          The Signature Experience
        </span>
        <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-ink">
          Made for the UAE.
        </h2>
        <p className="mt-2 text-xs sm:text-sm font-medium text-ash leading-relaxed">
          Four flavours crafted in Khorfakkan with 45 years of bakery tradition,
          delivering fresh-from-the-oven aroma with every single pour.
        </p>
      </div>
    </motion.div>
  );
}
