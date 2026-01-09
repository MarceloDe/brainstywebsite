import ConciergePreview from "@/components/landing/concierge-preview";
import HeroSection from "@/components/landing/hero-section";
import MissionSection from "@/components/landing/mission-section";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <MissionSection />
      <Separator />
      <ConciergePreview />
    </div>
  );
}
