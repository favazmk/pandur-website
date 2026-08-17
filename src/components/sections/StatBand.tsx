"use client";

import Counter from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Text";
import { tiltAt } from "@/lib/motion";

const STATS = [
  { value: 45, suffix: "+", unit: "", label: "Years of Experience" },
  { value: 4, suffix: "", unit: "", label: "Signature Flavours" },
  { value: 6, suffix: "", unit: "Months", label: "Shelf Life" },
  { value: 8, suffix: "+", unit: "", label: "UAE Markets" },
];

export default function StatBand() {
  return (
    <section className="relative border-b border-ink/12 bg-cream py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-14 px-6 md:grid-cols-4 md:gap-y-0">
        {STATS.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
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
                {s.unit && (
                  <span className="text-title text-ash">{s.unit}</span>
                )}
              </span>
              <p className="text-eyebrow mt-4 text-ash">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
