import "server-only";
import { z } from "zod";

// The legacy site posts to this Apps Script via JSONP (js/vt-deploy-form.js, agent.html).
// V2 calls it server-side with the same parameters so the Sheets backend needs no changes.
const SCRIPT_URL =
  process.env.FORMS_SCRIPT_URL ??
  "https://script.google.com/macros/s/AKfycbzQGL7Y3FhfaRD5LhN8KKaVqvBVNI0QGwdQI4I2S1CvkkO4ovrv5ZLEWGMQoFccFNKK/exec";

async function callScript(params: Record<string, string>): Promise<Record<string, unknown>> {
  const url = new URL(SCRIPT_URL);
  url.searchParams.set("callback", "vt_cb");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, { cache: "no-store", redirect: "follow", signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`Forms backend responded ${res.status}`);
  const text = await res.text();
  const jsonp = text.match(/^\s*[\w$.]+\(([\s\S]*)\)\s*;?\s*$/);
  return JSON.parse(jsonp ? jsonp[1] : text);
}

const text = (max = 200) => z.string().trim().min(1).max(max);
const optional = (max = 2000) => z.string().trim().max(max).optional().default("");

export const companyRequestSchema = z.object({
  "full-name": text(),
  "company-name": text(),
  email: z.email().max(200),
  phone: text(40),
  industry: text(),
  "agent-id": optional(60),
  "use-case": text(),
  "key-features": z.array(z.string().max(80)).max(12),
  platform: text(),
  "integration-needs": optional(),
  "number-of-users": text(),
  "deployment-timeline": text(),
  "budget-range": text(),
  "additional-requests": optional(),
});

export const agentRegistrationSchema = z
  .object({
    "agent-full-name": text(),
    "agent-email": z.email().max(200),
    "agent-phone": text(40),
    "agent-location": text(),
    "agent-country": text(),
    "agent-region": text(),
    "agent-city": text(),
    "agent-company": text(),
    "agent-industry": text(),
    "agent-position": text(),
    "agent-payment-method": z.enum(["Mobile Money", "Bank Transfer"]),
    "agent-mobile-money-network": optional(40),
    "agent-mobile-money-name": optional(120),
    "agent-payment-details": optional(60),
    "agent-bank-name": optional(120),
    "agent-bank-account-name": optional(120),
    "agent-bank-account": optional(60),
    "agent-terms": z.literal("on"),
  })
  .superRefine((d, ctx) => {
    const need = (keys: (keyof typeof d)[]) =>
      keys.forEach((k) => !d[k] && ctx.addIssue({ code: "custom", path: [k], message: "Required" }));
    if (d["agent-payment-method"] === "Mobile Money") need(["agent-mobile-money-network", "agent-mobile-money-name", "agent-payment-details"]);
    else need(["agent-bank-name", "agent-bank-account-name", "agent-bank-account"]);
  });

export type SubmitResult = { ok: true } | { ok: false; error: string; code: "duplicate" | "invalid" | "backend" };

export async function submitForm(formType: "company-request" | "agent-registration", data: Record<string, unknown>, email: string): Promise<SubmitResult> {
  const check = await callScript({
    action: formType === "company-request" ? "checkCompanyEmail" : "checkAgentEmail",
    email,
  });
  if (check.exists) {
    return {
      ok: false,
      code: "duplicate",
      error:
        formType === "company-request"
          ? "This email is already associated with an existing company. Please use a different email or contact support."
          : "This email is already registered as a partner. Please use a different email or contact support.",
    };
  }
  // Double-encoded on purpose: the legacy client sets encodeURIComponent(JSON) as the param value.
  const result = await callScript({ data: encodeURIComponent(JSON.stringify({ "form-type": formType, ...data })) });
  if (result.result === "success") return { ok: true };
  return { ok: false, code: "backend", error: String(result.error ?? "Submission failed") };
}
