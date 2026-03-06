export default function PrivacyPage() {
    return (
        <div className="container py-20 max-w-4xl">
            <h1 className="text-4xl font-bold font-headline mb-8 text-slate-900 border-b pb-4">Privacy Policy</h1>

            <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
                <p className="text-lg font-medium">Effective Date: March 5, 2026</p>

                <section>
                    <h2 className="text-2xl font-bold font-headline text-slate-900 mt-8 mb-4">Our Commitment to Your Privacy</h2>
                    <p>
                        At Brainsty Healthcare LLC, we believe that your healthcare data belongs to YOU. Our primary mission is to empower individuals with intelligence, not to monetize their personal information.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold font-headline text-slate-900 mt-8 mb-4">Independence and No Data Sharing</h2>
                    <p className="font-bold text-brain-blue">
                        Brainsty is 100% independent. We have NO affiliations with insurance companies, healthcare providers, or pharmaceutical firms.
                    </p>
                    <p>
                        Specifically, we DO NOT share your data with:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Your insurance carrier or any other insurer.</li>
                        <li>Your doctors, hospitals, or any healthcare provider.</li>
                        <li>Advertising networks or data brokers.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold font-headline text-slate-900 mt-8 mb-4">HIPAA Compliance Intent</h2>
                    <p>
                        While Brainsty is an independent intelligence platform and not a healthcare provider or "covered entity" in many traditional contexts, we architect our systems with HIPAA-compliant standards (Health Insurance Portability and Accountability Act) to ensure the highest level of security for your medical and financial information.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold font-headline text-slate-900 mt-8 mb-4">Data We Collect</h2>
                    <p>
                        We only collect information that is necessary to provide you with the AI Concierge services, such as your email for account access, and any insurance plan details or medical bills you choose to share with Wefella for analysis.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold font-headline text-slate-900 mt-8 mb-4">Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:hello@brainsty.ai" className="text-brain-blue underline">hello@brainsty.ai</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
