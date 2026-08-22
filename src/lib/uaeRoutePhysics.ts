/**
 * PANDUR — Mathematical Cubic Bézier Spline Evaluator & Physics
 *
 * Provides continuous (x, y, angle) tracking along the vertical S-curve journey route.
 */

interface Point {
  x: number;
  y: number;
}

interface BezierSegment {
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
}

// 9 Desktop S-curve segments
const DESKTOP_SEGMENTS: BezierSegment[] = [
  { p0: { x: 500, y: 240 }, p1: { x: 500, y: 360 }, p2: { x: 360, y: 380 }, p3: { x: 360, y: 520 } },
  { p0: { x: 360, y: 520 }, p1: { x: 360, y: 680 }, p2: { x: 640, y: 720 }, p3: { x: 640, y: 880 } },
  { p0: { x: 640, y: 880 }, p1: { x: 640, y: 1040 }, p2: { x: 350, y: 1080 }, p3: { x: 350, y: 1240 } },
  { p0: { x: 350, y: 1240 }, p1: { x: 350, y: 1400 }, p2: { x: 650, y: 1440 }, p3: { x: 650, y: 1600 } },
  { p0: { x: 650, y: 1600 }, p1: { x: 650, y: 1760 }, p2: { x: 340, y: 1800 }, p3: { x: 340, y: 1960 } },
  { p0: { x: 340, y: 1960 }, p1: { x: 340, y: 2120 }, p2: { x: 660, y: 2160 }, p3: { x: 660, y: 2320 } },
  { p0: { x: 660, y: 2320 }, p1: { x: 660, y: 2480 }, p2: { x: 350, y: 2520 }, p3: { x: 350, y: 2680 } },
  { p0: { x: 350, y: 2680 }, p1: { x: 350, y: 2840 }, p2: { x: 640, y: 2880 }, p3: { x: 640, y: 3040 } },
  { p0: { x: 640, y: 3040 }, p1: { x: 640, y: 3200 }, p2: { x: 500, y: 3240 }, p3: { x: 500, y: 3420 } },
];

// 9 Mobile S-curve segments
const MOBILE_SEGMENTS: BezierSegment[] = [
  { p0: { x: 200, y: 240 }, p1: { x: 200, y: 360 }, p2: { x: 130, y: 380 }, p3: { x: 130, y: 520 } },
  { p0: { x: 130, y: 520 }, p1: { x: 130, y: 680 }, p2: { x: 270, y: 720 }, p3: { x: 270, y: 880 } },
  { p0: { x: 270, y: 880 }, p1: { x: 270, y: 1040 }, p2: { x: 130, y: 1080 }, p3: { x: 130, y: 1240 } },
  { p0: { x: 130, y: 1240 }, p1: { x: 130, y: 1400 }, p2: { x: 270, y: 1440 }, p3: { x: 270, y: 1600 } },
  { p0: { x: 270, y: 1600 }, p1: { x: 270, y: 1760 }, p2: { x: 130, y: 1800 }, p3: { x: 130, y: 1960 } },
  { p0: { x: 130, y: 1960 }, p1: { x: 130, y: 2120 }, p2: { x: 270, y: 2160 }, p3: { x: 270, y: 2320 } },
  { p0: { x: 270, y: 2320 }, p1: { x: 270, y: 2480 }, p2: { x: 130, y: 2520 }, p3: { x: 130, y: 2680 } },
  { p0: { x: 130, y: 2680 }, p1: { x: 130, y: 2840 }, p2: { x: 270, y: 2880 }, p3: { x: 270, y: 3040 } },
  { p0: { x: 270, y: 3040 }, p1: { x: 270, y: 3200 }, p2: { x: 200, y: 3240 }, p3: { x: 200, y: 3420 } },
];

function evalBezier(seg: BezierSegment, t: number): { x: number; y: number; angle: number } {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  // Position
  const x = uuu * seg.p0.x + 3 * uu * t * seg.p1.x + 3 * u * tt * seg.p2.x + ttt * seg.p3.x;
  const y = uuu * seg.p0.y + 3 * uu * t * seg.p1.y + 3 * u * tt * seg.p2.y + ttt * seg.p3.y;

  // Tangent Derivative
  const dx =
    3 * uu * (seg.p1.x - seg.p0.x) +
    6 * u * t * (seg.p2.x - seg.p1.x) +
    3 * tt * (seg.p3.x - seg.p2.x);
  const dy =
    3 * uu * (seg.p1.y - seg.p0.y) +
    6 * u * t * (seg.p2.y - seg.p1.y) +
    3 * tt * (seg.p3.y - seg.p2.y);

  // Angle in degrees (downward flow)
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return { x, y, angle };
}

/**
 * Precompute dense sample points along the route for instant GPU transform lookup
 */
export function generateRouteSamples(isMobile = false, count = 120): {
  progressList: number[];
  xList: number[];
  yList: number[];
  rotList: number[];
} {
  const segments = isMobile ? MOBILE_SEGMENTS : DESKTOP_SEGMENTS;
  const numSegments = segments.length;

  const progressList: number[] = [];
  const xList: number[] = [];
  const yList: number[] = [];
  const rotList: number[] = [];

  for (let i = 0; i <= count; i++) {
    const p = i / count;
    const scaledP = p * numSegments;
    const segIndex = Math.min(Math.floor(scaledP), numSegments - 1);
    const segT = Math.max(0, Math.min(1, scaledP - segIndex));

    const point = evalBezier(segments[segIndex], segT);

    progressList.push(p);
    xList.push(point.x);
    yList.push(point.y);
    rotList.push(point.angle - 90); // Orient cookie upright relative to path
  }

  return { progressList, xList, yList, rotList };
}
