"use client";
import "@/styles/globals.scss";
import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import Header from "@/components/Header";
import { useRouter} from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";


type LayoutProps = {
    children: React.ReactNode;
};

export default function AdminLayout({ children }: LayoutProps) {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="flex flex-col min-h-screen bg-pageBackground">
            <Header />
            <main className="flex flex-col  px-2 py-6">
                {children}
            </main>
        </div>
    );
}