import type { Metadata } from "next";
import { LegalPage, legalTitle } from "@/components/marketing/LegalPage";

export const metadata: Metadata = {
  title: legalTitle("terms").title,
  description: legalTitle("terms").lead,
  alternates: { canonical: "/legal/terms" },
};

export default function Page() {
  return <LegalPage slug="terms" />;
}
