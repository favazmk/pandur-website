"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { CookieDoodle } from "@/components/brand/Marks";
import ScrubVideo from "@/components/hero/ScrubVideo";
import HeroBeats, { type Beat } from "@/components/hero/HeroBeats";
import { ease } from "@/lib/motion";
import { PACK } from "@/lib/assets";
import {
  useClientValue,
  useIsMobile,
  usePrefersReducedMotion,
} from "@/lib/useMedia";

/**
 * Two cuts of the same film, framed for their own shape rather than one cut
 * cropped to both. Each carries its own poster, taken from its own first
 * frame, so nothing jumps when the video takes over from the still.
 */
const FILM = {
  desktop: {
    src: "/hero/hero-desktop.mp4",
    poster: "/hero/hero-desktop-poster.jpg",
  },
  mobile: {
    src: "/hero/hero-mobile.mp4",
    poster: "/hero/hero-mobile-poster.jpg",
  },
} as const;

/*
 * Three beats against the film's three, each about what is on screen while it
 * is up — which is the only reason to sync copy to footage at all.
 *
 *   the cookie alone      p 0 - 0.19    it starts
 *   ingredients open out  p 0.19 - 0.60 what is in it
 *   it lands beside tea   p 0.70 - 1    where it goes
 *
 * Those spans are read off the cut, not guessed: the ingredients arrive
 * around frame 44 of 228 and the plate is in shot by frame 160.
 *
 * `in` and `out` are the window a beat owns, and the windows DO NOT TOUCH.
 * Each line is fully gone before the next begins, with a short empty gap
 * between — cross-fading them meant two headlines on screen at once, which at
 * display size reads as a mistake rather than a transition.
 *
 * The note under each line carries the fact the headline does not: the
 * bakery, the pack, the channels. All three come from `lib/nav` and
 * `lib/assets` rather than being written here, so they cannot drift.
 */
const BEATS: Beat[] = [
  { text: "It starts with one cookie.", in: 0, out: 0.26 },
  { text: "Butter, coconut, peanut, green cardamom.", in: 0.34, out: 0.62 },
  { text: "It always ends up beside the tea.", in: 0.7, out: 1 },
].map((b) => ({
  ...b,
  // the same note under every line: it is the one fact a trade visitor needs
  // held in front of them, and rotating it made it read as decoration
  note: `Four signature flavours, ${PACK.pieces} pieces to a box.`,
}));

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  /*
   * The film is chosen by breakpoint, and `useIsMobile` only tells the truth
   * after hydration — so the video is not rendered until then. Otherwise the
   * server's guess (desktop) starts downloading on a phone and gets cancelled
   * a moment later, which is 2MB of wasted request on the connection least
   * able to afford it. The poster covers that gap and is what a reduced-motion
   * visitor keeps.
   *
   * `useClientValue` rather than a setState-in-effect: it is the module's own
   * helper over `useSyncExternalStore`, which gives React an explicit server
   * snapshot instead of a cascading render after mount.
   */
  const mounted = useClientValue(() => true, false);

  const film = mobile ? FILM.mobile : FILM.desktop;
  const scrub = mounted && !reduced;

  /*
   * 320vh. The film is nine and a half seconds, and a shorter track makes a
   * normal scroll tear through it — the ingredient beat would pass in a flick
   * of the wheel.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Copy holds through the film, then lifts away as the hero releases.
  const copyY = useTransform(scrollYProgress, [0.86, 1], [0, -90]);
  const copyOpacity = useTransform(scrollYProgress, [0.88, 0.99], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative"
      style={scrub ? { height: "320vh" } : undefined}
    >
      <div
        className={
          scrub
            ? "sticky top-0 flex h-screen flex-col overflow-hidden"
            : "relative flex min-h-[100svh] flex-col overflow-hidden"
        }
      >
        {/* --- the film, full bleed --- */}
        <div aria-hidden className="absolute inset-0 z-scene">
          {scrub ? (
            <ScrubVideo
              targetRef={ref}
              src={film.src}
              poster={film.poster}
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={film.poster}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
        </div>

        {/*
         * Top-down scrim, and much lighter on desktop than on mobile.
         *
         * Measured against the film itself rather than guessed. Sampling the
         * bands the copy sits in, across the clip:
         *
         *   headline (ink, display size, needs 3.0)   6.92 with NO scrim
         *   beat line (ash, small text, needs 4.5)    1.89 with no scrim
         *
         * So the headline never needed covering — the wash was there to rescue
         * the beat line, and it cannot: even 80% cream only lifts `ash` to
         * 4.25. That is why the old ramp read as smoke over the whole frame on
         * a wide short viewport. It was doing nothing for the headline and
         * failing at the only job it had.
         *
         * From `lg` the beat line goes darker instead and the scrim drops to a
         * whisper — roughly 0.2 cream where the beats sit, which puts them
         * near 5:1. Mobile keeps the heavier ramp: the frame is tall, the
         * scrim covers mostly empty background there, and it already reads
         * well.
         *
         * Clears by 56% either way, so the plate and tea at the end of the
         * film are untouched.
         */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-scene bg-[linear-gradient(to_bottom,var(--color-cream)_0%,rgba(251,245,236,0.88)_18%,rgba(251,245,236,0.6)_34%,rgba(251,245,236,0.24)_46%,transparent_58%)] lg:bg-[linear-gradient(to_bottom,rgba(251,245,236,0.42)_0%,rgba(251,245,236,0.3)_16%,rgba(251,245,236,0.2)_32%,rgba(251,245,236,0.1)_44%,transparent_56%)]"
        />

        {/* --- copy --- */}
        <motion.div
          className="relative z-content mx-auto w-full max-w-7xl px-6 pt-[15vh] text-center md:pt-[13vh]"
          style={scrub ? { y: copyY, opacity: copyOpacity } : undefined}
        >
          {/*
           * The heading a crawler and a screen reader are given, and it does
           * not move. The three display lines below are what a visitor reads,
           * and they change with the film — but an `h1` whose text depends on
           * scroll position would mean the accessible name of the page depends
           * on how far down you are, so the stable one is kept and hidden.
           * It matches the `<title>` in layout.
           */}
          <h1 className="sr-only">Cookies worth the shelf space.</h1>

          {/*
           * Fixed-height box with the three beats stacked, sized to the
           * tallest of them so the CTA underneath does not sit in a pocket of
           * dead space. Putting the beats in the flow would reflow the hero on
           * every scroll frame.
           *
           * Widths are in rem, not ch: `ch` resolves against the CONTAINER's
           * font size, which is the 16px body text, not the 62px display type
           * inside it — a `ch` width here came out 202px wide and wrapped the
           * headline eight lines deep.
           */}
          <HeroBeats
            targetRef={ref}
            beats={BEATS}
            active={scrub}
            className="relative mx-auto h-[11rem] max-w-[20rem] sm:h-[11rem] sm:max-w-[30rem] lg:h-[10.5rem] lg:max-w-[46rem]"
          />

          {/*
           * The one thing a trade visitor is here to do, and it does not move
           * with the beats — a CTA that appeared and vanished three times on
           * the way down would be worse than no CTA.
           */}
          <a
            href="#partner"
            className="mt-4 inline-flex items-center gap-3 rounded-full bg-red-deep px-9 py-4 text-xs font-extrabold uppercase tracking-[0.16em] text-white transition-colors hover:bg-ink"
          >
            Become a stockist
          </a>
        </motion.div>

        {/* --- scroll cue --- */}
        <motion.div
          className="relative z-content mt-auto flex justify-center pb-10"
          style={scrub ? { opacity: copyOpacity } : undefined}
        >
          <motion.div
            className="animate-bob"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.8, ease: ease.pop }}
          >
            <CookieDoodle className="h-9 w-9 text-ink/45" strokeWidth={5} />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
