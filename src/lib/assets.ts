/**
 * PANDUR — product truth and asset contract.
 *
 * The four flavours below are read from the delivered packaging photography,
 * not invented. Everything a component needs about a flavour lives here.
 *
 * This module carries no "use client" directive on purpose: it is imported by
 * both server-rendered pages and interactive components, and a value crossing
 * from a client module into a server component arrives as a client reference
 * rather than the data itself. Keep it directive-free.
 */

/* ------------------------------------------------------------------ *
 * Photography
 * ------------------------------------------------------------------ */

/**
 * Two independent switches, because the two sets arrive independently and
 * either can go live without the other.
 *
 * Flip a flag only once the matching files are actually in `public/products/`.
 * Every slot reserves its aspect ratio in both states, so nothing reflows.
 */
/**
 * OFF deliberately, not because the files are missing — they are in
 * `public/products/` and correctly wired. The four pack images read as
 * generated mockups and two carry visible errors, so the procedural stand-ins
 * are the better thing to show until real photography exists. Flip to `true`
 * once it does; nothing else needs to change. See README, outstanding item 3.
 */
export const HAS_PACK_IMAGES = true;

/** The retail pair is genuine store photography and shipping. */
export const HAS_RETAIL_IMAGES = true;

/**
 * Packaging photography — the box on a styled kitchen set.
 *
 *   public/products/pack-butter.webp
 *   public/products/pack-coconut.webp
 *   public/products/pack-peanut.webp
 *   public/products/pack-cardamom.webp
 *
 * Portrait 3:4, >= 1600px on the long edge, JPEG (these are photographs on
 * full-bleed sets — there is no transparency to preserve and PNG would triple
 * the weight). The box sits left of centre with the styled props to its right;
 * slots crop from the centre, so keep that composition.
 *
 * WHAT WAS ACTUALLY DELIVERED (2026-08-18) — below spec on two counts:
 *
 *   pack-butter    896x1195  0.750  on ratio
 *   pack-cardamom  896x1056  0.848  12% wider than 3:4
 *   pack-coconut   896x1040  0.862  13% wider than 3:4
 *   pack-peanut    896x1049  0.854  12% wider than 3:4
 *
 * 1. 896px wide against a >=1600px spec, so these are soft on a 2x display at
 *    the ~500px slot the products grid renders them into.
 * 2. Only butter is on ratio. The other three are centre-cropped ~6% per side
 *    by `object-cover`. That was checked against each image: the crop takes
 *    background props (spice jars, cabinet edges) and leaves the box and the
 *    plated cookies whole. If these are ever re-shot, hold 3:4 and the crop
 *    disappears.
 *
 * Note also that these four read as renders rather than photographs — the
 * quality seal garbles to "SOEMIMS GOAUTT" on peanut, and peanut carries
 * coconut's Arabic. See README, outstanding item 3.
 */
export const packImage = (slug: FlavourSlug) => `/products/hero-${slug}-scene.webp`;

/**
 * Retail photography — Pandur on the shelf, in a real store.
 *
 *   public/products/retail-shelf.webp   the tall gondola end, boxes facing
 *   public/products/retail-aisle.webp   the wider aisle view
 *
 * Landscape 4:3, >= 2000px on the long edge, JPEG.
 */
export const RETAIL_IMAGES = [
  {
    src: "/products/retail-shelf.webp",
    alt: "Pandur cookie boxes facing out across a shelf display in a UAE store",
  },
  {
    src: "/products/retail-aisle.webp",
    alt: "A bakery aisle stocked with Pandur cookies alongside fresh bread",
  },
] as const;

/* ------------------------------------------------------------------ *
 * The four flavours
 * ------------------------------------------------------------------ */

export type FlavourSlug = "butter" | "coconut" | "peanut" | "cardamom";

export type Flavour = {
  id: number;
  slug: FlavourSlug;
  /** English name as printed on the pack */
  name: string;
  /**
   * The one ingredient the flavour is built on. This drives the flavour's
   * illustration (`public/ingredient/<slug>.svg`, placed by
   * `components/brand/IngredientPhoto.tsx`) as well as the label, so the four
   * are told apart by the ingredient itself and a colour, not only a word.
   *
   * The drawn line marks in `components/brand/Ingredients.tsx` are what this
   * used to render and are now unused — kept, not deleted, because they are
   * the only version that survives being shown at glyph size.
   */
  ingredient: string;
  /** one short line, never a paragraph */
  note: string;
  /** page ground while this panel is active */
  ground: string;
  /**
   * Stroke tone for this flavour's line art — the drifting cookie doodles and
   * the decorative marks. Named for what it does; it was `chip`, back when the
   * 3D biscuit had chocolate chips to colour, and the real product has none.
   */
  line: string;
  /**
   * Small label text on `ground`. Every value below was computed, not
   * eyeballed, and clears WCAG AA (4.5:1) on its own ground — the measured
   * ratio is recorded beside it so a later edit cannot quietly undo it.
   */
  accent: string;
};

/**
 * Each flavour is identified three ways — its name, its own ground and accent
 * sampled from that pack, and the ingredient it is built on. Nothing here is
 * decorative: a page that shows one flavour takes its colour from this row,
 * and the ingredient drives the drawn mark that goes with it.
 *
 * The site carries no Arabic. The supplied artwork's Arabic was unreliable
 * (peanut's pack shows coconut's line), and rather than publish a
 * transcription nobody had signed off, the flavours are told apart visually
 * instead. The packaging error is still worth raising with the client — see
 * README.
 */
export const FLAVOURS: Flavour[] = [
  {
    id: 1,
    slug: "butter",
    name: "Butter",
    ingredient: "Sweet cream butter",
    note: "Rich, short and properly buttery.",
    ground: "#F4F1E2",
    line: "#8A6A3A",
    accent: "#4F5A2B", // 6.55:1 on ground
  },
  {
    id: 2,
    slug: "coconut",
    name: "Coconut",
    ingredient: "Toasted coconut",
    note: "Toasted coconut, right through the crumb.",
    ground: "#F3EADD",
    line: "#6B4A32",
    accent: "#7A4A22", // 6.23:1 on ground
  },
  {
    id: 3,
    slug: "peanut",
    name: "Peanut",
    ingredient: "Roasted peanut",
    note: "Roasted peanut, deep and savoury-sweet.",
    ground: "#F8EFDB",
    line: "#8A5A2B",
    accent: "#8A4A16", // 5.98:1 on ground
  },
  {
    id: 4,
    slug: "cardamom",
    name: "Cardamom",
    ingredient: "Green cardamom",
    note: "Green cardamom. Built for the tea tray.",
    ground: "#EBF1E8",
    line: "#4A6B2E",
    accent: "#0E5C3F", // 6.97:1 on ground
  },
];

export const flavourBySlug = (slug: string) =>
  FLAVOURS.find((f) => f.slug === slug);

/**
 * Muted small text sits at 65% ink and no lighter. Below that it drops under
 * 4.5:1 on the lightest flavour ground — a failure that is invisible in review
 * because the composite still looks like legible grey.
 */
export const MUTED = "text-ink/65";

/* ------------------------------------------------------------------ *
 * Pack facts, printed on the box
 * ------------------------------------------------------------------ */

export const PACK = {
  pieces: 16,
  origin: "Made in UAE",
  seal: "Premium Quality",
} as const;

export const MARKETS = [
  { name: "Abu Dhabi", x: 15, y: 65 },
  { name: "Dubai", x: 25, y: 50 },
  { name: "Sharjah", x: 30, y: 46 },
  { name: "Ajman", x: 36, y: 40 },
  { name: "Umm Al Quwain", x: 42, y: 35 },
  { name: "Ras Al Khaimah", x: 46, y: 22 },
  { name: "Fujairah", x: 76, y: 43 },
] as const;
