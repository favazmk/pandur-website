import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import ProductSlot from "@/components/sections/ProductSlot";
import Bite from "@/components/sections/Bite";
import Retail from "@/components/sections/Retail";
import { Reveal, RevealGroup, RevealItem, SplitLine } from "@/components/motion/Text";
import { ScrollTilt, Tilt3D, ClipReveal } from "@/components/motion/Scroll";
import { HoverDrift, HoverRule, HoverScramble } from "@/components/motion/Hover";
import { FLAVOURS, MUTED, PACK } from "@/lib/assets";
import { tiltAt } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Four signature Pandur cookie flavours, developed for a distinctive taste and a six-month shelf life — built for retail, distribution and food service.",
};

const SPECS = [
  { k: "Shelf Life", v: "6 Months" },
  { k: "Flavours", v: "4 Signature" },
  { k: "Origin", v: "Khorfakkan, UAE" },
  { k: "Channels", v: "Retail & Food Service" },
];

export default function ProductsPage() {
  return (
    <main id="main">
      <PageHero
        title="Four cookies. Four reasons to come back."
        lead="Developed to deliver a delicious, memorable taste — with a six-month shelf life built for modern retail."
        cookie
        seed={11}
      />

      {/* --- flavour grid --- */}
      <section className="relative bg-cream px-6 pb-24 md:pb-32">
        <RevealGroup
          className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2"
          stagger={0.1}
        >
          {FLAVOURS.map((f, i) => (
            <RevealItem key={f.id} variant="scale">
              <div className="group" data-cursor-label="View">
                <ClipReveal>
                  <Tilt3D max={11} lift={24}>
                    <HoverDrift amount={16} className={`rounded-[2rem] ${tiltAt(i)}`}>
                      <ProductSlot flavour={f.id} index={i} />
                    </HoverDrift>
                  </Tilt3D>
                </ClipReveal>
                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <h2 className="text-title font-display font-black text-ink">
                    <HoverRule on="group">{f.name}</HoverRule>
                  </h2>
                  <span
                    lang="ar"
                    dir="rtl"
                    className="font-display text-lg"
                    style={{ color: f.accent }}
                  >
                    {f.nameAr}
                  </span>
                </div>
                <p className="text-lead mt-2 text-ash">{f.note}</p>
                <p className={`text-eyebrow mt-3 ${MUTED}`}>
                  {PACK.pieces} pieces · {PACK.origin}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* --- spec strip --- */}
      <section className="relative border-y border-ink/12 bg-cream-deep px-6 py-16">
        <ScrollTilt angle={20}>
          <RevealGroup
            className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 lg:grid-cols-4"
            stagger={0.09}
          >
            {SPECS.map((s) => (
              <RevealItem key={s.k} variant="scale">
                {/* spec values read as data, so the scramble suits them here */}
                <dl className="text-center">
                  <dt className="text-eyebrow text-ash">{s.k}</dt>
                  <dd className="text-title mt-3 font-display font-black text-ink">
                    <HoverScramble text={s.v} />
                  </dd>
                </dl>
              </RevealItem>
            ))}
          </RevealGroup>
        </ScrollTilt>
      </section>

      {/* --- retail proof --- */}
      <Retail />

      {/* --- the bite scene, reused --- */}
      <Bite />

      {/* --- CTA --- */}
      <section className="relative bg-cream px-6 py-24 text-center md:py-32">
        <SplitLine
          as="h2"
          text="Ready to stock Pandur?"
          className="text-display font-display font-black text-ink"
        />
        <Reveal delay={0.15} className="mt-10 flex justify-center">
          <Link
            href="/contact"
            data-cursor="grow"
            className="group inline-flex items-center gap-3 rounded-full bg-red-deep px-9 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-white transition-colors hover:bg-ink"
          >
            Request Trade Pricing
            <span className="transition-transform duration-400 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
