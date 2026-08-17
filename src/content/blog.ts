/**
 * File-based blog content.
 *
 * No CMS was specified, and none is needed to launch — posts live here as typed
 * data, which keeps the build dependency-free and fully static. If the client
 * needs to publish without a developer, this module is the seam: swap the two
 * accessors below for CMS fetches and the pages are unchanged.
 *
 * The posts below are SAMPLE content written only from facts in the company
 * brief. Nothing here is invented news. Replace with client-approved copy.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date */
  date: string;
  category: string;
  readMinutes: number;
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "why-six-months-matters",
    title: "Why six months matters",
    excerpt:
      "Shelf life isn't a technical footnote. It decides which shelves a cookie can reach.",
    date: "2026-07-28",
    category: "Product",
    readMinutes: 3,
    body: [
      {
        type: "p",
        text: "Every bakery product carries an invisible constraint: how far it can travel before it stops being worth selling. Shelf life sets that radius.",
      },
      {
        type: "h2",
        text: "The distribution maths",
      },
      {
        type: "p",
        text: "A six-month life changes what a distributor can plan. Stock can move through a warehouse, sit in a delivery cycle, and still reach a shelf with enough runway to sell through.",
      },
      {
        type: "list",
        items: [
          "Longer ordering cycles and larger, more efficient drops",
          "Room for slower-turning outlets without write-offs",
          "Realistic reach into markets beyond the immediate region",
        ],
      },
      {
        type: "quote",
        text: "Six months on shelf. Tastes like it left the oven this morning.",
      },
      {
        type: "p",
        text: "The harder part is holding taste across that window. That is a formulation and process question, and it is where decades of manufacturing experience earn their keep.",
      },
    ],
  },
  {
    slug: "eight-markets-one-taste",
    title: "Eight markets, one taste",
    excerpt:
      "Consistency across a growing footprint is a manufacturing problem before it is a brand one.",
    date: "2026-06-15",
    category: "Distribution",
    readMinutes: 2,
    body: [
      {
        type: "p",
        text: "Pandur is already moving across Sharjah, Ajman, Ras Al Khaimah, Masafi, Dibba, Khorfakkan, Fujairah and Kalba.",
      },
      {
        type: "h2",
        text: "Growth exposes inconsistency",
      },
      {
        type: "p",
        text: "A single bakery serving a single town can absorb variation between batches. A brand on eight sets of shelves cannot — the customer who buys in Fujairah expects exactly what they bought in Sharjah.",
      },
      {
        type: "p",
        text: "That is why controlled, repeatable production matters more as distribution widens. Consistency is what lets a footprint keep growing without the brand thinning out.",
      },
    ],
  },
  {
    slug: "45-years-in-the-oven",
    title: "45 years in the oven",
    excerpt:
      "Pandur is a new brand built on a manufacturing base that is anything but new.",
    date: "2026-05-02",
    category: "Brand",
    readMinutes: 2,
    body: [
      {
        type: "p",
        text: "Royal Quality Bakes has spent 45 years in food manufacturing and bakery production. Pandur is what that experience looks like when it is pointed at a single signature product.",
      },
      {
        type: "h2",
        text: "Why launch a brand now",
      },
      {
        type: "p",
        text: "Decades of production teach you what consumers return to, what survives a supply chain, and what a retailer will re-order. Pandur was developed against all three at once.",
      },
      {
        type: "p",
        text: "The ambition is straightforward: build a trusted UAE bakery brand, then grow it across the GCC.",
      },
    ],
  },
];

export const getAllPosts = (): Post[] =>
  [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

export const getPost = (slug: string): Post | undefined =>
  POSTS.find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
