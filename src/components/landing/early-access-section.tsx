"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EarlyAccessSection() {
    return (
        <section id="early-access" className="py-[80px] bg-surface-dark text-on-dark">
            <div className="container px-4">
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-[48px] font-bold font-display mb-4 leading-[1.1]">
                        Join the Waitlist
                    </h2>
                    <h3 className="text-[24px] text-on-dark-soft font-light mb-8 leading-[1.25]">
                        Be First to Have a Healthcare Guardian
                    </h3>
                    <p className="text-on-dark-soft mb-10 text-[18px] font-light leading-[1.55]">
                        We&apos;re expanding Wefella AI concierge access. Join the waitlist to stop guessing about your healthcare costs.
                    </p>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="text-left space-y-2">
                            <Input
                                type="email"
                                placeholder="Email address"
                                className="bg-canvas border-hairline text-ink h-[48px] px-[16px] py-[14px] rounded-none focus-visible:ring-primary focus-visible:border-ink placeholder:text-muted-soft"
                                required
                            />
                        </div>
                        <div className="text-left space-y-2">
                            <Select>
                                <SelectTrigger className="bg-canvas border-hairline text-ink h-[48px] px-[16px] py-[14px] rounded-none focus-visible:ring-primary focus-visible:border-ink uppercase tracking-[1.5px] text-[13px] font-bold">
                                    <SelectValue placeholder="I AM A..." />
                                </SelectTrigger>
                                <SelectContent className="bg-canvas border-hairline text-ink rounded-none">
                                    <SelectItem value="individual">Individual</SelectItem>
                                    <SelectItem value="employer">Employer</SelectItem>
                                    <SelectItem value="consultant">Benefits Consultant</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" variant="default" size="default" className="w-full mt-8">
                            Get Early Access
                        </Button>
                    </form>

                    <p className="mt-8 text-[12px] text-on-dark-soft max-w-sm mx-auto leading-relaxed">
                        We never share your information. No insurance company ties. No provider affiliations. Just healthcare intelligence for you.
                    </p>
                </div>
            </div>
        </section>
    );
}
