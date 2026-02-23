"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReposPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
            <iframe
                src="/stars.html"
                className="h-full w-full border-none"
                title="GitHub Stars Intelligence Map"
            />
        </div>
    );
}
