"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { CookieDoodle } from "@/components/brand/Marks";
import IngredientPhoto from "@/components/brand/IngredientPhoto";
import { SplitLine } from "@/components/motion/Text";
import { FLAVOURS, MUTED } from "@/lib/assets";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/useMedia";

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
          {FLAVOURS.map((f, i) => (
            <div key={f.id} className="mx-auto max-w-md px-6 text-center">
              {/*
               * The ingredient itself, not a drawing of it. The old disc was
               * filled with the flavour ground and held a line mark; the
               * delivered artwork has its own ground and its own 3:2, so it
               * is shown whole on a card rather than cropped into a circle.
               */}
              <IngredientPhoto
                slug={f.slug}
                index={i}
                className="mx-auto w-64 max-w-full"
              />
              <span
                className="text-eyebrow mt-6 block"
                style={{ color: f.accent }}
              >
                {f.ingredient}
              </span>
              <h3 className="text-title mt-2 font-display font-black text-ink">
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
                <span className={`text-eyebrow ${MUTED}`}>Signature</span>
              </div>

              <div className="flex max-w-xl items-end gap-7">
                {/* The ingredient, drawn and in the flavour's own accent —
                    so each panel is told apart by an object and a colour
                    before the name is even read. */}
                {/*
                 * Shown at every desktop width now. This used to appear only
                 * from `lg` because a continuous 3D cookie carried the panels
                 * below that; with the 3D gone it is the panel's subject and
                 * cannot be the first thing dropped.
                 */}
                <IngredientPhoto
                  slug={f.slug}
                  index={i}
                  className="w-36 shrink-0 lg:w-44"
                />
                <div>
                  <span className="text-eyebrow" style={{ color: f.accent }}>
                    {f.ingredient}
                  </span>
                  <h3 className="text-display mt-3 font-display font-black text-ink">
                    {f.name}
                  </h3>
                  <p className="text-lead mt-4 text-ash">{f.note}</p>
                </div>
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
