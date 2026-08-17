export type NavLink = { href: string; label: string };

export const NAV: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/franchises", label: "Franchises" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

/**
 * Trade channels. Lives here rather than in a component because server
 * components import it — values exported from a "use client" module arrive as
 * client references, not the real data.
 */
export const CHANNELS = [
  "Supermarkets",
  "Hypermarkets",
  "Distributors",
  "Wholesalers",
  "Cafés",
  "Hotels",
  "Food Service",
];

/** Company facts, single-sourced so they can't drift between pages. */
export const COMPANY = {
  name: "Pandur",
  legal: "Royal Quality Bakes LLC",
  address: "Zubara, Khorfakkan",
  country: "United Arab Emirates",
  /**
   * NOT SUPPLIED BY CLIENT — placeholders. Replace before launch.
   * Nothing on the site should present these as real contact details.
   */
  email: null as string | null,
  phone: null as string | null,
} as const;
