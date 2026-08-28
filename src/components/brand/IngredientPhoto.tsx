import type { CSSProperties } from "react";
import type { FlavourSlug } from "@/lib/assets";

/* ------------------------------------------------------------------
   A flavour's real ingredient, as delivered.

   The four `public/ingredient/*.svg` files, placed directly — no
   recolour, no redraw, no raster fallback, no filter. Where a drawn
   `IngredientMark` used to stand in, this shows the actual thing.

   THE SHAPE IS NOT A CHOICE. Each file is a 768x512 frame with an
   opaque ground, so it cannot be dropped onto a flavour's coloured
   panel as a bare rectangle. The obvious fix — crop it to a disc —
   was measured against all four and rejected: a centre square clips
   every one of them (coconut loses 98px of palm leaf, peanut 50px of
   shell). So the frame is kept whole at its native 3:2 and given a
   rounded corner instead, which crops nothing and matches the
   `rounded-[2rem]` product slots the site already uses.
   ------------------------------------------------------------------ */

/**
 * Four cadences, cycled by `index`. Same figures as the hero's drifting
 * ingredients, so a flavour's illustration moves the same way wherever it
 * appears. Delays are negative so a grid of these is already out of phase
 * on its first frame rather than starting in lockstep.
 */
const CADENCE = [
  { y: 8, rot: -2, scale: 1.02, duration: 5.6, delay: 0 },
  { y: 6, rot: 3, scale: 0.985, duration: 4.4, delay: -1.3 },
  { y: 10, rot: -2, scale: 1.015, duration: 6.8, delay: -2.1 },
  { y: 7, rot: 4, scale: 0.99, duration: 5, delay: -0.7 },
] as const;

export default function IngredientPhoto({
  slug,
  index = 0,
  alt = "",
  float = true,
  rounded = "rounded-[1.75rem]",
  className = "",
  loading = "lazy",
}: {
  slug: FlavourSlug;
  /** picks the drift cadence — pass the item's position in its list */
  index?: number;
  /**
   * Leave empty where adjacent copy already names the ingredient; the image
   * is then marked decorative rather than read out twice.
   */
  alt?: string;
  float?: boolean;
  rounded?: string;
  /** sizing and placement — this component brings no width of its own */
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const c = CADENCE[index % CADENCE.length];

  return (
    <div
      className={`overflow-hidden ${rounded} ${
        float ? "ingredient-float" : ""
      } ${className}`}
      style={
        {
          "--f-y": `${c.y}px`,
          "--f-rot": `${c.rot}deg`,
          "--f-scale": c.scale,
          "--f-dur": `${c.duration}s`,
          "--f-delay": `${c.delay}s`,
        } as CSSProperties
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ships as-is;
          next/image would need dangerouslyAllowSVG and gains nothing on a
          file the optimiser passes straight through. */}
      <img
        src={`/ingredient/${slug}.webp`}
        alt={alt}
        aria-hidden={alt === "" ? true : undefined}
        /* intrinsic 3:2 declared, so the box holds its ratio before the
           file lands and nothing reflows when it does */
        width={768}
        height={512}
        loading={loading}
        decoding="async"
        draggable={false}
        className="block h-auto w-full select-none"
      />
    </div>
  );
}
