/**
 * PANDUR — Signature Cookie Journey Physics & Flavour Worlds
 *
 * Deterministic, scroll-progress driven timeline mapping progress (0 -> 1)
 * into a continuous physical adventure across 5 flavour worlds:
 * Coconut -> Peanut -> Cardamom -> Butter -> Tea Moment.
 */

export type FlavourWorldId = "coconut" | "peanut" | "cardamom" | "butter" | "tea";

export interface FlavourWorld {
  id: FlavourWorldId;
  name: string;
  subtitle: string;
  tagline: string;
  background: string;
  accent: string;
  start: number;
  end: number;
}

export const FLAVOUR_WORLDS: FlavourWorld[] = [
  {
    id: "coconut",
    name: "COCONUT",
    subtitle: "Real Coconut Flakes & Cream",
    tagline: "Crisp outer shell with a fragrant toasted coconut heart.",
    background: "#F4E7D3",
    accent: "#5E3720",
    start: 0.0,
    end: 0.2,
  },
  {
    id: "peanut",
    name: "PEANUT",
    subtitle: "Roasted Kernels & Rich Butter",
    tagline: "Crunchy roasted peanuts blended into golden biscuit dough.",
    background: "#F7E9C9",
    accent: "#7A4718",
    start: 0.2,
    end: 0.4,
  },
  {
    id: "cardamom",
    name: "CARDAMOM",
    subtitle: "Crushed Green Cardamom Pods",
    tagline: "Aromatic whole spice warmth inspired by Arabian heritage.",
    background: "#E9F0E2",
    accent: "#4A6B2E",
    start: 0.4,
    end: 0.6,
  },
  {
    id: "butter",
    name: "BUTTER",
    subtitle: "Pure Dairy Butter & Golden Bake",
    tagline: "Melt-in-the-mouth richness with 45 years of bakery craft.",
    background: "#F5F0D6",
    accent: "#C5221F",
    start: 0.6,
    end: 0.8,
  },
  {
    id: "tea",
    name: "THE PERFECT PAIR",
    subtitle: "Karak & Fresh Chai Companion",
    tagline: "Baked to be dipped, savoured, and shared across the Emirates.",
    background: "#FBF5EC",
    accent: "#221F1F",
    start: 0.8,
    end: 1.0,
  },
];

export interface JourneyWaypoint {
  progress: number;
  x: number; // Percentage of stage width (0 - 100)
  y: number; // Percentage of stage height (0 - 100)
  rotation: number; // Degrees of rotation (cumulative roll)
  scaleX: number; // Squash on impact
  scaleY: number; // Stretch on impact
  tilt: number; // Aerodynamic tilt
  shadowSpread: number; // 0 (airborne/soft) to 1 (ground contact/crisp)
}

/**
 * Exact plate center coordinates on stage for pixel-perfect cookie landing
 */
export const DESKTOP_PLATE_CENTER = { x: 36, y: 54 };
export const MOBILE_PLATE_CENTER = { x: 50, y: 44 };

/**
 * Desktop authored physics trajectory:
 * Settles EXACTLY in the center of the tea plate at progress 1.00 (x: 36.0, y: 54.0)!
 */
export const DESKTOP_WAYPOINTS: JourneyWaypoint[] = [
  // 0.00: Suspended above center (Coconut World Entry)
  { progress: 0.00, x: 22, y: 16, rotation: 0, scaleX: 1.0, scaleY: 1.0, tilt: -8, shadowSpread: 0.2 },
  // 0.06: Freefall acceleration downward
  { progress: 0.06, x: 25, y: 44, rotation: 45, scaleX: 0.97, scaleY: 1.03, tilt: 12, shadowSpread: 0.45 },
  // 0.10: Impact on Coconut ramp (Squash + Crumb burst 1)
  { progress: 0.10, x: 28, y: 64, rotation: 90, scaleX: 1.04, scaleY: 0.96, tilt: -4, shadowSpread: 0.95 },
  // 0.15: Rolling right along ramp, touches coconut piece
  { progress: 0.15, x: 42, y: 60, rotation: 220, scaleX: 1.0, scaleY: 1.0, tilt: 4, shadowSpread: 0.9 },
  // 0.20: Ramp end, airborne leap into Peanut World
  { progress: 0.20, x: 55, y: 48, rotation: 360, scaleX: 0.98, scaleY: 1.02, tilt: 15, shadowSpread: 0.3 },

  // 0.26: Arc descent across Peanut World
  { progress: 0.26, x: 68, y: 58, rotation: 480, scaleX: 0.98, scaleY: 1.02, tilt: 10, shadowSpread: 0.6 },
  // 0.31: Bounce off Peanut hill (Squash + Crumb burst 2)
  { progress: 0.31, x: 74, y: 68, rotation: 580, scaleX: 1.04, scaleY: 0.96, tilt: -6, shadowSpread: 0.95 },
  // 0.36: Roll and pop over peanut hurdle
  { progress: 0.36, x: 62, y: 54, rotation: 720, scaleX: 1.0, scaleY: 1.0, tilt: -12, shadowSpread: 0.4 },
  // 0.40: Downward curve into Cardamom green mist
  { progress: 0.40, x: 48, y: 40, rotation: 860, scaleX: 0.97, scaleY: 1.03, tilt: -16, shadowSpread: 0.25 },

  // 0.47: S-curve drift through cardamom pods and loose seeds
  { progress: 0.47, x: 34, y: 52, rotation: 1020, scaleX: 1.0, scaleY: 1.0, tilt: 8, shadowSpread: 0.4 },
  // 0.53: Gliding roll through spice field
  { progress: 0.53, x: 40, y: 68, rotation: 1180, scaleX: 1.03, scaleY: 0.97, tilt: 5, shadowSpread: 0.9 },
  // 0.60: Launch into Butter World
  { progress: 0.60, x: 54, y: 50, rotation: 1340, scaleX: 0.98, scaleY: 1.02, tilt: 18, shadowSpread: 0.3 },

  // 0.66: Landing on silky Butter ramp (Squash + Crumb burst 3)
  { progress: 0.66, x: 66, y: 62, rotation: 1500, scaleX: 1.04, scaleY: 0.96, tilt: -5, shadowSpread: 0.95 },
  // 0.72: Smooth glide through butter curls
  { progress: 0.72, x: 78, y: 58, rotation: 1680, scaleX: 1.0, scaleY: 1.0, tilt: 3, shadowSpread: 0.85 },
  // 0.79: Long descending roll toward Tea Setting
  { progress: 0.79, x: 65, y: 46, rotation: 1840, scaleX: 0.99, scaleY: 1.01, tilt: -10, shadowSpread: 0.35 },

  // 0.86: Approach tea plate
  { progress: 0.86, x: 48, y: 46, rotation: 1980, scaleX: 0.98, scaleY: 1.02, tilt: 6, shadowSpread: 0.5 },
  // 0.92: Touchdown on fine ceramic plate (Soft bounce)
  { progress: 0.92, x: 38, y: 54, rotation: 2100, scaleX: 1.03, scaleY: 0.97, tilt: -2, shadowSpread: 0.95 },
  // 0.96: Tiny settle rock
  { progress: 0.96, x: 36.3, y: 54, rotation: 2145, scaleX: 1.01, scaleY: 0.99, tilt: 1, shadowSpread: 0.98 },
  // 1.00: Perfectly centered in the middle of the empty plate!
  { progress: 1.00, x: 36.0, y: 54.0, rotation: 2160, scaleX: 1.0, scaleY: 1.0, tilt: 0, shadowSpread: 1.0 },
];

/**
 * Mobile-specific high-dynamic-range trajectory with sweeping curves across width:
 * Settles dead-center on the mobile plate at (x: 50.0, y: 44.0)!
 */
export const MOBILE_WAYPOINTS: JourneyWaypoint[] = [
  // 0.00: Top left start
  { progress: 0.00, x: 26, y: 14, rotation: 0, scaleX: 1.0, scaleY: 1.0, tilt: -10, shadowSpread: 0.2 },
  // 0.08: High sweeping curve across to top right
  { progress: 0.08, x: 74, y: 22, rotation: 120, scaleX: 0.98, scaleY: 1.02, tilt: 14, shadowSpread: 0.4 },
  // 0.14: Impact on Coconut ramp (left side) with squash
  { progress: 0.14, x: 26, y: 36, rotation: 260, scaleX: 1.05, scaleY: 0.95, tilt: -6, shadowSpread: 0.95 },
  // 0.22: Leap across to Peanut right side
  { progress: 0.22, x: 76, y: 46, rotation: 420, scaleX: 0.98, scaleY: 1.02, tilt: 12, shadowSpread: 0.35 },
  // 0.30: Bounce on Peanut hill
  { progress: 0.30, x: 28, y: 54, rotation: 600, scaleX: 1.04, scaleY: 0.96, tilt: -8, shadowSpread: 0.95 },
  // 0.40: Sweep into Cardamom field (right side)
  { progress: 0.40, x: 72, y: 58, rotation: 800, scaleX: 0.98, scaleY: 1.02, tilt: 10, shadowSpread: 0.4 },
  // 0.52: Glide left through cardamom spice
  { progress: 0.52, x: 24, y: 64, rotation: 1020, scaleX: 1.03, scaleY: 0.97, tilt: -6, shadowSpread: 0.9 },
  // 0.64: Launch right onto Butter ramp
  { progress: 0.64, x: 76, y: 60, rotation: 1240, scaleX: 1.04, scaleY: 0.96, tilt: 12, shadowSpread: 0.95 },
  // 0.78: Long smooth swoop toward tea plate
  { progress: 0.78, x: 32, y: 50, rotation: 1460, scaleX: 0.99, scaleY: 1.01, tilt: -8, shadowSpread: 0.4 },
  // 0.88: Approach ceramic plate
  { progress: 0.88, x: 50, y: 36, rotation: 1620, scaleX: 0.98, scaleY: 1.02, tilt: 4, shadowSpread: 0.5 },
  // 0.94: Soft touchdown on plate
  { progress: 0.94, x: 50, y: 44, rotation: 1740, scaleX: 1.03, scaleY: 0.97, tilt: -1, shadowSpread: 0.95 },
  // 1.00: Perfectly dead-center on mobile plate
  { progress: 1.00, x: 50.0, y: 44.0, rotation: 1760, scaleX: 1.0, scaleY: 1.0, tilt: 0, shadowSpread: 1.0 },
];

/**
 * Crumb emission events at physical impacts
 */
export interface CrumbBurst {
  trigger: number; // progress value where impact happens
  x: number; // %
  y: number; // %
  count: number;
}

export const CRUMB_BURSTS: CrumbBurst[] = [
  { trigger: 0.10, x: 28, y: 64, count: 5 },
  { trigger: 0.31, x: 74, y: 68, count: 4 },
  { trigger: 0.66, x: 66, y: 62, count: 5 },
  { trigger: 0.92, x: 38, y: 54, count: 3 },
];

/**
 * Dedicated SVG assets for each flavour:
 * /ingredient/coconut.svg, /ingredient/peanut.svg, /ingredient/cardamom.svg, /ingredient/butter.svg
 */
export type FlavourQuadrant = "coconut" | "peanut" | "cardamom" | "butter";

export const FLAVOUR_SVG_CONFIGS: Record<
  FlavourQuadrant,
  { name: string; svgSrc: string; worldStart: number; worldEnd: number }
> = {
  coconut: { name: "Coconut", svgSrc: "/ingredient/coconut.svg", worldStart: 0.0, worldEnd: 0.2 },
  peanut: { name: "Peanut", svgSrc: "/ingredient/peanut.svg", worldStart: 0.2, worldEnd: 0.4 },
  cardamom: { name: "Cardamom", svgSrc: "/ingredient/cardamom.svg", worldStart: 0.4, worldEnd: 0.6 },
  butter: { name: "Butter", svgSrc: "/ingredient/butter.svg", worldStart: 0.6, worldEnd: 0.8 },
};

/**
 * Compact flavour layer instances for desktop and mobile:
 */
export interface FlavourLayerInstance {
  id: string;
  flavour: FlavourQuadrant;
  // Desktop placement (% of stage)
  x: number;
  y: number;
  widthVw: number; // % of viewport width
  maxWidthPx: number;
  rotateDeg: number;
  opacity: number;
  // Reactive movement when cookie rolls past
  triggerProgress: number;
  driftX: number; // px
  driftY: number; // px
  driftRotate: number; // deg
  // Mobile specific placement
  mobile?: {
    x: number;
    y: number;
    widthVw: number;
    rotateDeg: number;
    opacity: number;
  };
}

export const FLAVOUR_LAYER_INSTANCES: FlavourLayerInstance[] = [
  /* 1. COCONUT WORLD (0.0 - 0.2) */
  {
    id: "coconut-main",
    flavour: "coconut",
    x: 28,
    y: 58,
    widthVw: 20,
    maxWidthPx: 280,
    rotateDeg: 4,
    opacity: 0.95,
    triggerProgress: 0.12,
    driftX: 18,
    driftY: -12,
    driftRotate: 10,
    mobile: { x: 50, y: 36, widthVw: 42, rotateDeg: 4, opacity: 0.95 },
  },

  /* 2. PEANUT WORLD (0.2 - 0.4) */
  {
    id: "peanut-main",
    flavour: "peanut",
    x: 72,
    y: 58,
    widthVw: 20,
    maxWidthPx: 280,
    rotateDeg: -4,
    opacity: 0.95,
    triggerProgress: 0.30,
    driftX: -20,
    driftY: -14,
    driftRotate: -12,
    mobile: { x: 50, y: 52, widthVw: 42, rotateDeg: -4, opacity: 0.95 },
  },

  /* 3. CARDAMOM WORLD (0.4 - 0.6) */
  {
    id: "cardamom-main",
    flavour: "cardamom",
    x: 34,
    y: 52,
    widthVw: 20,
    maxWidthPx: 280,
    rotateDeg: 6,
    opacity: 0.95,
    triggerProgress: 0.48,
    driftX: 20,
    driftY: -12,
    driftRotate: 12,
    mobile: { x: 50, y: 56, widthVw: 42, rotateDeg: 6, opacity: 0.95 },
  },

  /* 4. BUTTER WORLD (0.6 - 0.8) */
  {
    id: "butter-main",
    flavour: "butter",
    x: 72,
    y: 58,
    widthVw: 20,
    maxWidthPx: 280,
    rotateDeg: -6,
    opacity: 0.95,
    triggerProgress: 0.68,
    driftX: 18,
    driftY: 12,
    driftRotate: 12,
    mobile: { x: 50, y: 58, widthVw: 42, rotateDeg: -6, opacity: 0.95 },
  },
];
