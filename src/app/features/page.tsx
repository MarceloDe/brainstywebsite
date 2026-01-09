import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const services = [
    { title: "Informed Clinical Decision Support", description: "Get clarity on diagnoses, treatments, and care plans." },
    { title: "Insurance and Provider Navigation", description: "We help you understand your benefits and find the right specialists." },
    { title: "Medication and Pharmacy Optimization", description: "Review your prescriptions for cost-savings and effectiveness." },
    { title: "Patient-Friendly Summaries", description: "We translate your medical notes into easy-to-understand language." },
    { title: "Curated Research for Patient Literacy", description: "Access the latest research, summarized for you." },
    { title: "Health Device & Wearable Portfolio", description: "Recommendations for devices that fit your health goals." },
    { title: "Patient Canvas Co-development", description: "Collaborate with us to build health solutions that matter to you." },
    { title: "White-Label Health Services", description: "A repository of health services you can trust." },
];

export default function FeaturesPage() {
    const heroImage = PlaceHolderImages.find(img => img.id === 'features-hero');

    return (
        <div>
            <section className="relative h-[400px] md:h-[500px] w-full">
                {heroImage && (
                    <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={heroImage.imageHint}
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-primary/70" />
                <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-center text-primary-foreground">
                    <h1 className="text-4xl md:text-6xl font-bold font-headline">Features & Services</h1>
                    <p className="mt-4 max-w-3xl text-lg md:text-xl">
                        Comprehensive support for every step of your health journey.
                    </p>
                </div>
            </section>

            <section className="py-20 md:py-28">
                <div className="container">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {services.map((service) => (
                            <Card key={service.title} className="bg-card hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CheckCircle2 className="h-8 w-8 text-primary mb-3" />
                                    <CardTitle className="font-headline text-xl leading-tight">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{service.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
