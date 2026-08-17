"use client";

import { ReactNode } from "react";

type Speed = 40 | 60 | 80;

const FWD: Record<Speed, string> = {
  40: "animate-ticker-40",
  60: "animate-ticker-60",
  80: "animate-ticker-80",
};
const REV: Record<number, string> = {
  40: "animate-ticker-40-rev",
  60: "animate-ticker-60-rev",
};

/**
 * Seamless infinite band. The track holds two identical copies and translates
 * by exactly -50%, so the loop point is invisible.
 *
 * Rule from the spec: never give two adjacent bands the same speed.
 */
export default function Marquee({
  children,
  speed = 60,
  reverse = false,
  className,
  itemClassName,
  repeat = 4,
  fade = false,
}: {
  children: ReactNode;
  speed?: Speed;
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
  repeat?: number;
  fade?: boolean;
}) {
  const anim = reverse ? (REV[speed] ?? REV[60]) : FWD[speed];
  const run = Array.from({ length: repeat });

  return (
    <div
      className={`relative w-full overflow-hidden ${fade ? "edge-fade" : ""} ${className ?? ""}`}
      aria-hidden
    >
      <div className={`flex w-max ${anim} will-change-transform`}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {run.map((_, i) => (
              <span key={i} className={`shrink-0 ${itemClassName ?? ""}`}>
                {children}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
