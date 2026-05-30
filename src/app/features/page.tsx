import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const services = [
    { title: "Clear Clinical Decisions", description: "The agent cuts through the mystery on diagnoses, treatments, and care plans — so you know the truth before you decide." },
    { title: "Navigates Insurance & Providers", description: "The agent navigates your benefits and hunts the right in-network specialists for you." },
    { title: "Guards Your Pharmacy Costs", description: "The agent monitors every prescription, fighting for the lowest price and flagging cheaper alternatives." },
    { title: "Decodes Your Records", description: "The agent translates confusing medical notes into clear, plain language — no jargon, no surprise." },
    { title: "Curated Health Truth", description: "The agent surfaces the latest research, summarized clearly, so you act on facts not guesses." },
    { title: "Smart Device Guidance", description: "The agent recommends the devices and wearables that actually fit your health goals." },
    { title: "Built Around You", description: "The agent works from your data to build health solutions that matter to you." },
    { title: "White-Label Health Services", description: "A trusted suite of health services your agent draws on to guard you." },
];

export default function FeaturesPage() {
    const featuresHeroImage = PlaceHolderImages.find(img => img.id === 'features-hero');

    return (
        <div className="bg-background text-foreground">
            <section className="relative h-[400px] flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-primary to-primary-active">
                {featuresHeroImage && (
                    <Image
                        src={featuresHeroImage.imageUrl}
                        alt={featuresHeroImage.description}
                        fill
                        sizes="100vw"
                        className="object-contain opacity-90"
                        priority
                        data-ai-hint={featuresHeroImage.imageHint}
                    />
                )}
                <div className="absolute inset-0 bg-primary/40" />
                <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-center text-primary-foreground">
                    <h1 className="text-4xl md:text-6xl font-bold font-headline">An Agent That Works for You</h1>
                    <p className="mt-4 max-w-3xl text-lg md:text-xl">
                        See how your autonomous health agent guards every part of your healthcare — clear truth, no surprise, all year.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((service) => (
                            <Card key={service.title} className="bg-card border-border hover:shadow-lg transition-shadow rounded-none">
                                <CardHeader className="flex flex-col items-center text-center p-6">
                                    <CheckCircle2 className="h-10 w-10 text-primary mb-4" />
                                    <CardTitle className="text-lg font-bold">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center text-muted-foreground px-6 pb-6">
                                    {service.description}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
