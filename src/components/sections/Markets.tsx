"use client";

import { motion } from "motion/react";
import { MARKETS } from "@/lib/assets";
import { SplitLine, Reveal } from "@/components/motion/Text";
import { Parallax, Tilt3D } from "@/components/motion/Scroll";
import { HoverRule } from "@/components/motion/Hover";
import { ease } from "@/lib/motion";

/**
 * Stylised outline of the northern Emirates — decorative, not cartographic.
 * Pin coordinates live in lib/assets.ts.
 */
const OUTLINE =
  "M10 58 C14 50 20 44 28 38 C34 33 40 29 48 17 C52 11 56 8 61 8 C66 8 70 11 73 16 C77 23 79 32 80 42 C81 50 78 56 74 59 C68 63 60 65 50 65 C38 65 24 64 16 62 C12 61 9 60 10 58 Z";

/** Order the pins as a distribution run rather than a scatter. */
const ROUTE = [
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Dibba",
  "Khorfakkan",
  "Fujairah",
  "Kalba",
  "Masafi",
];

const byName = (n: string) => MARKETS.find((m) => m.name === n)!;

const routePath = ROUTE.map((n, i) => {
  const p = byName(n);
  return `${i === 0 ? "M" : "L"}${p.x} ${p.y}`;
}).join(" ");

export default function Markets() {
  return (
    <section className="relative overflow-hidden bg-cream-deep py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-eyebrow text-red-deep">Market Presence</p>
          </Reveal>
          <SplitLine
            as="h2"
            text="Eight markets. One taste."
            className="text-display mt-5 font-display font-black text-ink"
          />
        </div>

        <div className="mt-16 grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.4fr_1fr]">
          {/* --- map --- */}
          <Parallax distance={45} className="relative">
           <Tilt3D max={7} lift={18}>
            <svg
              viewBox="0 0 100 72"
              className="w-full"
              role="img"
              aria-label="Pandur distribution across eight UAE markets"
            >
              <motion.path
                d={OUTLINE}
                fill="none"
                stroke="#221F1F"
                strokeOpacity={0.28}
                strokeWidth={0.6}
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: false, margin: "-20%" }}
                transition={{ duration: 2, ease: ease.expo }}
              />

              <motion.path
                d={routePath}
                fill="none"
                stroke="#EC2126"
                strokeOpacity={0.5}
                strokeWidth={0.45}
                strokeDasharray="1.6 1.4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: false, margin: "-20%" }}
                transition={{ duration: 2.2, delay: 0.5, ease: ease.expo }}
              />

              {MARKETS.map((m, i) => (
                <motion.g
                  key={m.name}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: false, margin: "-20%" }}
                  transition={{
                    duration: 0.55,
                    delay: 0.75 + i * 0.09,
                    ease: ease.pop,
                  }}
                  style={{ transformOrigin: `${m.x}px ${m.y}px` }}
                >
                  <circle cx={m.x} cy={m.y} r={1.5} fill="#EC2126" />
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r={3}
                    fill="none"
                    stroke="#EC2126"
                    strokeOpacity={0.35}
                    strokeWidth={0.35}
                  />
                </motion.g>
              ))}
            </svg>
           </Tilt3D>
          </Parallax>

          {/* --- list --- */}
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
            {MARKETS.map((m, i) => (
              <Reveal key={m.name} delay={0.75 + i * 0.06} y={14}>
                <li className="group flex items-center gap-3 border-b border-ink/10 py-3 transition-transform duration-500 ease-[var(--ease-expo)] hover:translate-x-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red transition-transform duration-500 ease-[var(--ease-pop)] group-hover:scale-[2.2]" />
                  <span className="font-display text-lg font-bold text-ink">
                    <HoverRule on="group">{m.name}</HoverRule>
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
