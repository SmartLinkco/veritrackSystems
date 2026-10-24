import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

// Legacy static URLs → V2 routes (blueprint §3.1, cutover plan §13). Permanent so search rankings carry over.
const legacyRedirects: [string, string][] = [
  ["/index.html", "/"],
  ["/platform.html", "/platform"],
  ["/vgba.html", "/awards"],
  ["/pricing-calculator.html", "/pricing#estimator"],
  ["/get-started.html", "/contact?intent=deploy"],
  ["/demo.html", "/demo"],
  ["/agent.html", "/partners"],
  ["/agentsTCs.html", "/legal/partner-terms"],
  ["/privacyPolicy.html", "/legal/privacy"],
  ["/termsAndConditions.html", "/legal/terms"],
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
