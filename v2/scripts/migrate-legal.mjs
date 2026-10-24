// One-off migration: extracts the legal copy from the legacy static pages into
// src/content/legal/*.html so V2 renders the same wording without the legacy markup.
// Re-run after legal text changes on the legacy site: `node scripts/migrate-legal.mjs`
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const legacyRoot = join(here, "..", "..");
const outDir = join(here, "..", "src", "content", "legal");

const pages = [
  { src: "privacyPolicy.html", out: "privacy.html" },
  { src: "termsAndConditions.html", out: "terms.html" },
  { src: "agentsTCs.html", out: "partner-terms.html" },
];

const linkMap = {
  "index.html#platform": "/platform",
  "index.html#solutions": "/solutions",
  "index.html#team": "/company",
  "index.html": "/",
  "agent.html": "/partners",
  "agentsTCs.html": "/legal/partner-terms",
  "demo.html": "/demo",
  "get-started.html": "/contact?intent=deploy",
  "platform.html": "/platform",
  "pricing-calculator.html": "/pricing#estimator",
  "privacyPolicy.html": "/legal/privacy",
  "termsAndConditions.html": "/legal/terms",
  "unsubscribe.html": "/unsubscribe.html",
  "vgba.html": "/awards",
};

function extractBody(html) {
  const open = html.search(/<div[^>]*class="(privacy|terms)-body"[^>]*>/);
  if (open < 0) throw new Error("legal body not found");
  const start = html.indexOf(">", open) + 1;
  // The body div closes right before the section's container closes.
  const end = html.indexOf("</section>", start);
  let inner = html.slice(start, end);
  inner = inner.replace(/\s*<\/div>\s*<\/div>\s*$/, "");
  return inner;
}

function clean(html) {
  return html
    .replace(/\s(style|class|decoding)="[^"]*"/g, "")
    .replace(/<h2[^>]*>[\s\S]*?<\/h2>/, "") // page renders its own title
    .replace(/href="([^"]+)"/g, (m, href) => {
      const [path, hash] = href.split("#");
      if (linkMap[href]) return `href="${linkMap[href]}"`;
      if (linkMap[path]) return `href="${linkMap[path]}${hash ? "#" + hash : ""}"`;
      return m;
    })
    .replace(/src="images\/dpc-certificate\.png"/g, 'src="/trust/dpc-certificate.png"')
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function lastUpdated(html) {
  const m = html.match(/Last updated:<\/span>\s*([^·<]+)/);
  return m ? m[1].trim() : "";
}

mkdirSync(outDir, { recursive: true });
const meta = {};
for (const p of pages) {
  const html = readFileSync(join(legacyRoot, p.src), "utf8");
  writeFileSync(join(outDir, p.out), clean(extractBody(html)) + "\n");
  meta[p.out.replace(".html", "")] = { lastUpdated: lastUpdated(html), source: p.src };
  console.log(`${p.src} -> src/content/legal/${p.out}`);
}
writeFileSync(join(outDir, "meta.json"), JSON.stringify(meta, null, 2) + "\n");
