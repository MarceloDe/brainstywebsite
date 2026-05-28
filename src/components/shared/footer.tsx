import { BrainstyLogo } from "@/components/shared/icons";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface-soft">
      <div className="container py-[64px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[48px]">
          {/* COLUMN 1 — Company */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BrainstyLogo className="h-8 w-8 text-ink" />
              <span className="text-xl font-bold font-display text-ink">
                Brainsty
              </span>
            </div>
            <p className="text-[14px] font-bold text-ink uppercase tracking-[1.5px]">Brainsty Healthcare LLC</p>
            <p className="text-[14px] font-light text-body leading-relaxed">
              Translate evidence-based research into useful knowledge. Integrate technology for sustainable health engagement. Deliver reliable knowledge for personalized health decisions.
            </p>
          </div>

          {/* COLUMN 2 — Product */}
          <div className="space-y-4">
            <h4 className="font-bold font-display text-[16px] text-ink">Product</h4>
            <ul className="space-y-2 text-[14px] font-light text-body">
              <li><Link href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/#your-shield" className="hover:text-primary transition-colors">Your Shield</Link></li>
              <li><Link href="/#for-employers" className="hover:text-primary transition-colors">For Employers</Link></li>
              <li><Link href="/#early-access" className="hover:text-primary transition-colors">Early Access</Link></li>
              <li><Link href="/concierge" className="hover:text-primary transition-colors">Wefella Chat</Link></li>
              <li><Link href="/research" className="hover:text-primary transition-colors">Curated Research</Link></li>
              <li><Link href="/repos" className="hover:text-primary transition-colors">Intelligence Map</Link></li>
              <li><Link href="/workerbrainsty" className="hover:text-primary transition-colors">Cognitive AI</Link></li>
              <li><Link href="/features" className="hover:text-primary transition-colors">Our Services</Link></li>
            </ul>
          </div>

          {/* COLUMN 3 — Legal */}
          <div className="space-y-4">
            <h4 className="font-bold font-display text-[16px] text-ink">Legal</h4>
            <ul className="space-y-2 text-[14px] font-light text-body">
              <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* COLUMN 4 — Contact */}
          <div className="space-y-4">
            <h4 className="font-bold font-display text-[16px] text-ink">Contact</h4>
            <ul className="space-y-2 text-[14px] font-light text-body">
              <li><a href="mailto:hello@brainsty.ai" className="hover:text-primary transition-colors">hello@brainsty.ai</a></li>
              <li><span>United States</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-hairline flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[12px] font-normal tracking-[0.5px] text-muted">
            © {new Date().getFullYear()} Brainsty Healthcare LLC. All rights reserved.
          </p>
          <p className="text-[12px] font-bold text-muted uppercase tracking-[1.5px]">
            Independent. White-Label. No insurance or provider affiliations.
          </p>
        </div>
      </div>
    </footer>
  );
}
