"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
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
        <section className="relative py-[80px] min-h-[600px] w-full bg-surface-dark overflow-hidden">
            {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                    data-ai-hint={heroImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-surface-dark/70" />
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative container mx-auto h-full flex flex-col items-center justify-center text-center px-4"
            >
                <motion.h1 
                    variants={itemVariants}
                    className="text-[40px] md:text-[64px] font-bold font-display text-on-dark leading-[1.05]"
                >
                    {t("hero.headline")}
                </motion.h1>
                <motion.p 
                    variants={itemVariants}
                    className="mt-6 max-w-3xl mx-auto text-[18px] md:text-[24px] font-light text-on-dark-soft leading-[1.55]"
                >
                    {t("hero.sub")}
                </motion.p>
                <motion.div 
                    variants={itemVariants}
                    className="mt-10 flex flex-col items-center gap-4"
                >
                    <Button asChild size="default" variant="default" className="transition-transform duration-300 hover:scale-[1.03]">
                        <Link href="#early-access">{t("hero.cta")}</Link>
                    </Button>
                    <p className="text-[14px] font-light text-on-dark-soft italic">
                        {t("hero.tagline")}
                    </p>
                </motion.div>
            </motion.div>
        </section>
    );
}
