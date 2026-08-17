"use client";

import { ReactNode } from "react";
import { CookieDoodle } from "@/components/brand/Marks";
import { SplitLine, Reveal } from "@/components/motion/Text";

const DOODLES = [
  { cls: "left-[4%] top-[30%] h-16 w-16", delay: "0s" },
  { cls: "right-[8%] top-[24%] h-24 w-24", delay: "-3.2s" },
  { cls: "right-[22%] bottom-[14%] h-12 w-12", delay: "-5.6s" },
];

/**
 * Shared header for interior pages. Deliberately quieter than the home hero —
 * no WebGL, so navigating between pages stays instant.
 */
export default function PageHero({
  eyebrow,
  title,
  lead,
  children,
  ground = "bg-cream",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
  ground?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden ${ground} px-6 pt-36 pb-20 md:pt-48 md:pb-28`}
    >
      {DOODLES.map((d, i) => (
        <span
          key={i}
          aria-hidden
          className={`animate-drift absolute ${d.cls} text-ink/10`}
          style={{ animationDelay: d.delay }}
        >
          <CookieDoodle className="h-full w-full" strokeWidth={5} />
        </span>
      ))}

      <div className="relative mx-auto max-w-5xl text-center">
        <Reveal>
          <p className="text-eyebrow text-red-deep">{eyebrow}</p>
        </Reveal>

        <SplitLine
          as="h1"
          text={title}
          className="text-display mt-5 font-display font-black text-ink"
          stagger={0.04}
        />

        {lead && (
          <Reveal delay={0.2}>
            <p className="text-lead mx-auto mt-6 max-w-2xl text-ash">{lead}</p>
          </Reveal>
        )}

        {children && <Reveal delay={0.3}>{children}</Reveal>}
      </div>
    </section>
  );
}
