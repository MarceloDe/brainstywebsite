"use client";

import { Shield, Eye, Database, Globe } from "lucide-react";
import { useLanguage } from "@/context/language-context";

export default function WhyDifferentSection() {
    const { t } = useLanguage();

    const differentiators = [
        {
            icon: <Shield className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />,
            title: t("why.card1.title"),
            body: t("why.card1.body"),
        },
        {
            icon: <Eye className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />,
            title: t("why.card2.title"),
            body: t("why.card2.body"),
        },
        {
            icon: <Database className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />,
            title: t("why.card3.title"),
            body: t("why.card3.body"),
        },
        {
            icon: <Globe className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />,
            title: t("why.card4.title"),
            body: t("why.card4.body"),
        },
    ];

    return (
        <section id="why-brainsty" className="py-[80px] bg-canvas">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-[80px]">
                    <h2 className="text-[48px] font-bold font-display text-ink leading-[1.1]">
                        {t("why.headline")}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {differentiators.map((item, index) => {
                        const floatClasses = [
                            "ag-float-slow ag-drift-left",
                            "ag-float-medium ag-drift-right",
                            "ag-float-medium ag-drift-left",
                            "ag-float-slow ag-drift-right"
                        ];
                        const animationClass = floatClasses[index % floatClasses.length];
                        return (
                            <div 
                                key={index} 
                                className={`flex gap-6 p-6 rounded-none transition-all duration-300 border border-hairline hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(28,105,212,0.15)] bg-canvas group ${animationClass}`}
                            >
                            <div className="shrink-0 pt-1">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-[20px] font-bold font-display text-ink leading-[1.3] mb-3 group-hover:text-primary transition-colors duration-300">
                                    {item.title}
                                </h3>
                                <p className="text-[16px] font-light text-body leading-[1.55]">
                                    {item.body}
                                </p>
                            </div>
                        </div>
                    );
                })}
                </div>
            </div>
        </section>
    );
}
