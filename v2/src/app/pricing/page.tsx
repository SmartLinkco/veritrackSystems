import type { Metadata } from "next";
import { Suspense } from "react";
import { Section, SectionHeading } from "@/components/layout/Section";
import { PageHero } from "@/components/marketing/Bands";
import { TierCards } from "@/components/marketing/TierCards";
import { Faq } from "@/components/marketing/Faq";
import { EstimateCalculator } from "@/components/forms/EstimateCalculator";
import { ADDONS, SETUP_FEE_GHS, STAFF_PER_BRANCH, TRIAL_DAYS, formatGHS } from "@/lib/pricing";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Pricing & estimator",
  description: `Resource-based pricing from ${formatGHS(300)} per branch per month, ${STAFF_PER_BRANCH} staff included per branch. Estimate your plan in GHS.`,
  alternates: { canonical: "/pricing" },
};

const pricingFaqs = [
  { q: "How is the branch rate chosen?", a: "One tier applies to every branch, based on your total branch count: 1–3 branches at GHS 450, 4–9 at GHS 350, and 10 or more at GHS 300 per branch per month." },
  { q: "What counts as extra staff?", a: `Each branch includes ${STAFF_PER_BRANCH} staff. Staff above that allowance are billed in one band for the whole excess: GHS 10 each for 1–20 extra, GHS 8 for 21–50, and GHS 6 for 51 or more.` },
  { q: "What does annual billing save?", a: "Annual billing prepays 12 months for the price of 11, saving one month compared with paying monthly." },
  { q: "Is there a setup fee?", a: `Yes, a one-time configuration fee of ${formatGHS(SETUP_FEE_GHS)}, plus a ${TRIAL_DAYS}-day trial on your subscription.` },
  { q: "Already a customer?", a: "Renew your subscription from the client portal renewal page linked in the footer." },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Resource-based subscription. Pay per branch."
        lead={`All plans include photo liveness, geofencing, multi-branch support, and automated reports. ${STAFF_PER_BRANCH} staff are included per branch. College, event, and integration modules are quoted separately.`}
      />

      <Section aria-label="Tiers">
        <TierCards />
        <div className="mt-8 grid gap-4 text-[0.9375rem] text-ink-muted sm:grid-cols-3">
          <p><strong className="text-ink">Extra staff:</strong> GHS 10 / 8 / 6 each per month depending on how many exceed the allowance.</p>
          <p><strong className="text-ink">Modules:</strong> leaderboard, shift rotation, AI tips, payroll sync and check-in alerts, from {formatGHS(ADDONS.alert.monthly)}/staff to {formatGHS(ADDONS.payroll.monthly)}/mo.</p>
          <p><strong className="text-ink">Setup:</strong> {formatGHS(SETUP_FEE_GHS)} one-time · {TRIAL_DAYS}-day trial.</p>
        </div>
      </Section>

      <Section id="estimator" tone="elevated" aria-labelledby="estimator-heading">
        <SectionHeading id="estimator-heading" eyebrow="Estimator" title="Estimate your plan" lead="Totals update as you type. Share the link, print it, or send it straight to our team." />
        <div className="mt-10">
          <Suspense fallback={<div className="card h-[40rem] animate-pulse" />}>
            <EstimateCalculator />
          </Suspense>
        </div>
      </Section>

      <Section aria-labelledby="pricing-faq">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <SectionHeading id="pricing-faq" eyebrow="FAQ" title="Pricing questions" />
            <a href={siteConfig.renewalUrl} className="btn btn-ghost mt-8">Renew a subscription ↗</a>
          </div>
          <Faq items={pricingFaqs} />
        </div>
      </Section>
    </>
  );
}
