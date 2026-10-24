import "server-only";
import { cacheLife } from "next/cache";

export type SiteMetric = { value: number; suffix: string; label: string };

// Verified check-ins grow from a counted baseline by a conservative daily rate, so the public figure
// keeps pace with real usage between manual updates. Re-baseline (date + count) whenever the real
// total is counted again. Accra runs on UTC, so UTC dates are local dates.
const CHECKINS_BASELINE = 200_000;
const CHECKINS_BASELINE_DATE = Date.UTC(2026, 9, 24); // 24 Oct 2026
const CHECKINS_PER_WORKING_DAY = 600; // Monday to Saturday; most branches are closed on Sunday
const DAY = 86_400_000;

/** Working days (Mon–Sat) from the baseline date up to, but not including, today. */
function workingDaysSince(from: number, now: number) {
  const days = Math.max(0, Math.floor((now - from) / DAY));
  const fullWeeks = Math.floor(days / 7);
  let count = fullWeeks * 6;
  for (let d = fullWeeks * 7; d < days; d++) {
    if (new Date(from + d * DAY).getUTCDay() !== 0) count++;
  }
  return count;
}

export function verifiedCheckins(now: number) {
  const grown = CHECKINS_BASELINE + workingDaysSince(CHECKINS_BASELINE_DATE, now) * CHECKINS_PER_WORKING_DAY;
  return Math.floor(grown / 100) * 100; // shown as "N+", so never round up
}

/** Headline figures: sectors covered, branches geofenced, verified check-ins (grows daily). */
export async function getSiteMetrics(): Promise<[SiteMetric, SiteMetric, SiteMetric]> {
  "use cache";
  cacheLife("hours");
  return [
    { value: 25, suffix: "+", label: "Sectors covered" },
    { value: 500, suffix: "+", label: "Branches geofenced" },
    { value: verifiedCheckins(Date.now()), suffix: "+", label: "Verified check-ins" },
  ];
}
