"use client";

import { getWhatsAppUrl, trackWhatsAppClick } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppCTA";
import { WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export default function GlobalWhatsAppCTA() {
  const url = getWhatsAppUrl(WHATSAPP_MESSAGES.global);

  return (
    <div className="fixed bottom-[max(18px,env(safe-area-inset-bottom))] right-4 z-50 md:right-6 md:bottom-6 pointer-events-none">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="pointer-events-auto flex items-center justify-center gap-2 rounded-full bg-red-deep px-4 py-3 sm:px-5 sm:py-3.5 text-white shadow-md shadow-ink/10 transition-all duration-300 ease-[var(--ease-pop)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-deep"
        onClick={() => trackWhatsAppClick("global_floating")}
      >
        <WhatsAppIcon className="h-6 w-6 sm:h-5 sm:w-5 shrink-0" />
        <span className="hidden sm:inline font-display text-sm font-bold tracking-wide">
          CHAT WITH US
        </span>
      </a>
    </div>
  );
}
