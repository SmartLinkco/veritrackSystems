import { SectorPage, sectorMetadata } from "@/components/marketing/SectorPage";

export const metadata = sectorMetadata("logistics");

export default function Page() {
  return <SectorPage slug="logistics" />;
}
