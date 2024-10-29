"use client";
import "@/styles/globals.css";
import useAuth from "@/hooks/useAuth";
import Header from "@/components/Header";


type LayoutProps = {
    children: React.ReactNode;
};

export default function DashboardLayout({ children }: LayoutProps) {
    useAuth();
    return (
        <div className="flex flex-col min-h-screen bg-pageBackground">
            <Header />
            <main className="flex-grow mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}