import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, Section, SectionHeading } from "@/components/layout/Section";
import { ScoreRing } from "@/components/product/ScoreRing";
import { CommandFrame } from "@/components/product/CommandFrame";
import { awardCategories, awardSafeguards, awardSteps } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "VeriTrack Global Business Awards (VGBA)",
  description: `VGBA ${siteConfig.vgba.editionYear}: annual recognition for organisations that lead in workforce attendance, ranked on live performance data, not opinion.`,
  alternates: { canonical: "/awards" },
};

export default function AwardsPage() {
  const year = siteConfig.vgba.editionYear;
  return (
    <div>
      <section className="bleed on-frame theme-command relative -mt-18 overflow-hidden pt-18">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60rem 30rem at 70% -10%, rgb(201 162 39 / 0.18), transparent), radial-gradient(40rem 30rem at 10% 110%, rgb(0 230 118 / 0.08), transparent)" }} />
        <Container className="relative grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.1fr_1fr]" stagger="enter">
          <div>
            <p className="eyebrow !text-award-gold">VeriTrack Global Business Awards · {year}</p>
            <h1 className="mt-4 text-display-xl font-light tracking-[-0.045em] text-award-platinum">Measured excellence. Celebrated annually.</h1>
            <p className="mt-6 max-w-xl text-lg text-command-muted sm:text-xl">
              VGBA recognises client organisations that lead in workforce attendance, not on opinion but on live performance data captured throughout the year.
            </p>
            <p className="mt-4 font-mono text-sm tracking-wide text-award-gold">Performance. Presence. Progress.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact?intent=deploy" className="btn btn-primary">Qualify for VGBA {year}</Link>
              <Link href="/awards/methodology" className="btn btn-ghost">Read the methodology</Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-award-gold/30 shadow-[0_30px_80px_-30px_rgb(201_162_39/0.4)]">
            <Image src="/awards/vgba.jpg" alt="VGBA key visual" width={1534} height={1025} priority sizes="(min-width: 1024px) 45vw, 100vw" className="h-auto w-full" />
          </div>
        </Container>
      </section>

      <Section tone="command" aria-labelledby="how-heading">
        <SectionHeading id="how-heading" eyebrow="How it works" title="Four steps, all year round" />
        <ol data-reveal-stagger className="mt-12 grid gap-5 md:grid-cols-4">
          {awardSteps.map((s, i) => (
            <li key={s.title} className="card relative p-6">
              <span className="font-mono text-sm text-award-gold">0{i + 1}</span>
              <h3 className="mt-2 text-xl">{s.title}</h3>
              <p className="mt-2 text-[0.9375rem] text-command-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="command" aria-labelledby="categories-heading">
        <SectionHeading id="categories-heading" eyebrow="Categories" title="Award categories" />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 [perspective:1000px]">
          {awardCategories.map((c) => (
            <li key={c.title} className="card group p-6 transition-transform duration-300 hover:[transform:rotateY(-8deg)_rotateX(4deg)]">
              <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-full border border-award-gold/50 text-award-gold">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 3h10v2h3v3a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 14.9V18h3v3H8v-3h3v-3.1A5 5 0 0 1 8.3 12H8a4 4 0 0 1-4-4V5h3zm0 4H6v1a2 2 0 0 0 1 1.7zm10 0v2.7A2 2 0 0 0 18 8V7z" /></svg>
              </span>
              <h3 className="mt-4 text-lg">{c.title}</h3>
              <p className="mt-2 text-[0.9375rem] text-command-muted">{c.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="command" aria-labelledby="score-heading">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div>
            <p className="eyebrow">Methodology</p>
            <h2 id="score-heading" className="mt-3 text-3xl sm:text-4xl">The same score your dashboard shows</h2>
            <p className="mt-4 text-command-muted">Rankings use the composite Performance Score (0–100) visible in VeriTrack dashboards. Weights are applied each year, subject to annual review.</p>
            <Link href="/awards/methodology" className="btn btn-ghost mt-8">Full methodology & eligibility →</Link>
          </div>
          <div className="card p-6 sm:p-8">
            <ScoreRing />
          </div>
        </div>
        <div className="mt-14">
          <CommandFrame image={{ src: "/product/performance.jpg", alt: "Performance dashboard: live metrics that feed VGBA", width: 2880, height: 1636 }} title="Performance dashboard · Live metrics that feed VGBA" />
        </div>
      </Section>

      <Section tone="command" aria-labelledby="safeguards-heading">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading id="safeguards-heading" eyebrow="Trust" title="Safeguards" />
            <ul className="mt-8 grid gap-3">
              {awardSafeguards.map((s) => (
                <li key={s} className="flex gap-3">
                  <span aria-hidden className="mt-1 text-signal">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="card flex flex-col justify-center p-8 text-center">
            <p className="eyebrow !text-award-gold">Hall of fame</p>
            <h3 className="mt-3 text-2xl text-award-platinum">First ceremony: VGBA {year}</h3>
            <p className="mt-3 text-command-muted">Winners will be listed here after the ceremony. Deploy your portal now to start building eligible performance data.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/contact?intent=deploy" className="btn btn-primary">Get started</Link>
              <Link href="/partners" className="btn btn-ghost">Partner co-marketing</Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
