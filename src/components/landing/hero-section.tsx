"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function HeroSection() {
    const heroImage = PlaceHolderImages.find(img => img.id === 'hero');

    return (
        <section className="relative py-[80px] min-h-[600px] w-full bg-surface-dark">
            {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                    data-ai-hint={heroImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-surface-dark/70" />
            <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-[40px] md:text-[64px] font-bold font-display text-on-dark leading-[1.05]">
                    Your Healthcare Costs Shouldn&apos;t Be a Mystery
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-[18px] md:text-[24px] font-light text-on-dark-soft leading-[1.55]">
                    Brainsty is an AI concierge that works for YOU — not insurers, not providers.
                    Know your real costs before you pay. Prevent surprise bills before they arrive.
                    Optimize your benefits before open enrollment ends.
                </p>
                <div className="mt-10 flex flex-col items-center gap-4">
                    <Button asChild size="default" variant="default">
                        <Link href="#early-access">Get Early Access</Link>
                    </Button>
                    <p className="text-[14px] font-light text-on-dark-soft italic">
                        Independent. White-label. No ties to any insurer or provider.
                    </p>
                </div>
            </div>
        </section>
    );
}
