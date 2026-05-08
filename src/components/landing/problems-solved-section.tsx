import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const problems = [
    {
        tag: "COST TRANSPARENCY",
        title: "My MRI estimate was $3,800. The cash price? $399.",
        body: "Insurance pricing is broken. Brainsty finds your REAL cost — comparing actual negotiated rates, cash-pay alternatives, and your deductible status. Decisions based on facts, not guesses.",
        bgColor: "bg-surface-soft",
    },
    {
        tag: "SURPRISE BILL DEFENSE",
        title: "I had a heart attack out of state. The hospital billed me $78,000.",
        body: "Cross-state emergencies shouldn't bankrupt you. Brainsty knows the rules — Medicaid emergency coverage, single-case agreements, charity care — and generates dispute letters and phone scripts for you.",
        bgColor: "bg-canvas",
    },
    {
        tag: "GHOST NETWORK FIGHTER",
        title: "Every therapist on my plan's list doesn't answer or isn't taking patients.",
        body: "Ghost networks are real. Brainsty documents your failed attempts, files gap exceptions for out-of-network care at in-network prices, and invokes mental health parity protections — automatically.",
        bgColor: "bg-surface-soft",
    },
    {
        tag: "PLAN OPTIMIZER",
        title: "I'm choosing between 3 health plans and have no idea which is better.",
        body: "Stop guessing. Brainsty analyzes your actual medical usage, prescriptions, and provider preferences to simulate costs under each plan. You choose with data, not hope.",
        bgColor: "bg-canvas",
    },
    {
        tag: "DENIAL FIGHTER",
        title: "My insurance denied the treatment my doctor recommended.",
        body: "Brainsty generates medical necessity appeals with clinical evidence, identifies manufacturer assistance programs, requests expedited review, and prepares external appeals to state regulators.",
        bgColor: "bg-surface-soft",
    },
    {
        tag: "AUTO-CLAIMS BUILDER",
        title: "I got a bill for services I thought were covered.",
        body: "Brainsty compares every bill against your plan terms and actual negotiated rates. When something doesn't match, it flags the error and builds your claim — even before the bill reaches your mailbox.",
        bgColor: "bg-canvas",
    },
];

export default function ProblemsSolvedSection() {
    return (
        <section id="your-shield" className="py-[80px] bg-surface-dark">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-[80px]">
                    <h2 className="text-[48px] font-bold font-display mb-4 text-on-dark leading-[1.1]">
                        Real Problems. Real Solutions.
                    </h2>
                    <p className="text-[18px] text-on-dark-soft font-light leading-[1.55]">
                        Healthcare is complex. We&apos;re here to make it simple.
                    </p>
                </div>

                <div className="grid gap-[32px]">
                    {problems.map((problem, index) => (
                        <div
                            key={index}
                            className={`min-h-[40vh] md:min-h-[50vh] flex flex-col justify-center p-[32px] md:p-[64px] rounded-none ${problem.bgColor}`}
                        >
                            <div className="max-w-4xl mx-auto w-full">
                                <span className="inline-block mb-6 text-[13px] font-bold tracking-[1.5px] uppercase text-primary">
                                    {problem.tag}
                                </span>
                                <h3 className="text-[32px] md:text-[48px] font-bold font-display mb-6 text-ink leading-[1.1] italic">
                                    &ldquo;{problem.title}&rdquo;
                                </h3>
                                <p className="text-[18px] md:text-[24px] font-light text-body leading-[1.55]">
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
