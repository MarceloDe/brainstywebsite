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
        <section id="for-employers" className="py-20 md:py-28 bg-slate-900 text-white">
            <div className="container">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold font-headline mb-6">
                            Give Your Team a Healthcare Advantage
                        </h2>
                        <p className="text-xl text-slate-300 leading-relaxed">
                            Brainsty integrates as a white-label solution for your organization. Reduce benefits administration burden, improve employee satisfaction, and lower claims costs — all while empowering your team with real healthcare intelligence.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-1 gap-8 mb-12 max-w-2xl mx-auto">
                        <div className="space-y-4">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
                                    <span className="text-lg text-slate-200">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center">
                        <Button asChild size="lg" className="bg-[#F59E0B] hover:bg-[#D97706] text-white border-none py-7 px-10 text-xl font-bold">
                            <Link href="mailto:hello@brainsty.ai">Request Employer Demo</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
