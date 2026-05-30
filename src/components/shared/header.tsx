"use client";

import Link from "next/link";
import { BrainstyLogo } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Globe } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function Header() {
  const { user, logout, isLoading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const activeLinks = user ? [
    { href: "/concierge", label: t("nav.wefellaChat") },
    { href: "/research", label: t("nav.curatedResearch") },
    { href: "/repos", label: t("nav.intelligenceMap") },
    { href: "/workerbrainsty", label: t("nav.cognitiveAi") },
  ] : [
    { href: "/#how-it-works", label: t("nav.howItWorks") },
    { href: "/#your-shield", label: t("nav.yourShield") },
    { href: "/#why-brainsty", label: t("nav.whyBrainsty") },
    { href: "/#for-employers", label: t("nav.forEmployers") },
    { href: "/workerbrainsty", label: t("nav.cognitiveAi") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-hairline bg-canvas/80 backdrop-blur-md">
      <div className="container flex h-[64px] max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2 transition-transform duration-300 hover:scale-[1.02] hover:opacity-90">
          <BrainstyLogo className="h-8 w-8 text-ink" />
          <span className="text-[20px] font-bold font-display text-ink sm:inline-block">
            Brainsty
          </span>
        </Link>
        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm">
          {activeLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-normal tracking-[0.3px] text-ink transition-colors duration-300 hover:text-primary"
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full transition-transform duration-300 hover:scale-105">
                <Globe className="h-5 w-5 text-ink" />
                <span className="sr-only">Select Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 bg-canvas border border-hairline">
              <DropdownMenuItem onClick={() => setLanguage("en")} className="flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-surface-soft">
                <span>🇺🇸</span> <span className={language === "en" ? "font-bold text-primary" : "text-ink"}>English</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("es")} className="flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-surface-soft">
                <span>🇪🇸</span> <span className={language === "es" ? "font-bold text-primary" : "text-ink"}>Español</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("pt")} className="flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-surface-soft">
                <span>🇧🇷</span> <span className={language === "pt" ? "font-bold text-primary" : "text-ink"}>Português</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/concierge">Wefella Chat</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/research">Curated Research</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/repos">Intelligence Map</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/workerbrainsty">Cognitive AI</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-canvas">
              <Link href="/" className="mr-6 flex items-center space-x-2 mb-6" onClick={closeMobileMenu}>
                <BrainstyLogo className="h-8 w-8 text-ink" />
                <span className="text-[20px] font-bold font-display text-ink">Brainsty</span>
              </Link>
              <div className="flex flex-col space-y-4">
                {activeLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[14px] font-normal tracking-[0.3px] text-ink transition-colors hover:text-primary"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
