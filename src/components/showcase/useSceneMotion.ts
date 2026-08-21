"use client";

import { useTransform, type MotionValue } from "motion/react";
import { sceneStops } from "@/lib/showcase";

/**
 * How much of a handover window the PACK spends fading, as a fraction of that
 * window. Everything else on the stage crossfades across the whole of it;
 * the pack does not, and this number is why.
 *
 * At 1.0 — a plain crossfade on `presence` — the two packs sit at matching
 * ink through the entire handover, and because they are the largest objects
 * on the stage and share a silhouette, that does not read as a transition. It
 * reads as one pack printed twice: at the midpoint you can comfortably read
 * "Coconut Cookies" and "Peanut Cookies" stacked on each other. Moving them
 * apart in space helped and did not fix it; the packs are simply too big for
 * a hundred pixels of travel to separate them.
 *
 * At 0.58 the ramps are pulled to opposite ends of the window and barely
 * meet: the outgoing pack is essentially gone before the incoming one starts,
 * they cross at about 14% ink each, and the overlap lasts a sixth of the
 * handover instead of all of it. It is a baton pass with a breath in it
 * rather than a dissolve — and the breath is filled by the ingredients, which
 * are mid-drift and still on screen.
 */
const PACK_RAMP = 0.58;

/**
 * The scroll progress controller for one scene.
 *
 * Three values, all derived from the section's single 0→1 progress, and every
 * layer of the scene reads from these rather than from scroll position
 * directly. That is what keeps the background, the word, the pack and seven
 * loose ingredients moving as ONE animation: there is only ever one curve, read
 * three ways.
 *
 *   presence   0 → 1 → 0    how present the scene is. Drives ink, scale, focus.
 *   flow      +1 → 0 → -1   SIGNED travel. The scene arrives from one side and
 *                           leaves by the other, so the pack and the word pass
 *                           through the frame instead of bouncing back out of
 *                           the way they came.
 *   spread     1 → 0 → 1    UNSIGNED travel. The ingredients open outward on
 *                           the way out and close back in on the way in — a
 *                           piece leaves by the same door it entered.
 *   ink        0 → 1 → 0    `presence` for the pack alone, with the ramps
 *                           pulled apart so the two packs hand over instead
 *                           of dissolving into each other. See `PACK_RAMP`.
 *
 * Nothing here holds React state and nothing subscribes: these are MotionValues
 * composed off the parent's, so a scroll frame updates transforms on the
 * compositor and never renders a component.
 */
export function useSceneMotion(
  progress: MotionValue<number>,
  index: number,
  total: number
): {
  presence: MotionValue<number>;
  flow: MotionValue<number>;
  spread: MotionValue<number>;
  ink: MotionValue<number>;
} {
  const { inA, inB, outA, outB } = sceneStops(index, total);

  const presence = useTransform(progress, [inA, inB, outA, outB], [0, 1, 1, 0]);
  const flow = useTransform(progress, [inA, inB, outA, outB], [1, 0, 0, -1]);
  const spread = useTransform(progress, [inA, inB, outA, outB], [1, 0, 0, 1]);

  /*
   * Same shape as `presence`, but the rise is pushed to the END of the
   * arrival window and the fall to the START of the departure window. The
   * first and last scenes clamp outside [0,1] exactly as their stops do, so
   * scene 0 is still at full ink on the section's first frame.
   */
  const ink = useTransform(
    progress,
    [
      inB - (inB - inA) * PACK_RAMP,
      inB,
      outA,
      outA + (outB - outA) * PACK_RAMP,
    ],
    [0, 1, 1, 0]
  );

  return { presence, flow, spread, ink };
}
