"use client";

import {
  motion,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { ShowcaseScene } from "@/lib/showcase";

/* ------------------------------------------------------------------
   The ingredient name, set enormous and sitting BEHIND the pack.

   This is a graphic, not a heading. The pack crosses its middle
   letters and is meant to — the occlusion is what makes the two read
   as one composition with depth in it, rather than as type with a
   picture parked on top. Everything here is tuned so the word never
   wins that contest: it carries the flavour's own `ink` at roughly a
   seventh strength, and it is the only element on the stage that is
   allowed to be cut off by another.

   It is `aria-hidden`. The flavour is named properly in the copy
   layer and, for a screen reader, in the section's static list — a
   giant decorative word repeated there would just be the same
   information twice.

   The handover is blur-to-sharp plus scale plus a small lift. NOT
   letter-spacing, which the brief offered as an option: interpolating
   letter-spacing relayouts a full-width line of display type on every
   scroll frame, and the same "letters settling into place" read comes
   free from scale, which stays on the compositor. The small eyebrow
   over the pack does the letter-spacing move instead, where it costs
   nothing.
   ------------------------------------------------------------------ */

export default function FlavourWordmark({
  scene,
  presence,
  flow,
  animate,
}: {
  scene: ShowcaseScene;
  /** 0 → 1 → 0 across this scene's arrival, hold and departure */
  presence: MotionValue<number>;
  /** +1 waiting, 0 present, -1 gone — signed, so the word travels one way through */
  flow: MotionValue<number>;
  animate: boolean;
}) {
  /*
   * Steep, and travelling far, for the same reason the pack is: two giant
   * words crossfading through each other at matching ink is a double
   * exposure. By the midpoint of a handover this is down at about 15% of an
   * already-15% ink, which is to say gone — and the word is background
   * furniture, so being gone for a moment costs nothing.
   */
  const opacity = useTransform(presence, [0, 0.4, 0.7, 1], [0, 0.05, 0.45, 1]);
  const scale = useTransform(presence, [0, 1], [1.14, 1]);
  const y = useTransform(flow, [1, 0, -1], ["30%", "0%", "-26%"]);

  /*
   * Blur reaches zero a little BEFORE the word is fully present, so it is
   * already sharp while it finishes arriving. Sharpening all the way to
   * presence 1 leaves it faintly soft through the middle of the beat, which
   * on type reads as a rendering fault rather than as focus.
   *
   * Kept shallow for the same reason as the pack's: two blurred words plus two
   * blurred packs at the midpoint of a handover is a frame with nothing sharp
   * in it anywhere.
   */
  const blur = useTransform(presence, [0, 0.4, 0.78, 1], [9, 3, 0, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.div
      aria-hidden
      /*
       * Centred on desktop; on mobile it rides UP so its top edge clears the
       * pack. Dead centre on a 9:16 frame puts the word entirely behind the
       * pack — the occlusion that makes this composition work on a wide screen
       * becomes total erasure on a narrow one.
       *
       * `vh`, not `%`. A percentage padding resolves against the container's
       * WIDTH, which on a 390px phone is 97px — that put the word straight
       * through the flavour name instead of below it. The offset wanted here
       * is a fraction of the STAGE'S HEIGHT, and only a viewport unit says so.
       */
      className="absolute inset-0 flex items-start justify-center pt-[25vh] md:items-center md:pt-0"
      style={
        animate
          ? { opacity, scale, y, filter, willChange: "transform, opacity" }
          : { opacity }
      }
    >
      <span
        className="text-word block whitespace-nowrap font-display font-black"
        /* 0.18. Low enough that the pack always wins, high enough that the
           word survives a phone screen, where it is a third the size and the
           pack covers its middle third. */
        style={{ color: scene.ink, opacity: 0.18 }}
      >
        {scene.word}
      </span>
    </motion.div>
  );
}
