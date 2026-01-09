"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { FileText, Globe, TestTube2, BotMessageSquare, BrainCircuit, GitCommitHorizontal, FileKnot } from "lucide-react";

type SectionProps = {
    children: React.ReactNode;
    className?: string;
};

const Section = ({ children, className }: SectionProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 1], ["50px", "-50px"]);

    return (
        <motion.section
            ref={ref}
            style={{ opacity, y }}
            className={cn("relative min-h-screen container mx-auto flex flex-col justify-center items-center text-center py-20 md:py-32", className)}
        >
            {children}
        </motion.section>
    );
};

const StickySection = ({ children, className }: SectionProps) => (
    <section className={cn("relative min-h-[200vh] container mx-auto", className)}>
        {children}
    </section>
);


export default function WorkerBrainstyClient() {
    const heroImage = PlaceHolderImages.find(p => p.id === 'workerbrainsty-hero');
    const conciergeImage = PlaceHolderImages.find(p => p.id === 'workerbrainsty-concierge');
    const designRigidImage = PlaceHolderImages.find(p => p.id === 'workerbrainsty-design-rigid');
    const designAdaptiveImage = PlaceHolderImages.find(p => p.id === 'workerbrainsty-design-adaptive');
    const architectureImage = PlaceHolderImages.find(p => p.id === 'workerbrainsty-architecture');
    const complexityImage = PlaceHolderImages.find(p => p.id === 'workerbrainsty-complexity');

    const stickyRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: stickyRef,
        offset: ["start start", "end end"],
    });

    const scaleConcierge = useTransform(scrollYProgress, [0.1, 0.25], [0.8, 1]);
    const opacityConcierge = useTransform(scrollYProgress, [0, 0.1, 0.25, 0.3], [0, 1, 1, 0]);
    const yConcierge = useTransform(scrollYProgress, [0, 0.25], ["100px", "0px"]);

    const opacityDesign = useTransform(scrollYProgress, [0.3, 0.35, 0.5, 0.55], [0, 1, 1, 0]);

    const opacityArchitecture = useTransform(scrollYProgress, [0.55, 0.6, 0.75, 0.8], [0, 1, 1, 0]);

    const opacityComplexity = useTransform(scrollYProgress, [0.8, 0.85, 1], [0, 1, 1]);
    const scaleComplexity = useTransform(scrollYProgress, [0.8, 1], [0.8, 1]);
    const yComplexity = useTransform(scrollYProgress, [0.8, 1], ["100px", "0px"]);

    return (
        <div className="bg-background text-foreground font-sans">
            {/* 1. Hero Section */}
            <section className="h-screen flex flex-col justify-center items-center text-center relative overflow-hidden">
                 {heroImage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 0.3, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 z-0"
                    >
                        <Image
                            src={heroImage.imageUrl}
                            alt={heroImage.description}
                            fill
                            className="object-cover"
                            data-ai-hint={heroImage.imageHint}
                            priority
                        />
                         <div className="absolute inset-0 bg-background/50"></div>
                    </motion.div>
                )}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="z-10 max-w-4xl px-4"
                >
                    <h1 className="text-4xl md:text-7xl font-bold font-headline tracking-tight">
                        Beyond Automation. Autonomous Intelligence.
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
                        Meet WorkerBrainsty—the digital resident that doesn't just read healthcare data; it understands it.
                    </p>
                </motion.div>
            </section>

            {/* Scrollytelling container */}
            <div ref={stickyRef} className="relative">
                {/* Sticky Visuals */}
                <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                    <motion.div style={{ opacity: opacityConcierge, scale: scaleConcierge, y: yConcierge }} className="absolute inset-0">
                         {conciergeImage && <Image src={conciergeImage.imageUrl} alt={conciergeImage.description} fill className="object-contain p-16" data-ai-hint={conciergeImage.imageHint}/>}
                    </motion.div>
                    <motion.div style={{ opacity: opacityDesign }} className="absolute inset-0 flex items-center justify-center gap-8 px-8">
                        <div className="w-1/2 h-1/2 relative">
                            {designRigidImage && <Image src={designRigidImage.imageUrl} alt={designRigidImage.description} fill className="object-contain" data-ai-hint={designRigidImage.imageHint} />}
                        </div>
                        <div className="w-1/2 h-1/2 relative">
                             {designAdaptiveImage && <Image src={designAdaptiveImage.imageUrl} alt={designAdaptiveImage.description} fill className="object-contain" data-ai-hint={designAdaptiveImage.imageHint} />}
                        </div>
                    </motion.div>
                    <motion.div style={{ opacity: opacityArchitecture }} className="absolute inset-0">
                        {architectureImage && <Image src={architectureImage.imageUrl} alt={architectureImage.description} fill className="object-contain p-8" data-ai-hint={architectureImage.imageHint} />}
                    </motion.div>
                     <motion.div style={{ opacity: opacityComplexity, scale: scaleComplexity, y: yComplexity }} className="absolute inset-0">
                        {complexityImage && <Image src={complexityImage.imageUrl} alt={complexityImage.description} fill className="object-contain p-8" data-ai-hint={complexityImage.imageHint} />}
                    </motion.div>
                </div>
                
                {/* Scrolling Text Sections */}
                <div className="relative z-10">
                    <div className="h-screen"></div>
                    
                    {/* 2. The Expert Concierge */}
                    <div className="h-screen flex items-center justify-center">
                         <div className="max-w-xl text-center p-8 bg-background/80 backdrop-blur-sm rounded-lg">
                            <BotMessageSquare className="h-12 w-12 mx-auto text-primary mb-4" />
                            <h2 className="text-3xl md:text-4xl font-bold font-headline">Your 24/7 Expert Concierge</h2>
                            <p className="mt-4 text-lg text-foreground/80">Powered by Brainsty AI, it accumulates expertise recursively, distinguishing between noise and critical medical breakthroughs.</p>
                            <div className="flex justify-center gap-4 mt-6 text-muted-foreground">
                                <FileText className="h-6 w-6"/>
                                <Globe className="h-6 w-6"/>
                                <TestTube2 className="h-6 w-6"/>
                            </div>
                        </div>
                    </div>

                    {/* 3. Human-Inspired Design */}
                     <div className="h-screen flex items-center justify-center">
                         <div className="max-w-xl text-center p-8 bg-background/80 backdrop-blur-sm rounded-lg">
                            <BrainCircuit className="h-12 w-12 mx-auto text-primary mb-4" />
                            <h2 className="text-3xl md:text-4xl font-bold font-headline">Cognitive Architecture</h2>
                            <p className="mt-4 text-lg text-foreground/80">Unlike rigid scrapers, WorkerBrainsty reasons like a human researcher—planning, critiquing, and diving deep when the data demands it.</p>
                        </div>
                    </div>

                    {/* 4. The Architecture */}
                     <div className="h-screen flex items-center justify-center">
                         <div className="max-w-xl text-center p-8 bg-background/80 backdrop-blur-sm rounded-lg">
                            <GitCommitHorizontal className="h-12 w-12 mx-auto text-primary mb-4" />
                            <h2 className="text-3xl md:text-4xl font-bold font-headline">Autonomous Event Loop</h2>
                            <p className="mt-4 text-lg text-foreground/80">From 'Deep Research' agents to Dynamic Knowledge Graphs, the system operates on a proactive pulse, ensuring you never miss a regulatory shift.</p>
                        </div>
                    </div>

                    {/* 5. Solving Healthcare Complexity */}
                     <div className="h-screen flex items-center justify-center">
                         <div className="max-w-xl text-center p-8 bg-background/80 backdrop-blur-sm rounded-lg">
                            <FileKnot className="h-12 w-12 mx-auto text-primary mb-4" />
                            <h2 className="text-3xl md:text-4xl font-bold font-headline">Resource Optimization</h2>
                            <p className="mt-4 text-lg text-foreground/80">We decode the complexity of healthcare resource allocation, transforming raw data streams into synthesized, actionable intelligence.</p>
                        </div>
                    </div>

                </div>
            </div>

            <section className="h-48 bg-background"></section>
        </div>
    );
}
