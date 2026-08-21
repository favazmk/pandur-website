/**
 * PANDUR — the flavour showcase's scene table.
 *
 * One pinned section, four scenes, each owning a quarter of the scroll. This
 * module is the whole of what a scene IS: its pack shot, its ground, its
 * palette, and where every loose ingredient sits around the pack. The
 * components under `components/showcase/` know how to animate a scene; they
 * know nothing about which flavours exist.
 *
 * Swapping artwork or recolouring a flavour is an edit here and nowhere else.
 *
 * No "use client" directive, for the same reason `lib/assets.ts` carries none:
 * it is imported by both server and client modules, and a value crossing from
 * a client module into a server component arrives as a client reference rather
 * than the data itself.
 */

import type {
  SpriteId,
  SpritePalette,
} from "@/components/brand/IngredientSprites";
import { FLAVOURS, type FlavourSlug } from "@/lib/assets";

/* ------------------------------------------------------------------ *
 * Choreography
 * ------------------------------------------------------------------ */

/**
 * How far either side of a scene boundary the handover runs, as a fraction of
 * one scene's span. At 0.24 the outgoing flavour is still leaving while the
 * incoming one is already arriving, which is what makes the four read as one
 * continuous animation rather than as four slides.
 *
 * The number IS the beat shape the brief asked for. A scene is fully present
 * from 24% to 76% of its own span — a little over half of it spent held — and
 * every handover is a 0.12-wide window straddling the boundary, which at this
 * section's height works out at roughly 50vh of scrolling.
 *
 * Push it past 0.5 and neighbouring handovers start to overlap each OTHER:
 * three flavours on screen at once, which reads as a mistake rather than as a
 * transition.
 */
export const BLEND = 0.24;

/**
 * Stops for one scene's presence curve, in whole-section progress.
 *
 * The first and last scenes deliberately push their outer stops OUTSIDE [0,1]
 * so that they are fully present at the very start and the very end. Without
 * that, scene 0 would open half-faded at p = 0 — you would land on the section
 * already mid-transition.
 */
export function sceneStops(index: number, total: number) {
  const span = 1 / total;
  const blend = span * BLEND;
  const start = index * span;
  const end = start + span;
  const first = index === 0;
  const last = index === total - 1;

  return {
    /** presence 0 → 1 across [inA, inB] */
    inA: first ? -2 * blend : start - blend,
    inB: first ? -blend : start + blend,
    /** presence 1 → 0 across [outA, outB] */
    outA: last ? 1 + blend : end - blend,
    outB: last ? 1 + 2 * blend : end + blend,
  };
}

/**
 * Local stacking order inside the pinned stage.
 *
 * The stage sets `isolate`, so these numbers form their own stacking context
 * and never meet the semantic `--z-index-*` ladder in `globals.css` — that
 * ladder orders whole sections against each other, this one orders the five
 * planes of a single composition. Ingredients straddle the pack on purpose:
 * a few pieces passing in front of its edges is what stops the pack reading as
 * a sticker laid on top of a picture.
 */
export const PLANE = {
  wash: 0,
  word: 1,
  back: 2,
  pack: 3,
  front: 4,
  copy: 5,
} as const;

/**
 * Idle float cadences. Extends the four in `lib/heroLayers.ts` to nine so a
 * scene carrying seven pieces never has two of them breathing in step.
 *
 * Negative delays start each one part-way through its cycle, so a scene is
 * already out of phase on its first painted frame instead of starting in
 * lockstep and drifting apart over the next ten seconds.
 *
 * Durations are deliberately un-round and share no small factors — 4.4 and 6.8
 * re-sync every 37 seconds, 4.4 and 6.6 would re-sync every 13.
 */
export const CADENCE = [
  { y: 9, rot: -2.4, scale: 1.03, duration: 5.6, delay: 0 },
  { y: 6, rot: 3.1, scale: 0.98, duration: 4.4, delay: -1.3 },
  { y: 11, rot: -1.8, scale: 1.02, duration: 6.8, delay: -2.1 },
  { y: 7, rot: 3.8, scale: 0.99, duration: 5.0, delay: -0.7 },
  { y: 13, rot: -3.2, scale: 1.04, duration: 7.9, delay: -3.4 },
  { y: 5, rot: 2.2, scale: 0.985, duration: 4.1, delay: -2.6 },
  { y: 10, rot: -2.8, scale: 1.025, duration: 6.3, delay: -1.9 },
  { y: 8, rot: 4.0, scale: 0.995, duration: 5.3, delay: -4.2 },
  { y: 12, rot: -1.4, scale: 1.035, duration: 7.1, delay: -0.4 },
] as const;

/* ------------------------------------------------------------------ *
 * Placement slots
 * ------------------------------------------------------------------ */

/**
 * Seven placements, shared by all four flavours.
 *
 * Slots rather than per-ingredient coordinates, because the composition has
 * hard no-go areas and repeating them four times is four chances to get one
 * wrong — which is exactly what happened first time round: coconut's palm
 * frond and peanut's shell were both parked behind the flavour headline.
 *
 * What the slots have to keep clear:
 *
 *   desktop   the copy column, x < 34% and y > 62%, and the progress rail in
 *             the bottom-right corner
 *   mobile    the two centred text blocks, roughly y 6-24% and y 70-88%, and
 *             the rail centred at the very bottom
 *
 * `lowLeft` is the slot that carries the whole point: on a phone it sits in
 * the bottom-left corner UNDER the note, and on desktop it climbs to mid-left
 * instead, because on desktop that corner is where the copy lives. A slot is
 * allowed to be a different place at each size — that is the job.
 *
 * Mobile-first, exactly as `lib/heroLayers.ts` writes it: bare classes are the
 * 9:16 phone composition, `md:` is the wide one. Widths are percentages of the
 * stage, so a piece keeps its share of the frame at every size.
 */
export const SLOT_PLACE = {
  upperLeft: "left-[3%] top-[10%] w-[23%] md:left-[8%] md:top-[16%] md:w-[10.5%]",
  upperRight:
    "right-[3%] top-[9%] w-[25%] md:right-[11%] md:top-[13%] md:w-[11.5%]",
  midLeft: "left-[-2%] top-[36%] w-[20%] md:left-[15%] md:top-[38%] md:w-[8.5%]",
  midRight:
    "right-[-2%] top-[44%] w-[22%] md:right-[14%] md:top-[46%] md:w-[9.5%]",
  lowRight:
    "right-[6%] bottom-[4%] w-[17%] md:right-[8%] md:bottom-[20%] md:w-[8.5%]",
  lowLeft: "left-[4%] bottom-[3%] w-[15%] md:left-[5%] md:top-[47%] md:w-[7%]",
  /* the seventh piece, desktop only — seven loose objects is too many for a
     9:16 frame that also has to hold two blocks of copy */
  extra: "hidden md:block md:right-[25%] md:bottom-[12%] md:w-[6%]",
} as const;

export type Slot = keyof typeof SLOT_PLACE;

/**
 * Where a slot's piece travels to as its flavour hands over, in percent of its
 * own box. Always away from the pack: on the way out the scene opens up and
 * lets the next one through, on the way in it closes back around the pack.
 *
 * Paired with the slot rather than set per ingredient, because "outward" is a
 * property of where a thing IS, not of what it is.
 */
export const SLOT_DRIFT: Record<Slot, [number, number]> = {
  upperLeft: [-70, -58],
  upperRight: [72, -60],
  midLeft: [-82, -10],
  midRight: [86, 12],
  lowRight: [60, 68],
  lowLeft: [-76, -14],
  extra: [62, 52],
};

/* ------------------------------------------------------------------ *
 * Scene shape
 * ------------------------------------------------------------------ */

export type ShowcaseIngredient = {
  sprite: SpriteId;
  slot: Slot;
  /** `front` paints over the pack, `back` behind it */
  plane: "back" | "front";
  /** 0 = far plane, 1 = nearest. Drives ink and scale together. */
  depth: number;
  /** degrees of rotation across the handover. Small; nothing here spins. */
  spin: number;
  /** index into `CADENCE` */
  cadence: number;
  /**
   * Optional focus blur in px, for the one or two pieces meant to sit
   * furthest back. The house rule for DEPTH is scale and ink, never blur (see
   * `HeroIngredients`); this is the deliberate exception, and it is kept UNDER
   * 2px — at the 2.2 this started at, a blurred sprite on a pale ground stops
   * reading as "far away" and starts reading as a smudge on the screen.
   */
  blur?: number;
};

export type ShowcaseScene = {
  id: FlavourSlug;
  /** the word set behind the pack, in caps */
  word: string;
  name: string;
  /** the one ingredient line, from `lib/assets.ts` */
  ingredient: string;
  note: string;
  /**
   * The pack shot. `null` means no photography yet — the scene draws a
   * stand-in in its own palette instead. Fill this in and nothing else has to
   * change; keep the aspect near 1:1.05 so the composition does not shift.
   */
  pack: { src: string; width: number; height: number; alt: string } | null;
  /** ground colour at this scene's centre; the section interpolates between them */
  ground: string;
  /** the two radial washes laid over the ground, inner then outer */
  wash: [string, string];
  /**
   * Small-text colour on `ground` — carried over from `lib/assets.ts`, where
   * each was measured against AA rather than eyeballed.
   */
  accent: string;
  /** the giant word behind the pack */
  ink: string;
  palette: SpritePalette;
  ingredients: ShowcaseIngredient[];
};

/** Pulls the shared truth for a flavour so nothing is written twice. */
const base = (slug: FlavourSlug) => {
  const f = FLAVOURS.find((x) => x.slug === slug);
  if (!f) throw new Error(`showcase: no flavour "${slug}" in lib/assets`);
  return {
    name: f.name,
    ingredient: f.ingredient,
    note: f.note,
    accent: f.accent,
  };
};

/* ------------------------------------------------------------------ *
 * The four scenes, in scroll order
 * ------------------------------------------------------------------ */

/*
 * GROUNDS are a step deeper than the page's own cream (#FBF5EC). They started
 * within a couple of percent of it, and the result was that the two flavours
 * without photography read as the same empty cream page twice — the colour
 * has to be far enough from the site's default for the change to register as
 * a change at all.
 */

export const SCENES: ShowcaseScene[] = [
  {
    id: "coconut",
    word: "COCONUT",
    ...base("coconut"),
    /*
     * No cut-out for coconut yet. `components/showcase/PackPlaceholder.tsx`
     * stands in until one exists — the flat `pack-coconut.jpg` is not a
     * candidate: it has no alpha, so it would arrive on this tinted stage as
     * a rectangle of somebody else's kitchen.
     */
    pack: null,
    ground: "#F4E7D3",
    wash: ["#E3C296", "#FAF3E8"],
    ink: "#6B4A32",
    palette: {
      deep: "#5E3720",
      mid: "#A06C3F",
      light: "#FBF4E8",
      line: "#4A2A17",
    },
    ingredients: [
      { sprite: "coconut-half", slot: "upperLeft", plane: "back", depth: 0.35, spin: -12, cadence: 0, blur: 1.4 },
      { sprite: "coconut-flake", slot: "upperRight", plane: "back", depth: 0.45, spin: 16, cadence: 2 },
      { sprite: "palm-leaf", slot: "midLeft", plane: "back", depth: 0.28, spin: 14, cadence: 4, blur: 1.8 },
      { sprite: "coconut-chunk", slot: "midRight", plane: "front", depth: 0.95, spin: -14, cadence: 6 },
      { sprite: "coconut-flake", slot: "lowRight", plane: "front", depth: 0.8, spin: -18, cadence: 7 },
      { sprite: "crumb", slot: "lowLeft", plane: "front", depth: 1, spin: 20, cadence: 5 },
      { sprite: "coconut-chunk", slot: "extra", plane: "back", depth: 0.55, spin: 10, cadence: 8 },
    ],
  },

  {
    id: "peanut",
    word: "PEANUT",
    ...base("peanut"),
    /* Same as coconut — no alpha cut-out delivered yet. */
    pack: null,
    ground: "#F7E9C9",
    wash: ["#DDB166", "#FCF6E4"],
    ink: "#8A5A2B",
    palette: {
      deep: "#7A4718",
      mid: "#BE8842",
      light: "#EFD3A2",
      line: "#5E3411",
    },
    ingredients: [
      { sprite: "peanut-shell", slot: "upperLeft", plane: "back", depth: 0.4, spin: -16, cadence: 1, blur: 1.4 },
      { sprite: "peanut-kernel", slot: "upperRight", plane: "back", depth: 0.5, spin: 18, cadence: 3 },
      { sprite: "peanut-shell", slot: "midLeft", plane: "back", depth: 0.3, spin: 12, cadence: 5, blur: 1.8 },
      { sprite: "peanut-kernel", slot: "midRight", plane: "front", depth: 0.95, spin: -20, cadence: 7 },
      { sprite: "peanut-piece", slot: "lowRight", plane: "front", depth: 0.85, spin: -12, cadence: 8 },
      { sprite: "peanut-piece", slot: "lowLeft", plane: "front", depth: 1, spin: 22, cadence: 0 },
      { sprite: "crumb", slot: "extra", plane: "back", depth: 0.6, spin: 16, cadence: 6 },
    ],
  },

  {
    id: "cardamom",
    word: "CARDAMOM",
    ...base("cardamom"),
    pack: {
      src: "/products/hero-cardamom-box-sachet.png",
      width: 1224,
      height: 1285,
      alt: "Pandur Cardamom Cookies — the 16-piece box beside a single sachet",
    },
    ground: "#E9F0E2",
    wash: ["#AEC894", "#F4F9EF"],
    ink: "#4A6B2E",
    palette: {
      deep: "#3A5A26",
      mid: "#75A051",
      light: "#D3E4BC",
      line: "#28401A",
    },
    ingredients: [
      { sprite: "cardamom-leaf", slot: "upperLeft", plane: "back", depth: 0.3, spin: 14, cadence: 2, blur: 1.8 },
      { sprite: "cardamom-pod", slot: "upperRight", plane: "back", depth: 0.5, spin: -16, cadence: 4 },
      { sprite: "cardamom-pod", slot: "midLeft", plane: "front", depth: 0.95, spin: 18, cadence: 1 },
      { sprite: "cardamom-leaf", slot: "midRight", plane: "back", depth: 0.28, spin: -12, cadence: 6, blur: 1.4 },
      { sprite: "cardamom-seed", slot: "lowRight", plane: "front", depth: 1, spin: -24, cadence: 8 },
      { sprite: "cardamom-seed", slot: "lowLeft", plane: "front", depth: 0.9, spin: 20, cadence: 5 },
      { sprite: "cardamom-pod", slot: "extra", plane: "back", depth: 0.6, spin: 12, cadence: 0 },
    ],
  },

  {
    id: "butter",
    word: "BUTTER",
    ...base("butter"),
    pack: {
      src: "/products/hero-butter-box-sachet.png",
      width: 1230,
      height: 1278,
      alt: "Pandur Butter Cookies — the 16-piece box beside a single sachet",
    },
    ground: "#F5F0D6",
    wash: ["#DFCE7C", "#FCFAEC"],
    ink: "#8A6A3A",
    palette: {
      deep: "#A67C22",
      mid: "#E2BB53",
      light: "#F9E9A8",
      line: "#7C5C17",
    },
    ingredients: [
      { sprite: "butter-pat", slot: "upperLeft", plane: "back", depth: 0.38, spin: -10, cadence: 3, blur: 1.4 },
      { sprite: "butter-curl", slot: "upperRight", plane: "back", depth: 0.45, spin: 16, cadence: 5 },
      { sprite: "butter-curl", slot: "midLeft", plane: "back", depth: 0.3, spin: -14, cadence: 7, blur: 1.8 },
      { sprite: "butter-pat", slot: "midRight", plane: "front", depth: 0.95, spin: 12, cadence: 1 },
      { sprite: "crumb", slot: "lowRight", plane: "front", depth: 0.85, spin: -18, cadence: 2 },
      { sprite: "crumb", slot: "lowLeft", plane: "front", depth: 1, spin: 22, cadence: 8 },
      { sprite: "butter-curl", slot: "extra", plane: "back", depth: 0.6, spin: 10, cadence: 6 },
    ],
  },
];

/** Ground colours in scroll order — the section interpolates across these. */
export const GROUNDS = SCENES.map((s) => s.ground);
