/**
 * PANDUR — Markets Data & UAE Map Geography
 *
 * Eight signature markets across the Northern Emirates and East Coast.
 * Coordinates are mapped to the 760x580 stylized UAE SVG viewport.
 */

export type MarketId =
  | "sharjah"
  | "ajman"
  | "ras-al-khaimah"
  | "masafi"
  | "dibba"
  | "khorfakkan"
  | "fujairah"
  | "kalba";

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
    id: "sharjah",
    name: "Sharjah",
    order: 1,
    orderStr: "01",
    x: 250,
    y: 395,
    region: "Arabian Gulf Coast",
    accent: "#C5221F",
    description: "Retailers & bakery shelves across central Sharjah",
    flavourTag: "Butter & Cardamom",
  },
  {
    id: "ajman",
    name: "Ajman",
    order: 2,
    orderStr: "02",
    x: 288,
    y: 355,
    region: "Arabian Gulf Coast",
    accent: "#8A5A2B",
    description: "Key supermarket & grocery distribution",
    flavourTag: "Peanut & Coconut",
  },
  {
    id: "ras-al-khaimah",
    name: "Ras Al Khaimah",
    order: 3,
    orderStr: "03",
    x: 375,
    y: 195,
    region: "Northern Emirates",
    accent: "#4A6B2E",
    description: "Hypermarkets and hospitality partners",
    flavourTag: "Cardamom & Butter",
  },
  {
    id: "masafi",
    name: "Masafi",
    order: 4,
    orderStr: "04",
    x: 435,
    y: 320,
    region: "Hajar Mountains Crossroads",
    accent: "#7A4718",
    description: "Mountain route stores & travel stops",
    flavourTag: "Coconut & Butter",
  },
  {
    id: "dibba",
    name: "Dibba",
    order: 5,
    orderStr: "05",
    x: 505,
    y: 165,
    region: "Gulf of Oman (North)",
    accent: "#5E3720",
    description: "Coastal food stores and cafés",
    flavourTag: "Peanut & Cardamom",
  },
  {
    id: "khorfakkan",
    name: "Khorfakkan",
    order: 6,
    orderStr: "06",
    x: 540,
    y: 295,
    region: "Brand Home · East Coast",
    accent: "#C5221F",
    description: "Royal Quality Bakes bakery home & premier shelf presence",
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
    description: "Supermarket chains & food service partners",
    flavourTag: "Butter & Cardamom",
  },
  {
    id: "kalba",
    name: "Kalba",
    order: 8,
    orderStr: "08",
    x: 536,
    y: 460,
    region: "Gulf of Oman (South)",
    accent: "#8A5A2B",
    description: "Southern east coast grocery & retail partners",
    flavourTag: "All 4 Signature Flavours",
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

/** The animated brand route connecting the 8 markets in order */
export const MARKET_ROUTE_PATH =
  "M 250 395 " + // Sharjah
  "C 265 380, 278 368, 288 355 " + // to Ajman
  "C 318 310, 345 250, 375 195 " + // to Ras Al Khaimah
  "C 400 235, 418 280, 435 320 " + // to Masafi (mountain pass)
  "C 460 265, 485 210, 505 165 " + // to Dibba
  "C 525 210, 535 255, 540 295 " + // to Khorfakkan
  "C 544 325, 546 355, 546 380 " + // to Fujairah
  "C 544 410, 540 435, 536 460"; // to Kalba

/**
 * Scroll progress breakpoints (0 to 1) for each market's activation.
 */
export const MARKET_SCROLL_STOPS = [
  { in: 0.12, active: 0.20 }, // 0: Sharjah
  { in: 0.22, active: 0.30 }, // 1: Ajman
  { in: 0.32, active: 0.40 }, // 2: Ras Al Khaimah
  { in: 0.42, active: 0.50 }, // 3: Masafi
  { in: 0.52, active: 0.60 }, // 4: Dibba
  { in: 0.62, active: 0.70 }, // 5: Khorfakkan
  { in: 0.72, active: 0.80 }, // 6: Fujairah
  { in: 0.82, active: 0.90 }, // 7: Kalba
];
