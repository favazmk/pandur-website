/**
 * PANDUR — the hero's layer table.
 *
 * Data, not markup, because the delivered shots are square and portrait while
 * the hero is widescreen: placement and scale have to differ per breakpoint,
 * and that is far easier to reason about in one table than scattered through
 * JSX.
 *
 * `depth` is the single number that drives everything about how a layer
 * behaves: 0 is the far plane, 1 is nearest the viewer. Parallax rate, idle
 * float amplitude and ink all read from it, so a layer cannot end up moving
 * like it is close while looking like it is far.
 */

import type { FlavourSlug } from "@/lib/assets";

/* ------------------------------------------------------------------ *
 * Products
 * ------------------------------------------------------------------ */

export type HeroProduct = {
  slug: Extract<FlavourSlug, "butter" | "cardamom">;
  src: string;
  /** intrinsic size of the delivered file, so nothing reflows on load */
  width: number;
  height: number;
  alt: string;
  /** placement inside the stage box */
  place: string;
};

/**
 * Only butter and cardamom. Coconut and peanut have no photography at this
 * standard, and a hero that mixes these cut-outs with the older low-res pack
 * renders would advertise the difference.
 *
 * Both use the box-and-sachet shot: it is the only composition that exists
 * with real alpha for BOTH flavours, so the two sides of the swap are built
 * from the same kind of picture rather than one box against one sachet.
 */
export const HERO_PRODUCTS: HeroProduct[] = [
  {
    slug: "butter",
    src: "/products/hero-butter-box-sachet.png",
    width: 1230,
    height: 1278,
    alt: "Pandur Butter Cookies — the 16-piece box beside a single sachet",
    place: "left-[2%] top-[6%] w-[74%] sm:left-[4%] sm:w-[70%]",
  },
  {
    slug: "cardamom",
    src: "/products/hero-cardamom-box-sachet.png",
    width: 1224,
    height: 1285,
    alt: "Pandur Cardamom Cookies — the 16-piece box beside a single sachet",
    place: "right-[0%] bottom-[4%] w-[66%] sm:right-[2%] sm:w-[62%]",
  },
];

/* ------------------------------------------------------------------ *
 * Ingredients
 * ------------------------------------------------------------------ */

export type HeroIngredient = {
  slug: FlavourSlug;
  /** 0 = far plane, 1 = nearest. Drives parallax, float and ink together. */
  depth: number;
  /** which plane it paints in — `near` sits over the products */
  plane: "far" | "near";
  place: string;
  /** index into the float cadence table, so no two share a rhythm */
  cadence: number;
};

/**
 * The two hero flavours get the near plane, where they are large and read as
 * the ingredient in the pack you are looking at. Coconut and peanut sit far
 * back and small — present as part of the range, not competing for the two
 * products actually on show.
 *
 * The far pair is dropped below `sm`. At 375 the copy is centred and spans
 * the full column, so there is no margin to sit in — the eyebrow line runs
 * from edge to edge and anything at the top corners lands on it. Four
 * floating elements is also simply too many for that screen; the near pair
 * carries the ingredients there.
 */
export const HERO_INGREDIENTS: HeroIngredient[] = [
  {
    slug: "coconut",
    depth: 0.15,
    plane: "far",
    place:
      "hidden sm:block left-[3%] top-[12%] w-[16%] sm:left-[5%] sm:w-[13%] lg:w-[11%]",
    cadence: 0,
  },
  {
    slug: "peanut",
    depth: 0.3,
    plane: "far",
    place:
      "hidden sm:block right-[6%] top-[6%] w-[15%] sm:right-[8%] sm:w-[12%] lg:w-[10%]",
    cadence: 2,
  },
  {
    slug: "butter",
    depth: 0.8,
    plane: "near",
    /*
     * Right of centre, not left. The near plane paints OVER the copy, and at
     * `left-[-4%]` this landed across the headline's last line and the
     * caption under it. Near-plane layers belong on the product side.
     */
    place:
      "left-[38%] bottom-[6%] w-[22%] sm:left-[42%] sm:w-[18%] lg:left-[46%] lg:w-[13%]",
    cadence: 1,
  },
  {
    slug: "cardamom",
    depth: 1,
    plane: "near",
    /*
     * Sits low until `lg`. In the stacked layout the copy owns the top half,
     * and at `top-[34%]` this landed across the flavour caption; from `lg`
     * the copy moves left and the right side is free.
     */
    place:
      "right-[-5%] top-[54%] w-[28%] sm:right-[-2%] sm:top-[50%] sm:w-[22%] lg:right-[3%] lg:top-[34%] lg:w-[16%]",
    cadence: 3,
  },
];

/**
 * Idle float cadences — the same figures the ingredients have used since they
 * arrived, so an illustration moves the same way here as it does in the
 * flavour panels. Negative delays start each one part-way through its cycle,
 * so the group is out of phase from the first frame.
 */
export const FLOAT_CADENCE = [
  { y: 8, rot: -2, scale: 1.02, duration: 5.6, delay: 0 },
  { y: 6, rot: 3, scale: 0.985, duration: 4.4, delay: -1.3 },
  { y: 10, rot: -2, scale: 1.015, duration: 6.8, delay: -2.1 },
  { y: 7, rot: 4, scale: 0.99, duration: 5, delay: -0.7 },
] as const;

/* ------------------------------------------------------------------ *
 * Choreography
 * ------------------------------------------------------------------ */

/**
 * The pin is 150vh, which buys exactly one beat. Spending it on a single
 * swap — butter leads, then cardamom does — is what justifies holding the
 * visitor at all; a hold with only drift in it is a delay.
 *
 *   0    -> HOLD   the landed state, identical to what renders on load
 *   HOLD -> SWAP   lead and trailing product trade places
 *   SWAP -> 1      copy lifts away and the hero releases
 */
export const BEAT = {
  hold: 0.15,
  swap: 0.7,
} as const;

/** Where the two products cross. zIndex has to step, so it steps here. */
export const CROSSOVER = 0.42;

/** Parallax travel in px for a depth-1 layer across the whole pin. */
export const PARALLAX = {
  far: -40,
  near: -130,
} as const;
