import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import EnquiryForm from "@/components/forms/EnquiryForm";
import MarqueeBand from "@/components/sections/MarqueeBand";
import { Reveal, RevealGroup, RevealItem, SplitLine } from "@/components/motion/Text";
import { ScrollTilt, Tilt3D } from "@/components/motion/Scroll";
import { HoverSpotlight, HoverOutline } from "@/components/motion/Hover";
import { CookieDoodle } from "@/components/brand/Marks";
import { tiltAt } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Franchises & Partnerships",
  description:
    "Partner with Pandur — distribution, retail, food service and territory opportunities across the UAE and the wider GCC.",
};

const MODELS = [
  {
    t: "Distribution",
    d: "Carry Pandur across your existing retail network in the UAE or GCC.",
  },
  {
    t: "Retail Stockist",
    d: "Supermarkets, hypermarkets and grocery — shelf-ready with six-month life.",
  },
  {
    t: "Food Service",
    d: "Cafés, hotels and HORECA looking for a consistent branded cookie.",
  },
  {
    t: "Territory Partner",
    d: "Represent Pandur in a GCC market as we expand beyond the UAE.",
  },
];

/** Only claims that follow from the supplied company brief. */
const BRINGS = [
  { t: "45 years of manufacturing", d: "A production base with decades behind it." },
  { t: "Six-month shelf life", d: "Long enough for real distribution economics." },
  { t: "Consistent quality", d: "Controlled processes, repeatable batches." },
  { t: "An established footprint", d: "Already moving in eight UAE markets." },
];

const STEPS = [
  { n: "01", t: "Enquire", d: "Tell us your market and channel." },
  { n: "02", t: "Introduction", d: "We discuss fit, volumes and coverage." },
  { n: "03", t: "Samples & terms", d: "Product samples and commercial terms." },
  { n: "04", t: "Launch", d: "Onboarding and first order." },
];

const INTERESTS = MODELS.map((m) => m.t);

export default function FranchisesPage() {
  return (
    <main id="main">
      <PageHero
        title="Grow with Pandur."
        lead="We're building long-term relationships with distributors, retailers and food-service partners across the UAE and GCC."
      />

      {/* --- models --- */}
      <section className="relative bg-cream px-6 pb-24 md:pb-32">
        <RevealGroup
          className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2"
          stagger={0.1}
        >
          {MODELS.map((m, i) => (
            <RevealItem key={m.t} variant="scale">
              <Tilt3D max={10} lift={22} className="h-full">
                <HoverOutline radius={32} className={`h-full text-red-deep ${tiltAt(i)}`}>
                  <HoverSpotlight className="h-full rounded-[2rem] border border-ink/12 bg-white/50 p-9">
                    <CookieDoodle className="h-10 w-10 text-red-deep" strokeWidth={5} />
                    <h2 className="text-title mt-6 font-display font-black text-ink">
                      {m.t}
                    </h2>
                    <p className="text-lead mt-3 text-ash">{m.d}</p>
                  </HoverSpotlight>
                </HoverOutline>
              </Tilt3D>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* --- what we bring --- */}
      <section className="relative bg-cream-deep px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <SplitLine
              as="h2"
              text="A product built to travel."
              className="text-display font-display font-black text-ink"
            />
          </div>

          <ul className="mt-14">
            {BRINGS.map((b, i) => (
              <Reveal key={b.t} delay={i * 0.07}>
                <li className="grid grid-cols-1 gap-3 border-t border-ink/12 py-7 md:grid-cols-[1fr_1.4fr] md:gap-10">
                  <h3 className="text-title font-display font-black text-ink">
                    {b.t}
                  </h3>
                  <p className="text-lead text-ash md:pt-2">{b.d}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <MarqueeBand />

      {/* --- process --- */}
      <section className="relative bg-cream px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <SplitLine
            as="h2"
            text="How it works."
            className="text-display font-display font-black text-ink"
          />

          <ScrollTilt angle={20}>
            <RevealGroup
              className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
              stagger={0.1}
            >
              {STEPS.map((s) => (
                <RevealItem key={s.n} variant="wipe">
                  <div className="border-t-2 border-ink pt-6">
                    <span className="text-eyebrow text-red-deep">{s.n}</span>
                    <h3 className="mt-3 font-display text-2xl font-black text-ink">
                      {s.t}
                    </h3>
                    <p className="mt-2 text-ash">{s.d}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </ScrollTilt>
        </div>
      </section>

      {/* --- enquiry --- */}
      <section id="enquire" className="relative bg-cream-deep px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <SplitLine
              as="h2"
              text="Let's grow together."
              className="text-display font-display font-black text-ink"
            />
          </div>

          <div className="mt-14">
            <EnquiryForm
              topic="franchise"
              interestOptions={INTERESTS}
              submitLabel="Submit Enquiry"
            />
          </div>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-ash">
              Commercial terms — investment, territory rights, minimum volumes and
              margins — are agreed case by case and are not published here.
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
