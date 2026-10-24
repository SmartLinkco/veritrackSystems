import { SectorPage, sectorMetadata } from "@/components/marketing/SectorPage";

export const metadata = sectorMetadata("security");

export default function Page() {
  return <SectorPage slug="security" />;
}
