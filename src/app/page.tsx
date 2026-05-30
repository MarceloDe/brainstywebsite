import ConciergePreview from "@/components/landing/concierge-preview";
import HeroSection from "@/components/landing/hero-section";
import MissionSection from "@/components/landing/mission-section";
import ProblemsSolvedSection from "@/components/landing/problems-solved-section";
import StatsBar from "@/components/landing/stats-bar";
import WhyDifferentSection from "@/components/landing/why-different-section";
import EmployersSection from "@/components/landing/employers-section";
import EarlyAccessSection from "@/components/landing/early-access-section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import VideoSection from "@/components/landing/video-section";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      
      <ScrollReveal>
        <MissionSection />
      </ScrollReveal>

      <VideoSection 
        videoSrc="/video1.mp4" 
        titleKey="video1.title" 
        descKey="video1.desc" 
        bgColor="surface-soft" 
      />

      <ScrollReveal>
        <ConciergePreview />
      </ScrollReveal>

      <ScrollReveal>
        <ProblemsSolvedSection />
      </ScrollReveal>

      <ScrollReveal>
        <StatsBar />
      </ScrollReveal>

      <ScrollReveal>
        <WhyDifferentSection />
      </ScrollReveal>

      <VideoSection 
        videoSrc="/video2.mp4" 
        titleKey="video2.title" 
        descKey="video2.desc" 
        bgColor="surface-dark" 
      />

      <ScrollReveal>
        <EmployersSection />
      </ScrollReveal>

      <ScrollReveal>
        <EarlyAccessSection />
      </ScrollReveal>
    </div>
  );
}

