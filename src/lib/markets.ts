/**
 * PANDUR — Markets Data & UAE Map Geography
 *
 * Eight signature markets across the Northern Emirates and East Coast.
 * Coordinates are mapped to the 760x580 stylized UAE SVG viewport.
 */

export type MarketId =
  | "abu-dhabi"
  | "dubai"
  | "sharjah"
  | "ajman"
  | "umm-al-quwain"
  | "ras-al-khaimah"
  | "fujairah";

export type Market = {
  id: MarketId;
  name: string;
  order: number;
  orderStr: string;
  /** SVG X coordinate in 760x580 space */
  x: number;
  /** SVG Y coordinate in 760x580 space */
  y: number;
  region: string;
  accent: string;
  description: string;
  flavourTag?: string;
};

export const MARKETS_DATA: Market[] = [
  {
    id: "abu-dhabi",
    name: "Abu Dhabi",
    order: 1,
    orderStr: "01",
    x: 180,
    y: 500,
    region: "Capital",
    accent: "#C5221F",
    description: "Premium retail shelves and premier bakery distribution across the capital.",
    flavourTag: "Butter & Cardamom",
  },
  {
    id: "dubai",
    name: "Dubai",
    order: 2,
    orderStr: "02",
    x: 230,
    y: 450,
    region: "Global Hub",
    accent: "#8A5A2B",
    description: "Key supermarket partners and neighbourhood grocery shelves in Dubai.",
    flavourTag: "Peanut & Coconut",
  },
  {
    id: "sharjah",
    name: "Sharjah",
    order: 3,
    orderStr: "03",
    x: 250,
    y: 395,
    region: "Cultural Capital",
    accent: "#4A6B2E",
    description: "Retailers & bakery shelves across central Sharjah.",
    flavourTag: "Cardamom & Butter",
  },
  {
    id: "ajman",
    name: "Ajman",
    order: 4,
    orderStr: "04",
    x: 288,
    y: 355,
    region: "Arabian Gulf Coast",
    accent: "#7A4718",
    description: "Key supermarket & grocery distribution.",
    flavourTag: "Coconut & Butter",
  },
  {
    id: "umm-al-quwain",
    name: "Umm Al Quwain",
    order: 5,
    orderStr: "05",
    x: 310,
    y: 300,
    region: "Northern Coast",
    accent: "#5E3720",
    description: "Coastal food stores and cafés.",
    flavourTag: "Peanut & Cardamom",
  },
  {
    id: "ras-al-khaimah",
    name: "Ras Al Khaimah",
    order: 6,
    orderStr: "06",
    x: 375,
    y: 195,
    region: "Northern Emirates",
    accent: "#C5221F",
    description: "Hypermarkets and hospitality partners.",
    flavourTag: "All 4 Signature Flavours",
  },
  {
    id: "fujairah",
    name: "Fujairah",
    order: 7,
    orderStr: "07",
    x: 546,
    y: 380,
    region: "East Coast Hub",
    accent: "#4A6B2E",
    description: "Supermarket chains & food service partners.",
    flavourTag: "Butter & Cardamom",
  },
];

/** Stylized UAE landmass silhouette (Northern Emirates + East Coast focus) */
export const UAE_LANDMASS_PATH =
  "M 130 520 " +
  "C 160 480, 200 440, 230 415 " + // Dubai / Sharjah border coast
  "C 255 390, 275 370, 290 350 " + // Sharjah to Ajman
  "C 310 325, 335 295, 360 250 " + // UAQ to RAK coast
  "C 380 210, 395 160, 420 100 " + // North to Musandam
  "C 435 60, 455 45, 470 55 " + // Northern peninsula tip
  "C 485 75, 495 120, 510 160 " + // East coast south past Dibba
  "C 525 210, 538 260, 545 300 " + // Khorfakkan coast
  "C 552 345, 554 380, 550 420 " + // Fujairah coast
  "C 546 450, 540 485, 530 520 " + // Kalba coast down
  "C 515 545, 480 540, 430 535 " + // Inland South-East border
  "C 360 530, 260 540, 180 540 " + // Southern sweep back west
  "Z";

/** Hajar Mountain ridge contour line through the interior */
export const HAJAR_MOUNTAIN_PATH =
  "M 440 85 " +
  "C 455 140, 470 195, 475 240 " +
  "C 480 290, 465 325, 470 370 " +
  "C 475 420, 490 460, 500 515";

/** Secondary mountain ridge */
export const HAJAR_MOUNTAIN_SUB_PATH =
  "M 425 150 " +
  "C 440 210, 445 260, 435 310 " +
  "C 425 360, 440 405, 460 460";

/** The animated brand route connecting the 7 markets in order */
export const MARKET_ROUTE_PATH =
  "M 180 500 " + // Abu Dhabi
  "C 200 480, 215 465, 230 450 " + // to Dubai
  "C 240 425, 245 410, 250 395 " + // to Sharjah
  "C 265 380, 278 368, 288 355 " + // to Ajman
  "C 300 325, 305 310, 310 300 " + // to UAQ
  "C 330 260, 350 230, 375 195 " + // to RAK
  "C 420 250, 480 320, 546 380"; // to Fujairah

/**
 * Scroll progress breakpoints (0 to 1) for each market's activation.
 */
export const MARKET_SCROLL_STOPS = [
  { in: 0.12, active: 0.22 }, // 0: Abu Dhabi
  { in: 0.24, active: 0.34 }, // 1: Dubai
  { in: 0.36, active: 0.46 }, // 2: Sharjah
  { in: 0.48, active: 0.58 }, // 3: Ajman
  { in: 0.60, active: 0.70 }, // 4: UAQ
  { in: 0.72, active: 0.82 }, // 5: RAK
  { in: 0.84, active: 0.94 }, // 6: Fujairah
];

