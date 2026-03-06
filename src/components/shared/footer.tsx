import { BrainstyLogo } from "@/components/shared/icons";

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* COLUMN 1 — Company */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BrainstyLogo className="h-8 w-8" />
              <span className="text-xl font-bold font-headline bg-gradient-to-r from-brain-blue to-brain-purple bg-clip-text text-transparent">
                Brainsty
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900">Brainsty Healthcare LLC</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Translate evidence-based research into useful knowledge. Integrate technology for sustainable health engagement. Deliver reliable knowledge for personalized health decisions.
            </p>
          </div>

          {/* COLUMN 2 — Product */}
          <div className="space-y-4">
            <h4 className="font-bold font-headline text-slate-900">Product</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#how-it-works" className="hover:text-brain-blue">How It Works</a></li>
              <li><a href="#your-shield" className="hover:text-brain-blue">Your Shield</a></li>
              <li><a href="#for-employers" className="hover:text-brain-blue">For Employers</a></li>
              <li><a href="#early-access" className="hover:text-brain-blue">Early Access</a></li>
              <li><a href="/concierge" className="hover:text-brain-blue">Try Wefella</a></li>
            </ul>
          </div>

          {/* COLUMN 3 — Legal */}
          <div className="space-y-4">
            <h4 className="font-bold font-headline text-slate-900">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="/privacy" className="hover:text-brain-blue">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-brain-blue">Terms of Service</a></li>
            </ul>
          </div>

          {/* COLUMN 4 — Contact */}
          <div className="space-y-4">
            <h4 className="font-bold font-headline text-slate-900">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="mailto:hello@brainsty.ai" className="hover:text-brain-blue">hello@brainsty.ai</a></li>
              <li><span>United States</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Brainsty Healthcare LLC. All rights reserved.
          </p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Independent. White-Label. No insurance or provider affiliations.
          </p>
        </div>
      </div>
    </footer>
  );
}
