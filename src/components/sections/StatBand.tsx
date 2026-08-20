"use client";

import Counter from "@/components/motion/Counter";
import { RevealGroup, RevealItem } from "@/components/motion/Text";
import { ScrollTilt } from "@/components/motion/Scroll";
import { tiltAt } from "@/lib/motion";

const STATS = [
  { value: 45, suffix: "+", unit: "", label: "Years of Experience" },
  { value: 4, suffix: "", unit: "", label: "Signature Flavours" },
  { value: 6, suffix: "", unit: "Months", label: "Shelf Life" },
  { value: 8, suffix: "+", unit: "", label: "UAE Markets" },
];

export default function StatBand() {
  /*
   * `border-y`, not just `border-b`. The hero's ticker used to carry a ruled
   * edge and that was what separated the film from this section; with the
   * ticker gone the film ran straight into cream with nothing marking the
   * change.
   */
  return (
    <section className="relative border-y border-ink/12 bg-cream py-20 md:py-28">
      <ScrollTilt angle={22}>
        <RevealGroup
          className="mx-auto grid max-w-7xl grid-cols-2 gap-y-14 px-6 md:grid-cols-4 md:gap-y-0"
          stagger={0.1}
        >
          {STATS.map((s, i) => (
            <RevealItem
              key={s.label}
              variant="scale"
              className={`relative flex flex-col items-center text-center ${
                i > 0 ? "md:border-l md:border-ink/12" : ""
              }`}
            >
              <div className={tiltAt(i)}>
                <span className="flex items-baseline justify-center gap-2 font-display font-black text-ink">
                  <Counter
                    value={s.value}
                    suffix={s.suffix}
                    className="text-display tabular-nums"
                  />
                  {s.unit && <span className="text-title text-ash">{s.unit}</span>}
                </span>
                <p className="text-eyebrow mt-4 text-ash">{s.label}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </ScrollTilt>
    </section>
  );
}
