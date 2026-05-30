import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ConciergePreview() {
    const diagramImage = PlaceHolderImages.find(img => img.id === "concierge-diagram");

    return (
        <section className="py-[80px] bg-surface-card">
            <div className="container">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-[32px] md:text-[48px] font-bold font-display text-ink leading-[1.1]">Meet Wefella — The Agent That Guards You While You Live Your Life</h2>
                        <p className="mt-6 text-[18px] font-light text-body leading-[1.55]">
                            Not a chatbot you visit. An autonomous agent that hunts unfair charges, makes every price clear, and fights your bills for you — in English, Spanish, and Portuguese.
                        </p>
                        <ul className="mt-8 space-y-4 text-[16px] font-light text-body">
                            <li className="flex items-start">
                                <ArrowRight className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                                <span>Stops surprise bills and auto-builds a claim for every unfair charge</span>
                            </li>
                            <li className="flex items-start">
                                <ArrowRight className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                                <span>Finds the real negotiated price — never an estimate — for any procedure or drug</span>
                            </li>
                            <li className="flex items-start">
                                <ArrowRight className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                                <span>Guards your plan, employer benefits, and pharmacy costs all year</span>
                            </li>
                            <li className="flex items-start">
                                <ArrowRight className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                                <span>Tells you when to use insurance and when cash is cheaper</span>
                            </li>
                            <li className="flex items-start">
                                <ArrowRight className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                                <span>Books the best-value provider — no phone-tag</span>
                            </li>
                            <li className="flex items-start">
                                <ArrowRight className="h-5 w-5 mt-1 mr-3 text-primary shrink-0" />
                                <span className="font-bold text-ink italic">Escalates denied claims with appeals, parity citations, and regulator complaints</span>
                            </li>
                        </ul>
                        <Button asChild size="default" variant="default" className="mt-10">
                            <Link href="/concierge">Try Wefella Free</Link>
                        </Button>
                    </div>
                    <div>
                        <div className="bg-canvas p-6 ag-float-slow ag-drift-left">
                            {diagramImage && (
                                <div className="aspect-video relative rounded-none w-full">
                                    <Image
                                        src={diagramImage.imageUrl}
                                        alt={diagramImage.description}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-contain"
                                        data-ai-hint={diagramImage.imageHint}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
