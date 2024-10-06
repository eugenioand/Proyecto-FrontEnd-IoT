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
            <main className="mx-auto mt-3">
                {children}
            </main>
        </div>
    );
}