import type { Metadata } from "next";
import { RevealGroup, RevealItem } from "@/components/motion/Text";
import { Tilt3D } from "@/components/motion/Scroll";
import { HoverSpotlight, HoverOutline } from "@/components/motion/Hover";
import { CookieDoodle } from "@/components/brand/Marks";
import { tiltAt } from "@/lib/motion";

import FranchiseHero from "@/components/franchise-v2/FranchiseHero";
import FranchiseWhy from "@/components/franchise-v2/FranchiseWhy";
import FranchiseFlow from "@/components/franchise-v2/FranchiseFlow";
import FranchiseEcosystem from "@/components/franchise-v2/FranchiseEcosystem";
import FranchiseGrowth from "@/components/franchise-v2/FranchiseGrowth";
import FranchiseJourney from "@/components/franchise-v2/FranchiseJourney";
import FranchiseCTA from "@/components/franchise-v2/FranchiseCTA";

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
      <FranchiseHero />

      {/* --- models (LOCKED - DO NOT TOUCH) --- */}
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

      <FranchiseWhy />
      <FranchiseFlow />
      <FranchiseEcosystem />
      <FranchiseGrowth />
      <FranchiseJourney />
      <FranchiseCTA />
    </main>
  );
}
