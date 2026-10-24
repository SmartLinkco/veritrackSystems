import Image from "next/image";
import Link from "next/link";
import { Container, Panel } from "@/components/layout/Section";
import { GeofenceRecord } from "@/components/home/GeofenceRecord";
import { QuoteBlocks } from "@/components/home/QuoteBlocks";
import { PlanIndex } from "@/components/home/PlanIndex";
import { FirstStep } from "@/components/home/FirstStep";
import { TourButton } from "@/components/product/TourButton";
import { CommandFrame, PhoneFrame } from "@/components/product/CommandFrame";
import { BackgroundVideo } from "@/components/media/BackgroundVideo";
import { FilmButton, FilmGallery } from "@/components/media/Films";
import { PinnedStory, type StoryStep } from "@/components/marketing/PinnedStory";
import { StageTracker } from "@/components/marketing/StageTracker";
import { faqs, performanceWeights, sectors, testimonials } from "@/lib/content";
import { films, sectorFilms } from "@/lib/media";
import { siteConfig, worldCredits } from "@/lib/site-config";
import { getSiteMetrics } from "@/lib/site-metrics";
import { TRIAL_DAYS } from "@/lib/pricing";

const reveal = (i: number) => ({ "data-reveal": "", style: { "--i": i } as React.CSSProperties });
const enter = (i: number) => ({ "data-enter": "", style: { "--i": i } as React.CSSProperties });

const specimens = [
  { src: "/product/crops/rate.jpg", w: 1100, h: 337, name: "Daily attendance rate", fact: "Thirty days of the attendance rate, day by day, for every branch in scope.", field: "bg-brand-600" },
  { src: "/product/crops/ranking.jpg", w: 1600, h: 546, name: "Performance ranking", fact: "Organisations ranked on the weighted score that also decides VGBA.", field: "bg-brand-100", wide: true },
  { src: "/product/crops/late.jpg", w: 1100, h: 334, name: "Late arrivals", fact: "Late check-ins per day, so a bad week shows up before payroll does.", field: "bg-brand-100" },
  { src: "/product/crops/hours.jpg", w: 1100, h: 334, name: "Arrival hours", fact: "When people really arrive and leave, hour by hour.", field: "bg-command-surface" },
  { src: "/product/crops/branch.jpg", w: 1100, h: 337, name: "By branch", fact: "Check-ins per branch side by side. Client names are blurred here.", field: "bg-brand-600" },
];

const stages = [
  { label: "Ten minutes", detail: "Tell us your branches, shifts and who should see the reports." },
  { label: "Thirty minutes", detail: "One call to confirm locations and what your dashboard tracks." },
  { label: "A few days", detail: "We build your branded portal, pin every branch and test it with you." },
  { label: `${TRIAL_DAYS}-day trial`, detail: "Staff go live on their own phones. You judge it on real data before you pay." },
];

const sectorWords: Record<string, { before: string; word: string }> = {
  pharmacy: { before: "in", word: "pharmacies" },
  education: { before: "on", word: "campuses" },
  logistics: { before: "with", word: "delivery fleets" },
  corporate: { before: "in", word: "head offices" },
  security: { before: "at", word: "guarded sites" },
  events: { before: "and at", word: "conference halls" },
};

const sectorPhoto = (slug: string) => worldCredits.find((c) => c.key === slug)?.src ?? (slug === "security" ? films.SGO8I0AXpQ4.poster : undefined);

const story: StoryStep[] = [
  {
    key: "verify",
    title: "Only the real person can check in",
    body: <p>Staff check in on their own phone with a live photo. Liveness detection rejects a held-up picture, so nobody can sign in for an absent colleague.</p>,
    cta: { href: "/platform#verify", label: "The staff portal" },
    media: (
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:aspect-[5/4]">
        <BackgroundVideo clip="selfie-checkin" scrim="dark" />
        <PhoneFrame
          image={{ src: "/product/staff-portal.png", alt: "VeriTrack staff portal on a phone: Staff ID field, Check-In and Check-Out buttons, and the before-you-begin checklist", width: 828, height: 1792 }}
          className="absolute bottom-[-18%] right-[8%] w-[38%] max-w-[15rem]"
        />
      </div>
    ),
  },
  {
    key: "geofence",
    title: "Only at the branch, only on time",
    body: <p>A check-in counts only when the face, the place and the time agree. Try it: drag the photo pin outside the 50 m ring and watch it get refused.</p>,
    media: (
      <div className="flex aspect-[4/5] items-center justify-center rounded-[1.5rem] bg-frame p-4 sm:aspect-[5/4] sm:p-10">
        <GeofenceRecord />
      </div>
    ),
  },
  {
    key: "monitor",
    title: "You see every branch without visiting",
    body: <p>Who is in, who is late and who left without checking out, for every branch, as it happens. No more calling round each morning.</p>,
    cta: { href: "/platform#monitor", label: "The admin dashboard" },
    media: (
      <div className="rounded-[1.5rem] bg-brand-100 p-4 sm:p-8">
        <CommandFrame
          title="Admin dashboard · Analytics"
          image={{ src: "/product/dashboard.jpg", alt: "VeriTrack attendance analytics dashboard with daily attendance rate, late arrivals and by-branch charts", width: 2880, height: 1640 }}
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
    ),
  },
  {
    key: "report",
    title: "Payroll gets numbers it can trust",
    body: <p>Days present, days absent and hours worked per person, emailed every week and month. Pay for the hours that were worked, with the evidence behind each one.</p>,
    cta: { href: "/pricing", label: "See the plans" },
    media: (
      <div className="flex items-start justify-center gap-5 rounded-[1.5rem] bg-command-surface px-6 py-8 sm:py-10">
        <PhoneFrame image={{ src: "/product/admin-weekly.png", alt: "Weekly Attendance Summary email with days present, days absent and total hours per staff member", width: 828, height: 1792 }} className="w-[62%] max-w-[15rem] sm:w-[42%]" />
        <PhoneFrame image={{ src: "/product/admin-monthly.png", alt: "Monthly Attendance Summary email", width: 828, height: 1792 }} className="mt-10 hidden w-[42%] max-w-[15rem] sm:block" />
      </div>
    ),
  },
];

export default async function HomePage() {
  const [sectorsCovered, branches, checkins] = await getSiteMetrics();

  return (
    <>
      {/* Hero: footage of Accra under the brand blue, and the promise in large light type. */}
      <section aria-labelledby="hero-heading" className="bleed on-frame relative -mt-18 flex min-h-[max(40rem,100svh)] flex-col overflow-hidden bg-frame pt-18">
        <BackgroundVideo clip="accra-square" blur priority controlClassName="bottom-6 right-6" />
        <Container className="relative flex flex-1 flex-col justify-center py-16 lg:py-20">
          <h1 id="hero-heading" {...enter(0)} className="max-w-[15ch] text-[clamp(2.75rem,1rem+5.6vw,6.75rem)] font-light leading-[0.98] tracking-[-0.045em]">
            Stop paying for hours nobody worked.
          </h1>
          <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12">
            <div className="lg:col-span-7 lg:col-start-4">
              <p {...enter(1)} className="text-muted-frame max-w-[40ch] text-lg sm:text-xl">
                VeriTrack proves who was at work, where and when, with a live photo and GPS at every branch. Payroll, managers and clients finally see the same evidence.
              </p>
              <div {...enter(2)} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                {/* Below lg the header has no room for "Request a portal", so it leads here and the walkthrough steps back to glass. */}
                <Link href="/contact?intent=deploy" className="btn btn-primary btn-arrow lg:hidden">Request a portal</Link>
                <Link href="/demo#book" className="btn btn-glass btn-arrow lg:bg-signal lg:text-ink lg:hover:bg-signal-deep">Book a walkthrough</Link>
                <FilmButton id="K8QZyf5AAkM" className="btn-glass">Watch the 60-second demo</FilmButton>
              </div>
              <ul {...enter(3)} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] text-white/80">
                {[`${TRIAL_DAYS}-day trial`, "No hardware to buy", "DPC certified", "Live in days"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
        {/* Extra bottom room on mobile keeps the Pause control clear of the figures; from lg up they stop short of it. */}
        <Container className="relative pb-20 lg:pb-8">
          <dl {...enter(3)} className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6 text-white sm:max-w-2xl">
            {[sectorsCovered, branches, checkins].map((m) => (
              <div key={m.label}>
                <dt className="text-[0.875rem] text-white/70">{m.label}</dt>
                <dd className="tnum order-first font-display text-[clamp(1.5rem,3vw,2.25rem)] font-light tracking-[-0.03em]">
                  {m.value.toLocaleString("en-GB")}
                  {m.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* The problem, in their terms: what the sign-in book is costing them today. */}
      <section aria-labelledby="problem-heading" className="bleed on-frame relative mt-3 overflow-hidden bg-frame-deep">
        <BackgroundVideo clip="register" blur />
        <Container className="relative grid gap-12 py-24 lg:grid-cols-12 lg:items-end lg:py-32">
          <div className="lg:col-span-6">
            <p {...reveal(0)} className="text-[0.9375rem] font-semibold text-white/80">The sign-in book</p>
            <h2 id="problem-heading" {...reveal(1)} className="mt-4 text-[clamp(2.25rem,4.6vw,4.25rem)] font-light leading-[1.04] tracking-[-0.04em]">
              A register only proves someone held the pen.
            </h2>
          </div>
          <ul className="grid gap-5 lg:col-span-5 lg:col-start-8">
            {[
              ["Colleagues sign in for each other", "and you pay for a shift nobody worked."],
              ["Late arrivals get written down as on time", "because nobody checks the clock against the book."],
              ["Managers spend mornings chasing records", "instead of running the branch."],
              ["Every dispute is your word against theirs", "with clients, with staff, with payroll."],
            ].map(([lead, rest], i) => (
              <li key={lead} {...reveal(i + 1)} className="border-t border-white/20 pt-4 text-lg">
                <strong className="font-semibold text-white">{lead}</strong> <span className="text-white/75">{rest}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* How it works: the record, step by step, with the media swapping as you scroll. */}
      <Panel aria-labelledby="how-heading" className="py-20 sm:py-28">
        <Container>
          <div className="max-w-3xl">
            <p {...reveal(0)} className="text-[0.9375rem] font-semibold text-brand-600">How VeriTrack fixes it</p>
            <h2 id="how-heading" {...reveal(1)} className="mt-4 text-[clamp(2.25rem,4.4vw,4rem)] font-light leading-[1.05] tracking-[-0.035em]">
              Every check-in becomes <span className="text-brand-500">evidence</span> you can pay against.
            </h2>
          </div>
          <div className="mt-16 border-t border-border pt-4">
            <PinnedStory steps={story} />
          </div>
        </Container>
      </Panel>

      {/* Full-bleed break: the 60-second film. */}
      <section aria-labelledby="film-heading" className="bleed on-frame relative mt-3 overflow-hidden bg-frame-deep">
        <BackgroundVideo clip="laptop" blur />
        <Container className="relative flex min-h-[min(46rem,90svh)] flex-col justify-center py-24">
          <h2 id="film-heading" {...reveal(0)} className="max-w-[16ch] text-[clamp(2.5rem,5.4vw,5rem)] font-light leading-[1.02] tracking-[-0.04em]">
            See the whole thing in sixty seconds.
          </h2>
          <p {...reveal(1)} className="text-muted-frame mt-6 max-w-[44ch] text-lg sm:text-xl">
            A new staff member is registered, checks in at a branch, and lands in the weekly report. No sales call needed to watch it.
          </p>
          <div {...reveal(2)} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <FilmButton id="K8QZyf5AAkM" className="btn-primary">Watch the full demo</FilmButton>
            <TourButton className="text-link">or take the interactive tour</TourButton>
          </div>
        </Container>
      </section>

      {/* Proof: the real figures, written as a sentence, beside the real network map. */}
      <Panel aria-labelledby="proof-heading" className="py-24 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <h2 id="proof-heading" {...reveal(0)} className="text-display font-light tracking-[-0.035em]">Already running across Ghana</h2>
            <p {...reveal(1)} className="mt-8 max-w-[34ch] font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-light leading-[1.22] tracking-[-0.02em]">
              <strong className="whitespace-nowrap font-medium text-brand-600">{branches.value}+ branches</strong> across{" "}
              <strong className="whitespace-nowrap font-medium text-brand-600">{sectorsCovered.value}+ sectors</strong> run on VeriTrack, with more than{" "}
              <strong className="whitespace-nowrap font-medium text-brand-600">{checkins.value.toLocaleString("en-GB")} check-ins</strong> verified.
            </p>
            <p {...reveal(2)} className="mt-6 max-w-[44ch] text-lg text-ink-muted">
              Each green point is a branch where attendance is now verified, not assumed. VeriTrack is approved and certified by Ghana&apos;s Data Protection Commission.
            </p>
          </div>
          <figure {...reveal(2)} className="lg:col-span-5 lg:col-start-8">
            <div className="mx-auto aspect-square w-full max-w-[34rem] overflow-hidden rounded-full">
              <Image src="/product/crops/map.jpg" alt="VeriTrack super-admin map of Greater Accra with active geofenced branches shown as green points" width={900} height={900} sizes="(min-width: 1024px) 34rem, 90vw" className="h-full w-full object-cover" />
            </div>
            <figcaption className="mt-5 text-center text-[0.9375rem] text-ink-muted">The super-admin map, Greater Accra, May 2026.</figcaption>
          </figure>
        </Container>
      </Panel>

      {/* Films: one question per sector, each answered in under two minutes. */}
      <Panel tone="elevated" aria-labelledby="films-heading" className="py-24 lg:py-28">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h2 id="films-heading" {...reveal(0)} className="text-[clamp(2.25rem,3.6vw,3.25rem)] font-light leading-[1.05] tracking-[-0.035em] lg:col-span-7">
              The question you are already asking
            </h2>
            <p {...reveal(1)} className="max-w-[40ch] text-lg text-ink-muted lg:col-span-4 lg:col-start-9">
              Were the guards on post? Did the class start? Did the rep visit the outlet? Each film shows how VeriTrack answers it with proof.
            </p>
          </div>
          <FilmGallery ids={sectorFilms} className="mt-14 lg:grid-cols-4 lg:gap-6" />
        </Container>
      </Panel>

      {/* The dashboard, as specimens on colour tiles. */}
      <Panel aria-labelledby="specimens-heading" className="py-24 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="specimens-heading" {...reveal(0)} className="text-[clamp(2.25rem,3.2vw,2.75rem)] font-light leading-[1.05] tracking-[-0.035em]">Reports nobody has to build</h2>
            <p {...reveal(1)} className="mt-6 max-w-[30ch] text-lg text-ink-muted">
              Real captures from the live dashboard. Attendance, lateness and arrival times per branch, ready every morning without a spreadsheet.
            </p>
            <Link href="/platform" className="btn btn-navy btn-arrow mt-8" {...reveal(2)}>See the whole platform</Link>
          </div>
          <ul className="grid grid-cols-2 gap-x-2.5 gap-y-8 sm:grid-cols-3 lg:col-span-8">
            {[specimens[1], specimens[0], specimens[2], specimens[3], specimens[4]].map((s, i) => (
              <li key={s.src} {...reveal(i)} className={s.wide ? "col-span-2" : ""}>
                <div className={`relative overflow-hidden rounded-[1.25rem] ${s.field} ${s.wide ? "aspect-[8/5]" : "aspect-[4/5]"}`}>
                  <Image
                    src={s.src}
                    alt={`${s.name}: a capture from the VeriTrack dashboard`}
                    width={s.w}
                    height={s.h}
                    sizes={s.wide ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                    className={`absolute rounded-xl ${s.wide ? "inset-x-[5%] top-1/2 h-auto w-[90%] -translate-y-1/2" : "inset-[12%] h-[76%] w-[76%] object-cover object-left"}`}
                  />
                </div>
                <h3 className="mt-4 text-[1.375rem] font-medium tracking-[-0.015em]">{s.name}</h3>
                <p className="mt-1 text-[0.9375rem] text-ink-muted">{s.fact}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Panel>

      {/* Six sectors, said as one sentence with their places in it. */}
      <Panel tone="elevated" aria-labelledby="sectors-heading" className="py-24 lg:py-36">
        <Container>
          <h2 id="sectors-heading" {...reveal(0)} className="text-center text-display font-light tracking-[-0.035em]">Six sectors, one record</h2>
          <p {...reveal(1)} className="mx-auto mt-10 max-w-[36ch] text-left font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-light leading-[1.4] tracking-[-0.02em] sm:text-center">
            Running today{" "}
            {sectors.map((s, i) => {
              const w = sectorWords[s.slug];
              const photo = sectorPhoto(s.slug);
              return (
                <span key={s.slug}>
                  {w.before}{" "}
                  <Link href={`/solutions/${s.slug}`} className="group whitespace-nowrap text-brand-600 underline decoration-2 underline-offset-[0.2em] hover:text-brand-700">
                    {photo && (
                      <span className="mx-[0.12em] inline-block h-[1.2em] w-[1.2em] overflow-hidden rounded-full align-[-0.25em] transition-transform duration-300 group-hover:scale-125">
                        <Image src={photo} alt="" width={96} height={96} sizes="48px" className="h-full w-full object-cover" />
                      </span>
                    )}
                    {w.word}
                  </Link>
                  {i < sectors.length - 1 ? ", " : " across Ghana."}
                </span>
              );
            })}
          </p>
        </Container>
      </Panel>

      {/* Deployment, as a tracker: each stage ticks off in order. */}
      <Panel aria-labelledby="deploy-heading" className="py-24 lg:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <h2 id="deploy-heading" {...reveal(0)} className="text-[clamp(2.25rem,3.6vw,3.25rem)] font-light leading-[1.05] tracking-[-0.035em]">Live in days, judged on your own data</h2>
            <p {...reveal(1)} className="mt-6 max-w-[34ch] text-lg text-ink-muted">No hardware, no long project. A one-time GHS 500 setup, then a {TRIAL_DAYS}-day trial so you see the results before you commit.</p>
            <div {...reveal(2)} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/contact?intent=deploy" className="btn btn-navy btn-arrow">Request your portal</Link>
            </div>
          </div>
          <div className="lg:col-span-8">
            <StageTracker stages={stages} />
          </div>
        </Container>
      </Panel>

      {/* Customers. */}
      <Panel aria-labelledby="quotes-heading" className="p-3 sm:p-4">
        <QuoteBlocks items={testimonials} />
      </Panel>

      {/* VGBA: the score made public. */}
      <Panel tone="command" aria-labelledby="award-heading" className="py-24 lg:py-28">
        <Container className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <h2 id="award-heading" {...reveal(0)} className="text-display font-light tracking-[-0.035em]">The score behind VGBA</h2>
            <p {...reveal(1)} className="mt-6 max-w-[46ch] text-lg text-command-muted">
              Every organisation on VeriTrack gets a Performance Score from 0 to 100, from four measures its dashboard already tracks. The best are recognised at the VeriTrack Global Business Awards, {siteConfig.vgba.editionYear} edition.
            </p>
            <ul className="ring-list mt-10 grid gap-4">
              {performanceWeights.map((w, i) => (
                <li key={w.key} {...reveal(i + 2)} className="flex items-baseline gap-4 text-lg">
                  <span className="tnum w-[4.5rem] shrink-0 font-display text-[2.25rem] font-light leading-none tracking-[-0.03em] text-command-text">{w.weight}%</span>
                  <span className="text-command-text">{w.label}</span>
                </li>
              ))}
            </ul>
            <div {...reveal(6)} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/awards" className="btn btn-ghost btn-arrow">How VGBA works</Link>
              <Link href="/awards/methodology" className="text-link">Read the methodology</Link>
            </div>
          </div>
          <div {...reveal(2)} className="lg:col-span-5 lg:col-start-8">
            <div className="mx-auto aspect-square w-full max-w-[32rem] overflow-hidden rounded-full">
              <Image src="/awards/vgba.jpg" alt="VeriTrack Global Business Awards key visual" width={1534} height={1025} sizes="(min-width: 1024px) 32rem, 90vw" className="drift h-full w-full object-cover object-[94%_50%]" />
            </div>
          </div>
        </Container>
      </Panel>

      {/* Pricing: plan names, one live figure. */}
      <Panel aria-labelledby="pricing-heading" className="py-24 lg:py-32">
        <Container>
          <PlanIndex />
        </Container>
      </Panel>

      {/* FAQ: filled tiles, one open at a time. */}
      <Panel tone="elevated" aria-labelledby="faq-heading" className="py-24 lg:py-28">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h2 id="faq-heading" {...reveal(0)} className="text-[clamp(2.25rem,3.2vw,2.75rem)] font-light leading-[1.05] tracking-[-0.035em]">Questions buyers ask first</h2>
              <p {...reveal(1)} className="mt-6 text-lg">
                Anything else: <a href={`mailto:${siteConfig.contact.email}`} className="text-link">{siteConfig.contact.email}</a> or{" "}
                <a href={siteConfig.contact.phoneHref} className="text-link whitespace-nowrap">{siteConfig.contact.phone}</a>.
              </p>
            </div>
          </div>
          <div className="grid gap-2 lg:col-span-8">
            {faqs.map((f, i) => (
              <details key={f.q} name="faq" className="faq-tile group rounded-[1.25rem] bg-white transition-colors duration-200" {...(i === 0 ? { open: true } : {})}>
                <summary className="flex min-h-[4.5rem] cursor-pointer list-none items-center justify-between gap-6 px-6 py-4 text-[1.375rem] font-semibold">
                  {f.q}
                  <span aria-hidden className="faq-plus" />
                </summary>
                <p className="max-w-[52ch] px-6 pb-6 text-lg">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Panel>

      {/* Close: the first step, already open. */}
      <section aria-labelledby="start-heading" className="bleed on-frame relative mt-3 overflow-hidden bg-frame">
        <BackgroundVideo clip="office-checkin" blur />
        <Container className="relative grid min-h-[max(40rem,88svh)] gap-12 py-20 lg:grid-cols-12 lg:items-center">
          <div className="self-end lg:col-span-6 lg:pb-6">
            <h2 id="start-heading" {...reveal(0)} className="max-w-[14ch] text-[clamp(2.5rem,1rem+4.6vw,5.5rem)] font-light leading-[0.98] tracking-[-0.045em]">Know who showed up, starting this week.</h2>
            <p {...reveal(1)} className="text-muted-frame mt-6 max-w-[38ch] text-lg">
              Every week on paper is another payroll run on trust. We reply within 24 hours, confirm your branches on a 30-minute call, and your portal is usually live within days.
            </p>
          </div>
          <div {...reveal(2)} className="flex lg:col-span-5 lg:col-start-8 lg:justify-end">
            <FirstStep />
          </div>
        </Container>
      </section>
    </>
  );
}
