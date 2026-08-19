"use client";

import Image from "next/image";
import { CookieDoodle } from "@/components/brand/Marks";
import IngredientPhoto from "@/components/brand/IngredientPhoto";
import { FLAVOURS, HAS_PACK_IMAGES, packImage } from "@/lib/assets";

const ASPECT = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
} as const;

/**
 * A slot holding one flavour's packaging shot.
 *
 * Renders the monoline stand-in until `HAS_PACK_IMAGES` is flipped. The aspect
 * ratio is fixed either way, so swapping the photography in causes no layout
 * shift — but pick the ratio that matches the delivered files (portrait 3:4),
 * otherwise the photograph gets centre-cropped to fit.
 *
 * The delivered shots are full-bleed photographs on styled sets, not cut-outs,
 * so they are covered rather than contained — a contained photo would letterbox
 * against the flavour ground and read as a mistake.
 */
export default function ProductSlot({
  flavour = 1,
  className,
  index = 0,
  aspect = "portrait",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw",
}: {
  flavour?: number;
  className?: string;
  index?: number;
  aspect?: keyof typeof ASPECT;
  priority?: boolean;
  sizes?: string;
}) {
  const f = FLAVOURS[(flavour - 1) % FLAVOURS.length];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[2rem] ${ASPECT[aspect]} ${className ?? ""}`}
      style={{ backgroundColor: f.ground }}
    >
      {HAS_PACK_IMAGES ? (
        <Image
          src={packImage(f.slug)}
          alt={`Pandur ${f.name} Cookies — ${f.note}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        /*
         * The stand-in is the flavour's own ingredient in the flavour's own
         * accent, not a generic cookie. With the pack photography switched
         * off these four slots are the only thing distinguishing the products
         * on the page, and four identical doodles made them look like one
         * product listed four times.
         */
        <div className="relative flex h-full w-full items-center justify-center">
          <CookieDoodle
            aria-hidden
            className="absolute -right-6 -bottom-8 h-2/5 w-2/5 opacity-25"
            strokeWidth={4}
            stroke={f.line}
          />
          {/*
           * With the pack photography switched off this IS the product
           * image, so it carries a real alt rather than being decorative.
           */}
          <IngredientPhoto
            slug={f.slug}
            index={index}
            alt={`${f.ingredient} — the ingredient behind Pandur ${f.name} Cookies`}
            className="w-[82%]"
          />
        </div>
      )}
    </div>
  );
}
