"use client";

import { SplitLine, Reveal } from "@/components/motion/Text";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { CHANNELS } from "@/lib/nav";
import { DoodleWall } from "@/components/brand/DoodleField";
import WhatsAppCTA from "@/components/cta/WhatsAppCTA";
import { WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export default function Partner({
  ctaLabel = "TALK TO PANDUR",
  ctaMessage = WHATSAPP_MESSAGES.homeFinal,
  ctaContext = "home_final",
}: {
  ctaLabel?: string;
  ctaMessage?: string;
  ctaContext?: string;
} = {}) {
  return (
    <section id="partner" className="relative overflow-hidden bg-cream py-24 md:py-36">
      {/*
       * The closing section is the one place the doodle carries a whole
       * ground rather than hinting at one, so it is inked hard enough to
       * read as this section's background rather than as a texture on the
       * page's.
       *
       * The strength is affordable because the pattern is a single covering
       * field with no repeat in it. Tiling it — once, or as two offset
       * layers — put either a gutter grid or a density plaid on the wall,
       * and both only showed up once the ink went past about 0.10.
       *
       * The form's fields are `bg-white/70`, so the pattern reads through
       * them at roughly 4% — present enough to feel like one surface, far
       * too faint to fight the inputs.
       *
       * The copy below is `relative` so it stays above the wall: the wall is
       * positioned and the content was not, and a positioned element paints
       * over static siblings whatever the source order says.
       */}
      <DoodleWall opacity={0.09} />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="text-center">
          <SplitLine
            as="h2"
            text="Let's grow together."
            className="text-display font-display font-black text-ink"
          />
          <Reveal delay={0.15}>
            <p className="text-lead mx-auto mt-6 max-w-2xl text-ash">
              {CHANNELS.join(" · ")}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex justify-center">
              <WhatsAppCTA 
                label={ctaLabel} 
                message={ctaMessage} 
                variant="primary" 
                context={ctaContext} 
              />
            </div>
          </Reveal>
        </div>

        {/*
         * A cream scrim under the form only. The wall stays at full strength
         * across the rest of the section; here it reads through at roughly
         * 0.04, so the labels and fields have quiet ground behind them.
         *
         * Its strength is tied to the wall's: this was /70 while the wall was
         * at 0.15, and easing the wall to 0.09 without easing the scrim would
         * have left a dead patch under the form rather than a quieter one.
         *
         * No border and no shadow — this should read as the doodle easing
         * off behind the form, not as a card sitting on top of it. The
         * padding is what keeps the falloff away from the first field.
         */}
        <div className="relative mt-16 rounded-[2.5rem] bg-cream/55 p-4 sm:p-8 md:p-10">
          <EnquiryForm topic="partner" />
        </div>
      </div>
    </section>
  );
}
