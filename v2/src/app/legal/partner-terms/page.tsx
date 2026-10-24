import type { Metadata } from "next";
import { LegalPage, legalTitle } from "@/components/marketing/LegalPage";

export const metadata: Metadata = {
  title: legalTitle("partner-terms").title,
  description: legalTitle("partner-terms").lead,
  alternates: { canonical: "/legal/partner-terms" },
};

export default function Page() {
  return <LegalPage slug="partner-terms" />;
}
