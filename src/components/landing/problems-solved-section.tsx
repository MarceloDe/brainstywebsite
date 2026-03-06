import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const problems = [
    {
        tag: "COST TRANSPARENCY",
        title: "My MRI estimate was $3,800. The cash price? $399.",
        body: "Insurance pricing is broken. Brainsty finds your REAL cost — comparing actual negotiated rates, cash-pay alternatives, and your deductible status. Decisions based on facts, not guesses.",
        bgColor: "bg-white",
    },
    {
        tag: "SURPRISE BILL DEFENSE",
        title: "I had a heart attack out of state. The hospital billed me $78,000.",
        body: "Cross-state emergencies shouldn't bankrupt you. Brainsty knows the rules — Medicaid emergency coverage, single-case agreements, charity care — and generates dispute letters and phone scripts for you.",
        bgColor: "bg-slate-50",
    },
    {
        tag: "GHOST NETWORK FIGHTER",
        title: "Every therapist on my plan's list doesn't answer or isn't taking patients.",
        body: "Ghost networks are real. Brainsty documents your failed attempts, files gap exceptions for out-of-network care at in-network prices, and invokes mental health parity protections — automatically.",
        bgColor: "bg-white",
    },
    {
        tag: "PLAN OPTIMIZER",
        title: "I'm choosing between 3 health plans and have no idea which is better.",
        body: "Stop guessing. Brainsty analyzes your actual medical usage, prescriptions, and provider preferences to simulate costs under each plan. You choose with data, not hope.",
        bgColor: "bg-slate-50",
    },
    {
        tag: "DENIAL FIGHTER",
        title: "My insurance denied the treatment my doctor recommended.",
        body: "Brainsty generates medical necessity appeals with clinical evidence, identifies manufacturer assistance programs, requests expedited review, and prepares external appeals to state regulators.",
        bgColor: "bg-white",
    },
    {
        tag: "AUTO-CLAIMS BUILDER",
        title: "I got a bill for services I thought were covered.",
        body: "Brainsty compares every bill against your plan terms and actual negotiated rates. When something doesn't match, it flags the error and builds your claim — even before the bill reaches your mailbox.",
        bgColor: "bg-slate-50",
    },
];

export default function ProblemsSolvedSection() {
    return (
        <section id="your-shield" className="py-20 md:py-28 bg-slate-900 text-white">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4">
                        Real Problems. Real Solutions.
                    </h2>
                    <p className="text-xl text-slate-300">
                        Healthcare is complex. We&apos;re here to make it simple.
                    </p>
                </div>

                <div className="grid gap-8">
                    {problems.map((problem, index) => (
                        <div
                            key={index}
                            className={`min-h-[40vh] md:min-h-[50vh] flex flex-col justify-center p-8 md:p-16 rounded-3xl ${problem.bgColor} text-slate-900`}
                        >
                            <div className="max-w-4xl mx-auto">
                                <Badge className="bg-brain-blue/10 text-brain-blue border-none mb-6 px-4 py-1.5 text-xs font-bold tracking-wider uppercase">
                                    {problem.tag}
                                </Badge>
                                <h3 className="text-3xl md:text-5xl font-bold font-headline mb-6 leading-tight italic">
                                    &ldquo;{problem.title}&rdquo;
                                </h3>
                                <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
                                    {problem.body}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
