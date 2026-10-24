import { SectorPage, sectorMetadata } from "@/components/marketing/SectorPage";

export const metadata = sectorMetadata("events");

export default function Page() {
  return <SectorPage slug="events" />;
}
