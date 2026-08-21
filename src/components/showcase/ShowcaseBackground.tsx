"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { ShowcaseScene } from "@/lib/showcase";

/* ------------------------------------------------------------------
   The ground under the whole section, and the wash belonging to each
   flavour.

   Two layers, because they answer two different questions.

   BackgroundLayer is the section's own colour and it is CONTINUOUS —
   one `backgroundColor` interpolated across the four grounds by scroll
   position, so there is no point at which the page changes colour.
   Holding each ground flat across its scene's centre and interpolating
   only between centres is what makes the change read as gradual rather
   than as a constant slow drift.

   SceneWash is the two soft radial pools a flavour lays over that
   ground. They fade with the scene, so the colour arrives as light
   falling on the set rather than as a panel swapping in.

   Neither is a flat fill. The brief for this section was explicitly
   "subtle gradients, not loud flat backgrounds", and a single flat
   colour behind a cut-out pack is the thing that makes a product page
   look like a slideshow.
   ------------------------------------------------------------------ */

export default function BackgroundLayer({
  progress,
  scenes,
}: {
  progress: MotionValue<number>;
  scenes: ShowcaseScene[];
}) {
  const n = scenes.length;

  /*
   * Stops sit at each scene's CENTRE, with the first and last held out to the
   * ends of the track. Interpolating centre-to-centre means a flavour owns its
   * colour outright while it is the subject, and the whole change happens
   * across the handover where the eye is already busy.
   */
  const stops = [0, ...scenes.map((_, i) => (i + 0.5) / n), 1];
  const colours = [
    scenes[0].ground,
    ...scenes.map((s) => s.ground),
    scenes[n - 1].ground,
  ];

  /*
   * Not gated on reduced motion, and neither is the wash below. A colour
   * crossfade IS the reduced-motion treatment — what that setting asks us to
   * drop is travel, not the fact that the page changes colour.
   */
  const ground = useTransform(progress, stops, colours);

  return (
    <motion.div
      aria-hidden
      className="absolute inset-0"
      style={{ backgroundColor: ground }}
    >
      {/*
       * The house doodle field, held far below its usual strength. At 0.045
       * it is a paper texture; anywhere near the 0.10 the field is normally
       * run at it starts competing with the ingredients for attention, which
       * is the one thing this stage cannot afford.
       */}
      <div className="doodle-pattern absolute inset-0 opacity-[0.045]" />

      {/* vignette — pulls the eye to the pack without darkening the copy */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(34,31,31,0.09)_100%)]" />
    </motion.div>
  );
}

/** One flavour's light, laid over the shared ground and fading with it. */
export function SceneWash({
  scene,
  presence,
}: {
  scene: ShowcaseScene;
  presence: MotionValue<number>;
}) {
  const [inner, outer] = scene.wash;

  return (
    <motion.div
      aria-hidden
      className="absolute inset-0"
      style={{
        /*
         * Two pools rather than one: a warm one behind the pack that lifts it
         * off the ground, and a cool bloom top-left that keeps the frame from
         * reading as a single centred spotlight.
         *
         * The alphas are low BECAUSE THEY STACK. Through a handover two scenes
         * are painting their washes at once, each at about half opacity, so
         * whatever is set here effectively lands at three-quarters strength
         * twice over. At the `cc` the outer pool started on, that bleached the
         * ground to near-white for the whole crossover and the flavour colour
         * simply left the screen in the middle of changing.
         */
        backgroundImage: `radial-gradient(58% 52% at 50% 56%, ${inner}55 0%, transparent 72%), radial-gradient(46% 44% at 16% 12%, ${outer}55 0%, transparent 78%)`,
        opacity: presence,
      }}
    />
  );
}
