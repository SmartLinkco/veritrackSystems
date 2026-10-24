// Ported from the legacy js/pricing-calculator.js. Totals must stay identical for the
// same inputs (blueprint §15 criterion 4) — see pricing.test.ts before changing anything.

export const STAFF_PER_BRANCH = 12;
export const MAX_BRANCHES = 100000;
export const SETUP_FEE_GHS = 500;
export const TRIAL_DAYS = 14;

export type TierKey = "starter" | "growth" | "enterprise";

export type BranchTier = {
  key: TierKey;
  tier: 1 | 2 | 3;
  name: string;
  legacyName: string;
  rate: number;
  range: string;
  minBranches: number;
  maxBranches: number | null;
};

export const BRANCH_TIERS: readonly BranchTier[] = [
  { key: "starter", tier: 1, name: "Starter", legacyName: "Small operations", rate: 450, range: "1–3 branches", minBranches: 1, maxBranches: 3 },
  { key: "growth", tier: 2, name: "Growth", legacyName: "Growing operations", rate: 350, range: "4–9 branches", minBranches: 4, maxBranches: 9 },
  { key: "enterprise", tier: 3, name: "Enterprise", legacyName: "Enterprise operations", rate: 300, range: "10+ branches", minBranches: 10, maxBranches: null },
];

export type ExtraStaffTier = {
  tier: "-" | "A" | "B" | "C";
  label: string;
  rate: number;
  range: string;
};

const EXTRA_STAFF_TIERS: readonly (ExtraStaffTier & { max: number })[] = [
  { tier: "A", label: "Low excess", rate: 10, range: "1–20 extra staff", max: 20 },
  { tier: "B", label: "Moderate excess", rate: 8, range: "21–50 extra staff", max: 50 },
  { tier: "C", label: "High volume", rate: 6, range: "51+ extra staff", max: Infinity },
];

export const ADDONS = {
  leaderboard: { label: "Leaderboard & Recognition", monthly: 20, perStaff: false },
  shift: { label: "Shift Rotation Management", monthly: 30, perStaff: false },
  ai: { label: "AI Productivity Tips", monthly: 30, perStaff: false },
  payroll: { label: "Payroll Sync", monthly: 50, perStaff: false },
  alert: { label: "Admin real-time alert on each check-in", monthly: 2, perStaff: true },
} as const;

export type AddonKey = keyof typeof ADDONS;
export type BillingPeriod = "monthly" | "annual";

export type EstimateInput = {
  branches: number;
  staff: number;
  addons?: Partial<Record<AddonKey, boolean>>;
  billing?: BillingPeriod;
};

export type Estimate = {
  branches: number;
  staff: number;
  branchTier: BranchTier;
  baseBranchCost: number;
  coveredStaff: number;
  extraStaff: number;
  extraStaffTier: ExtraStaffTier;
  extraStaffCost: number;
  addonLines: { key: AddonKey; label: string; cost: number }[];
  addonsMonthly: number;
  monthlyGhs: number;
  billing: {
    period: BillingPeriod;
    monthsCovered: number;
    fullRollup: number;
    amountDue: number;
    savings: number;
    effectiveMonthly: number;
  };
  setupGhs: number;
};

/** One tier applies to every branch, chosen by total branch count. */
export function getBranchTier(branches: number): BranchTier {
  const b = Math.max(0, Math.floor(branches));
  if (b <= 3) return BRANCH_TIERS[0];
  if (b <= 9) return BRANCH_TIERS[1];
  return BRANCH_TIERS[2];
}

/** All excess staff are billed at the rate of the band the whole excess count falls in. */
export function getExtraStaffTier(extra: number): ExtraStaffTier {
  const e = Math.max(0, Math.floor(extra));
  if (e <= 0) return { tier: "-", label: "No excess staff", rate: 0, range: "0 extra staff" };
  const t = EXTRA_STAFF_TIERS.find((x) => e <= x.max)!;
  return { tier: t.tier, label: t.label, rate: t.rate, range: t.range };
}

export function estimate({ branches, staff, addons = {}, billing = "monthly" }: EstimateInput): Estimate {
  const b = Math.max(0, branches);
  const staffCount = Math.max(0, Math.floor(staff));
  const branchTier = getBranchTier(b);
  const baseBranchCost = b * branchTier.rate;
  const coveredStaff = b * STAFF_PER_BRANCH;
  const extraStaff = Math.max(0, staffCount - coveredStaff);
  const extraStaffTier = getExtraStaffTier(extraStaff);
  const extraStaffCost = extraStaff * extraStaffTier.rate;

  const addonLines = (Object.keys(ADDONS) as AddonKey[])
    .filter((k) => addons[k])
    .map((k) => {
      const a = ADDONS[k];
      return { key: k, label: a.label, cost: a.perStaff ? staffCount * a.monthly : a.monthly };
    });
  const addonsMonthly = addonLines.reduce((sum, l) => sum + l.cost, 0);
  const monthlyGhs = baseBranchCost + extraStaffCost + addonsMonthly;

  // Annual: prepay 12 months at 11× monthly.
  const months = billing === "annual" ? 12 : 1;
  const fullRollup = monthlyGhs * months;
  const prepaid = billing === "annual" ? monthlyGhs * 11 : monthlyGhs;
  const amountDue = Math.round(prepaid);

  return {
    branches: b,
    staff: staffCount,
    branchTier,
    baseBranchCost,
    coveredStaff,
    extraStaff,
    extraStaffTier,
    extraStaffCost,
    addonLines,
    addonsMonthly,
    monthlyGhs,
    billing: {
      period: billing,
      monthsCovered: months,
      fullRollup: Math.round(fullRollup),
      amountDue,
      savings: Math.round(fullRollup - prepaid),
      effectiveMonthly: Math.round(amountDue / months),
    },
    setupGhs: SETUP_FEE_GHS,
  };
}

export function formatGHS(n: number): string {
  return "GHS " + Math.round(n).toLocaleString("en-GH");
}
