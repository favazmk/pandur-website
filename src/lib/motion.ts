/**
 * PANDUR — motion tokens.
 *
 * The cubic-beziers are measured from the benchmark site (oreo.com) rather than
 * invented: `pop` and `expo` are its `pop-up` and `slide-up-in` curves. `slam`
 * and `glide` extend the same family for impact moments and 3D camera moves.
 */

export const ease = {
  pop: [0.34, 1.56, 0.64, 1], // overshoot — cards, badges, chips
  expo: [0.23, 1, 0.32, 1], // headlines, section reveals
  slam: [0.85, 0, 0.15, 1], // impact moments
  glide: [0.16, 1, 0.3, 1], // 3D camera moves
} as const;

export const spring = {
  soft: { stiffness: 120, damping: 18, mass: 0.9 }, // cursor parallax
  snap: { stiffness: 320, damping: 24, mass: 0.6 }, // magnetic CTAs
} as const;

export const dur = {
  fast: 0.35,
  base: 0.6,
  slow: 1.0,
  scene: 1.6,
} as const;

/** Idle-tilt classes. Cycle these so neighbouring elements never re-sync. */
export const TILTS = [
  "animate-tilt-4",
  "animate-tilt-6",
  "animate-tilt-8",
] as const;

export const tiltAt = (i: number) => TILTS[i % TILTS.length];

/** Standard masked line reveal used by every headline on the site. */
export const revealLine = {
  hidden: { y: "110%" },
  show: (i = 0) => ({
    y: "0%",
    transition: { duration: dur.slow, ease: ease.expo, delay: i * 0.06 },
  }),
};

export const revealChar = {
  hidden: { y: "110%" },
  show: (i = 0) => ({
    y: "0%",
    transition: { duration: 0.85, ease: ease.expo, delay: i * 0.03 },
  }),
};

export const popIn = {
  hidden: { scale: 0.7, opacity: 0 },
  show: (i = 0) => ({
    scale: 1,
    opacity: 1,
    transition: { duration: dur.base, ease: ease.pop, delay: i * 0.08 },
  }),
};

export const fadeUp = {
  hidden: { y: 32, opacity: 0 },
  show: (i = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: dur.slow, ease: ease.expo, delay: i * 0.08 },
  }),
};
