"use client";

import { ReactNode, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import { CookieDoodle } from "@/components/brand/Marks";
import { SplitLine, Reveal } from "@/components/motion/Text";
import SceneFallback from "@/components/three/SceneFallback";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/useMedia";

const MarkScene = dynamic(() => import("@/components/three/scenes/MarkScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

/** Three depths — each drifts and parallaxes at a different rate. */
const DOODLES = [
  { cls: "left-[4%] top-[30%] h-16 w-16", delay: "0s", depth: 40 },
  { cls: "right-[8%] top-[24%] h-24 w-24", delay: "-3.2s", depth: 90 },
  { cls: "right-[22%] bottom-[14%] h-12 w-12", delay: "-5.6s", depth: 150 },
];

/**
 * Shared header for interior pages. Lighter than the home hero, with an
 * optional 3D mark on the more brand-forward pages.
 */
/*
 * No kicker above the title.
 *
 * A tiny uppercase tracked label over every page heading is AI section grammar,
 * not voice. The h1 carries the page on its own; where the label held real
 * information it has been folded into the lead line instead.
 */
export default function PageHero({
  title,
  lead,
  children,
  ground = "bg-cream",
  cookie = false,
  seed = 7,
}: {
  title: string;
  lead?: string;
  children?: ReactNode;
  ground?: string;
  cookie?: boolean;
  seed?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const touch = useIsTouch();
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const d0 = useTransform(scrollYProgress, [0, 1], [0, -DOODLES[0].depth]);
  const d1 = useTransform(scrollYProgress, [0, 1], [0, -DOODLES[1].depth]);
  const d2 = useTransform(scrollYProgress, [0, 1], [0, -DOODLES[2].depth]);
  const depths = [d0, d1, d2];

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden ${ground} px-6 pt-36 pb-20 md:pt-48 md:pb-28`}
    >
      {cookie && <MarkScene interactive={!touch && !reduced} seed={seed} />}

      {DOODLES.map((d, i) => (
        <motion.span
          key={i}
          aria-hidden
          className={`animate-drift absolute ${d.cls} text-ink/10`}
          style={{ animationDelay: d.delay, ...(reduced ? {} : { y: depths[i] }) }}
        >
          <CookieDoodle className="h-full w-full" strokeWidth={5} />
        </motion.span>
      ))}

      <motion.div
        className="relative z-10 mx-auto max-w-5xl text-center"
        style={reduced ? undefined : { y, opacity }}
      >
        <SplitLine
          as="h1"
          text={title}
          className="text-display font-display font-black text-ink"
          stagger={0.04}
        />

        {lead && (
          <Reveal delay={0.2} variant="blur">
            <p className="text-lead mx-auto mt-6 max-w-2xl text-ash">{lead}</p>
          </Reveal>
        )}

        {children && <Reveal delay={0.3}>{children}</Reveal>}
      </motion.div>
    </section>
  );
}
