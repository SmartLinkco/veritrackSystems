// Cuts the site's background loops (public/media/loops) from source footage.
// Needs an ffmpeg binary:  FFMPEG=/path/to/ffmpeg node scripts/build-media.mjs [key ...]
// Sources: the VeriTrack commercial (repo images/) and any stock clips saved to media-src/<key>.mp4.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, "public/media/loops");
const commercial = path.join(root, "../images/VeriTrack Commercials.mp4");
const stock = (key) => path.join(root, "media-src", `${key}.mp4`);
const ffmpeg = process.env.FFMPEG || "ffmpeg";

// start/duration in seconds of the source; speed < 1 slows short handheld shots into calm loops.
const clips = [
  { key: "register", src: commercial, start: 9.2, duration: 6.5 },
  { key: "office-checkin", src: commercial, start: 28.0, duration: 3.6, speed: 0.6 },
  { key: "laptop", src: commercial, start: 48.8, duration: 2.1, speed: 0.5 },
  { key: "event-hall", src: commercial, start: 54.6, duration: 6 },
  // Pexels clips (free licence), downloaded by hand to media-src/. Skipped when absent.
  { key: "accra-square", src: stock("accra-square"), start: 0, duration: 8 }, // pexels.com/video/30444361
  { key: "accra-road", src: stock("accra-road"), start: 0, duration: 8 }, // pexels.com/video/29742817
  { key: "classroom", src: stock("classroom"), start: 0, duration: 8 }, // pexels.com/video/32778876
  { key: "teacher", src: stock("teacher"), start: 0, duration: 7 }, // pexels.com/video/6671805
  { key: "office-team", src: stock("office-team"), start: 0, duration: 8 }, // pexels.com/video/9464653
  { key: "delivery", src: stock("delivery"), start: 0, duration: 7 }, // pexels.com/video/7362605
  { key: "selfie-checkin", src: stock("selfie-checkin"), start: 0, duration: 7 }, // pexels.com/video/4105033
];

const only = process.argv.slice(2);
mkdirSync(out, { recursive: true });

for (const c of clips) {
  if (only.length && !only.includes(c.key)) continue;
  if (!existsSync(c.src)) {
    console.log(`skip ${c.key}: ${path.relative(root, c.src)} not found`);
    continue;
  }
  const speed = c.speed ?? 1;
  const vf = [`setpts=PTS/${speed}`, "scale='min(1280,iw)':-2", "fps=24", "format=yuv420p"].join(",");
  const input = ["-hide_banner", "-loglevel", "error", "-y", "-ss", String(c.start), "-t", String(c.duration), "-i", c.src, "-an"];
  const file = (ext) => path.join(out, `${c.key}.${ext}`);

  execFileSync(ffmpeg, [...input, "-vf", vf, "-c:v", "libx264", "-profile:v", "baseline", "-crf", "28", "-preset", "slow", "-movflags", "+faststart", file("mp4")]);
  execFileSync(ffmpeg, [...input, "-vf", vf, "-c:v", "libvpx-vp9", "-crf", "38", "-b:v", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", file("webm")]);
  execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-i", file("mp4"), "-frames:v", "1", "-q:v", "5", file("jpg")]);

  const kb = (ext) => Math.round(statSync(file(ext)).size / 1024);
  console.log(`${c.key}: mp4 ${kb("mp4")} KB · webm ${kb("webm")} KB · poster ${kb("jpg")} KB`);
}

// Record which loops exist so src/lib/media.ts can fall back to commercial footage for missing stock.
const built = readdirSync(out).filter((f) => f.endsWith(".mp4")).map((f) => f.replace(/\.mp4$/, "")).sort();
writeFileSync(path.join(root, "src/lib/media-manifest.json"), JSON.stringify({ loops: built }, null, 2) + "\n");
console.log(`manifest: ${built.join(", ")}`);
