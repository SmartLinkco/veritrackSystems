import { SectorPage, sectorMetadata } from "@/components/marketing/SectorPage";

export const metadata = sectorMetadata("education");

export default function Page() {
  return <SectorPage slug="education" />;
}
