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
                        <h2 className="text-3xl md:text-4xl font-bold font-headline">Meet Wefella — Your Always-On Healthcare Guardian</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Not just a chatbot you visit when you have a question. Wefella is a continuous AI guardian that prevents financial harm before it happens, navigates the healthcare system for you, and fights unfair bills — in English, Spanish, and Portuguese.
                        </p>
                        <ul className="mt-6 space-y-3 text-muted-foreground">
                            <li className="flex items-start">
                                <ArrowRight className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                                <span>Prevent surprise bills and auto-build claims for every unfair charge</span>
                            </li>
                            <li className="flex items-start">
                                <ArrowRight className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                                <span>Find real negotiated prices — not estimates — for any procedure or medication</span>
                            </li>
                            <li className="flex items-start">
                                <ArrowRight className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                                <span>Optimize your plan, employer benefits, and pharmacy costs year-round</span>
                            </li>
                            <li className="flex items-start">
                                <ArrowRight className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                                <span>Decide whether to use your plan or pay cash for medication and surgery</span>
                            </li>
                            <li className="flex items-start">
                                <ArrowRight className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                                <span>Get decomplicated scheduling at the best-value provider</span>
                            </li>
                            <li className="flex items-start">
                                <ArrowRight className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                                <span className="font-medium text-foreground italic">Auto-escalate denied claims with appeals, parity citations, and regulator complaints</span>
                            </li>
                        </ul>
                        <Button asChild size="lg" className="mt-8 bg-[#F59E0B] hover:bg-[#D97706] text-white border-none">
                            <Link href="/concierge">Try Wefella Free</Link>
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
                                            sizes="(max-width: 768px) 100vw, 50vw"
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
