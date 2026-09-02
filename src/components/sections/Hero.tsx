"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import ScrubVideo from "@/components/hero/ScrubVideo";
import HeroBeats, { type Beat } from "@/components/hero/HeroBeats";
import { ease } from "@/lib/motion";
import { HoverSweep } from "@/components/motion/Hover";

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
    poster: "/hero/hero-desktop-poster.webp",
  },
  mobile: {
    src: "/hero/hero-mobile.mp4",
    poster: "/hero/hero-mobile-poster.webp",
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
  { text: "It starts with\none cookie.", in: 0, out: 0.34 },
  { text: "Butter, coconut, peanut, green cardamom.", in: 0.33, out: 0.67 },
  { text: "It always ends up beside the tea.", in: 0.66, out: 1 },
].map((b) => ({
  ...b,
  // the same note under every line: it is the one fact a trade visitor needs
  // held in front of them, and rotating it made it read as decoration
  note: `Signature cookies crafted with care.`,
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
  const scrollCueOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

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
            /*
             * The still, art-directed, and deliberately NOT through the image
             * optimiser.
             *
             * This branch is what the server renders — `mounted` is false
             * until hydration — so it is the hero's first paint for everyone,
             * not just the reduced-motion visitor who keeps it. It used to be
             * one `next/image` on `film.poster`, and because `useIsMobile()`
             * reads false on the server that always resolved to the DESKTOP
             * still. A phone therefore preloaded a landscape frame at up to
             * 3840w, painted it cropped into a portrait viewport, and then
             * threw it away when hydration swapped in the video — whose own
             * `poster` is the portrait file. Wasted bytes, a visible change of
             * picture, and the "preloaded but not used" warning.
             *
             * `<source media>` picks in the preload scanner, before any JS, so
             * the correct still is the one that is fetched and the one that is
             * painted. The URLs are the raw files, which is what the `<video
             * poster>` attribute also points at — so the still the browser
             * already holds is reused rather than re-fetched through a second,
             * optimised URL. Both are under 12KB; there is nothing for the
             * optimiser to win here.
             */
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet={FILM.mobile.poster}
              />
              <img
                src={FILM.desktop.poster}
                alt=""
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </picture>
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
          className="relative z-20 mx-auto w-full max-w-7xl px-6 pt-[15vh] text-center md:pt-[13vh]"
          style={scrub ? { y: copyY } : undefined}
        >
          <h1 className="sr-only">Cookies worth the shelf space.</h1>

          <HeroBeats
            progress={scrollYProgress}
            beats={BEATS}
            active={scrub}
            className="relative mx-auto h-[13rem] max-w-[20rem] sm:h-[11rem] sm:max-w-[30rem] lg:h-[10.5rem] lg:max-w-[46rem]"
            footerClassName="mt-4"
            footer={
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <a
                  href="/products"
                  className="inline-flex overflow-hidden rounded-full bg-white text-xs font-extrabold uppercase tracking-[0.16em] text-ink shadow-md"
                >
                  <HoverSweep fill="bg-ink" className="px-9 py-4">
                    <span className="flex items-center gap-3 transition-colors duration-500 group-hover/sweep:text-white">
                      View Products
                    </span>
                  </HoverSweep>
                </a>
                <a
                  href="#partner"
                  className="inline-flex overflow-hidden rounded-full bg-red-deep text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-md"
                >
                  <HoverSweep fill="bg-ink" className="px-9 py-4">
                    <span className="flex items-center gap-3">
                      Become a stockist
                    </span>
                  </HoverSweep>
                </a>
              </div>
            }
          />
        </motion.div>

        {/* --- scroll cue --- */}
        <motion.div
          className="relative z-content mt-auto flex justify-center pb-10"
          style={scrub ? { opacity: scrollCueOpacity } : undefined}
        >
          <motion.div
            className="animate-bob flex flex-col items-center gap-2"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.8, ease: ease.pop }}
          >
            <span className="block text-center text-xs font-bold uppercase tracking-[0.2em] text-ink/90">
              Scroll to unbox the experience
            </span>
            <svg
              className="h-5 w-5 text-ink/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
