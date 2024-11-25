"use client";
import "@/styles/globals.scss";
import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import Header from "@/components/Header";
import { redirect, useRouter } from 'next/navigation';
import LoadingSpinner from "@/components/LoadingSpinner";

type LayoutProps = {
    children: React.ReactNode;
};

export default function DashboardLayout({ children }: LayoutProps) {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (loading && !isAuthenticated) {
            redirect('/login');
        }
    }, [isAuthenticated, loading]);

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="flex flex-col min-h-screen bg-pageBackground">
            <Header />
            <main className="flex-grow px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}