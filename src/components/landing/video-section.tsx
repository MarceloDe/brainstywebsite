"use client";

import React from "react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Play } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface VideoSectionProps {
  videoSrc: string;
  titleKey: string;
  descKey: string;
  bgColor?: "canvas" | "surface-soft" | "surface-dark";
}

export default function VideoSection({
  videoSrc,
  titleKey,
  descKey,
  bgColor = "surface-soft"
}: VideoSectionProps) {
  const { t } = useLanguage();

  const bgClass = 
    bgColor === "canvas" ? "bg-canvas" :
    bgColor === "surface-dark" ? "bg-surface-dark text-on-dark" : "bg-surface-soft";

  const titleColor = bgColor === "surface-dark" ? "text-on-dark" : "text-ink";
  const descColor = bgColor === "surface-dark" ? "text-on-dark-soft" : "text-body";

  return (
    <section className={`py-[80px] w-full ${bgClass} overflow-hidden`}>
      <div className="container">
        <ScrollReveal className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <h3 className={`text-[32px] md:text-[40px] font-bold font-display ${titleColor} leading-[1.1] mb-4`}>
            {t(titleKey)}
          </h3>
          <p className={`text-[16px] md:text-[18px] font-light ${descColor} leading-[1.55] max-w-2xl mb-12`}>
            {t(descKey)}
          </p>
          
          {/* Visual video player container */}
          <div className="w-full relative shadow-2xl border border-hairline/20 bg-slate-900 group">
            {/* Auto-playing premium video */}
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto aspect-video object-cover transition-opacity duration-700 opacity-90 group-hover:opacity-100"
            />
            
            {/* Video overlay overlay/branding */}
            <div className="absolute top-4 left-4 bg-canvas/90 backdrop-blur-sm px-3.5 py-1 text-[10px] font-bold uppercase tracking-[1px] text-primary flex items-center gap-1.5 shadow-sm">
              <Play className="h-3 w-3 fill-primary text-primary" /> Live Demo
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
