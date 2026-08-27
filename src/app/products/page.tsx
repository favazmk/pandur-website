import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import Bite from "@/components/sections/Bite";
import ProductSlot from "@/components/sections/ProductSlot";
import IngredientPhoto from "@/components/brand/IngredientPhoto";
import { SplitLine } from "@/components/motion/Text";
import { Tilt3D } from "@/components/motion/Scroll";
import { HoverDrift, HoverRule } from "@/components/motion/Hover";
import { FLAVOURS, MUTED, PACK } from "@/lib/assets";
import { tiltAt } from "@/lib/motion";

// New components built for the premium product journey
import ProductShelf from "@/components/products/ProductShelf";
import FlavourSelector from "@/components/products/FlavourSelector";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Four signature Pandur cookie flavours, developed for a distinctive taste and a six-month shelf life — built for retail, distribution and food service.",
};

export default function ProductsPage() {
  return (
    <main id="main">
      {/* SECTION 01: Hero */}
      <PageHero
        title="Four Flavours. One Pandur."
        lead="Discover the signature Pandur cookie range."
      />

      {/* SECTION 02: Old Flavour Grid */}
      <section className="relative bg-cream px-6 pb-24 md:pb-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 gap-y-16 sm:grid-cols-2">
          {FLAVOURS.map((f, i) => (
            <div key={f.id} className="group">
              <Tilt3D max={11} lift={24}>
                <HoverDrift amount={16} className={`rounded-[2rem] ${tiltAt(i)}`}>
                  <ProductSlot flavour={f.id} index={i} />
                </HoverDrift>
              </Tilt3D>
              <div className="mt-6 flex items-start gap-4">
                <IngredientPhoto
                  slug={f.slug}
                  index={i}
                  rounded="rounded-2xl"
                  className="mt-1 w-24 shrink-0"
                />
                <div>
                  <span className="text-eyebrow" style={{ color: f.accent }}>
                    {f.ingredient}
                  </span>
                  <h2 className="text-title mt-2 font-display font-black text-ink">
                    <HoverRule on="group">{f.name}</HoverRule>
                  </h2>
                  <p className="text-lead mt-2 text-ash">{f.note}</p>
                  <p className={`text-eyebrow mt-3 ${MUTED}`}>
                    {PACK.pieces} pieces · {PACK.origin}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 03: Product Details */}
      <ProductShelf />

      {/* SECTION 04: Find Your Flavour */}
      <FlavourSelector />

      {/* SECTION 05: Ready to Stock Pandur */}
      <section className="relative bg-cream-deep px-6 py-24 text-center md:py-32">
        <Bite />
        <div className="mt-16 md:mt-24">
          <SplitLine
            as="h2"
            text="Ready to stock Pandur?"
            className="text-display font-display font-black text-ink mb-10"
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              data-cursor="grow"
              className="group inline-flex items-center gap-3 rounded-full bg-red-deep px-9 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-white transition-colors hover:bg-ink"
            >
              Partner with Pandur
              <span className="transition-transform duration-400 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/contact"
              data-cursor="grow"
              className="group inline-flex items-center gap-3 rounded-full border border-ink/20 px-9 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
