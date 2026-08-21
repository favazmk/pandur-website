"use client";

import Image from "next/image";
import { useTransform, motion, type MotionValue } from "motion/react";
import { FLAVOURS } from "@/lib/assets";

const FLAVOUR_SHOTS = [
  { slug: "coconut", name: "Coconut", shot: "/products/flavour-coconut.png", accent: "#5E3720", ground: "#F4E7D3" },
  { slug: "peanut", name: "Peanut", shot: "/products/flavour-peanut.png", accent: "#7A4718", ground: "#F7E9C9" },
  { slug: "cardamom", name: "Cardamom", shot: "/products/flavour-cardamom.png", accent: "#4A6B2E", ground: "#E9F0E2" },
  { slug: "butter", name: "Butter", shot: "/products/flavour-butter.png", accent: "#C5221F", ground: "#F5F0D6" },
] as const;

export default function MarketPackages({
  progress,
  reduced,
  className = "",
}: {
  progress: MotionValue<number>;
  reduced: boolean;
  className?: string;
}) {
  // At ~68-82% scroll, reveal the 4 retail packages
  const opacity = useTransform(progress, [0.65, 0.82], [0, 1], { clamp: true });
  const y = useTransform(progress, [0.65, 0.82], [24, 0], { clamp: true });
  const scale = useTransform(progress, [0.65, 0.82], [0.94, 1], { clamp: true });

  return (
    <motion.div
      style={reduced ? undefined : { opacity, y, scale }}
      className={`rounded-2xl border border-ink/10 bg-cream/80 p-2.5 md:p-4 backdrop-blur-md shadow-[0_8px_24px_rgba(58,35,24,0.06)] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-ink/8 pb-1.5 md:pb-2.5">
        <span className="text-[0.58rem] md:text-[0.65rem] font-black uppercase tracking-widest text-ink/60">
          Four Flavour Facings
        </span>
        <span className="text-[0.58rem] md:text-[0.65rem] font-bold text-red-deep uppercase tracking-wider">
          16-Piece Retail Carton
        </span>
      </div>

      <div className="mt-2 md:mt-3 grid grid-cols-4 gap-1.5 md:gap-2.5">
        {FLAVOUR_SHOTS.map((f) => {
          const flavourData = FLAVOURS.find((x) => x.slug === f.slug);
          return (
            <div
              key={f.slug}
              className="group relative flex flex-col items-center rounded-xl p-1.5 md:p-2 transition-transform duration-300 hover:-translate-y-1"
              style={{ backgroundColor: f.ground }}
            >
              <div className="relative aspect-4/3 w-full overflow-hidden">
                <Image
                  src={f.shot}
                  alt={`Pandur ${f.name} Cookies`}
                  width={240}
                  height={170}
                  className="h-full w-full object-contain drop-shadow-[0_3px_6px_rgba(58,35,24,0.18)]"
                />
              </div>

              <span className="mt-1 text-[0.62rem] md:text-[0.7rem] font-black tracking-tight text-ink truncate max-w-full">
                {f.name}
              </span>
              <span
                className="hidden sm:block text-[0.52rem] md:text-[0.55rem] font-bold uppercase tracking-wider opacity-75 truncate max-w-full"
                style={{ color: f.accent }}
              >
                {flavourData?.ingredient ?? f.name}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
