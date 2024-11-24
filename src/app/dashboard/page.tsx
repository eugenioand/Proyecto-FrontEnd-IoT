"use client";

import { redirect } from 'next/navigation';
import { useAuth } from "@/context/auth-context";
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DashboardPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    console.log(user);

    if (!user) {
        return null;
    }
    
    if (user.role.code === 'USER') {
        redirect('/dashboard/wetland');
    } else if (user.role.code === 'ADMIN') {
        redirect('/admin');
    } else {
        redirect('/logout');
    }
}