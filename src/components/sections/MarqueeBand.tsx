"use client";

import Marquee from "@/components/motion/Marquee";

/**
 * Full-bleed red band. The only place red is allowed to fill a whole area —
 * everywhere else it stays an accent.
 *
 * Two bands, opposite directions, different speeds (40s / 60s), per the rule
 * that neighbouring bands must never share a tempo.
 */
export default function MarqueeBand() {
  return (
    <section className="relative overflow-hidden bg-red-deep py-10 text-white md:py-14">
      <Marquee
        speed={40}
        itemClassName="text-band whitespace-pre font-display font-black"
        repeat={3}
      >
        {"MADE TO GROW · "}
      </Marquee>

      <Marquee
        speed={60}
        reverse
        className="mt-4"
        itemClassName="text-eyebrow whitespace-pre text-white"
        repeat={6}
      >
        {"OUR SIGNATURE TASTE · "}
      </Marquee>
    </section>
  );
}
