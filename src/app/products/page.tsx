import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import ProductSlot from "@/components/sections/ProductSlot";
import Bite from "@/components/sections/Bite";
import { Reveal, RevealGroup, RevealItem, SplitLine } from "@/components/motion/Text";
import { ScrollTilt, Tilt3D, ClipReveal } from "@/components/motion/Scroll";
import { FLAVOURS } from "@/lib/assets";
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
        eyebrow="Our Products"
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
              <ClipReveal>
                <Tilt3D max={11} lift={24}>
                  <div className={tiltAt(i)}>
                    <ProductSlot flavour={f.id} index={i} />
                  </div>
                </Tilt3D>
              </ClipReveal>
              <p className="text-eyebrow mt-6" style={{ color: f.accent }}>
                {`0${i + 1}`}
              </p>
              <h2 className="text-title mt-2 font-display font-black text-ink">
                {f.name}
              </h2>
              <p className="text-lead mt-2 text-ash">{f.note}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-16 max-w-2xl text-center text-sm text-ash">
            Flavour names and product photography are pending from Royal Quality
            Bakes and will replace these placeholders.
          </p>
        </Reveal>
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
                <dl className="text-center">
                  <dt className="text-eyebrow text-ash">{s.k}</dt>
                  <dd className="text-title mt-3 font-display font-black text-ink">
                    {s.v}
                  </dd>
                </dl>
              </RevealItem>
            ))}
          </RevealGroup>
        </ScrollTilt>
      </section>

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
