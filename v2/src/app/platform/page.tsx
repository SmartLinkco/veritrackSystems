import type { Metadata } from "next";
import Link from "next/link";
import { Container, Panel, Section, SectionHeading } from "@/components/layout/Section";
import { BackgroundVideo } from "@/components/media/BackgroundVideo";
import { FilmFacade } from "@/components/media/Films";
import { PinnedStory, type StoryStep } from "@/components/marketing/PinnedStory";
import { PageHero } from "@/components/marketing/Bands";
import { CommandFrame, PhoneFrame } from "@/components/product/CommandFrame";
import { capabilities, pillars } from "@/lib/content";

export const metadata: Metadata = {
  title: "Platform: Portal, Dashboard & Network Intelligence",
  description: "Three layers, one source of truth: photo-verified staff portals, live admin dashboards, and network-wide Performance Scores.",
  alternates: { canonical: "/platform" },
};

const comparison = [
  ["Proof the person was physically on site", false, true],
  ["Same-day view of missing check-ins", false, true],
  ["Works when connectivity drops", true, true],
  ["Consistent records across every branch", false, true],
  ["Reports without manual compilation", false, true],
  ["Benchmark against similar organisations", false, true],
] as const;

const pillarMedia: Record<string, React.ReactNode> = {
  verify: (
    <div className="relative flex aspect-[5/4] items-end justify-center overflow-hidden rounded-[1.5rem]">
      <BackgroundVideo clip="selfie-checkin" scrim="dark" />
      <PhoneFrame image={pillars[0].image} className="relative -mb-24 w-[42%] max-w-[15rem]" />
    </div>
  ),
  monitor: (
    <div className="rounded-[1.5rem] bg-command-bg p-4 sm:p-8">
      <CommandFrame image={pillars[1].image} title="Admin dashboard · Analytics" />
    </div>
  ),
  improve: (
    <div className="rounded-[1.5rem] bg-brand-100 p-4 sm:p-8">
      <CommandFrame image={pillars[2].image} glow title="Super Admin · By company" />
    </div>
  ),
};

const steps: StoryStep[] = pillars.map((p) => ({
  key: p.id,
  anchor: p.id,
  title: `${p.label}: ${p.title}`,
  body: (
    <>
      <p>{p.body}</p>
      <ul className="mt-4 grid gap-2 text-[1.0625rem]">
        {p.capabilities.map((c) => (
          <li key={c} className="flex gap-3">
            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            {c}
          </li>
        ))}
      </ul>
    </>
  ),
  media: pillarMedia[p.id],
}));

export default function PlatformPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="Three layers. One source of truth."
        lead="Verify attendance at the edge, monitor every branch live, and improve with network-wide intelligence. All from one record per check-in."
        clip="laptop"
      >
        <nav aria-label="Platform layers" className="flex flex-wrap gap-2">
          {pillars.map((p) => (
            <a key={p.id} href={`#${p.id}`} className="btn btn-ghost btn-sm">{p.label}: {p.title}</a>
          ))}
        </nav>
      </PageHero>

      <Panel aria-labelledby="layers-heading" className="py-20 sm:py-28">
        <Container>
          <h2 id="layers-heading" className="max-w-3xl text-[clamp(2.25rem,4.4vw,4rem)] font-light leading-[1.05] tracking-[-0.035em]">
            Every check-in is <span className="text-brand-500">verified</span>, watched and measured.
          </h2>
          <div className="mt-16 border-t border-border pt-4">
            <PinnedStory steps={steps} />
          </div>
        </Container>
      </Panel>

      <Section aria-labelledby="capabilities-heading">
        <SectionHeading id="capabilities-heading" eyebrow="Capabilities" title="Built for operations teams" />
        <ul data-reveal-stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <li key={c.title} className="card p-6">
              <h3 className="text-lg">{c.title}</h3>
              <p className="mt-2 text-ink-muted">{c.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="elevated" aria-labelledby="compare-heading">
        <SectionHeading id="compare-heading" eyebrow="Compared" title="Manual registers vs VeriTrack" />
        <div className="card mt-10 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left">
            <thead>
              <tr className="border-b border-border font-mono text-xs uppercase tracking-[0.12em] text-ink-muted">
                <th className="p-4 font-medium">Capability</th>
                <th className="p-4 text-center font-medium">Manual register</th>
                <th className="p-4 text-center font-medium text-brand-600">VeriTrack</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map(([label, manual, vt]) => (
                <tr key={label} className="border-b border-border last:border-0">
                  <td className="p-4">{label}</td>
                  <td className="p-4 text-center">{manual ? <Yes /> : <No />}</td>
                  <td className="p-4 text-center">{vt ? <Yes /> : <No />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div data-reveal-stagger className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            ["Reports", "Included", "Daily, weekly and monthly exports on every plan."],
            ["Payroll", "Optional", "Payroll Sync add-on, or a scoped integration project."],
            ["Events & visitors", "Optional", "Delegate and visitor check-in on the same engine."],
          ].map(([title, badge, body]) => (
            <div key={title} className="card p-6">
              <p className="flex items-center justify-between">
                <span className="font-semibold">{title}</span>
                <span className="rounded-full bg-brand-100 px-2.5 py-0.5 font-mono text-xs text-brand-600">{badge}</span>
              </p>
              <p className="mt-2 text-[0.9375rem] text-ink-muted">{body}</p>
            </div>
          ))}
        </div>

        <div className="card mt-12 flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl">Security &amp; data protection</h3>
            <p className="mt-1 max-w-2xl text-ink-muted">Role-restricted access, data held in your organisation&apos;s controlled Google Workspace stack, and registration with Ghana&apos;s Data Protection Commission.</p>
          </div>
          <Link href="/legal/privacy#dpc-certification" className="btn btn-ghost shrink-0">Read the privacy policy</Link>
        </div>
      </Section>

      <Section aria-labelledby="platform-cta">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <h2 id="platform-cta" className="text-[clamp(2rem,3.4vw,3rem)] font-light leading-[1.05] tracking-[-0.035em]">See all three layers on your own data.</h2>
            <p className="mt-4 text-lg text-ink-muted">Or watch them work together first: registration, check-in, dashboard and report in sixty seconds.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/demo#book" className="btn btn-primary btn-arrow">Book a live walkthrough</Link>
              <Link href="/contact?intent=deploy" className="btn btn-ghost">Start a deployment</Link>
            </div>
          </div>
          <div className="lg:col-span-7">
            <FilmFacade id="K8QZyf5AAkM" />
          </div>
        </div>
      </Section>
    </>
  );
}

function Yes() {
  return <span className="font-semibold text-brand-600" aria-label="Yes">✓</span>;
}
function No() {
  return <span className="text-ink-muted" aria-label="No">–</span>;
}
