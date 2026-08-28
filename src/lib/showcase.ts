/**
 * PANDUR — the flavour showcase's scene table.
 *
 * One pinned section, four scenes, each owning a quarter of the scroll. This
 * module is the whole of what a scene IS: its pack shot, its beauty shot, its
 * ground and its palette. The loose ingredients scattered around the pack are
 * their own table, in `lib/showcaseProps.ts`, because they are windows onto a
 * delivered artwork sheet and carry a dozen fields each. The components under
 * `components/showcase/` know how to animate a scene; they know nothing about
 * which flavours exist.
 *
 * Swapping artwork or recolouring a flavour is an edit here and nowhere else.
 *
 * No "use client" directive, for the same reason `lib/assets.ts` carries none:
 * it is imported by both server and client modules, and a value crossing from
 * a client module into a server component arrives as a client reference rather
 * than the data itself.
 */

import type { SpritePalette } from "@/components/brand/IngredientSprites";
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
 * Scene shape
 * ------------------------------------------------------------------ */

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
  /**
   * The flavour's beauty shot — its two cookies and its own ingredients,
   * mid-air. Set beside the name in the copy block.
   *
   * Cut out of `reference/flavour-cookie-sheet.png`, a 2x2 of 768x512 shots
   * that arrived already masked; the four files under `public/products/` are
   * that mask taken in a couple of pixels, cropped to the artwork and resized.
   * Unlike `pack`, all four exist — there is no stand-in and no null case.
   *
   * The height differs per flavour because each was cropped to its own
   * artwork rather than padded to a shared frame: padding would hand the
   * layout four boxes of identical size holding four subjects of different
   * size, which is the thing that makes a row of cut-outs look mismatched.
   */
  shot: { src: string; width: number; height: number };
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
    shot: { src: "/products/flavour-coconut.webp", width: 480, height: 334 },
    pack: {
      src: "/products/hero-coconut-box-sachet.webp",
      width: 1312,
      height: 1199,
      alt: "Pandur Coconut Cookies — the 16-piece box beside a single sachet",
    },
    ground: "#F4E7D3",
    wash: ["#E3C296", "#FAF3E8"],
    ink: "#6B4A32",
    palette: {
      deep: "#5E3720",
      mid: "#A06C3F",
      light: "#FBF4E8",
      line: "#4A2A17",
    },
  },

  {
    id: "peanut",
    word: "PEANUT",
    ...base("peanut"),
    shot: { src: "/products/flavour-peanut.webp", width: 480, height: 341 },
    pack: {
      src: "/products/hero-peanut-box-sachet.webp",
      width: 1240,
      height: 1269,
      alt: "Pandur Peanut Cookies — the 16-piece box beside a single sachet",
    },
    ground: "#F7E9C9",
    wash: ["#DDB166", "#FCF6E4"],
    ink: "#8A5A2B",
    palette: {
      deep: "#7A4718",
      mid: "#BE8842",
      light: "#EFD3A2",
      line: "#5E3411",
    },
  },

  {
    id: "cardamom",
    word: "CARDAMOM",
    ...base("cardamom"),
    shot: { src: "/products/flavour-cardamom.webp", width: 480, height: 350 },
    pack: {
      src: "/products/hero-cardamom-box-sachet.webp",
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
  },

  {
    id: "butter",
    word: "BUTTER",
    ...base("butter"),
    shot: { src: "/products/flavour-butter.webp", width: 480, height: 341 },
    pack: {
      src: "/products/hero-butter-box-sachet.webp",
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
  },
];

/** Ground colours in scroll order — the section interpolates across these. */
export const GROUNDS = SCENES.map((s) => s.ground);
