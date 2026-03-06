import ConciergePreview from "@/components/landing/concierge-preview";
import HeroSection from "@/components/landing/hero-section";
import MissionSection from "@/components/landing/mission-section";
import ProblemsSolvedSection from "@/components/landing/problems-solved-section";
import StatsBar from "@/components/landing/stats-bar";
import WhyDifferentSection from "@/components/landing/why-different-section";
import EmployersSection from "@/components/landing/employers-section";
import EarlyAccessSection from "@/components/landing/early-access-section";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <MissionSection />
      <ConciergePreview />
      <ProblemsSolvedSection />
      <StatsBar />
      <WhyDifferentSection />
      <EmployersSection />
      <EarlyAccessSection />
    </div>
  );
}
