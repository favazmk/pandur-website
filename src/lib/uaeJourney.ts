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
    id: "abu-dhabi",
    name: "Abu Dhabi",
    order: 1,
    orderStr: "01",
    region: "The Capital",
    accent: "#C5221F",
    bgTint: "#F2E2C4",
    description: "Premium retail shelves and premier bakery distribution across the capital.",
    flavourTag: "Butter & Cardamom",
    side: "left",
    progress: 0.12,
    desktop: { x: 360, y: 520 },
    mobile: { x: 130, y: 520 },
  },
  {
    id: "dubai",
    name: "Dubai",
    order: 2,
    orderStr: "02",
    region: "Global Hub",
    accent: "#8A5A2B",
    bgTint: "#EAD5B6",
    description: "Key supermarket partners and neighbourhood grocery shelves in Dubai.",
    flavourTag: "Peanut & Coconut",
    side: "right",
    progress: 0.24,
    desktop: { x: 640, y: 880 },
    mobile: { x: 270, y: 880 },
  },
  {
    id: "sharjah",
    name: "Sharjah",
    order: 3,
    orderStr: "03",
    region: "Cultural Capital",
    accent: "#4A6B2E",
    bgTint: "#D8E3C9",
    description: "Retailers & bakery shelves across central Sharjah.",
    flavourTag: "Cardamom & Butter",
    side: "left",
    progress: 0.36,
    desktop: { x: 350, y: 1240 },
    mobile: { x: 130, y: 1240 },
  },
  {
    id: "ajman",
    name: "Ajman",
    order: 4,
    orderStr: "04",
    region: "Arabian Gulf Coast",
    accent: "#7A4718",
    bgTint: "#EFD5CD",
    description: "Key supermarket & grocery distribution.",
    flavourTag: "Coconut & Butter",
    side: "right",
    progress: 0.48,
    desktop: { x: 650, y: 1600 },
    mobile: { x: 270, y: 1600 },
  },
  {
    id: "umm-al-quwain",
    name: "Umm Al Quwain",
    order: 5,
    orderStr: "05",
    region: "Northern Coast",
    accent: "#5E3720",
    bgTint: "#CDE3DF",
    description: "Coastal food stores and cafés.",
    flavourTag: "Peanut & Cardamom",
    side: "left",
    progress: 0.60,
    desktop: { x: 340, y: 1960 },
    mobile: { x: 130, y: 1960 },
  },
  {
    id: "ras-al-khaimah",
    name: "Ras Al Khaimah",
    order: 6,
    orderStr: "06",
    region: "Northern Emirates Gateway",
    accent: "#C5221F",
    bgTint: "#C7DFDE",
    description: "Hypermarkets and hospitality partners.",
    flavourTag: "All 4 Signature Flavours",
    side: "right",
    progress: 0.72,
    desktop: { x: 660, y: 2320 },
    mobile: { x: 270, y: 2320 },
  },
  {
    id: "fujairah",
    name: "Fujairah",
    order: 7,
    orderStr: "07",
    region: "East Coast Hub",
    accent: "#4A6B2E",
    bgTint: "#E3D4C2",
    description: "Supermarket chains & food service partners.",
    flavourTag: "Butter & Cardamom",
    side: "left",
    progress: 0.84,
    desktop: { x: 350, y: 2680 },
    mobile: { x: 130, y: 2680 },
  }
];

/** Desktop S-Curve SVG Path (1000 x 3240 coordinate space) */
export const DESKTOP_JOURNEY_PATH =
  "M 500 240 " +
  // Curve down to Market 1
  "C 500 360, 360 380, 360 520 " +
  // Curve to Market 2
  "C 360 680, 640 720, 640 880 " +
  // Curve to Market 3
  "C 640 1040, 350 1080, 350 1240 " +
  // Curve to Market 4
  "C 350 1400, 650 1440, 650 1600 " +
  // Curve to Market 5
  "C 650 1760, 340 1800, 340 1960 " +
  // Curve to Market 6
  "C 340 2120, 660 2160, 660 2320 " +
  // Curve to Market 7
  "C 660 2480, 350 2520, 350 2680 " +
  // Curve into finale center
  "C 350 2840, 500 2880, 500 3060";

// Precise path fractions for exact cookie sync
export const JOURNEY_PROGRESS_STOPS = [0.06, 0.12, 0.24, 0.36, 0.48, 0.60, 0.72, 0.84, 0.94];
export const DESKTOP_PATH_FRACTIONS = [0, 0.0875, 0.2167, 0.3477, 0.4805, 0.6152, 0.7521, 0.8868, 1];
export const MOBILE_PATH_FRACTIONS = [0, 0.0831, 0.2161, 0.3494, 0.4825, 0.6155, 0.7488, 0.8819, 1];

/** Mobile S-Curve SVG Path (400 x 3240 coordinate space) */
export const MOBILE_JOURNEY_PATH =
  "M 200 240 " +
  // Curve down to Market 1
  "C 200 360, 130 380, 130 520 " +
  // Curve to Market 2
  "C 130 680, 270 720, 270 880 " +
  // Curve to Market 3
  "C 270 1040, 130 1080, 130 1240 " +
  // Curve to Market 4
  "C 130 1400, 270 1440, 270 1600 " +
  // Curve to Market 5
  "C 270 1760, 130 1800, 130 1960 " +
  // Curve to Market 6
  "C 130 2120, 270 2160, 270 2320 " +
  // Curve to Market 7
  "C 270 2480, 130 2520, 130 2680 " +
  // Curve into finale center
  "C 130 2840, 200 2880, 200 3060";

/** Total virtual height of the coordinate stage */
export const STAGE_HEIGHT = 3240;
export const DESKTOP_STAGE_WIDTH = 1000;
export const MOBILE_STAGE_WIDTH = 400;

