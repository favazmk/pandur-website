import type { Metadata } from "next";
import { RevealGroup, RevealItem } from "@/components/motion/Text";
import { Tilt3D } from "@/components/motion/Scroll";
import { HoverSpotlight, HoverOutline } from "@/components/motion/Hover";
import { CookieDoodle } from "@/components/brand/Marks";
import { tiltAt } from "@/lib/motion";

import FranchiseExperience from "@/components/franchise-v3/FranchiseExperience";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { SplitLine } from "@/components/motion/Text";

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

export default function FranchisesPage() {
  return (
    <main id="main">
      <FranchiseExperience>
        {/* --- models (LOCKED - DO NOT TOUCH) --- */}
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
      </FranchiseExperience>

      {/* Static Enquiry Form Section */}
      <section id="enquire" className="relative bg-cream-deep px-6 py-24 md:py-32 z-20">
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
              interestOptions={[
                "Distribution",
                "Retail Stockist",
                "Food Service",
                "Territory Partner"
              ]}
              submitLabel="Submit Enquiry"
            />
          </div>

          <div className="mx-auto mt-10 max-w-2xl text-center text-sm text-ash">
            <p>
              Commercial terms — investment, territory rights, minimum volumes and
              margins — are agreed case by case and are not published here.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
