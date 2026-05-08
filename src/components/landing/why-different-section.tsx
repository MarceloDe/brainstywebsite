import { Shield, Eye, Database, Globe } from "lucide-react";

const differentiators = [
    {
        icon: <Shield className="h-10 w-10 text-primary" />,
        title: "100% Independent — White Label",
        body: "Brainsty has zero association with insurers, providers, or health services companies. We work for you. Period. No hidden incentives. No sponsored recommendations.",
    },
    {
        icon: <Eye className="h-10 w-10 text-primary" />,
        title: "Always On, Always Watching",
        body: "Not a chatbot you visit. A continuous guardian — monitoring your plan, tracking regulatory changes, flagging billing errors, and optimizing your benefits 24/7.",
    },
    {
        icon: <Database className="h-10 w-10 text-primary" />,
        title: "Real Data, Not Estimates",
        body: "Powered by 5 billion+ actual negotiated rates from hospital transparency data, government databases, and regulatory filings. You see what things REALLY cost.",
    },
    {
        icon: <Globe className="h-10 w-10 text-primary" />,
        title: "Speaks Your Language",
        body: "Available in English, Spanish, and Portuguese. Because healthcare confusion shouldn't have a language barrier.",
    },
];

export default function WhyDifferentSection() {
    return (
        <section id="why-brainsty" className="py-[80px] bg-canvas">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-[80px]">
                    <h2 className="text-[48px] font-bold font-display text-ink leading-[1.1]">
                        Why Brainsty Is Different
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {differentiators.map((item, index) => (
                        <div key={index} className="flex gap-6 p-6 rounded-none transition-all border border-hairline hover:border-hairline-strong bg-canvas">
                            <div className="shrink-0 pt-1">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-[20px] font-bold font-display text-ink leading-[1.3] mb-3">{item.title}</h3>
                                <p className="text-[16px] font-light text-body leading-[1.55]">
                                    {item.body}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
