"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import SceneFallback from "@/components/three/SceneFallback";
import { CookieDoodle } from "@/components/brand/Marks";
import { SplitLine } from "@/components/motion/Text";
import { FLAVOURS } from "@/lib/assets";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/useMedia";

const FlavourScene = dynamic(
  () => import("@/components/three/scenes/FlavourScene"),
  { ssr: false, loading: () => <SceneFallback className="absolute inset-0 z-10" /> }
);

const N = FLAVOURS.length;

export default function Flavours() {
  const ref = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(N - 1) * 100}%`]);
  const ground = useTransform(
    scrollYProgress,
    FLAVOURS.map((_, i) => i / (N - 1)),
    FLAVOURS.map((f) => f.ground)
  );

  // Hoisted above the mobile early-return: these must run on every render or
  // the hook count changes when the breakpoint flips.
  const doodleA = useTransform(scrollYProgress, [0, 1], [0, -420]);
  const doodleB = useTransform(scrollYProgress, [0, 1], [0, -820]);
  const doodleC = useTransform(scrollYProgress, [0, 1], [0, -1240]);

  /* ---------- mobile / reduced motion: plain vertical stack ---------- */
  if (mobile || reduced) {
    return (
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <SplitLine
            as="h2"
            text="Four cookies. Four reasons to come back."
            className="text-title font-display font-black text-ink"
          />
        </div>
        <div className="mt-14 space-y-14">
          {FLAVOURS.map((f) => (
            <div key={f.id} className="mx-auto max-w-md px-6 text-center">
              <div
                className="mx-auto flex h-56 w-56 items-center justify-center rounded-full"
                style={{ backgroundColor: f.ground }}
              >
                <CookieDoodle
                  className="h-32 w-32"
                  strokeWidth={5}
                  stroke={f.chip}
                />
              </div>
              <h3 className="text-title mt-6 font-display font-black text-ink">
                {f.name}
              </h3>
              <p className="text-lead mt-3 text-ash">{f.note}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ---------- desktop: pinned horizontal scrub ---------- */
  return (
    <div ref={ref} style={{ height: `${N * 100}vh` }} className="relative">
      <motion.div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ backgroundColor: ground }}
      >
        {/* parallax doodles, three depths */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <motion.span
            className="absolute left-[8%] top-[18%] h-24 w-24 text-ink/10"
            style={{ x: doodleA }}
          >
            <CookieDoodle className="h-full w-full" strokeWidth={5} />
          </motion.span>
          <motion.span
            className="absolute right-[12%] top-[26%] h-16 w-16 text-ink/15"
            style={{ x: doodleB }}
          >
            <CookieDoodle className="h-full w-full" strokeWidth={5} />
          </motion.span>
          <motion.span
            className="absolute left-[22%] bottom-[14%] h-20 w-20 text-ink/10"
            style={{ x: doodleC }}
          >
            <CookieDoodle className="h-full w-full" strokeWidth={5} />
          </motion.span>
        </div>

        {/* the single continuous 3D subject */}
        <FlavourScene progress={scrollYProgress} />

        {/* horizontal text track */}
        <motion.div className="relative z-20 flex h-full w-max" style={{ x }}>
          {FLAVOURS.map((f, i) => (
            <div
              key={f.id}
              className="flex h-full w-screen flex-col justify-between px-12 py-16"
            >
              <div className="flex items-start justify-between">
                <span className="text-eyebrow" style={{ color: f.accent }}>
                  {`0${i + 1} / 0${N}`}
                </span>
                <span className="text-eyebrow text-ink/45">Signature</span>
              </div>

              <div className="max-w-xl">
                <h3 className="text-display font-display font-black text-ink">
                  {f.name}
                </h3>
                <p className="text-lead mt-4 text-ash">{f.note}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* progress rail */}
        <div className="absolute bottom-10 left-1/2 z-30 h-[3px] w-40 -translate-x-1/2 overflow-hidden rounded-full bg-ink/15">
          <motion.div
            className="h-full origin-left bg-ink"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
      </motion.div>
    </div>
  );
}
