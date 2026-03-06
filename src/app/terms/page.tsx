export default function TermsPage() {
    return (
        <div className="container py-20 max-w-4xl">
            <h1 className="text-4xl font-bold font-headline mb-8 text-slate-900 border-b pb-4">Terms of Service</h1>

            <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
                <p className="text-lg font-medium">Effective Date: March 5, 2026</p>

                <section>
                    <h2 className="text-2xl font-bold font-headline text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using the Brainsty website and the Wefella AI Concierge, you agree to be bound by these Terms of Service.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold font-headline text-slate-900 mt-8 mb-4">2. Independent Status — Information Only</h2>
                    <p className="bg-amber-50 p-4 border-l-4 border-amber-400 font-medium">
                        IMPORTANT: Brainsty is an independent information service. WE ARE NOT DOCTORS, WE ARE NOT INSURANCE AGENTS, AND WE ARE NOT LAWYERS.
                    </p>
                    <p className="mt-4">
                        The information provided by Wefella and the Brainsty platform is for educational and navigational purposes only. It does not constitute medical advice, legal advice, or a guarantee of insurance coverage or payment.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold font-headline text-slate-900 mt-8 mb-4">3. Not Medical Advice</h2>
                    <p>
                        Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on Brainsty.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold font-headline text-slate-900 mt-8 mb-4">4. User Agreements</h2>
                    <p>
                        When you use Brainsty to analyze medical bills or insurance plans, you represent that you have the right to share that information and that it is accurate to the best of your knowledge.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold font-headline text-slate-900 mt-8 mb-4">5. Limitation of Liability</h2>
                    <p>
                        Brainsty Healthcare LLC provides its services "as is" and makes no warranties regarding the accuracy of negotiated rate data or the outcome of any billing disputes. We are not responsible for any financial decisions you make based on our information.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold font-headline text-slate-900 mt-8 mb-4">6. Contact</h2>
                    <p>
                        Questions? Email us at: <a href="mailto:hello@brainsty.ai" className="text-brain-blue underline">hello@brainsty.ai</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
