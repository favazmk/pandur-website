/**
 * PANDUR - the flavour showcase's ingredient props.
 *
 * One sheet, `public/ingredient/premium-flavour-props.webp`: a 1536x1024 frame
 * holding four 768x512 quadrants of loose ingredients, one per flavour, shot
 * with their own depth of field and delivered already masked.
 *
 * IT ARRIVED AS AN SVG, and that SVG was a wrapper around a base64 PNG - which
 * is to say 3.35MB of raster for a decorative layer, with base64 adding a
 * third of it for nothing. This is the same 1536x1024 pixels re-encoded at
 * WebP q92: 587KB, no resolution lost, and the alpha channel comes through
 * bit-for-bit identical, which is the part that matters because the whole
 * technique depends on that mask. The delivered file is kept, unaltered, at
 * `reference/premium_flavor_ingredients.svg`.
 *
 * NOTHING HERE IS REDRAWN AND NOTHING IS RE-CUT INTO FILES. Each prop below is
 * a WINDOW onto that one sheet - a box in sheet pixels, shown by scaling the
 * sheet up behind a small element and offsetting it, which is the CSS-sprite
 * technique. The browser fetches and decodes the artwork once however many
 * props are on screen, and every prop keeps the resolution it was delivered at.
 *
 * THE BOXES WERE MEASURED, NOT EYEBALLED. The sheet's own alpha channel was
 * labelled into connected regions and each region's bounding box taken. Every
 * window was then scored on how much paint its border crosses, because the one
 * thing that gives a cropped sprite away is a straight cut through the piece
 * next door; windows that scored badly were dropped, and the few kept for
 * their size dissolve the offending corner instead - see `fade`.
 *
 * Sizes are held near each crop's own pixel width at a 1536-wide stage, so no
 * prop is upscaled much past 1.3x and none of them goes soft on a large
 * display.
 *
 * LAYOUT IS DATA. Every prop carries where it sits, how big it is, which way
 * it faces, how present it is, how soft, and how far it travels - twice over,
 * once for a phone and once from `md` up. The rules that hold across the table:
 *
 *   - the pack owns the middle of the stage (x 30-70%, y 18-82% at rest) and
 *     nothing is placed inside it;
 *   - the desktop copy column owns x 2-33% below y 52%, the chrome owns the
 *     top 11%, and the rail owns the bottom right;
 *   - on a phone the free ground is the two side margins and the strip under
 *     the note, so the phone layout keeps six props at the edges - several of
 *     them deliberately half off-frame - and drops the rest;
 *   - `opacity` and `blur` are the depth cue, not decoration. A prop that
 *     reads as far away is smaller, paler and softer than one in front, and
 *     the sheet's OWN out-of-focus pieces carry the furthest planes rather
 *     than a sharp piece being blurred to fake it.
 *
 * Placement is authored per flavour and never shared: four flavours reading
 * the same scatter is the thing that makes a decorative layer look generated.
 */

import type { CSSProperties } from "react";
import type { FlavourSlug } from "@/lib/assets";

/** The delivered sheet. One file, four quadrants, every prop inside it. */
export const SHEET = {
  src: "/ingredient/premium-flavour-props.webp",
  width: 1536,
  height: 1024,
} as const;

/** A window onto `SHEET`, in its own pixels. */
export type PropCrop = { x: number; y: number; w: number; h: number };

/** Where a prop sits at one breakpoint. Percentages of the stage. */
export type PropPlace = {
  /**
   * The prop's CENTRE, not its corner - so a value outside 0-100 hangs it off
   * the edge on purpose, and the stage's `overflow-hidden` does the cropping.
   */
  x: number;
  y: number;
  /** width, as a percent of the stage's width; the height follows the crop */
  size: number;
};

export type ShowcaseProp = {
  /** what it is, for reading the table - never rendered */
  name: string;
  crop: PropCrop;
  /** placement from `md` up */
  place: PropPlace;
  /** placement on a phone; `null` drops the prop below `md` */
  mobile: PropPlace | null;
  /** resting angle, degrees */
  rotate: number;
  /** extra degrees across a handover - no two props turn by the same amount */
  spin: number;
  /** resting ink, 0-1 */
  opacity: number;
  /**
   * Focus blur in px, and kept under 2 for the reason the drawn sprites this
   * replaced documented: past that a prop stops reading as far away and starts
   * reading as a smudge on the screen. Most of the depth here is the artwork's
   * own, so this is 0 on all but a couple of pieces.
   */
  blur: number;
  /**
   * Which corner to dissolve, on the few windows whose box keeps a soft sliver
   * of the piece next door. `null` on everything else - and it is deliberately
   * a corner rather than a trim: pulling the box in walks into the prop's own
   * silhouette, while a corner fade takes the sliver and leaves the prop whole.
   */
  fade: "tl" | "tr" | "bl" | "br" | null;
  /** `front` paints over the pack, `back` behind it */
  plane: "back" | "front";
  /** how far it opens away from the pack across a handover, 1 = the full distance */
  drift: number;
  /**
   * Percent of its own height it travels across the WHOLE section - the
   * parallax. Deliberately small: at these numbers you cannot watch a prop
   * move, you can only tell that the layer has depth.
   */
  parallax: number;
  /** index into `CADENCE` in `lib/showcase.ts` */
  cadence: number;
};

/**
 * Turns a crop into the CSS that shows it: the sheet scaled up behind the
 * element, offset so the wanted box lands in the frame.
 *
 * The percentage form of `background-position` is what makes this work at any
 * size - 0% aligns the image's left edge with the box's left edge and 100% its
 * right with the box's right, so one pair of numbers holds however the element
 * is sized. `aspect-ratio` from the crop means the element never needs a height.
 */
export function cropStyle(crop: PropCrop): CSSProperties {
  return {
    aspectRatio: `${crop.w} / ${crop.h}`,
    backgroundImage: `url(${SHEET.src})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${(SHEET.width / crop.w) * 100}% ${(SHEET.height / crop.h) * 100}%`,
    backgroundPosition: `${(crop.x / (SHEET.width - crop.w)) * 100}% ${
      (crop.y / (SHEET.height - crop.h)) * 100
    }%`,
  };
}

/** The four prop sets, in scroll order. */
export const FLAVOUR_PROPS: Record<FlavourSlug, ShowcaseProp[]> = {
  coconut: [
    {
      name: "crescent",
      crop: { x: 482, y: 100, w: 175, h: 155 },
      place: { x: 12, y: 29, size: 12.0 },
      mobile: { x: -4, y: 31, size: 26 },
      rotate: -10, spin: 14, opacity: 0.98, blur: 0, fade: "tr",
      plane: "front", drift: 1.0, parallax: 3.2, cadence: 0,
    },
    {
      name: "pair",
      crop: { x: 143, y: 396, w: 136, h: 92 },
      place: { x: 78, y: 70, size: 10.0 },
      mobile: { x: 89, y: 95, size: 21 },
      rotate: 6, spin: -14, opacity: 0.92, blur: 0, fade: null,
      plane: "front", drift: 0.95, parallax: 3.0, cadence: 7,
    },
    {
      name: "wedge",
      crop: { x: 33, y: 263, w: 100, h: 140 },
      place: { x: 92, y: 44, size: 7.5 },
      mobile: { x: 99, y: 53, size: 17 },
      rotate: -16, spin: 18, opacity: 0.95, blur: 0, fade: "tl",
      plane: "front", drift: 1.05, parallax: 3.6, cadence: 5,
    },
    {
      name: "blur-shell",
      crop: { x: 54, y: 411, w: 91, h: 67 },
      place: { x: 26, y: 15, size: 7.0 },
      mobile: null,
      rotate: 12, spin: -12, opacity: 0.62, blur: 0, fade: null,
      plane: "back", drift: 0.8, parallax: 2.2, cadence: 3,
    },
    {
      name: "leaf",
      crop: { x: 411, y: 425, w: 81, h: 67 },
      place: { x: 6, y: 46, size: 6.0 },
      mobile: { x: 2, y: 63, size: 15 },
      rotate: -22, spin: 20, opacity: 0.85, blur: 0, fade: null,
      plane: "back", drift: 0.9, parallax: 2.0, cadence: 4,
    },
    {
      name: "leaf-soft",
      crop: { x: 690, y: 37, w: 57, h: 74 },
      place: { x: 34, y: 39, size: 4.2 },
      mobile: null,
      rotate: 18, spin: -10, opacity: 0.6, blur: 1.2, fade: null,
      plane: "back", drift: 0.7, parallax: 1.6, cadence: 8,
    },
    {
      name: "flake",
      crop: { x: 685, y: 195, w: 64, h: 58 },
      place: { x: 69, y: 25, size: 4.6 },
      mobile: null,
      rotate: 24, spin: -20, opacity: 0.88, blur: 0, fade: null,
      plane: "front", drift: 1.1, parallax: 2.8, cadence: 1,
    },
    {
      name: "flake-b",
      crop: { x: 548, y: 269, w: 53, h: 63 },
      place: { x: 47, y: 92, size: 3.8 },
      mobile: { x: 16, y: 92, size: 11 },
      rotate: -12, spin: 16, opacity: 0.9, blur: 0, fade: "br",
      plane: "front", drift: 1.0, parallax: 2.4, cadence: 6,
    },
    {
      name: "piece",
      crop: { x: 418, y: 176, w: 40, h: 44 },
      place: { x: 62, y: 14, size: 2.8 },
      mobile: null,
      rotate: 10, spin: 22, opacity: 0.82, blur: 0, fade: null,
      plane: "front", drift: 1.0, parallax: 2.0, cadence: 2,
    },
    {
      name: "flake-soft",
      crop: { x: 19, y: 140, w: 42, h: 39 },
      place: { x: 72, y: 91, size: 3.0 },
      mobile: null,
      rotate: -8, spin: 12, opacity: 0.58, blur: 0.8, fade: null,
      plane: "back", drift: 0.8, parallax: 1.4, cadence: 5,
    },
  ],
  peanut: [
    {
      name: "open-shell",
      crop: { x: 1166, y: 66, w: 168, h: 222 },
      place: { x: 87, y: 31, size: 11.5 },
      mobile: { x: 101, y: 34, size: 24 },
      rotate: 12, spin: -15, opacity: 0.95, blur: 0, fade: null,
      plane: "front", drift: 1.0, parallax: 3.4, cadence: 2,
    },
    {
      name: "shell",
      crop: { x: 872, y: 65, w: 172, h: 144 },
      place: { x: 15, y: 21, size: 12.0 },
      mobile: { x: -3, y: 25, size: 26 },
      rotate: -14, spin: 16, opacity: 0.92, blur: 0, fade: null,
      plane: "back", drift: 0.9, parallax: 2.4, cadence: 0,
    },
    {
      name: "shell-soft",
      crop: { x: 1292, y: 10, w: 121, h: 82 },
      place: { x: 28, y: 42, size: 9.0 },
      mobile: null,
      rotate: 20, spin: -12, opacity: 0.55, blur: 0, fade: null,
      plane: "back", drift: 0.65, parallax: 1.8, cadence: 6,
    },
    {
      name: "split",
      crop: { x: 1023, y: 311, w: 176, h: 117 },
      place: { x: 73, y: 77, size: 11.0 },
      mobile: { x: 86, y: 95, size: 22 },
      rotate: -8, spin: 14, opacity: 0.9, blur: 0, fade: "br",
      plane: "front", drift: 0.95, parallax: 3.0, cadence: 4,
    },
    {
      name: "kernel",
      crop: { x: 1102, y: 23, w: 85, h: 94 },
      place: { x: 7, y: 39, size: 6.2 },
      mobile: { x: 1, y: 57, size: 16 },
      rotate: 16, spin: -18, opacity: 0.95, blur: 0, fade: null,
      plane: "front", drift: 1.05, parallax: 3.2, cadence: 1,
    },
    {
      name: "kernel-b",
      crop: { x: 1008, y: 203, w: 93, h: 103 },
      place: { x: 95, y: 55, size: 6.5 },
      mobile: { x: 98, y: 68, size: 16 },
      rotate: -20, spin: 20, opacity: 0.88, blur: 0, fade: null,
      plane: "front", drift: 1.05, parallax: 3.6, cadence: 7,
    },
    {
      name: "swirl",
      crop: { x: 1409, y: 64, w: 92, h: 92 },
      place: { x: 35, y: 15, size: 6.5 },
      mobile: null,
      rotate: 10, spin: -14, opacity: 0.82, blur: 0, fade: null,
      plane: "back", drift: 0.8, parallax: 2.0, cadence: 3,
    },
    {
      name: "nut",
      crop: { x: 1081, y: 140, w: 80, h: 70 },
      place: { x: 66, y: 13, size: 5.5 },
      mobile: null,
      rotate: -12, spin: 18, opacity: 0.85, blur: 0, fade: null,
      plane: "back", drift: 0.9, parallax: 2.2, cadence: 5,
    },
    {
      name: "nut-b",
      crop: { x: 955, y: 301, w: 87, h: 60 },
      place: { x: 79, y: 43, size: 5.5 },
      mobile: null,
      rotate: 22, spin: -16, opacity: 0.9, blur: 0, fade: null,
      plane: "front", drift: 1.0, parallax: 2.8, cadence: 8,
    },
    {
      name: "nut-soft",
      crop: { x: 789, y: 94, w: 71, h: 62 },
      place: { x: 58, y: 91, size: 4.8 },
      mobile: { x: 22, y: 92, size: 12 },
      rotate: -6, spin: 12, opacity: 0.6, blur: 0, fade: null,
      plane: "back", drift: 0.75, parallax: 1.6, cadence: 0,
    },
    {
      name: "crumb",
      crop: { x: 1214, y: 299, w: 49, h: 49 },
      place: { x: 45, y: 93, size: 3.0 },
      mobile: null,
      rotate: 14, spin: 20, opacity: 0.85, blur: 0, fade: null,
      plane: "front", drift: 1.0, parallax: 2.4, cadence: 4,
    },
    {
      name: "crumb-b",
      crop: { x: 989, y: 419, w: 43, h: 44 },
      place: { x: 24, y: 32, size: 2.6 },
      mobile: null,
      rotate: -18, spin: 16, opacity: 0.72, blur: 0, fade: null,
      plane: "back", drift: 0.85, parallax: 1.8, cadence: 6,
    },
  ],
  cardamom: [
    {
      name: "pod",
      crop: { x: 10, y: 772, w: 185, h: 201 },
      place: { x: 12, y: 32, size: 11.0 },
      mobile: { x: -3, y: 34, size: 24 },
      rotate: -12, spin: 15, opacity: 0.95, blur: 0, fade: "tr",
      plane: "front", drift: 1.0, parallax: 3.2, cadence: 1,
    },
    {
      name: "pod-b",
      crop: { x: 203, y: 564, w: 166, h: 157 },
      place: { x: 86, y: 23, size: 10.5 },
      mobile: { x: 101, y: 21, size: 23 },
      rotate: 16, spin: -18, opacity: 0.9, blur: 0, fade: "tr",
      plane: "back", drift: 0.85, parallax: 2.6, cadence: 4,
    },
    {
      name: "open-pod",
      crop: { x: 369, y: 695, w: 119, h: 165 },
      place: { x: 92, y: 53, size: 8.0 },
      mobile: { x: 98, y: 56, size: 17 },
      rotate: -14, spin: 16, opacity: 0.92, blur: 0, fade: null,
      plane: "front", drift: 1.05, parallax: 3.4, cadence: 6,
    },
    {
      name: "leaf",
      crop: { x: 611, y: 535, w: 113, h: 182 },
      place: { x: 28, y: 14, size: 7.5 },
      mobile: null,
      rotate: 18, spin: -14, opacity: 0.85, blur: 0, fade: null,
      plane: "back", drift: 0.85, parallax: 2.2, cadence: 2,
    },
    {
      name: "leaf-b",
      crop: { x: 53, y: 517, w: 139, h: 109 },
      place: { x: 74, y: 74, size: 9.0 },
      mobile: { x: 86, y: 95, size: 19 },
      rotate: -8, spin: 12, opacity: 0.88, blur: 0, fade: "tl",
      plane: "front", drift: 0.95, parallax: 2.8, cadence: 7,
    },
    {
      name: "leaf-soft",
      crop: { x: 30, y: 677, w: 66, h: 62 },
      place: { x: 5, y: 49, size: 8.0 },
      mobile: { x: 3, y: 65, size: 17 },
      rotate: 22, spin: -20, opacity: 0.62, blur: 0, fade: null,
      plane: "back", drift: 0.75, parallax: 1.8, cadence: 0,
    },
    {
      name: "open-pod-s",
      crop: { x: 638, y: 895, w: 98, h: 69 },
      place: { x: 63, y: 14, size: 6.0 },
      mobile: null,
      rotate: -16, spin: 18, opacity: 0.82, blur: 0, fade: null,
      plane: "back", drift: 0.9, parallax: 2.4, cadence: 5,
    },
    {
      name: "pod-small",
      crop: { x: 439, y: 595, w: 62, h: 78 },
      place: { x: 36, y: 42, size: 4.5 },
      mobile: null,
      rotate: 12, spin: -12, opacity: 0.6, blur: 1.0, fade: null,
      plane: "back", drift: 0.7, parallax: 1.6, cadence: 8,
    },
    {
      name: "pod-open-b",
      crop: { x: 328, y: 549, w: 75, h: 66 },
      place: { x: 47, y: 92, size: 5.5 },
      mobile: { x: 18, y: 92, size: 13 },
      rotate: -6, spin: 16, opacity: 0.88, blur: 0, fade: null,
      plane: "front", drift: 1.0, parallax: 2.6, cadence: 3,
    },
    {
      name: "seed",
      crop: { x: 487, y: 676, w: 37, h: 38 },
      place: { x: 70, y: 34, size: 2.8 },
      mobile: null,
      rotate: 24, spin: -22, opacity: 0.9, blur: 0, fade: null,
      plane: "front", drift: 1.1, parallax: 3.0, cadence: 6,
    },
    {
      name: "seed-b",
      crop: { x: 349, y: 870, w: 44, h: 34 },
      place: { x: 30, y: 25, size: 3.0 },
      mobile: null,
      rotate: -20, spin: 18, opacity: 0.85, blur: 0, fade: null,
      plane: "front", drift: 1.0, parallax: 2.2, cadence: 2,
    },
    {
      name: "seed-soft",
      crop: { x: 20, y: 534, w: 67, h: 38 },
      place: { x: 68, y: 92, size: 4.6 },
      mobile: null,
      rotate: 8, spin: 14, opacity: 0.58, blur: 0, fade: null,
      plane: "back", drift: 0.8, parallax: 1.4, cadence: 5,
    },
  ],
  butter: [
    {
      name: "cube",
      crop: { x: 1282, y: 837, w: 146, h: 151 },
      place: { x: 14, y: 26, size: 11.0 },
      mobile: { x: -3, y: 29, size: 24 },
      rotate: 14, spin: -16, opacity: 0.95, blur: 0, fade: null,
      plane: "front", drift: 1.0, parallax: 3.0, cadence: 3,
    },
    {
      name: "curl",
      crop: { x: 971, y: 516, w: 136, h: 109 },
      place: { x: 85, y: 21, size: 10.5 },
      mobile: { x: 101, y: 25, size: 23 },
      rotate: -10, spin: 14, opacity: 0.92, blur: 0, fade: null,
      plane: "back", drift: 0.88, parallax: 2.6, cadence: 0,
    },
    {
      name: "cube-soft",
      crop: { x: 1414, y: 719, w: 122, h: 130 },
      place: { x: 30, y: 43, size: 9.5 },
      mobile: null,
      rotate: 18, spin: -12, opacity: 0.55, blur: 0, fade: null,
      plane: "back", drift: 0.65, parallax: 1.8, cadence: 5,
    },
    {
      name: "cube-b",
      crop: { x: 1106, y: 577, w: 148, h: 156 },
      place: { x: 90, y: 51, size: 8.5 },
      mobile: { x: 98, y: 55, size: 18 },
      rotate: -18, spin: 20, opacity: 0.9, blur: 0, fade: null,
      plane: "front", drift: 1.05, parallax: 3.4, cadence: 7,
    },
    {
      name: "curl-b",
      crop: { x: 1415, y: 516, w: 100, h: 97 },
      place: { x: 74, y: 75, size: 7.5 },
      mobile: { x: 87, y: 95, size: 18 },
      rotate: 8, spin: -14, opacity: 0.9, blur: 0, fade: null,
      plane: "front", drift: 0.95, parallax: 2.8, cadence: 2,
    },
    {
      name: "chunk",
      crop: { x: 1034, y: 924, w: 91, h: 74 },
      place: { x: 6, y: 44, size: 6.5 },
      mobile: { x: 2, y: 61, size: 15 },
      rotate: -22, spin: 18, opacity: 0.85, blur: 0, fade: null,
      plane: "back", drift: 0.9, parallax: 2.0, cadence: 6,
    },
    {
      name: "chunk-b",
      crop: { x: 1429, y: 918, w: 75, h: 63 },
      place: { x: 40, y: 14, size: 5.5 },
      mobile: null,
      rotate: 20, spin: -18, opacity: 0.82, blur: 0, fade: null,
      plane: "back", drift: 0.85, parallax: 2.2, cadence: 1,
    },
    {
      name: "chunk-c",
      crop: { x: 1213, y: 957, w: 53, h: 53 },
      place: { x: 66, y: 12, size: 4.0 },
      mobile: null,
      rotate: -12, spin: 16, opacity: 0.84, blur: 0, fade: null,
      plane: "back", drift: 0.9, parallax: 2.4, cadence: 4,
    },
    {
      name: "nub",
      crop: { x: 1258, y: 618, w: 44, h: 56 },
      place: { x: 78, y: 39, size: 3.2 },
      mobile: null,
      rotate: 16, spin: -20, opacity: 0.9, blur: 0, fade: null,
      plane: "front", drift: 1.05, parallax: 3.2, cadence: 8,
    },
    {
      name: "nub-soft",
      crop: { x: 987, y: 895, w: 61, h: 51 },
      place: { x: 55, y: 91, size: 4.4 },
      mobile: { x: 22, y: 92, size: 12 },
      rotate: -8, spin: 12, opacity: 0.56, blur: 0, fade: null,
      plane: "back", drift: 0.75, parallax: 1.6, cadence: 0,
    },
    {
      name: "crumb",
      crop: { x: 951, y: 817, w: 44, h: 41 },
      place: { x: 45, y: 93, size: 3.0 },
      mobile: null,
      rotate: 22, spin: 18, opacity: 0.88, blur: 0, fade: null,
      plane: "front", drift: 1.0, parallax: 2.6, cadence: 5,
    },
    {
      name: "crumb-b",
      crop: { x: 1276, y: 808, w: 40, h: 38 },
      place: { x: 24, y: 34, size: 2.8 },
      mobile: null,
      rotate: -16, spin: 14, opacity: 0.74, blur: 0, fade: null,
      plane: "back", drift: 0.85, parallax: 1.8, cadence: 7,
    },
  ],
};
