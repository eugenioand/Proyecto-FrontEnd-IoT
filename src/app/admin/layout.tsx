"use client";
import "@/styles/globals.css";
import useAuth from "@/hooks/useAuth";
import Header from "@/components/Header";


type LayoutProps = {
    children: React.ReactNode;
};

export default function AdminLayout({ children }: LayoutProps) {
    useAuth();
    return (
        <div className="flex flex-col min-h-screen bg-pageBackground">
            <Header />
            <main className="flex flex-col  px-2 py-6">
                {children}
            </main>
        </div>
    );
}