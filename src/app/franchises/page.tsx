import type { Metadata } from "next";
import { RevealGroup, RevealItem } from "@/components/motion/Text";
import { Tilt3D } from "@/components/motion/Scroll";
import { HoverSpotlight, HoverOutline } from "@/components/motion/Hover";
import { CookieDoodle } from "@/components/brand/Marks";
import { tiltAt } from "@/lib/motion";

import FranchiseExperience from "@/components/franchise-v3/FranchiseExperience";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { SplitLine } from "@/components/motion/Text";
import { DoodleWall } from "@/components/brand/DoodleField";
import WhatsAppCTA from "@/components/cta/WhatsAppCTA";
import { WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Franchises & Partnerships",
  description:
    "Partner with Pandur — distribution, retail, food service and territory opportunities across the UAE and the wider GCC.",
};

const MODELS = [
  {
    t: "Distribution",
    d: "Carry Pandur across your existing retail network in the UAE or GCC.",
    msgKey: "franchiseDistribution",
  },
  {
    t: "Retail Stockist",
    d: "Supermarkets, hypermarkets and grocery — shelf-ready with six-month life.",
    msgKey: "franchiseRetail",
  },
  {
    t: "Food Service",
    d: "Cafés, hotels and HORECA looking for a consistent branded cookie.",
    msgKey: "franchiseFoodService",
  },
  {
    t: "Territory Partner",
    d: "Represent Pandur in a GCC market as we expand beyond the UAE.",
    msgKey: "franchiseTerritory",
  },
] as const;

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
            <RevealItem key={m.t} variant="scale" className="group">
              <Tilt3D max={10} lift={22} className="h-full">
                <HoverOutline on="group" radius={32} className={`h-full text-red-deep ${tiltAt(i)}`}>
                  <HoverSpotlight className="h-full rounded-[2rem] border border-ink/12 bg-white/50 p-9 flex flex-col">
                    <CookieDoodle className="h-10 w-10 text-red-deep" strokeWidth={5} />
                    <h2 className="text-title mt-6 font-display font-black text-ink">
                      {m.t}
                    </h2>
                    <p className="text-lead mt-3 text-ash mb-8">{m.d}</p>
                    <div className="mt-auto">
                      <WhatsAppCTA 
                        label="ENQUIRE VIA WHATSAPP"
                        message={WHATSAPP_MESSAGES[m.msgKey]}
                        variant="secondary"
                        context={`franchise_${m.msgKey}`}
                        className="w-full"
                      />
                    </div>
                  </HoverSpotlight>
                </HoverOutline>
              </Tilt3D>
            </RevealItem>
          ))}
        </RevealGroup>
      </FranchiseExperience>

      {/* Static Enquiry Form Section */}
      <section id="enquire" className="relative overflow-hidden bg-cream py-24 md:py-32 z-20">
        <DoodleWall opacity={0.09} />

        <div className="relative mx-auto max-w-5xl px-6">
          <div className="text-center">
            <SplitLine
              as="h2"
              text="Let's grow together."
              className="text-display font-display font-black text-ink"
            />
            <div className="mt-8 flex justify-center gap-4">
              <WhatsAppCTA 
                label="PARTNER WITH PANDUR"
                message={WHATSAPP_MESSAGES.franchiseFinal}
                variant="primary"
                context="franchise_final"
              />
            </div>
          </div>

          <div className="relative mt-16 rounded-[2.5rem] bg-cream/55 p-4 sm:p-8 md:p-10">
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

          <div className="relative mx-auto mt-10 max-w-2xl text-center text-sm text-ash">
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
