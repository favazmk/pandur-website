import { SplitLine } from "@/components/motion/Text";

/**
 * The shelf-life claim, on the one dark panel in the page.
 *
 * This used to pin for 320vh while a 3D cookie was bitten through on scroll.
 * With the 3D gone the pin had nothing to scrub, and holding a visitor for
 * three screen-heights to read two lines of type is worse than not holding
 * them at all — so it is a normal section again. `PanelOver` in the page
 * still rides it up over the section before it, which is what gave the
 * moment its weight in the first place.
 */
export default function Bite() {
  return (
    <section className="relative flex min-h-[70svh] flex-col items-center justify-center overflow-hidden bg-cocoa py-24 md:py-32">
      <div className="relative z-content max-w-3xl px-6 text-center">
        <SplitLine
          as="h2"
          text="Six months on shelf."
          className="text-title block font-display font-black text-cream"
        />
        {/* Tailwind's reset zeroes block margins, so without this the two
            lines sit flush and their glyphs touch. */}
        <SplitLine
          as="p"
          text="Tastes like it left the oven this morning."
          className="text-title mt-3 block font-display font-black text-dough md:mt-4"
          delay={0.12}
        />
      </div>
    </section>
  );
}
