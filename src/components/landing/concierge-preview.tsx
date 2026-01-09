import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function ConciergePreview() {
    const diagramImage = PlaceHolderImages.find(img => img.id === "concierge-diagram");

    return (
        <section className="py-20 md:py-28 bg-card">
            <div className="container">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold font-headline">Meet Wefella, Your AI Health Concierge</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Get personalized guidance and support from an expert healthcare concierge. Wefella is designed to help you understand your health better and make informed decisions with confidence.
                        </p>
                        <ul className="mt-6 space-y-3 text-muted-foreground">
                            <li className="flex items-start">
                                <ArrowRight className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                                <span>Navigate insurance and find providers.</span>
                            </li>
                            <li className="flex items-start">
                                <ArrowRight className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                                <span>Understand medical notes and research.</span>
                            </li>
                            <li className="flex items-start">
                                <ArrowRight className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                                <span>Optimize medication and pharmacy choices.</span>
                            </li>
                        </ul>
                        <Button asChild size="lg" className="mt-8">
                            <Link href="/concierge">Try the AI Concierge</Link>
                        </Button>
                    </div>
                    <div>
                        <Card>
                            <CardContent className="p-4">
                                {diagramImage && (
                                     <div className="aspect-video relative rounded-md overflow-hidden">
                                        <Image
                                            src={diagramImage.imageUrl}
                                            alt={diagramImage.description}
                                            fill
                                            className="object-cover"
                                            data-ai-hint={diagramImage.imageHint}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
