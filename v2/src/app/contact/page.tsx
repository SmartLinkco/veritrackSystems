import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout/Section";
import { ContactWizard } from "@/components/forms/ContactWizard";
import { Faq } from "@/components/marketing/Faq";
import { faqs } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact & get started",
  description: "Deploy a VeriTrack portal, book a demo, join the partner programme, or reach support.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="panel">
        <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_2fr]" stagger="enter">
          <div>
            <p className="eyebrow">Contact</p>
            <h1 className="mt-3 text-display font-light tracking-[-0.035em]">Let&apos;s get you set up.</h1>
            <p className="mt-5 text-lg text-ink-muted">Pick what you need and we&apos;ll route you to the right team.</p>
            <dl className="mt-10 grid gap-5 text-[0.9375rem]">
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.12em] text-ink-muted">Email</dt>
                <dd><a href={`mailto:${siteConfig.contact.email}`} className="text-brand-500 underline underline-offset-2">{siteConfig.contact.email}</a></dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.12em] text-ink-muted">Phone</dt>
                <dd><a href={siteConfig.contact.phoneHref} className="text-brand-500 underline underline-offset-2">{siteConfig.contact.phone}</a></dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.12em] text-ink-muted">Office</dt>
                <dd>{siteConfig.contact.address}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.12em] text-ink-muted">Support</dt>
                <dd>{siteConfig.support}</dd>
              </div>
            </dl>
          </div>
          <Suspense fallback={<div className="card h-96 animate-pulse" />}>
            <ContactWizard />
          </Suspense>
        </Container>
      </section>
      <div className="panel">
        <Container id="faq" className="max-w-4xl py-16 sm:py-20">
          <h2 className="mb-8 text-3xl">Frequently asked questions</h2>
          <Faq items={faqs} />
        </Container>
      </div>
    </>
  );
}
