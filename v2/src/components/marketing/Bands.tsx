import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Container } from "@/components/layout/Section";
import { BackgroundVideo } from "@/components/media/BackgroundVideo";
import { deploySteps, sectors } from "@/lib/content";
import { SETUP_FEE_GHS, TRIAL_DAYS, formatGHS } from "@/lib/pricing";
import { films, sectorMedia, type LoopKey } from "@/lib/media";
import { worldCredits } from "@/lib/site-config";

/**
 * Page hero on the blue frame. It runs up under the floating header; footage (when given) is tinted
 * blue and soft-focused so the large light headline stays the subject.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  aside,
  clip,
  tone = "default",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
  aside?: React.ReactNode;
  clip?: LoopKey;
  tone?: "default" | "command";
}) {
  return (
    <section className={clsx("bleed on-frame relative -mt-18 overflow-hidden pt-18", tone === "command" ? "theme-command" : "bg-frame")}>
      {clip ? (
        <BackgroundVideo clip={clip} blur priority />
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-40 h-[38rem] w-[38rem] rounded-full bg-brand-400/35 blur-3xl" />
          <div className="absolute -bottom-48 left-[10%] h-[30rem] w-[30rem] rounded-full bg-frame-deep/80 blur-3xl" />
        </div>
      )}
      <Container className={clsx("relative py-16 sm:py-24 lg:py-28", aside && "grid gap-12 lg:grid-cols-12 lg:items-center")}>
        <div data-enter-stagger className={aside ? "lg:col-span-6" : undefined}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-display font-light tracking-[-0.035em]">{title}</h1>
          {lead && <p className="text-muted-frame mt-6 max-w-2xl text-lg sm:text-xl">{lead}</p>}
          {children && <div className="mt-9">{children}</div>}
        </div>
        {aside && (
          <div data-enter className="lg:col-span-6" style={{ "--i": 3 } as React.CSSProperties}>
            {aside}
          </div>
        )}
      </Container>
    </section>
  );
}

export function DeployBand() {
  return (
    <section className="panel theme-command mt-3 py-20">
      <Container>
        <div className="rounded-3xl border border-signal/40 bg-command-surface p-8 shadow-[0_0_0_1px_var(--color-signal-dim)] sm:p-12">
          <div data-reveal-stagger className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <div>
              <p className="eyebrow">Get started</p>
              <h2 className="mt-3 text-3xl sm:text-4xl">Deploy your VeriTrack portal</h2>
              <p className="mt-4 text-command-muted">
                Tell us your branches, headcount, and sector. We configure your branded portal, admin dashboard, geofenced locations, and reporting, typically within days, not months.
              </p>
              <p className="mt-4 font-mono text-sm text-command-text">
                {formatGHS(SETUP_FEE_GHS)} one-time setup · {TRIAL_DAYS}-day trial on subscription
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/contact?intent=deploy" className="btn btn-primary">Start your deployment</Link>
                <Link href="/pricing#estimator" className="btn btn-ghost">Estimate your plan</Link>
              </div>
            </div>
            <ol data-reveal-stagger className="grid gap-4 sm:grid-cols-2">
              {deploySteps.map((s, i) => (
                <li key={s.title} className="rounded-2xl border border-command-border p-5">
                  <span className="font-mono text-sm text-signal">0{i + 1}</span>
                  <h3 className="mt-2 text-lg">{s.title}</h3>
                  <p className="mt-1 text-[0.9375rem] text-command-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function SectorGrid() {
  return (
    <ul data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sectors.map((s) => {
        const photo = worldCredits.find((c) => c.key === s.slug)?.src ?? films[sectorMedia[s.slug].film ?? "K8QZyf5AAkM"].poster;
        return (
          <li key={s.slug}>
            <Link href={`/solutions/${s.slug}`} className="card group flex h-full flex-col overflow-hidden bg-white">
              <span className="relative block aspect-[16/10] overflow-hidden">
                <Image src={photo} alt="" fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover transition-[scale] duration-700 ease-out group-hover:scale-[1.04]" />
              </span>
              <span className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-medium leading-snug tracking-[-0.01em]">{s.name}</h3>
                <span className="mt-2 flex-1 text-[0.9375rem] text-ink-muted">{s.pitch}</span>
                <span className="mt-5 text-[0.9375rem] font-semibold text-brand-500">Explore <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span></span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

const iconPaths: Record<string, string> = {
  pharmacy: "M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z",
  education: "M12 3 1 9l11 6 9-4.9V17h2V9zM5 13.2v4L12 21l7-3.8v-4L12 17z",
  logistics: "M3 6h11v9H3zM14 9h4l3 3v3h-7zM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  corporate: "M4 21V5l8-3 8 3v16h-6v-5h-4v5zm4-13h2v2H8zm6 0h2v2h-2zm-6 4h2v2H8zm6 0h2v2h-2z",
  security: "M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5zm-1.2 13.6L7.4 12.2l1.4-1.4 2 2 4.4-4.4 1.4 1.4z",
  events: "M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zM5 9h14v11H5zm6 2v3H8v2h3v3h2v-3h3v-2h-3v-3z",
};

export function SectorIcon({ slug }: { slug: string }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600" aria-hidden>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd">
        <path d={iconPaths[slug]} />
      </svg>
    </span>
  );
}
