"use client";

import { RevealGroup, RevealItem, SplitLine } from "@/components/motion/Text";
import {
  Parallax,
  Tilt3D,
  ClipReveal,
  ScrollFillText,
} from "@/components/motion/Scroll";
import ProductSlot from "./ProductSlot";
import { tiltAt } from "@/lib/motion";
import { DoodleLayer } from "@/components/brand/DoodleField";

const CLAIMS = [
  { title: "45 years in the oven.", note: "Four decades of bakery craft behind every batch." },
  { title: "Consistent, every batch.", note: "Controlled production, repeatable results." },
  { title: "Built for the shelf.", note: "Six months, without trading away taste." },
];

export default function Craft() {
  return (
    <section className="relative overflow-hidden bg-cream py-24 md:py-36">
      {/*
       * Two layers, opposite corners, each on its own cadence — the point of
       * staggering them is that the eye never catches two edges of the same
       * drawing rising together. Both bleed past the section, which the
       * section's `overflow-hidden` clips.
       */}
      <DoodleLayer index={0} className="-left-[10%] top-[3%] w-[62%]" />
      <DoodleLayer index={1} className="-right-[12%] bottom-[1%] w-[54%]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:gap-20">
        {/* left — the claims */}
        <div>
          <SplitLine
            as="h2"
            text="Made properly. Then made again."
            className="text-display font-display font-black text-ink"
          />

          <ScrollFillText
            className="text-lead mt-6 max-w-md"
            text="Every batch runs the same way, so the cookie a shop orders in Kalba is the cookie they got in Sharjah."
          />

          <RevealGroup className="mt-12 space-y-9" stagger={0.12}>
            {CLAIMS.map((c) => (
              <RevealItem key={c.title} variant="wipe">
                {/* no 01/02/03 — these are three claims, not a sequence */}
                <div className="border-t border-ink/12 pt-6">
                  <h3 className="text-title font-display font-black text-ink">
                    {c.title}
                  </h3>
                  <p className="text-lead mt-2 text-ash">{c.note}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* right — reserved for photography, on two parallax planes */}
        <div className="relative">
          <Parallax distance={60}>
            <ClipReveal>
              <Tilt3D max={9} lift={22}>
                <div className={tiltAt(1)}>
                  <ProductSlot flavour={1} index={0} />
                </div>
              </Tilt3D>
            </ClipReveal>
          </Parallax>

          {/* deeper plane — moves further, so the two separate as you scroll */}
          <div className="absolute -bottom-10 -left-6 w-1/2 md:-left-12">
            <Parallax distance={-110}>
              <Tilt3D max={12} lift={26}>
                <div className={tiltAt(2)}>
                  <ProductSlot flavour={3} index={1} />
                </div>
              </Tilt3D>
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  );
}
