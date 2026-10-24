import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, SectionHeading } from "@/components/layout/Section";
import { PageHero } from "@/components/marketing/Bands";
import { PartnerForm } from "@/components/forms/PartnerForm";

export const metadata: Metadata = {
  title: "Partner programme",
  description: "Refer organisations to VeriTrack and earn recurring commissions. Partners receive a unique Partner ID, onboarding support, and VGBA co-marketing.",
  alternates: { canonical: "/partners" },
};

const benefits = [
  { title: "Recurring commissions", body: "Earn on every successful referral, with transparent payment terms by mobile money or bank transfer." },
  { title: "Your own Partner ID", body: "Clients enter your ID when they request a portal, so every referral is tracked to you." },
  { title: "Support & training", body: "Onboarding materials and ongoing support from our team." },
  { title: "VGBA co-marketing", body: "Share the official awards programme with prospects: annual recognition built on the same live metrics clients use." },
];

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner programme"
        title="Grow with VeriTrack"
        lead="Refer organisations to VeriTrack and earn recurring commissions. Partners receive a unique Partner ID, onboarding support, and co-marketing opportunities, including VGBA."
      >
        <div className="flex flex-wrap gap-3">
          <a href="#register" className="btn btn-primary">Register as partner</a>
          <Link href="/legal/partner-terms" className="btn btn-ghost">Partner terms</Link>
        </div>
      </PageHero>

      <Section aria-labelledby="benefits-heading">
        <SectionHeading id="benefits-heading" eyebrow="Why partner" title="Trusted referrals across Africa" />
        <ul data-reveal-stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <li key={b.title} className="card p-6">
              <h3 className="text-lg">{b.title}</h3>
              <p className="mt-2 text-[0.9375rem] text-ink-muted">{b.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <section id="register" className="panel panel-elevated py-20 sm:py-24" aria-labelledby="register-heading">
        <Container className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow">Register</p>
            <h2 id="register-heading" className="mt-3 text-3xl sm:text-4xl">Partner registration</h2>
            <p className="mt-4 text-ink-muted">Register to receive a Partner ID and earn recurring commissions on every referral you make.</p>
            <div className="card mt-8 p-5 text-[0.9375rem]">
              <p className="font-semibold">Before you register</p>
              <ul className="mt-3 grid gap-2 text-ink-muted">
                <li>Commission structure and payment terms</li>
                <li>Partner responsibilities and code of conduct</li>
                <li>Referral tracking and verification</li>
                <li>Territory rights and client protection</li>
              </ul>
              <Link href="/legal/partner-terms" className="mt-4 inline-block font-semibold text-brand-500">Read the full terms →</Link>
            </div>
          </div>
          <PartnerForm />
        </Container>
      </section>
    </>
  );
}
