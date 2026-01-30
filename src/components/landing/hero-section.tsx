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
            <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-white">
                    Navigate Your Health Journey with Clarity
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-neutral-200">
                    Brainsty is a human-inspired biotech company supporting people
                    negatively impacted by the complexities and knowledge gaps in the
                    healthcare system.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    <Button asChild size="lg">
                        <Link href="/signup">Get Started</Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary">
                        <Link href="/features">Learn More</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
