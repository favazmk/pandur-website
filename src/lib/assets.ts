/**
 * PANDUR — asset contract.
 *
 * Product photography has not been delivered. Every product slot renders a
 * procedural stand-in until it is. Flipping this single flag swaps in the
 * photographs; nothing else changes and no layout shifts, because each slot
 * reserves its aspect ratio from day one.
 *
 * Expected on delivery:
 *   /public/products/flavour-01.png … flavour-04.png
 *   /public/products/pack-01.png    … pack-04.png
 *   transparent PNG, >= 2000px long edge, cookie centred, soft contact shadow
 */
export const HAS_PRODUCT_IMAGES = false;

export const productImage = (kind: "flavour" | "pack", n: number) =>
  `/products/${kind}-${String(n).padStart(2, "0")}.png`;

/**
 * Flavour names are NOT in the client brief — these are placeholders.
 * Replace `name` only; the colour grade per panel is a design decision and can
 * stay as-is.
 */
export type Flavour = {
  id: number;
  name: string;
  note: string;
  /** page ground while this panel is active */
  ground: string;
  /** cookie dough albedo */
  dough: string;
  /** chip / inclusion colour */
  chip: string;
  /**
   * Used for small label text on `ground`, so each pair must clear WCAG AA
   * (4.5:1). The brand red is only 4.03:1 on cream and 3.65:1 on panel 04's
   * ground, so these are deepened accordingly.
   */
  accent: string;
};

export const FLAVOURS: Flavour[] = [
  {
    id: 1,
    name: "FLAVOUR_01",
    note: "The original. Where it started.",
    ground: "#FBF5EC",
    dough: "#E8C89A",
    chip: "#3A2318",
    accent: "#CE1419", // 5.18:1 on ground
  },
  {
    id: 2,
    name: "FLAVOUR_02",
    note: "Deeper, darker, cocoa-rich.",
    ground: "#F0E4D4",
    dough: "#C89A6B",
    chip: "#241009",
    accent: "#8C3A1E", // 6.12:1 on ground
  },
  {
    id: 3,
    name: "FLAVOUR_03",
    note: "Bright, buttery, golden.",
    ground: "#FCF1DD",
    dough: "#F0D6A4",
    chip: "#7A4A1E",
    accent: "#8A5209", // 5.70:1 on ground (amber #D98A1F was 2.47:1)
  },
  {
    id: 4,
    name: "FLAVOUR_04",
    note: "The bold one.",
    ground: "#F5E8E4",
    dough: "#DDB089",
    chip: "#4A1410",
    accent: "#C4161B", // 5.05:1 on ground
  },
];

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
