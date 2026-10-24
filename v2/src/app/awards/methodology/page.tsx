import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Section";
import { PageHero } from "@/components/marketing/Bands";
import { awardCategories, awardSafeguards, performanceWeights } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "VGBA methodology & eligibility",
  description: "How the VeriTrack Performance Score is calculated, who is eligible for VGBA, and how organisations can opt out of public ranking.",
  alternates: { canonical: "/awards/methodology" },
};

export default function MethodologyPage() {
  return (
    <>
      <PageHero
        tone="command"
        eyebrow="VGBA · Methodology"
        title="How the Performance Score works"
        lead="A composite score from 0 to 100, calculated per organisation from four measures VeriTrack already records."
      />
      <div className="panel mt-3">
        <Container className="max-w-3xl py-16 sm:py-20">
          <h2 className="text-2xl">The formula</h2>
          <p className="mt-3 text-ink-muted">Each measure is a rate between 0 and 100% over the scoring window. The score is the weighted sum:</p>
          <p className="mt-5 overflow-x-auto rounded-xl bg-surface-elevated p-5 font-mono text-[0.9375rem]">
            Score = {performanceWeights.map((w) => `${w.weight / 100} × ${w.label.toLowerCase()}`).join(" + ")}
          </p>
          <div className="card mt-8 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border font-mono text-xs uppercase tracking-[0.12em] text-ink-muted">
                  <th className="p-4 font-medium">Measure</th>
                  <th className="p-4 font-medium">What it captures</th>
                  <th className="p-4 text-right font-medium">Weight</th>
                </tr>
              </thead>
              <tbody>
                {performanceWeights.map((w) => (
                  <tr key={w.key} className="border-b border-border last:border-0">
                    <td className="p-4 font-semibold">{w.label}</td>
                    <td className="p-4 text-[0.9375rem] text-ink-muted">{measureNotes[w.key]}</td>
                    <td className="p-4 text-right font-mono">{w.weight}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-14 text-2xl">Eligibility &amp; safeguards</h2>
          <ul className="mt-4 grid gap-3">
            {awardSafeguards.map((s) => (
              <li key={s} className="flex gap-3"><span aria-hidden className="text-brand-500">•</span>{s}</li>
            ))}
          </ul>

          <h2 className="mt-14 text-2xl">Categories</h2>
          <dl className="mt-4 grid gap-4">
            {awardCategories.map((c) => (
              <div key={c.title}>
                <dt className="font-semibold">{c.title}</dt>
                <dd className="text-ink-muted">{c.body}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-14 text-2xl">Questions</h2>
          <p className="mt-3 text-ink-muted">
            Weights are subject to annual review. For questions about your organisation&apos;s score or to opt out of public ranking, email{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-brand-500 underline underline-offset-2">{siteConfig.contact.email}</a>.
          </p>
          <Link href="/awards" className="btn btn-ghost mt-8">← Back to VGBA</Link>
        </Container>
      </div>
    </>
  );
}

const measureNotes: Record<(typeof performanceWeights)[number]["key"], string> = {
  attendance: "Share of expected staff who checked in.",
  punctuality: "Share of check-ins that were on time.",
  checkout: "Share of check-ins with a matching check-out.",
  sync: "Share of records captured online rather than queued offline.",
};
