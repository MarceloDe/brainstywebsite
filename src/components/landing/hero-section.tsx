"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

export default function HeroSection() {
    const heroImage = PlaceHolderImages.find(img => img.id === 'hero');
    const { t } = useLanguage();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <section className="relative py-[80px] min-h-[600px] w-full overflow-hidden bg-gradient-to-br from-primary to-primary-active">
            {/* soft decorative glows */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative container mx-auto flex flex-col items-center gap-12 px-4 md:grid md:grid-cols-2 md:items-center"
            >
                {/* text column */}
                <div className="text-center md:text-left">
                    <motion.h1
                        variants={itemVariants}
                        className="text-[40px] md:text-[64px] font-bold font-display text-on-dark leading-[1.05]"
                    >
                        {t("hero.headline")}
                    </motion.h1>
                    <motion.p
                        variants={itemVariants}
                        className="mt-6 max-w-xl mx-auto md:mx-0 text-[18px] md:text-[24px] font-light text-on-dark-soft leading-[1.55]"
                    >
                        {t("hero.sub")}
                    </motion.p>
                    <motion.div
                        variants={itemVariants}
                        className="mt-10 flex flex-col items-center md:items-start gap-4"
                    >
                        <Button asChild size="default" variant="secondary" className="transition-transform duration-300 hover:scale-[1.03]">
                            <Link href="#early-access">{t("hero.cta")}</Link>
                        </Button>
                        <p className="text-[14px] font-light text-on-dark-soft italic">
                            {t("hero.tagline")}
                        </p>
                    </motion.div>
                </div>

                {/* illustration column */}
                {heroImage && (
                    <motion.div
                        variants={itemVariants}
                        className="flex w-full justify-center md:justify-end"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={heroImage.imageUrl}
                            alt={heroImage.description}
                            fetchPriority="high"
                            data-ai-hint={heroImage.imageHint}
                            className="ag-float-slow w-full max-w-md md:max-w-lg drop-shadow-2xl"
                        />
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}
