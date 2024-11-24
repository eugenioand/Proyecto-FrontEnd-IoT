"use client";

import { redirect } from 'next/navigation';
import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
    const { user } = useAuth();

    console.log(user);

    if (!user) {
        return null;
    }

    if (user.role.code === 'USER') {
        redirect('/dashboard/wetland');
    } else if (user.role.code === 'ADMIN') {
        redirect('/admin/users');
    } else {
        redirect('/logout');
    }
}