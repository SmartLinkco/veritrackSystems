import { agentRegistrationSchema, companyRequestSchema, submitForm } from "@/lib/forms-backend";

export async function POST(request: Request) {
  let body: { type?: string; data?: Record<string, unknown>; website?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, code: "invalid", error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill the hidden "website" field.
  if (body.website) return Response.json({ ok: true });

  const schema = body.type === "company-request" ? companyRequestSchema : body.type === "agent-registration" ? agentRegistrationSchema : null;
  if (!schema) return Response.json({ ok: false, code: "invalid", error: "Unknown form." }, { status: 400 });

  const parsed = schema.safeParse(body.data);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((i) => String(i.path[0]));
    return Response.json({ ok: false, code: "invalid", error: "Please check the highlighted fields.", fields }, { status: 422 });
  }

  const data = parsed.data as Record<string, unknown>;
  const email = String(data.email ?? data["agent-email"]);

  try {
    const result = await submitForm(body.type as "company-request" | "agent-registration", data, email);
    return Response.json(result, { status: result.ok ? 200 : result.code === "duplicate" ? 409 : 502 });
  } catch (err) {
    console.error("forms backend error", err);
    return Response.json({ ok: false, code: "backend", error: "We couldn't reach our servers. Please try again or email info@veritrack.cloud." }, { status: 502 });
  }
}
