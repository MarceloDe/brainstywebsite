export default function StatsBar() {
    const stats = [
        { number: "40%", label: "of insured Americans can't understand their coverage" },
        { number: "5B+", label: "actual negotiated rates now publicly available" },
        { number: "$78K", label: "average surprise bill for out-of-state emergencies" },
        { number: "2027", label: "deadline for insurers to provide real-time approvals" },
    ];

    return (
        <section className="py-[80px] bg-surface-dark text-on-dark overflow-hidden">
            <div className="container">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-[48px] md:text-[64px] font-bold font-display mb-2 animate-in fade-in slide-in-from-bottom duration-700 leading-[1.05]">
                                {stat.number}
                            </div>
                            <p className="text-[13px] text-on-dark-soft font-bold uppercase tracking-[1.5px] max-w-[200px] mx-auto">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="mt-16 text-center">
                    <p className="text-[12px] text-on-dark-soft opacity-60 uppercase tracking-[0.5px]">
                        Sources: KFF Health, CMS, Congressional Records 2025-2026
                    </p>
                </div>
            </div>
        </section>
    );
}
