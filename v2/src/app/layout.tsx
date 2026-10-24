import type { Metadata, Viewport } from "next";
import { Sora, Source_Sans_3 } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealObserver } from "@/components/layout/RevealObserver";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { PageTransition } from "@/components/layout/PageTransition";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], weight: ["300", "500", "600"], variable: "--font-sora", display: "swap" });
const sourceSans = Source_Sans_3({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-source-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "VeriTrack Systems | Workforce Attendance & Analytics Platform",
    template: "%s | VeriTrack Systems",
  },
  description: siteConfig.description,
  keywords: [
    "Ghana attendance software",
    "West Africa attendance software",
    "Africa workforce attendance",
    "staff attendance software",
    "pharmacy staff attendance",
    "college attendance system",
    "geofenced check-in",
    "workforce analytics",
  ],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "VeriTrack Systems: Verified Attendance & Live Dashboards",
    description: "Photo-verified attendance, branch dashboards, and performance analytics for growing organisations.",
    images: [{ url: "/product/super-admin.jpg", width: 2880, height: 1638, alt: "VeriTrack live attendance command view" }],
    locale: "en_GH",
  },
  twitter: { card: "summary_large_image", site: "@Veritracks" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#1b4d8c",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/brand/logo.png`,
      email: siteConfig.contact.email,
      telephone: "+233592548849",
      address: { "@type": "PostalAddress", addressLocality: "Accra", addressCountry: "GH" },
      areaServed: ["Ghana", "West Africa", "Africa", "Worldwide"],
      sameAs: Object.values(siteConfig.social),
    },
    {
      "@type": "SoftwareApplication",
      name: "VeriTrack",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", priceCurrency: "GHS", price: "300", description: "From GHS 300 per branch per month" },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-scroll-behavior lets Next jump to the top on navigation despite html { scroll-behavior: smooth }.
    <html lang="en" data-scroll-behavior="smooth" className={`${sora.variable} ${sourceSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Entrance states apply only when scripting works. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <MotionProvider>
          <Header />
          <main id="main" className="flex-1">
            {/* Route changes cross-fade the page body; header and footer stay put. */}
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </MotionProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
