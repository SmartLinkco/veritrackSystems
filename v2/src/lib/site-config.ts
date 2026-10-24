// Single source for facts that appear on many pages. Update here, not in components.
// Dynamic homepage metrics live in site-metrics.ts (server-only "use cache") so this file stays client-safe.

export const siteConfig = {
  name: "VeriTrack Systems",
  tagline: "Trusted workforce intelligence for organisations that need proof, not paperwork.",
  description:
    "VeriTrack Systems provides photo-verified staff attendance, live admin dashboards, and cross-branch analytics for pharmacies, colleges, logistics, and corporate teams across Ghana. Deploy in days. Performance recognised annually through VGBA.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://veritrack.cloud",
  renewalUrl: "https://portals.veritrack.cloud/renewal",
  calUrl: process.env.NEXT_PUBLIC_CAL_URL ?? "https://calendly.com/info-veritrack/30min",
  demoFormUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSeocqzS0V9AX2x8sC8MfJC7Igxrml4pcjgy3AwkIlaqvRtvCQ/viewform?embedded=true",
  supademoId: "cmqjnsjs41somqmx1x1n9xu0y",
  contact: {
    email: "info@veritrack.cloud",
    phone: "+233 59 254 8849",
    phoneHref: "tel:+233592548849",
    address: "Accra, Ghana",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/veritrack-systems",
    x: "https://x.com/Veritracks",
    instagram: "https://www.instagram.com/veritrack_systems",
    facebook: "https://www.facebook.com/profile.php?id=61580288907388",
  },
  vgba: {
    editionYear: 2028,
    ceremonyDate: null as string | null, // ISO date once confirmed; countdown stays hidden until then
  },
  support: "Dedicated support during business hours with defined response targets.",
} as const;

// Open-licence photographs of Ghana used on the homepage sector line (files in public/world, sources in credits.json).
// They show each sector's world, never a VeriTrack client.
export const worldCredits = [
  { key: "pharmacy", src: "/world/a-female-pharmacist-distributing-drugs-to-pharmacies.jpg", alt: "A pharmacist loading medicine cartons into a van", title: "A female pharmacist distributing drugs to pharmacies", creator: "KISUMAR123", licence: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/w/index.php?curid=151562761" },
  { key: "education", src: "/world/legon-tower.jpg", alt: "Legon Tower at the University of Ghana", title: "Legon Tower", creator: "Rtevels", licence: "CC BY-SA 3.0", href: "https://commons.wikimedia.org/w/index.php?curid=12054929" },
  { key: "logistics", src: "/world/ghana-truck-moving.jpg", alt: "A loaded truck on a Ghanaian road", title: "Ghana-truck-moving", creator: "Fquasie", licence: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/w/index.php?curid=87569999" },
  { key: "corporate", src: "/world/office-building-in-accra.jpg", alt: "An office building in Accra", title: "Office Building in Accra", creator: "Gkbediako", licence: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/w/index.php?curid=116882513" },
  { key: "events", src: "/world/accra-international-conference-center-accra.jpg", alt: "Accra International Conference Centre", title: "Accra International Conference Center, Accra", creator: "Fkoku", licence: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/w/index.php?curid=65550782" },
] as const;
