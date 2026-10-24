import type { MetadataRoute } from "next";
import { sectors } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

const routes = [
  "",
  "/platform",
  "/solutions",
  ...sectors.map((s) => `/solutions/${s.slug}`),
  "/awards",
  "/awards/methodology",
  "/pricing",
  "/partners",
  "/company",
  "/demo",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
  "/legal/partner-terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${siteConfig.url}${r}`,
    changeFrequency: r.startsWith("/legal") ? "yearly" : "monthly",
    priority: r === "" ? 1 : r.startsWith("/legal") ? 0.3 : 0.7,
  }));
}
