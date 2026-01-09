import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeliveryIcon, IntegrateIcon, TranslateIcon } from "@/components/shared/icons";

const pillars = [
    {
        title: "Translate",
        description: "We translate complex, evidence-based research into useful, understandable knowledge for the average person.",
        icon: <TranslateIcon className="h-10 w-10 text-primary" />,
    },
    {
        title: "Integrate",
        description: "We integrate modern technology (like AI, wearables, and apps) to build sustainable and engaging health and wellness solutions.",
        icon: <IntegrateIcon className="h-10 w-10 text-primary" />,
    },
    {
        title: "Delivery",
        description: "We deliver reliable, personalized knowledge that empowers users to make informed health decisions.",
        icon: <DeliveryIcon className="h-10 w-10 text-primary" />,
    }
];


export default function MissionSection() {
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
                    {pillars.map((pillar) => (
                        <Card key={pillar.title} className="flex flex-col text-center items-center">
                             <CardHeader className="items-center">
                                {pillar.icon}
                                <CardTitle className="font-headline text-2xl mt-4">{pillar.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground">{pillar.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}