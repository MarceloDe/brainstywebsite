import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function EmployersSection() {
    const features = [
        "White-label branding — your logo, your colors, your people",
        "Per-employee-per-month pricing — predictable, scalable",
        "Benefits consultant partnership program",
        "HIPAA-compliant architecture",
        "Multilingual support (English, Spanish, Portuguese)",
    ];

    return (
        <section id="for-employers" className="py-[80px] bg-canvas text-ink">
            <div className="container">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-[80px]">
                        <h2 className="text-[48px] font-bold font-display mb-6 leading-[1.1]">
                            Give Your Team a Healthcare Advantage
                        </h2>
                        <p className="text-[18px] font-light text-body leading-[1.55]">
                            Brainsty integrates as a white-label solution for your organization. Reduce benefits administration burden, improve employee satisfaction, and lower claims costs — all while empowering your team with real healthcare intelligence.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-1 gap-8 mb-16 max-w-2xl mx-auto">
                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                                    <span className="text-[18px] font-light text-ink">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center">
                        <Button asChild size="default" variant="default">
                            <Link href="mailto:hello@brainsty.ai">Request Employer Demo</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
