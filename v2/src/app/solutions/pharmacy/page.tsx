import { SectorPage, sectorMetadata } from "@/components/marketing/SectorPage";

export const metadata = sectorMetadata("pharmacy");

export default function Page() {
  return <SectorPage slug="pharmacy" />;
}
