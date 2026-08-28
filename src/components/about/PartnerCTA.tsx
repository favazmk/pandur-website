"use client";

import Link from "next/link";
import WhatsAppCTA from "@/components/cta/WhatsAppCTA";
import { WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export default function PartnerCTA() {
  return (
    <section className="relative bg-cream py-32 md:py-48 flex items-center justify-center text-center">
      <div className="mx-auto max-w-4xl px-6 relative z-10">
        
        <h2 className="text-5xl md:text-7xl font-display font-black text-ink uppercase tracking-tight leading-[1.1] mb-8">
          Build Something<br />That Grows.
        </h2>
        
        <p className="text-lg md:text-xl text-ash max-w-2xl mx-auto mb-16 leading-relaxed">
          Pandur is looking to build long-term relationships with supermarkets, hypermarkets, distributors, wholesalers, retailers, cafés, hotels and food-service businesses across the UAE and GCC.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <WhatsAppCTA 
            label="PARTNER WITH PANDUR"
            message={WHATSAPP_MESSAGES.aboutPartner}
            variant="primary"
            context="about_partner"
            className="w-full sm:w-auto !py-5"
          />

          <Link
            href="/contact"
            data-cursor="grow"
            className="group inline-flex items-center gap-3 rounded-full border-2 border-ink px-10 py-5 text-sm font-extrabold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-cream w-full sm:w-auto justify-center"
          >
            Contact Us
          </Link>
        </div>

      </div>
    </section>
  );
}
