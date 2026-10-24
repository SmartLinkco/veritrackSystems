import type { Metadata } from "next";
import Link from "next/link";
import { Container, Panel, Section } from "@/components/layout/Section";
import { PageHero } from "@/components/marketing/Bands";
import { FilmFacade, FilmGallery } from "@/components/media/Films";
import { sectorFilms } from "@/lib/media";
import { CommandFrame, PhoneFrame } from "@/components/product/CommandFrame";
import { TourButton } from "@/components/product/TourButton";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Live demo",
  description: "Take the interactive VeriTrack tour, request demo portal access, or book a live walkthrough of the staff portal and admin dashboard.",
  alternates: { canonical: "/demo" },
};

export default function DemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Product theatre"
        title="See VeriTrack work, end to end."
        lead="Watch the sixty-second film, take the two-minute interactive tour, request a demo portal, or book a live walkthrough with our team."
        aside={<FilmFacade id="K8QZyf5AAkM" priority sizes="(min-width: 1024px) 45vw, 100vw" className="shadow-[0_40px_80px_-30px_rgb(7_11_18/0.6)]" />}
      >
        <div className="flex flex-wrap gap-3">
          <TourButton className="btn btn-primary btn-arrow">Start the interactive tour</TourButton>
          <a href="#book" className="btn btn-ghost">Book a walkthrough</a>
        </div>
      </PageHero>

      <Panel tone="elevated" aria-labelledby="films-heading" className="py-20 sm:py-24">
        <Container>
          <h2 id="films-heading" className="max-w-2xl text-[clamp(2rem,3.4vw,3rem)] font-light leading-[1.05] tracking-[-0.035em]">Films by sector</h2>
          <FilmGallery ids={sectorFilms} className="mt-12 lg:grid-cols-4 lg:gap-6" />
        </Container>
      </Panel>

      <Section aria-labelledby="sides-heading">
        <h2 id="sides-heading" className="text-[clamp(2rem,3.4vw,3rem)] font-light leading-[1.05] tracking-[-0.035em]">The portal and the dashboard, side by side</h2>
        <div data-reveal-stagger className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_2.2fr]">
          <div>
            <p className="mb-4 text-[0.9375rem] font-semibold text-ink-muted">Staff side · Check-in confirmation</p>
            <PhoneFrame image={{ src: "/product/portal-checkin.png", alt: "Check-in confirmation on a staff phone", width: 828, height: 1792 }} className="mx-auto w-56" />
          </div>
          <div>
            <p className="mb-4 text-[0.9375rem] font-semibold text-ink-muted">Admin side · Analytics dashboard</p>
            <CommandFrame image={{ src: "/product/dashboard.jpg", alt: "Admin analytics dashboard", width: 2880, height: 1640 }} sizes="(min-width: 1024px) 60vw, 100vw" />
          </div>
        </div>
      </Section>

      <Section aria-labelledby="access-heading">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">Demo portal access</p>
            <h2 id="access-heading" className="mt-3 text-3xl sm:text-4xl">Try it with a demo account</h2>
            <p className="mt-4 text-ink-muted">Fill in the short form and we&apos;ll send credentials for the demo portal, so you can check in from your own phone and watch it land on the dashboard.</p>
          </div>
          <div className="card overflow-hidden">
            <iframe
              src={siteConfig.demoFormUrl}
              title="Demo access request form"
              loading="lazy"
              className="h-[46rem] w-full"
            />
          </div>
        </div>
      </Section>

      <Section id="book" tone="elevated" aria-labelledby="book-heading">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Live walkthrough</p>
          <h2 id="book-heading" className="mt-3 text-3xl sm:text-4xl">Book 30 minutes with our team</h2>
          <p className="mt-4 text-ink-muted">We&apos;ll walk through the staff portal, your admin dashboard, and the network view for your sector.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={siteConfig.calUrl} target="_blank" rel="noopener" className="btn btn-primary btn-arrow">Choose a time</a>
            <Link href="/contact?intent=deploy" className="btn btn-ghost">Skip to deployment</Link>
          </div>
        </div>
      </Section>
    </>
  );
}
