import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { Reveal, SplitLine } from "@/components/motion/Text";
import { CHANNELS, COMPANY, SOCIALS } from "@/lib/nav";
import { DoodleWall } from "@/components/brand/DoodleField";
import { HoverSpotlight, HoverOutline } from "@/components/motion/Hover";
import WhatsAppCTA from "@/components/cta/WhatsAppCTA";
import { WHATSAPP_MESSAGES } from "@/lib/whatsapp";
import { getSocialIcon } from "@/components/ui/SocialIcons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Pandur — Royal Quality Bakes LLC, Khorfakkan, UAE. Enquiries from retail, distribution and food service welcome.",
};

export default function ContactPage() {
  return (
    <main id="main">
      <PageHero
        title="Let's grow together."
        lead="Retail, distribution, food service or something else — tell us what you need."
      />

      <section className="relative overflow-hidden bg-cream px-6 pb-24 md:pb-32">
        <DoodleWall opacity={0.09} />
        
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          {/* --- details --- */}
          <div className="flex flex-col gap-6">
            <Reveal>
              <HoverOutline on="group" radius={24} className="h-full group text-red-deep">
                <HoverSpotlight className="h-full rounded-3xl border border-ink/10 bg-white/90 md:bg-white/60 md:backdrop-blur-md p-8 md:p-10 flex flex-col">
                  <h2 className="text-eyebrow text-red-deep mb-6">Headquarters</h2>
                  
                  <address className="not-italic flex-1">
                    <p className="font-display text-2xl md:text-3xl font-black text-ink">
                      {COMPANY.legal}
                    </p>
                    <p className="text-lead mt-4 text-ash leading-relaxed">
                      {COMPANY.address}
                      <br />
                      {COMPANY.country}
                    </p>
                  </address>

                  {(COMPANY.email || COMPANY.phone || COMPANY.phone2) && (
                    <div className="mt-8 pt-8 border-t border-ink/10 space-y-4">
                      {COMPANY.email && (
                         <div className="flex items-center gap-4 group/link">
                           <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-red-deep shrink-0 transition-transform group-hover/link:scale-110">
                             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                           </div>
                           <a href={`mailto:${COMPANY.email}`} className="text-ink font-medium hover:text-red-deep transition-colors truncate">
                             {COMPANY.email}
                           </a>
                        </div>
                      )}
                      {COMPANY.phone && (
                        <div className="flex items-center gap-4 group/link">
                           <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-red-deep shrink-0 transition-transform group-hover/link:scale-110">
                             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                           </div>
                          <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`} className="text-ink font-medium hover:text-red-deep transition-colors">
                            {COMPANY.phone}
                          </a>
                        </div>
                      )}
                      {COMPANY.phone2 && (
                        <div className="flex items-center gap-4 group/link">
                           <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-red-deep shrink-0 transition-transform group-hover/link:scale-110">
                             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                           </div>
                          <a href={`tel:${COMPANY.phone2.replace(/\s/g, "")}`} className="text-ink font-medium hover:text-red-deep transition-colors">
                            {COMPANY.phone2}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-8 pt-8 border-t border-ink/10 flex items-center justify-start gap-4">
                    {SOCIALS.map((social) => (
                      <a
                        key={social.platform}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-red-deep shrink-0 transition-transform hover:scale-110 hover:bg-red-deep hover:text-white"
                        aria-label={social.platform}
                      >
                        {getSocialIcon(social.icon)}
                      </a>
                    ))}
                  </div>

                </HoverSpotlight>
              </HoverOutline>
            </Reveal>

            <Reveal delay={0.1}>
              <HoverOutline on="group" radius={24} className="h-full group text-red-deep">
                <HoverSpotlight className="h-full rounded-3xl border border-ink/10 bg-white/90 md:bg-white/60 md:backdrop-blur-md p-8 md:p-10">
                  <h3 className="text-eyebrow text-red-deep mb-4">Direct Message</h3>
                  <p className="text-ash mb-8 text-sm leading-relaxed">
                    Need a faster response? Our team is available on WhatsApp for business enquiries, franchising, and support.
                  </p>
                  <WhatsAppCTA 
                    label="CHAT ON WHATSAPP" 
                    message={WHATSAPP_MESSAGES.contact}
                    variant="primary" 
                    context="contact_page"
                    className="w-full"
                  />
                </HoverSpotlight>
              </HoverOutline>
            </Reveal>
            
            <Reveal delay={0.2}>
               <div className="rounded-3xl border border-ink/5 bg-ink/5 p-8 text-center shadow-inner">
                 <h3 className="text-eyebrow text-ash mb-3">We work with</h3>
                 <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-[11px] md:text-sm font-bold text-ink uppercase tracking-widest">
                   {CHANNELS.map((channel, i) => (
                     <span key={channel}>
                       {channel}
                       {i < CHANNELS.length - 1 && <span className="mx-2 opacity-50">·</span>}
                     </span>
                   ))}
                 </div>
               </div>
            </Reveal>
          </div>

          {/* --- form --- */}
          <div className="relative">
            <Reveal>
              <HoverOutline on="group" radius={24} className="h-full group text-red-deep">
                <HoverSpotlight className="h-full rounded-3xl border border-ink/10 bg-white/90 md:bg-white/60 md:backdrop-blur-md p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-10">
                    <SplitLine
                      as="h2"
                      text="Send us a message."
                      className="text-3xl md:text-5xl font-display font-black text-ink"
                    />
                    <p className="text-ash mt-4 font-medium">
                      Fill out the form below and we&rsquo;ll get back to you shortly.
                    </p>
                  </div>
                  <EnquiryForm topic="contact" submitLabel="Send Message" />
                </HoverSpotlight>
              </HoverOutline>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
