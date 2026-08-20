"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { CookieDoodle } from "@/components/brand/Marks";
import ScrubVideo from "@/components/hero/ScrubVideo";
import { ease } from "@/lib/motion";
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
 * Three lines against the film's three beats, each about what is on screen
 * while it is up — which is the only reason to sync copy to footage at all.
 *
 *   the cookie alone      p 0 - 0.19    the maker
 *   ingredients open out  p 0.19 - 0.60 the range
 *   it lands beside tea   p 0.70 - 1    the channel
 *
 * The last one is observational rather than a channel list. Naming the trade
 * outright read like a slide from a deck — a buyer already knows what they
 * are; what sells to them is the product moving, and a line about where it
 * ends up says that without saying it. Partner lists the channels properly.
 *
 * Those spans are read off the cut, not guessed: the ingredients arrive
 * around frame 44 of 228 and the plate is in shot by frame 160.
 *
 * The shelf-life claim is deliberately not one of them. Bite already carries
 * "Six months on shelf" as its whole reason for existing, and saying it twice
 * on one page spends it twice.
 *
 * `at` is where a line reaches full strength; they cross-fade between.
 */
const BEATS = [
  { at: 0.06, text: "Forty-five years of getting this one right." },
  { at: 0.46, text: "Butter, coconut, peanut and green cardamom." },
  { at: 0.86, text: "It always ends up beside the tea." },
];

/** How long a beat takes to hand over to the next. */
const FADE = 0.16;

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

  // Hooks cannot run inside a loop, so the three are written out.
  const b0 = useTransform(
    scrollYProgress,
    [BEATS[0].at, BEATS[0].at + FADE],
    [1, 0]
  );
  const b1 = useTransform(
    scrollYProgress,
    [BEATS[1].at - FADE, BEATS[1].at, BEATS[1].at + FADE],
    [0, 1, 0]
  );
  const b2 = useTransform(
    scrollYProgress,
    [BEATS[2].at - FADE, BEATS[2].at],
    [0, 1]
  );
  const beatOpacity = [b0, b1, b2];

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
           * Fixed-height box with the three lines stacked and cross-faded.
           * Swapping them in the flow would reflow the hero on every scroll
           * frame. Widths are in rem, not ch: `ch` resolves against the
           * CONTAINER's font size, which is the 16px body text, so a `ch`
           * width here came out at 202px and wrapped the display type eight
           * lines deep. Sized instead so the longest of the three lands on
           * two lines at each breakpoint.
           */}
          <div className="relative mx-auto h-[11rem] max-w-[20rem] sm:h-[9rem] sm:max-w-[30rem] lg:h-[9rem] lg:max-w-[46rem]">
            {BEATS.map((b, i) => (
              <motion.p
                key={b.at}
                className="text-hero-split absolute inset-x-0 font-display font-black text-balance text-ink"
                style={
                  scrub
                    ? { opacity: beatOpacity[i] }
                    : { opacity: i === 0 ? 1 : 0 }
                }
              >
                {b.text}
              </motion.p>
            ))}
          </div>
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
