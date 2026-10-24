import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/layout/Section";
import { MetricStrip } from "@/components/marketing/MetricStrip";
import { PageHero } from "@/components/marketing/Bands";
import { team } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { getSiteMetrics } from "@/lib/site-metrics";

export const metadata: Metadata = {
  title: "Company & team",
  description: "VeriTrack Systems is an Accra-based workforce intelligence company building verified attendance for organisations across Ghana, West Africa, Africa and beyond.",
  alternates: { canonical: "/company" },
};

export default async function CompanyPage() {
  const metrics = await getSiteMetrics();

  return (
    <>
      <PageHero eyebrow="Company" title="Proof, not paperwork." lead={siteConfig.tagline} clip="office-team">
        <p className="text-muted-frame max-w-2xl">
          VeriTrack gives organisations a branded attendance portal and executive dashboard: check-ins verified by live photo and GPS, offline-ready for the field, and analytics that show who is on site, who is late, and who never checked out. From pharmacies and colleges to logistics and field teams, we deploy fast, scale by branch, and measure performance across our client network.
        </p>
      </PageHero>

      <section className="panel py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MetricStrip metrics={metrics} />
        </div>
      </section>

      <Section aria-labelledby="team-heading">
        <SectionHeading id="team-heading" eyebrow="Leadership" title="The team" />
        <ul data-reveal-stagger className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {team.map((m, i) => (
            // The founder gets the first row to themselves on mobile; the other four fill two even rows.
            <li key={m.name} className={i === 0 ? "col-span-2 mx-auto w-[72%] text-center sm:col-span-1 sm:mx-0 sm:w-auto sm:text-left" : undefined}>
              {m.photo ? (
                <Image src={m.photo} alt={m.name} width={400} height={400} sizes={i === 0 ? "(min-width: 1024px) 220px, (min-width: 640px) 30vw, 70vw" : "(min-width: 1024px) 220px, 45vw"} className="aspect-square w-full rounded-2xl object-cover" />
              ) : (
                <div role="img" aria-label={`${m.name} (photo coming soon)`} className="flex aspect-square w-full items-center justify-center rounded-2xl bg-brand-100">
                  <span aria-hidden className="font-display text-[clamp(2rem,4vw,3rem)] font-light tracking-[-0.03em] text-brand-600">
                    {m.name.split(" ").filter((_, i, a) => i === 0 || i === a.length - 1).map((w) => w[0]).join("")}
                  </span>
                </div>
              )}
              <p className="mt-4 font-semibold leading-snug">{m.name}</p>
              <p className="text-[0.9375rem] text-ink-muted">{m.role}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="elevated" aria-labelledby="where-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading id="where-heading" eyebrow="Where we are" title="Built in Accra, for Africa and the world" lead="Our team is in Accra, and every client portal runs on our secure cloud infrastructure, so we can deploy for organisations wherever their staff carry a phone." />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">Contact us</Link>
              <Link href="/legal/privacy#dpc-certification" className="btn btn-ghost">DPC certification</Link>
            </div>
          </div>
          <div className="card p-6">
            <Image src="/trust/dpc-certificate.png" alt="Ghana Data Protection Commission registration certificate for VeriTrack Systems" width={962} height={1360} sizes="(min-width: 1024px) 30vw, 80vw" className="mx-auto h-auto w-full max-w-xs rounded-lg" />
            <p className="mt-4 text-center text-[0.9375rem] text-ink-muted">Registered with Ghana&apos;s Data Protection Commission under the Data Protection Act, 2012 (Act 843).</p>
          </div>
        </div>
      </Section>
    </>
  );
}
