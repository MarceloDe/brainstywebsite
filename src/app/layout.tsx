import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/auth-context";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Brainsty — AI Healthcare Concierge | Know Your Real Costs",
  description: "AI-powered healthcare concierge. Know your real costs. Prevent surprise bills. Optimize your benefits. Independent — no insurer or provider ties.",
  openGraph: {
    title: "Brainsty — Your Healthcare Intelligence",
    description: "Stop guessing about healthcare costs. Brainsty is an AI concierge that works for you.",
    type: "website",
    url: "https://brainsty.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("min-h-screen bg-canvas text-body font-body font-light antialiased")}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
