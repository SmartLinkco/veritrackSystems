import { SectorPage, sectorMetadata } from "@/components/marketing/SectorPage";

export const metadata = sectorMetadata("corporate");

export default function Page() {
  return <SectorPage slug="corporate" />;
}
