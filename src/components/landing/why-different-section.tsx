import { Shield, Eye, Database, Globe } from "lucide-react";

const differentiators = [
    {
        icon: <Shield className="h-10 w-10 text-emerald-500" />,
        title: "100% Independent — White Label",
        body: "Brainsty has zero association with insurers, providers, or health services companies. We work for you. Period. No hidden incentives. No sponsored recommendations.",
    },
    {
        icon: <Eye className="h-10 w-10 text-brain-blue" />,
        title: "Always On, Always Watching",
        body: "Not a chatbot you visit. A continuous guardian — monitoring your plan, tracking regulatory changes, flagging billing errors, and optimizing your benefits 24/7.",
    },
    {
        icon: <Database className="h-10 w-10 text-brain-purple" />,
        title: "Real Data, Not Estimates",
        body: "Powered by 5 billion+ actual negotiated rates from hospital transparency data, government databases, and regulatory filings. You see what things REALLY cost.",
    },
    {
        icon: <Globe className="h-10 w-10 text-amber-500" />,
        title: "Speaks Your Language",
        body: "Available in English, Spanish, and Portuguese. Because healthcare confusion shouldn't have a language barrier.",
    },
];

export default function WhyDifferentSection() {
    return (
        <section id="why-brainsty" className="py-20 md:py-28 bg-white">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4">
                        Why Brainsty Is Different
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {differentiators.map((item, index) => (
                        <div key={index} className="flex gap-6 p-6 rounded-2xl transition-all hover:shadow-lg border border-transparent hover:border-slate-100">
                            <div className="shrink-0 pt-1">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold font-headline mb-3">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">
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
