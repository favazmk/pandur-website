"use client";

import Image from "next/image";
import { CookieDoodle } from "@/components/brand/Marks";
import { SplitLine, Reveal, RevealGroup, RevealItem } from "@/components/motion/Text";
import { Parallax, Tilt3D, ClipReveal } from "@/components/motion/Scroll";
import { HoverDrift } from "@/components/motion/Hover";
import { FLAVOURS, HAS_RETAIL_IMAGES, RETAIL_IMAGES, MUTED } from "@/lib/assets";
import { tiltAt } from "@/lib/motion";

/**
 * Retail presence — the product in a real store.
 *
 * This sits with the markets map because it does the same job by other means:
 * the map states the distribution, these photographs evidence it. Until the
 * files land it renders the same monoline stand-in vocabulary as every other
 * reserved slot, at the exact aspect ratio the photographs will occupy.
 */
function RetailFrame({
  index,
  className,
  sizes,
}: {
  index: number;
  className?: string;
  sizes: string;
}) {
  const shot = RETAIL_IMAGES[index];
  const f = FLAVOURS[index % FLAVOURS.length];

  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] ${className ?? ""}`}
      style={{ backgroundColor: f.ground }}
    >
      {HAS_RETAIL_IMAGES ? (
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <CookieDoodle
            className={`h-2/5 w-2/5 ${tiltAt(index)}`}
            strokeWidth={4}
            stroke={f.line}
          />
        </div>
      )}
    </div>
  );
}

const PROOF = [
  { k: "Facings", v: "Four flavours, side by side" },
  { k: "Format", v: "16-piece retail carton" },
  { k: "Channel", v: "Grocery, bakery and food service" },
];

export default function Retail() {
  return (
    <section className="relative overflow-hidden bg-cream py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className={`text-eyebrow ${MUTED}`}>In store</span>
          <SplitLine
            as="h2"
            text="Already on the shelf."
            className="text-display mt-4 font-display font-black text-ink"
          />
          <Reveal delay={0.15}>
            <p className="text-lead mt-5 max-w-md text-ash">
              Four flavours, facing out, in stores across the northern Emirates.
            </p>
          </Reveal>
        </div>

        {/* --- two planes, so the pair separates as you scroll --- */}
        <div className="relative mt-16 grid grid-cols-1 gap-8 lg:mt-20 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-12">
          <Parallax distance={50}>
            <ClipReveal>
              <Tilt3D max={8} lift={20}>
                <HoverDrift amount={14} className="rounded-[2rem]">
                  <RetailFrame
                    index={0}
                    className={tiltAt(0)}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </HoverDrift>
              </Tilt3D>
            </ClipReveal>
          </Parallax>

          <Parallax distance={-90}>
            <ClipReveal>
              <Tilt3D max={11} lift={24}>
                <HoverDrift amount={18} className="rounded-[2rem]">
                  <RetailFrame
                    index={1}
                    className={tiltAt(2)}
                    sizes="(max-width: 1024px) 100vw, 38vw"
                  />
                </HoverDrift>
              </Tilt3D>
            </ClipReveal>
          </Parallax>
        </div>

        {/* --- proof strip --- */}
        <RevealGroup
          className="mt-16 grid grid-cols-1 gap-y-8 border-t border-ink/12 pt-10 sm:grid-cols-3 sm:gap-x-10"
          stagger={0.09}
        >
          {PROOF.map((p) => (
            <RevealItem key={p.k} variant="scale">
              <dl>
                <dt className={`text-eyebrow ${MUTED}`}>{p.k}</dt>
                <dd className="text-lead mt-2 font-display font-black text-ink">
                  {p.v}
                </dd>
              </dl>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
