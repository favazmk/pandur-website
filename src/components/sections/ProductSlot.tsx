"use client";

import Image from "next/image";
import { CookieDoodle } from "@/components/brand/Marks";
import { FLAVOURS, HAS_PRODUCT_IMAGES, productImage } from "@/lib/assets";
import { tiltAt } from "@/lib/motion";

/**
 * A reserved slot for product photography.
 *
 * Renders the monoline stand-in until `HAS_PRODUCT_IMAGES` is flipped. The
 * aspect ratio is fixed either way, so swapping the real photographs in causes
 * no layout shift.
 */
export default function ProductSlot({
  flavour = 1,
  kind = "flavour",
  className,
  index = 0,
}: {
  flavour?: number;
  kind?: "flavour" | "pack";
  className?: string;
  index?: number;
}) {
  const f = FLAVOURS[(flavour - 1) % FLAVOURS.length];

  return (
    <div
      className={`relative aspect-square w-full overflow-hidden rounded-[2rem] ${className ?? ""}`}
      style={{ backgroundColor: f.ground }}
    >
      {HAS_PRODUCT_IMAGES ? (
        <Image
          src={productImage(kind, flavour)}
          alt={`Pandur ${f.name}`}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-contain p-6"
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
