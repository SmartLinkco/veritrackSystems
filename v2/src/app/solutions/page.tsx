import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { DeployBand, PageHero, SectorGrid } from "@/components/marketing/Bands";

export const metadata: Metadata = {
  title: "Solutions by sector",
  description: "VeriTrack for pharmacy, education, logistics, corporate, security and events: photo-verified, geofenced attendance configured for how your sector works.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Your sector. Your rules."
        lead="The same verification engine, configured for pharmacies, campuses, field teams, head offices, guarded sites and events."
        clip="accra-square"
      />
      <Section>
        <SectorGrid />
      </Section>
      <DeployBand />
    </>
  );
}
