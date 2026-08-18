"use client";

import Image from "next/image";
import { CookieDoodle } from "@/components/brand/Marks";
import { FLAVOURS, HAS_PACK_IMAGES, packImage } from "@/lib/assets";
import { tiltAt } from "@/lib/motion";

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
        <div className="flex h-full w-full items-center justify-center">
          <CookieDoodle
            className={`h-3/5 w-3/5 ${tiltAt(index)}`}
            strokeWidth={4}
            stroke={f.chip}
          />
        </div>
      )}
    </div>
  );
}
