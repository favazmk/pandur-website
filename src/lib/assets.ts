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
export const HAS_PACK_IMAGES = false;
export const HAS_RETAIL_IMAGES = false;

/**
 * Packaging photography — the box on a styled kitchen set.
 *
 *   public/products/pack-butter.jpg
 *   public/products/pack-coconut.jpg
 *   public/products/pack-peanut.jpg
 *   public/products/pack-cardamom.jpg
 *
 * Portrait 3:4, >= 1600px on the long edge, JPEG (these are photographs on
 * full-bleed sets — there is no transparency to preserve and PNG would triple
 * the weight). The box sits left of centre with the styled props to its right;
 * slots crop from the centre, so keep that composition.
 */
export const packImage = (slug: FlavourSlug) => `/products/pack-${slug}.jpg`;

/**
 * Retail photography — Pandur on the shelf, in a real store.
 *
 *   public/products/retail-shelf.jpg   the tall gondola end, boxes facing
 *   public/products/retail-aisle.jpg   the wider aisle view
 *
 * Landscape 4:3, >= 2000px on the long edge, JPEG.
 */
export const RETAIL_IMAGES = [
  {
    src: "/products/retail-shelf.jpg",
    alt: "Pandur cookie boxes facing out across a shelf display in a UAE store",
  },
  {
    src: "/products/retail-aisle.jpg",
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
   * Arabic name, transcribed from the packaging photography rather than
   * supplied as text — see the sign-off note below before this ships.
   */
  nameAr: string;
  /** one short line, never a paragraph */
  note: string;
  /** page ground while this panel is active */
  ground: string;
  /** cookie dough albedo in the 3D scene */
  dough: string;
  /** inclusion / line-art stroke colour */
  chip: string;
  /**
   * Small label text on `ground`. Every value below was computed, not
   * eyeballed, and clears WCAG AA (4.5:1) on its own ground — the measured
   * ratio is recorded beside it so a later edit cannot quietly undo it.
   */
  accent: string;
};

/**
 * The pack prints its Arabic name alongside the English one, so the site does
 * too. These readings come from photographs: `butter` and `cardamom` are
 * legible and confident, `coconut` follows the transliteration the pack itself
 * uses, and `peanut` is standard Arabic because that panel is not legible at
 * the resolution supplied. Have the client confirm all four against a physical
 * pack before launch — see README, outstanding item 1.
 */
export const FLAVOURS: Flavour[] = [
  {
    id: 1,
    slug: "butter",
    name: "Butter",
    nameAr: "بسكويت الزبدة",
    note: "Rich, short and properly buttery.",
    ground: "#F4F1E2",
    dough: "#E8C89A",
    chip: "#8A6A3A",
    accent: "#4F5A2B", // 6.55:1 on ground
  },
  {
    id: 2,
    slug: "coconut",
    name: "Coconut",
    nameAr: "كوكونات كوكيز",
    note: "Toasted coconut, right through the crumb.",
    ground: "#F3EADD",
    dough: "#E3BE8C",
    chip: "#6B4A32",
    accent: "#7A4A22", // 6.23:1 on ground
  },
  {
    id: 3,
    slug: "peanut",
    name: "Peanut",
    nameAr: "بسكويت الفول السوداني",
    note: "Roasted peanut, deep and savoury-sweet.",
    ground: "#F8EFDB",
    dough: "#E8C486",
    chip: "#8A5A2B",
    accent: "#8A4A16", // 5.98:1 on ground
  },
  {
    id: 4,
    slug: "cardamom",
    name: "Cardamom",
    nameAr: "بسكويت الهيل",
    note: "Green cardamom. Built for the tea tray.",
    ground: "#EBF1E8",
    dough: "#E5C79B",
    chip: "#4A6B2E",
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

/** Confirmed from the brief. "Aman" read as Ajman — flagged for client sign-off. */
export const MARKETS = [
  { name: "Sharjah", x: 30, y: 46 },
  { name: "Ajman", x: 36, y: 40 },
  { name: "Ras Al Khaimah", x: 46, y: 22 },
  { name: "Masafi", x: 57, y: 34 },
  { name: "Dibba", x: 68, y: 17 },
  { name: "Khorfakkan", x: 74, y: 33 },
  { name: "Fujairah", x: 76, y: 43 },
  { name: "Kalba", x: 74, y: 53 },
] as const;
