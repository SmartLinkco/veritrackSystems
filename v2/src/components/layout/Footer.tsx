import Link from "next/link";
import { Container } from "./Section";
import { BackgroundVideo } from "@/components/media/BackgroundVideo";
import { sectors } from "@/lib/content";
import { siteConfig, worldCredits } from "@/lib/site-config";

type FooterLink = { href: string; label: string; external?: boolean };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Platform",
    links: [
      { href: "/platform#verify", label: "Staff portal" },
      { href: "/platform#monitor", label: "Admin dashboard" },
      { href: "/platform#improve", label: "Network intelligence" },
      { href: "/pricing", label: "Pricing" },
      { href: "/demo", label: "Live demo" },
    ],
  },
  {
    title: "Solutions",
    links: sectors.map((s) => ({ href: `/solutions/${s.slug}`, label: s.name })),
  },
  {
    title: "Company",
    links: [
      { href: "/company", label: "About & team" },
      { href: "/partners", label: "Partner programme" },
      { href: "/awards", label: "VGBA awards" },
      { href: "/legal/privacy#dpc-certification", label: "DPC certification" },
    ],
  },
  {
    title: "Access",
    links: [
      { href: siteConfig.renewalUrl, label: "Renew subscription", external: true },
      { href: "/contact", label: "Contact" },
      { href: `mailto:${siteConfig.contact.email}`, label: siteConfig.contact.email, external: true },
    ],
  },
];

const socials = [
  { href: siteConfig.social.linkedin, label: "LinkedIn" },
  { href: siteConfig.social.x, label: "X" },
  { href: siteConfig.social.instagram, label: "Instagram" },
  { href: siteConfig.social.facebook, label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="on-frame relative mt-3 overflow-hidden bg-frame-deep">
      <BackgroundVideo clip="accra-road" blur />
      <Container className="relative pt-20 pb-10 sm:pt-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <p data-reveal className="font-display text-[clamp(2.25rem,4.6vw,4.25rem)] font-light leading-[1.05] tracking-[-0.035em] lg:col-span-6">
            Proof of presence for every branch, campus and client site in Ghana.
          </p>
          <div data-reveal style={{ "--i": 1 } as React.CSSProperties} className="flex flex-col items-start gap-6 lg:col-span-5 lg:col-start-8 lg:items-end lg:justify-end">
            <Link href="/contact?intent=deploy" className="btn btn-primary btn-arrow">Request a portal</Link>
            <Link href="/demo#book" className="text-link">Book a walkthrough</Link>
          </div>
        </div>

        <div className="mt-20 grid gap-12 border-t border-white/15 pt-12 lg:grid-cols-12">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="text-[0.9375rem] font-semibold text-white/70">{col.title}</h2>
                <ul className="mt-4 grid gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      {l.external ? (
                        <a href={l.href} className="break-words text-[0.9375rem] text-white hover:text-signal" {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
                          {l.label}
                        </a>
                      ) : (
                        <Link href={l.href} className="text-[0.9375rem] text-white hover:text-signal">{l.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="grid content-start gap-6 text-[0.9375rem] lg:col-span-4">
            <p className="max-w-xs text-white">{siteConfig.tagline}</p>
            <p className="text-white/70">
              <a href={siteConfig.contact.phoneHref} className="text-white hover:text-signal">{siteConfig.contact.phone}</a>
              <br />
              <a href={`mailto:${siteConfig.contact.email}`} className="text-white hover:text-signal">{siteConfig.contact.email}</a>
              <br />
              {siteConfig.contact.address}
            </p>
          </div>
        </div>

        {/* The mark, built large: the wordmark closed by the geofence ring. */}
        <Link href="/" aria-label="VeriTrack Systems home" className="group mt-20 flex items-end gap-[0.06em] font-display font-semibold leading-[0.8] tracking-[-0.04em] text-white text-[min(15.2vw,13.25rem)]">
          <span aria-hidden>VeriTrack</span>
          <span aria-hidden className="mb-[0.02em] inline-block h-[0.2em] w-[0.2em] shrink-0 rounded-full border-[0.05em] border-signal transition-transform duration-300 group-hover:scale-125" />
        </Link>

        <div className="mt-12 flex flex-col gap-5 text-[0.9375rem] text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>© VeriTrack Systems, Accra</p>
            <Link href="/legal/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-white">Terms</Link>
            <Link href="/legal/partner-terms" className="hover:text-white">Partner terms</Link>
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener" className="hover:text-white">{s.label}</a>
            ))}
          </div>
        </div>
        <p className="mt-8 max-w-4xl text-[0.8125rem] leading-relaxed text-white/70">
          Photographs of Ghana: {worldCredits.map((c, i) => (
            <span key={c.href}>{i > 0 && "; "}<a href={c.href} className="underline underline-offset-2 hover:text-white" target="_blank" rel="noopener">{c.title}</a>{" "}by {c.creator}, {c.licence}</span>
          ))}. Via Wikimedia Commons.
        </p>
      </Container>
    </footer>
  );
}
