"use client";
import "@/styles/globals.scss";
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
            <main className="flex-grow px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}