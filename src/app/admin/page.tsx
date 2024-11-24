"use client";

import { redirect } from 'next/navigation';
import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
    const { user } = useAuth();
    if (!user) {
        return null;
    }


}