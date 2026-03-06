"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EarlyAccessSection() {
    return (
        <section id="early-access" className="py-20 md:py-28 bg-slate-950 text-white">
            <div className="container px-4">
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4">
                        Join the Waitlist
                    </h2>
                    <h3 className="text-xl md:text-2xl text-amber-500 font-medium mb-8">
                        Be First to Have a Healthcare Guardian
                    </h3>
                    <p className="text-slate-300 mb-10 text-lg">
                        We&apos;re expanding Wefella AI concierge access. Join the waitlist to stop guessing about your healthcare costs.
                    </p>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="text-left space-y-2">
                            <Input
                                type="email"
                                placeholder="Email address"
                                className="bg-slate-900 border-slate-800 text-white h-14"
                                required
                            />
                        </div>
                        <div className="text-left space-y-2">
                            <Select>
                                <SelectTrigger className="bg-slate-900 border-slate-800 text-white h-14 uppercase tracking-wider text-xs font-bold">
                                    <SelectValue placeholder="I AM A..." />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                    <SelectItem value="individual">Individual</SelectItem>
                                    <SelectItem value="employer">Employer</SelectItem>
                                    <SelectItem value="consultant">Benefits Consultant</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white border-none h-14 text-lg font-bold uppercase tracking-widest mt-4">
                            Get Early Access
                        </Button>
                    </form>

                    <p className="mt-8 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                        We never share your information. No insurance company ties. No provider affiliations. Just healthcare intelligence for you.
                    </p>
                </div>
            </div>
        </section>
    );
}
