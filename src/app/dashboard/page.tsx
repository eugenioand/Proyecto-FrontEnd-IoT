"use client";

import { redirect } from 'next/navigation';
import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }
    
    if (user.role.code === 'USER') {
        redirect('/dashboard/wetland');
    } else if (user.role.code === 'ADMIN') {
        redirect('/dashboard/admin');
    } else {
        redirect('/logout');
    }
}