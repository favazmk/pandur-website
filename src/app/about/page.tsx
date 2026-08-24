import type { Metadata } from "next";

import AboutHero from "@/components/about/AboutHero";
import OriginStory from "@/components/about/OriginStory";
import ExperienceStory from "@/components/about/ExperienceStory";
import CompanyStory from "@/components/about/CompanyStory";
import TechnicalManufacturing from "@/components/about/TechnicalManufacturing";
import PrinciplesStory from "@/components/about/PrinciplesStory";
import VisionMission from "@/components/about/VisionMission";
import GrowthStory from "@/components/about/GrowthStory";
import PartnerCTA from "@/components/about/PartnerCTA";

export const metadata: Metadata = {
  title: "About Us | Pandur",
  description:
    "The story behind Pandur. Discover our heritage, our 45 years of bakery experience, and our vision for the future.",
};

export default function AboutPage() {
  return (
    <main id="main" className="bg-cream">
      <AboutHero />
      <OriginStory />
      <ExperienceStory />
      <CompanyStory />
      <TechnicalManufacturing />
      <PrinciplesStory />
      <VisionMission />
      <GrowthStory />
      <PartnerCTA />
    </main>
  );
}
