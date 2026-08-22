/**
 * PANDUR — UAE Vertical Market Journey Architecture & Geometry
 *
 * 8 signature markets mapped across a vertical S-curve journey:
 * Sharjah -> Ajman -> Ras Al Khaimah -> Masafi -> Dibba -> Khorfakkan -> Fujairah -> Kalba
 */

export type MarketSide = "left" | "right";

export interface JourneyMarket {
  id: string;
  name: string;
  order: number;
  orderStr: string;
  region: string;
  accent: string;
  bgTint: string;
  description: string;
  flavourTag: string;
  side: MarketSide;
  progress: number; // 0 to 1 scroll target
  desktop: { x: number; y: number };
  mobile: { x: number; y: number };
}

export const UAE_JOURNEY_MARKETS: JourneyMarket[] = [
  {
    id: "sharjah",
    name: "Sharjah",
    order: 1,
    orderStr: "01",
    region: "Cultural Capital · Arabian Gulf",
    accent: "#C5221F",
    bgTint: "#FBF4E8",
    description: "Premium retail shelves and premier bakery distribution across central Sharjah.",
    flavourTag: "Butter & Cardamom",
    side: "left",
    progress: 0.12,
    desktop: { x: 360, y: 520 },
    mobile: { x: 130, y: 520 },
  },
  {
    id: "ajman",
    name: "Ajman",
    order: 2,
    orderStr: "02",
    region: "Coastal Trade · Arabian Gulf",
    accent: "#8A5A2B",
    bgTint: "#FAF1E0",
    description: "Key supermarket partners and neighbourhood grocery shelves.",
    flavourTag: "Peanut & Coconut",
    side: "right",
    progress: 0.23,
    desktop: { x: 640, y: 880 },
    mobile: { x: 270, y: 880 },
  },
  {
    id: "ras-al-khaimah",
    name: "Ras Al Khaimah",
    order: 3,
    orderStr: "03",
    region: "Northern Emirates Gateway",
    accent: "#4A6B2E",
    bgTint: "#F5EFE4",
    description: "Hypermarket chains and select hospitality partners in the northern frontier.",
    flavourTag: "Cardamom & Butter",
    side: "left",
    progress: 0.34,
    desktop: { x: 350, y: 1240 },
    mobile: { x: 130, y: 1240 },
  },
  {
    id: "masafi",
    name: "Masafi",
    order: 4,
    orderStr: "04",
    region: "Hajar Mountains Crossroads",
    accent: "#7A4718",
    bgTint: "#F7EFE6",
    description: "Mountain route stores, oasis markets, and travel rest stops.",
    flavourTag: "Coconut & Butter",
    side: "right",
    progress: 0.45,
    desktop: { x: 650, y: 1600 },
    mobile: { x: 270, y: 1600 },
  },
  {
    id: "dibba",
    name: "Dibba",
    order: 5,
    orderStr: "05",
    region: "Gulf of Oman · North Coast",
    accent: "#5E3720",
    bgTint: "#EDF4F2",
    description: "Coastal food stores, seaside markets, and local grocers.",
    flavourTag: "Peanut & Cardamom",
    side: "left",
    progress: 0.56,
    desktop: { x: 340, y: 1960 },
    mobile: { x: 130, y: 1960 },
  },
  {
    id: "khorfakkan",
    name: "Khorfakkan",
    order: 6,
    orderStr: "06",
    region: "The Brand Home · East Coast",
    accent: "#C5221F",
    bgTint: "#EAF3F2",
    description: "Royal Quality Bakes bakery home and premier shelf presence across every quarter.",
    flavourTag: "All 4 Signature Flavours",
    side: "right",
    progress: 0.67,
    desktop: { x: 660, y: 2320 },
    mobile: { x: 270, y: 2320 },
  },
  {
    id: "fujairah",
    name: "Fujairah",
    order: 7,
    orderStr: "07",
    region: "East Coast Commercial Hub",
    accent: "#4A6B2E",
    bgTint: "#F4EFEA",
    description: "Major supermarket chains and established food service partners.",
    flavourTag: "Butter & Cardamom",
    side: "left",
    progress: 0.78,
    desktop: { x: 350, y: 2680 },
    mobile: { x: 130, y: 2680 },
  },
  {
    id: "kalba",
    name: "Kalba",
    order: 8,
    orderStr: "08",
    region: "Gulf of Oman · South Mangroves",
    accent: "#8A5A2B",
    bgTint: "#EDF3EA",
    description: "Southern East Coast grocery partners and community retail outlets.",
    flavourTag: "All 4 Signature Flavours",
    side: "right",
    progress: 0.89,
    desktop: { x: 640, y: 3040 },
    mobile: { x: 270, y: 3040 },
  },
];

/** Desktop S-Curve SVG Path (1000 x 3600 coordinate space) */
export const DESKTOP_JOURNEY_PATH =
  "M 500 240 " +
  // Curve down to Market 1 (Sharjah)
  "C 500 360, 360 380, 360 520 " +
  // Curve to Market 2 (Ajman)
  "C 360 680, 640 720, 640 880 " +
  // Curve to Market 3 (RAK)
  "C 640 1040, 350 1080, 350 1240 " +
  // Curve to Market 4 (Masafi)
  "C 350 1400, 650 1440, 650 1600 " +
  // Curve to Market 5 (Dibba)
  "C 650 1760, 340 1800, 340 1960 " +
  // Curve to Market 6 (Khorfakkan)
  "C 340 2120, 660 2160, 660 2320 " +
  // Curve to Market 7 (Fujairah)
  "C 660 2480, 350 2520, 350 2680 " +
  // Curve to Market 8 (Kalba)
  "C 350 2840, 640 2880, 640 3040 " +
  // Curve into finale center
  "C 640 3200, 500 3240, 500 3420";

/** Mobile S-Curve SVG Path (400 x 3600 coordinate space) */
export const MOBILE_JOURNEY_PATH =
  "M 200 240 " +
  // Curve down to Market 1 (Sharjah)
  "C 200 360, 130 380, 130 520 " +
  // Curve to Market 2 (Ajman)
  "C 130 680, 270 720, 270 880 " +
  // Curve to Market 3 (RAK)
  "C 270 1040, 130 1080, 130 1240 " +
  // Curve to Market 4 (Masafi)
  "C 130 1400, 270 1440, 270 1600 " +
  // Curve to Market 5 (Dibba)
  "C 270 1760, 130 1800, 130 1960 " +
  // Curve to Market 6 (Khorfakkan)
  "C 130 2120, 270 2160, 270 2320 " +
  // Curve to Market 7 (Fujairah)
  "C 270 2480, 130 2520, 130 2680 " +
  // Curve to Market 8 (Kalba)
  "C 130 2840, 270 2880, 270 3040 " +
  // Curve into finale center
  "C 270 3200, 200 3240, 200 3420";

/** Total virtual height of the coordinate stage */
export const STAGE_HEIGHT = 3600;
export const DESKTOP_STAGE_WIDTH = 1000;
export const MOBILE_STAGE_WIDTH = 400;
