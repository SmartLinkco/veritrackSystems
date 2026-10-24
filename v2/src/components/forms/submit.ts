export type FormResponse = { ok: true } | { ok: false; error: string; code: string; fields?: string[] };

export async function postForm(type: "company-request" | "agent-registration", data: Record<string, unknown>, website: string): Promise<FormResponse> {
  try {
    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data, website }),
    });
    return (await res.json()) as FormResponse;
  } catch {
    return { ok: false, code: "network", error: "Network error. Please check your connection and try again." };
  }
}
