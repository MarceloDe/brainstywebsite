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
                        <h2 className="text-[32px] md:text-[48px] font-bold font-display text-ink leading-[1.1]">Meet Wefella — Your Always-On Healthcare Guardian</h2>
                        <p className="mt-6 text-[18px] font-light text-body leading-[1.55]">
                            Not just a chatbot you visit when you have a question. Wefella is a continuous AI guardian that prevents financial harm before it happens, navigates the healthcare system for you, and fights unfair bills — in English, Spanish, and Portuguese.
                        </p>
                        <ul className="mt-8 space-y-4 text-[16px] font-light text-body">
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
                                <span className="font-bold text-ink italic">Auto-escalate denied claims with appeals, parity citations, and regulator complaints</span>
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
                                        className="object-cover"
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
