"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function HeroSection() {
    const heroImage = PlaceHolderImages.find(img => img.id === 'hero');

    return (
        <section className="relative h-[500px] md:h-[600px] w-full">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-white leading-tight">
                    Your Healthcare Costs Shouldn&apos;t Be a Mystery
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-neutral-200">
                    Brainsty is an AI concierge that works for YOU — not insurers, not providers.
                    Know your real costs before you pay. Prevent surprise bills before they arrive.
                    Optimize your benefits before open enrollment ends.
                </p>
                <div className="mt-10 flex flex-col items-center gap-4">
                    <Button asChild size="lg" className="bg-[#F59E0B] hover:bg-[#D97706] text-white border-none">
                        <Link href="#early-access">Get Early Access</Link>
                    </Button>
                    <p className="text-sm text-neutral-300 italic">
                        Independent. White-label. No ties to any insurer or provider.
                    </p>
                </div>
            </div>
        </section>
    );
}
