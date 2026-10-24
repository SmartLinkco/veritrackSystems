import type { Metadata } from "next";
import Link from "next/link";
import { Container, Panel, Section } from "@/components/layout/Section";
import { FilmFacade } from "@/components/media/Films";
import { films, sectorMedia } from "@/lib/media";
import { DeployBand, PageHero, SectorIcon } from "@/components/marketing/Bands";
import { CommandFrame } from "@/components/product/CommandFrame";
import { sectors, testimonials, type SectorSlug } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

function getSector(slug: SectorSlug) {
  return sectors.find((s) => s.slug === slug)!;
}

export function sectorMetadata(slug: SectorSlug): Metadata {
  const s = getSector(slug);
  return {
    title: `${s.name} attendance`,
    description: `${s.pitch} Photo-verified, geofenced attendance for ${s.name.toLowerCase()} in Ghana.`,
    alternates: { canonical: `/solutions/${slug}` },
  };
}

const sectorTestimonial: Partial<Record<SectorSlug, string>> = {
  logistics: "Shola Oluwa",
  corporate: "Stephen Darry Oppong",
};

export function SectorPage({ slug }: { slug: SectorSlug }) {
  const s = getSector(slug);
  const quote = testimonials.find((t) => t.name === sectorTestimonial[slug]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `VeriTrack for ${s.name}`,
    provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    areaServed: "GH",
    description: s.pitch,
  };

  const media = sectorMedia[slug];
  const film = media.film ? films[media.film] : undefined;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow={`Solutions · ${s.name}`} title={s.heroAngle} lead={s.pitch} clip={media.loop}>
        <div className="flex flex-wrap gap-3">
          <Link href={`/contact?intent=deploy&sector=${slug}`} className="btn btn-primary btn-arrow">Deploy for {s.name.split(" & ")[0].toLowerCase()}</Link>
          <Link href="/demo" className="btn btn-ghost">See the live demo</Link>
        </div>
      </PageHero>

      {film && media.film && (
        <Panel aria-labelledby="film-heading" className="py-16 sm:py-20">
          <Container className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-4">
              <p data-reveal className="text-[0.9375rem] font-semibold text-brand-600">Watch the film</p>
              <h2 id="film-heading" data-reveal style={{ "--i": 1 } as React.CSSProperties} className="mt-3 text-[clamp(1.875rem,3vw,2.5rem)] font-light leading-[1.1] tracking-[-0.03em]">{film.title}</h2>
              <p data-reveal style={{ "--i": 2 } as React.CSSProperties} className="mt-4 text-lg text-ink-muted">{film.hook}</p>
            </div>
            <div data-reveal style={{ "--i": 2 } as React.CSSProperties} className="lg:col-span-8">
              <FilmFacade id={media.film} />
            </div>
          </Container>
        </Panel>
      )}

      <Section aria-labelledby="pain-heading">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <h2 id="pain-heading" className="text-[clamp(2rem,3.4vw,3rem)] font-light leading-[1.05] tracking-[-0.035em]">
                What VeriTrack <span className="text-brand-500">replaces</span>
              </h2>
              <ul data-reveal-stagger className="mt-8 grid gap-3">
                {s.painPoints.map((p) => (
                  <li key={p} className="flex gap-4 border-b border-border pb-3 text-lg text-ink-muted">
                    <span aria-hidden className="mt-0.5 text-ink-muted">✕</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="text-[clamp(2rem,3.4vw,3rem)] font-light leading-[1.05] tracking-[-0.035em]">What you get</h2>
            <ul data-reveal-stagger className="mt-8 grid gap-4">
              {s.features.map((f, i) => (
                <li key={f.title} className="card p-6 sm:p-7">
                  <span className="tnum text-[0.875rem] font-semibold text-brand-600">0{i + 1}</span>
                  <h3 className="mt-2 text-xl font-medium tracking-[-0.01em]">{f.title}</h3>
                  <p className="mt-2 text-ink-muted">{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="command" aria-labelledby="exclusive-heading">
        <div data-reveal-stagger className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="eyebrow">Built for {s.name.split(" & ")[0].toLowerCase()}</p>
            <h2 id="exclusive-heading" className="mt-3 text-[clamp(2rem,3.4vw,3rem)] font-light leading-[1.05] tracking-[-0.035em]">{s.exclusive.title}</h2>
            <p className="mt-4 text-lg text-command-muted">{s.exclusive.body}</p>
          </div>
          <CommandFrame image={s.screenshot} glow />
        </div>
      </Section>

      {quote && (
        <Section aria-label="Customer quote">
          <figure className="mx-auto max-w-3xl text-center">
            <blockquote className="font-display text-2xl font-light leading-snug tracking-[-0.02em] sm:text-4xl">“{quote.quote}”</blockquote>
            <figcaption className="mt-6">
              <span className="font-semibold">{quote.name}</span>
              <span className="block text-ink-muted">{quote.role}</span>
            </figcaption>
          </figure>
        </Section>
      )}

      <Section tone="elevated" aria-labelledby="other-sectors">
        <h2 id="other-sectors" className="text-[clamp(1.75rem,2.6vw,2.25rem)] font-light tracking-[-0.03em]">Other sectors</h2>
        <ul data-reveal-stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {sectors.filter((o) => o.slug !== slug).map((o) => (
            <li key={o.slug}>
              <Link href={`/solutions/${o.slug}`} className="card group flex h-full items-center gap-4 bg-white p-4">
                <SectorIcon slug={o.slug} />
                <span className="font-semibold">{o.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <DeployBand />
    </>
  );
}
