import type { Metadata } from "next";
import { LegalPage, legalTitle } from "@/components/marketing/LegalPage";

export const metadata: Metadata = {
  title: legalTitle("privacy").title,
  description: legalTitle("privacy").lead,
  alternates: { canonical: "/legal/privacy" },
};

export default function Page() {
  return <LegalPage slug="privacy" />;
}
