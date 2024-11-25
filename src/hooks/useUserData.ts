"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    status: number;
}

interface ApiUser {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    status: number;
}

interface UseUserDataProps {
    searchTerm: string;
    searchBy: 'name' | 'email';
    roleFilter: string;
    statusFilter: string;
    startDateFilter: string;
    endDateFilter: string;
    currentPage: number;
    usersPerPage: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

const useUserData = ({
    searchTerm,
    searchBy,
    roleFilter,
    statusFilter,
    startDateFilter,
    endDateFilter,
    currentPage,
    usersPerPage,
    sortBy,
    sortOrder,
}: UseUserDataProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const params = new URLSearchParams({
                text_search: searchTerm,
                search_by: searchBy,
                role: roleFilter,
                status: statusFilter,
                start_date: startDateFilter,
                end_date: endDateFilter,
                page: currentPage.toString(),
                page_size: usersPerPage.toString(), // pageSize
                sort_by: sortBy,
                sort_order: sortOrder,
            });

            try {
                const response = await api.get(`/api/users?${params.toString()}`);
                const data = response.data;
                setUsers(data.map((user: ApiUser) => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.created_at,
                    status: user.status,
                })));
                setTotalUsers(data.length);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, [searchTerm, searchBy, roleFilter, statusFilter, startDateFilter, endDateFilter, currentPage, usersPerPage, sortBy, sortOrder]);

    return { users, totalUsers, loading };
};

export default useUserData;