import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { Container } from "@/components/layout/Section";
import meta from "@/content/legal/meta.json";

type LegalSlug = keyof typeof meta;

const titles: Record<LegalSlug, { title: string; lead: string }> = {
  privacy: { title: "Privacy Policy", lead: "Data collection, verification, retention, rights, and subprocessors for our workforce platform." },
  terms: { title: "Terms and Conditions", lead: "Service terms for portals, dashboards, subscriptions, VGBA, and multi-tenant operations." },
  "partner-terms": { title: "Partner Terms & Conditions", lead: "Complete terms for the VeriTrack independent partner and referral programme." },
};

export function legalTitle(slug: LegalSlug) {
  return titles[slug];
}

async function getLegalHtml(slug: LegalSlug) {
  "use cache";
  return readFile(path.join(process.cwd(), "src/content/legal", `${slug}.html`), "utf8");
}

/** Renders legal copy migrated verbatim from the legacy site (scripts/migrate-legal.mjs). */
export async function LegalPage({ slug }: { slug: LegalSlug }) {
  const html = await getLegalHtml(slug);
  const { title, lead } = titles[slug];
  const others = (Object.keys(titles) as LegalSlug[]).filter((s) => s !== slug);

  return (
    <>
      <section className="panel panel-elevated">
        <Container className="max-w-4xl py-14 sm:py-20" stagger="enter">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-3 text-display font-light tracking-[-0.035em]">{title}</h1>
          <p className="mt-4 text-lg text-ink-muted">{lead}</p>
          <p className="mt-4 text-[0.9375rem] text-ink-muted">
            Last updated: {meta[slug].lastUpdated} ·{" "}
            {others.map((o, i) => (
              <span key={o}>
                <Link href={`/legal/${o}`} className="underline underline-offset-2">{titles[o].title}</Link>
                {i < others.length - 1 && " · "}
              </span>
            ))}
          </p>
        </Container>
      </section>
      <div className="panel">
        <Container className="max-w-4xl py-12 sm:py-16">
          <article className="legal-prose" dangerouslySetInnerHTML={{ __html: html }} />
        </Container>
      </div>
    </>
  );
}
