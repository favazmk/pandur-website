"use client";

import { SplitLine, Reveal } from "@/components/motion/Text";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { CHANNELS } from "@/lib/nav";

export default function Partner() {
  return (
    <section id="partner" className="relative overflow-hidden bg-cream py-24 md:py-36">
      <div className="mx-auto max-w-5xl px-6">
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
        </div>

        <div className="relative mt-16">
          <EnquiryForm topic="partner" />
        </div>
      </div>
    </section>
  );
}
