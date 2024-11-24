"use client";

import { redirect } from 'next/navigation';
import { useAuth } from "@/context/auth-context";
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DashboardPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    // if (!user) {
    //     return null;
    // }
    
    return <div>Dashboard</div>;
}