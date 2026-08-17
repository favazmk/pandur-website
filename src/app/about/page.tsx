import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import StatBand from "@/components/sections/StatBand";
import MarqueeBand from "@/components/sections/MarqueeBand";
import { Reveal, RevealGroup, RevealItem, SplitLine } from "@/components/motion/Text";
import { ScrollTilt, Tilt3D } from "@/components/motion/Scroll";
import { CookieDoodle } from "@/components/brand/Marks";
import { tiltAt } from "@/lib/motion";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Pandur is the signature cookie brand of Royal Quality Bakes LLC — 45 years of food manufacturing and bakery experience, based in Zubara, Khorfakkan.",
};

const JOURNEY = [
  {
    k: "The foundation",
    v: "45 years in food manufacturing and bakery production.",
  },
  {
    k: "The brand",
    v: "Pandur created to bring a distinctive cookie to the UAE market.",
  },
  {
    k: "Today",
    v: "Four signature flavours, reaching eight markets across the UAE.",
  },
  {
    k: "Next",
    v: "A trusted UAE bakery brand, growing across the GCC.",
  },
];

const STRENGTHS = [
  { t: "45 Years of Experience", d: "Industry knowledge built over generations." },
  { t: "Quality & Consistency", d: "Reliable taste, batch after batch." },
  { t: "Six-Month Shelf Life", d: "Built for retail and distribution." },
  { t: "Distinctive Taste", d: "Developed to be remembered." },
  { t: "Growing UAE Presence", d: "Already in eight markets." },
  { t: "GCC Ready", d: "Built for expansion and long-term growth." },
];

export default function AboutPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="About Pandur"
        title="Our Taste. Our Experience. Our Future."
        lead="A signature cookie brand from Royal Quality Bakes LLC, based in Zubara, Khorfakkan."
        cookie
        seed={7}
      />

      {/* --- story --- */}
      <section className="relative bg-cream px-6 pb-24 md:pb-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 md:grid-cols-2 md:gap-20">
          <div>
            <SplitLine
              as="h2"
              text="Decades of craft, in one cookie."
              className="text-title font-display font-black text-ink"
            />
          </div>
          <div className="space-y-6">
            <Reveal>
              <p className="text-lead text-ash">
                We combine decades of manufacturing experience with modern
                production to make bakery products built on great taste,
                consistent quality and reliable shelf life.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-lead text-ash">
                Pandur is more than a cookie — it is our signature product.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <StatBand />

      {/* --- journey --- */}
      <section className="relative overflow-hidden bg-cream-deep px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <SplitLine
            as="h2"
            text="Our journey."
            className="text-display font-display font-black text-ink"
          />

          <ScrollTilt angle={18}>
            <RevealGroup className="mt-14 space-y-0" stagger={0.1}>
              {JOURNEY.map((j) => (
                <RevealItem key={j.k} variant="wipe">
                  <div className="grid grid-cols-1 gap-3 border-t border-ink/12 py-8 md:grid-cols-[1fr_2fr] md:gap-10">
                    <h3 className="text-eyebrow pt-1 text-red-deep">{j.k}</h3>
                    <p className="text-title font-display font-black text-ink">
                      {j.v}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </ScrollTilt>
        </div>
      </section>

      {/* --- strengths --- */}
      <section className="relative bg-cream px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-eyebrow text-red-deep">Why Pandur</p>
            </Reveal>
            <SplitLine
              as="h2"
              text="Six reasons to stock us."
              className="text-display mt-5 font-display font-black text-ink"
            />
          </div>

          <RevealGroup
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.07}
          >
            {STRENGTHS.map((s, i) => (
              <RevealItem key={s.t} variant="scale">
                <Tilt3D max={10} lift={20} className="h-full">
                  <div
                    className={`h-full rounded-[2rem] border border-ink/12 bg-white/50 p-8 ${tiltAt(i)}`}
                  >
                    <CookieDoodle
                      className="h-10 w-10 text-red-deep"
                      strokeWidth={5}
                    />
                    <h3 className="mt-6 font-display text-2xl font-black text-ink">
                      {s.t}
                    </h3>
                    <p className="mt-2 text-ash">{s.d}</p>
                  </div>
                </Tilt3D>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <MarqueeBand />

      {/* --- vision + mission --- */}
      <section className="relative bg-ink px-6 py-24 text-cream md:py-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 md:grid-cols-2 md:gap-20">
          <div>
            <Reveal>
              <p className="text-eyebrow text-cream/60">Our Vision</p>
            </Reveal>
            <SplitLine
              as="h2"
              text="A leading UAE-origin bakery brand."
              className="text-title mt-5 font-display font-black text-cream"
            />
          </div>
          <div>
            <Reveal delay={0.1}>
              <p className="text-eyebrow text-cream/60">Our Mission</p>
            </Reveal>
            <SplitLine
              as="h2"
              text="Great products. Trust. Growth."
              className="text-title mt-5 font-display font-black text-dough"
              delay={0.1}
            />
          </div>
        </div>

        <Reveal delay={0.2} className="mt-16 flex justify-center">
          <Link
            href="/contact"
            data-cursor="grow"
            className="group inline-flex items-center gap-3 rounded-full border-2 border-cream px-9 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-cream hover:text-ink"
          >
            Work With Us
            <span className="transition-transform duration-400 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
