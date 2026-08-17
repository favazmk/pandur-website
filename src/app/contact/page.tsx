import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import EnquiryForm from "@/components/forms/EnquiryForm";
import Markets from "@/components/sections/Markets";
import { Reveal, SplitLine } from "@/components/motion/Text";
import { CHANNELS, COMPANY } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Pandur — Royal Quality Bakes LLC, Zubara, Khorfakkan, UAE. Enquiries from retail, distribution and food service welcome.",
};

export default function ContactPage() {
  return (
    <main id="main">
      <PageHero
        title="Let's grow together."
        lead="Retail, distribution, food service or something else — tell us what you need."
      />

      <section className="relative bg-cream px-6 pb-24 md:pb-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          {/* --- details --- */}
          <div>
            <Reveal>
              <h2 className="text-eyebrow text-red-deep">Where we are</h2>
            </Reveal>

            <Reveal delay={0.08}>
              <address className="mt-6 not-italic">
                <p className="font-display text-2xl font-black text-ink">
                  {COMPANY.legal}
                </p>
                <p className="text-lead mt-2 text-ash">
                  {COMPANY.address}
                  <br />
                  {COMPANY.country}
                </p>
              </address>
            </Reveal>

            {(COMPANY.email || COMPANY.phone) && (
              <Reveal delay={0.14}>
                <div className="mt-8 space-y-2">
                  {COMPANY.email && (
                    <p>
                      <a
                        href={`mailto:${COMPANY.email}`}
                        className="text-lead text-ink underline underline-offset-4 hover:text-red-deep"
                      >
                        {COMPANY.email}
                      </a>
                    </p>
                  )}
                  {COMPANY.phone && (
                    <p>
                      <a
                        href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                        className="text-lead text-ink underline underline-offset-4 hover:text-red-deep"
                      >
                        {COMPANY.phone}
                      </a>
                    </p>
                  )}
                </div>
              </Reveal>
            )}

            <Reveal delay={0.2}>
              <div className="mt-10 border-t border-ink/12 pt-8">
                <h3 className="text-eyebrow text-ash">We work with</h3>
                <p className="text-lead mt-3 text-ink">{CHANNELS.join(" · ")}</p>
              </div>
            </Reveal>
          </div>

          {/* --- form --- */}
          <div>
            <Reveal>
              <SplitLine
                as="h2"
                text="Send us a message."
                className="text-title font-display font-black text-ink"
              />
            </Reveal>
            <div className="mt-10">
              <EnquiryForm topic="contact" submitLabel="Send Message" />
            </div>
          </div>
        </div>
      </section>

      <Markets />
    </main>
  );
}
