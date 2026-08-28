export const WHATSAPP_NUMBER = "971565048823";

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackWhatsAppClick(context: string) {
  if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
    window.gtag("event", "whatsapp_cta_click", {
      event_category: "engagement",
      event_label: context,
    });
  }
}

export const WHATSAPP_MESSAGES = {
  global: "Hi Pandur, I would like to get in touch regarding a general enquiry.",
  homeGeneral: "Hi Pandur, I would like to enquire about Pandur products and partnership opportunities.",
  homeFinal: "Hi Pandur, I would like to enquire about your products and business opportunities.",
  productsGeneral: "Hi Pandur, I would like to enquire about the Pandur cookie range.",
  productSpecific: (flavour: string) => `Hi Pandur, I am interested in ${flavour} Cookies and would like more information.`,
  aboutTalk: "Hi Pandur, I would like to learn more about the company and discuss a potential business opportunity.",
  aboutPartner: "Hi Pandur, I would like to discuss a partnership opportunity with Pandur.",
  franchiseDistribution: "Hi Pandur, I am interested in becoming a Distribution Partner and would like to discuss carrying Pandur across my retail network.",
  franchiseRetail: "Hi Pandur, I am interested in becoming a Retail Stockist and would like more information about stocking Pandur.",
  franchiseFoodService: "Hi Pandur, I am interested in Pandur for Food Service / HORECA and would like to discuss the opportunity.",
  franchiseTerritory: "Hi Pandur, I am interested in becoming a Territory Partner and would like to discuss representing Pandur in my market.",
  franchiseFinal: "Hi Pandur, I would like to discuss a partnership opportunity with Pandur.",
  contact: "Hi Pandur, I would like to get in touch regarding a business enquiry."
};
