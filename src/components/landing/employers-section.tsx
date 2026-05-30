"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

export default function EmployersSection() {
    const { t } = useLanguage();

    const features = [
        t("emp.f1"),
        t("emp.f2"),
        t("emp.f3"),
        t("emp.f4"),
        t("emp.f5"),
    ];

    return (
        <section id="for-employers" className="py-[80px] bg-canvas text-ink">
            <div className="container">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-[80px]">
                        <h2 className="text-[48px] font-bold font-display mb-6 leading-[1.1]">
                            {t("emp.headline")}
                        </h2>
                        <p className="text-[18px] font-light text-body leading-[1.55]">
                            {t("emp.sub")}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-1 gap-8 mb-16 max-w-2xl mx-auto">
                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-4 p-2 transition-all duration-300 hover:translate-x-1.5 group">
                                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110" />
                                    <span className="text-[18px] font-light text-ink group-hover:text-primary transition-colors duration-300">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center">
                        <Button asChild size="default" variant="default" className="transition-transform duration-300 hover:scale-[1.03]">
                            <Link href="mailto:hello@brainsty.ai">{t("emp.cta")}</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
