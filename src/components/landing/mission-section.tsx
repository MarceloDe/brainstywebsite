import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pillars = [
    {
        title: "#Translate",
        description: "We translate complex, evidence-based research into useful, understandable knowledge for the average person.",
        imageId: "translate",
        imageHint: "glowing brain",
    },
    {
        title: "#Integrate",
        description: "We integrate modern technology (like AI, wearables, and apps) to build sustainable and engaging health and wellness solutions.",
        imageId: "integrate",
        imageHint: "ai health",
    },
    {
        title: "#Delivery",
        description: "We deliver reliable, personalized knowledge that empowers users to make informed health decisions.",
        imageId: "delivery",
        imageHint: "empowerment",
    }
];


export default function MissionSection() {
    const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

    return (
        <section className="py-20 md:py-28">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Our Mission, Your Empowerment</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        We are founded on three core principles to guide you through the complexities of healthcare.
                    </p>
                </div>

                <div className="mt-16 grid md:grid-cols-3 gap-8">
                    {pillars.map((pillar) => {
                        const pillarImage = getImage(pillar.imageId);
                        return (
                            <Card key={pillar.title} className="flex flex-col">
                                {pillarImage && (
                                    <div className="aspect-square relative rounded-t-lg overflow-hidden">
                                        <Image 
                                            src={pillarImage.imageUrl}
                                            alt={pillarImage.description}
                                            fill
                                            className="object-cover"
                                            data-ai-hint={pillarImage.imageHint}
                                        />
                                    </div>
                                )}
                                <CardHeader className="items-center">
                                    <CardTitle className="font-headline text-2xl">{pillar.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col text-center">
                                    <p className="text-muted-foreground flex-grow">{pillar.description}</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}
