export default function StatsBar() {
    const stats = [
        { number: "40%", label: "of insured Americans can't understand their coverage" },
        { number: "5B+", label: "actual negotiated rates now publicly available" },
        { number: "$78K", label: "average surprise bill for out-of-state emergencies" },
        { number: "2027", label: "deadline for insurers to provide real-time approvals" },
    ];

    return (
        <section className="py-12 bg-brain-blue text-white overflow-hidden">
            <div className="container">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl md:text-5xl font-black mb-2 animate-in fade-in slide-in-from-bottom duration-700">
                                {stat.number}
                            </div>
                            <p className="text-xs md:text-sm text-blue-100 font-medium max-w-[200px] mx-auto opacity-80 uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="mt-8 text-center">
                    <p className="text-[10px] text-blue-200/60 uppercase tracking-widest">
                        Sources: KFF Health, CMS, Congressional Records 2025-2026
                    </p>
                </div>
            </div>
        </section>
    );
}
