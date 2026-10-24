// Parity test: runs the legacy calculator's own functions (lifted from
// ../js/pricing-calculator.js) against src/lib/pricing.ts for a grid of inputs.
// Run with `npm test`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { estimate, type AddonKey, type BillingPeriod } from "../src/lib/pricing.ts";

const legacyPath = fileURLToPath(new URL("../../js/pricing-calculator.js", import.meta.url));
const legacySrc = readFileSync(legacyPath, "utf8");

function extractFunction(name: string): string {
  const start = legacySrc.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `legacy function ${name} not found`);
  let depth = 0;
  for (let i = legacySrc.indexOf("{", start); i < legacySrc.length; i++) {
    if (legacySrc[i] === "{") depth++;
    if (legacySrc[i] === "}" && --depth === 0) return legacySrc.slice(start, i + 1);
  }
  throw new Error(`unbalanced braces in ${name}`);
}

const constants = legacySrc.slice(legacySrc.indexOf("var STAFF_PER_BRANCH"), legacySrc.indexOf("function getBranchTierInfo"));
const legacy = vm.runInNewContext(
  [
    constants,
    ...["getBranchTierInfo", "getExtraStaffTierInfo", "formatGHS", "computeAddonMonthly", "computeBillingPeriod", "compute"].map(extractFunction),
    "({ compute, computeAddonMonthly, computeBillingPeriod })",
  ].join("\n"),
) as {
  compute: (b: number, s: number) => { finalMonthly: number; baseBranchCost: number; extraBranchStaffCost: number; branchTier: { rate: number } };
  computeAddonMonthly: (s: number, sel: Record<string, boolean>) => { total: number };
  computeBillingPeriod: (m: number, p: string) => { prepaidTotal: number; savings: number; effectiveMonthly: number };
};

const addonSets: Partial<Record<AddonKey, boolean>>[] = [
  {},
  { leaderboard: true },
  { alert: true },
  { leaderboard: true, shift: true, ai: true, payroll: true, alert: true },
];

test("estimate matches legacy calculator totals", () => {
  let cases = 0;
  for (const branches of [1, 2, 3, 4, 9, 10, 25, 50]) {
    for (const staff of [1, 12, 20, 36, 37, 56, 57, 87, 120, 300, 900]) {
      for (const addons of addonSets) {
        for (const billing of ["monthly", "annual"] as BillingPeriod[]) {
          const core = legacy.compute(branches, staff);
          const addonTotal = legacy.computeAddonMonthly(staff, addons as Record<string, boolean>).total;
          const bill = legacy.computeBillingPeriod(core.finalMonthly + addonTotal, billing);
          const v2 = estimate({ branches, staff, addons, billing });
          const label = JSON.stringify({ branches, staff, addons, billing });
          assert.equal(v2.baseBranchCost, core.baseBranchCost, `branch cost ${label}`);
          assert.equal(v2.extraStaffCost, core.extraBranchStaffCost, `extra staff ${label}`);
          assert.equal(v2.addonsMonthly, addonTotal, `addons ${label}`);
          assert.equal(v2.billing.amountDue, bill.prepaidTotal, `amount due ${label}`);
          assert.equal(v2.billing.savings, bill.savings, `savings ${label}`);
          assert.equal(v2.billing.effectiveMonthly, bill.effectiveMonthly, `effective ${label}`);
          cases++;
        }
      }
    }
  }
  assert.ok(cases > 600);
});

test("reference example: 4 branches, 20 staff = GHS 1,400/month", () => {
  const e = estimate({ branches: 4, staff: 20 });
  assert.equal(e.branchTier.key, "growth");
  assert.equal(e.monthlyGhs, 1400);
  assert.equal(e.extraStaff, 0);
});
