"use client";

import * as React from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shell";
import { getUsers } from "@/services/users";
import { toast } from "sonner";
import { UsersTable } from "./components/Table";
interface UsersData {
    data: any[];
    pageCount: number;
    totalCount: number;
    currentPage: number;
    perPage: number;
    error?: any;
}

const getDefaultParams = (params: URLSearchParams) => {
    const defaultParams: Record<string, string> = {
        page: "1",
        page_size: "10",
        sort: "created_at.desc",
    };

    let updated = false;
    for (const [key, value] of Object.entries(defaultParams)) {
        if (!params.get(key)) {
            params.set(key, value);
            updated = true;
        }
    }

    return { updated, params };
};

const UsersPage = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [usersData, setUsersData] = React.useState<UsersData | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    
    React.useEffect(() => {
        // const params = Object.fromEntries(searchParams.entries());
        const params = new URLSearchParams(searchParams.toString());
        const { updated, params: updatedParams } = getDefaultParams(params);
    
        if (updated) {
            router.replace(`${window.location.pathname}?${updatedParams.toString()}`);
        } else {
            const fetchData = async () => {
                try {
                    const queryParams = Object.fromEntries(params.entries());   
                    console.log("Making API request with query string:", queryParams);
                    const data = await getUsers(queryParams);
                    setUsersData(data);
                } catch (error) {
                    const errorMsg = error?.message || "Ha ocurrido un error al cargar los usuarios. Por favor, intenta de nuevo.";
                    setError(errorMsg);
                    toast.error(errorMsg);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [searchParams, router]);

    if (isLoading) {
        return (
            <Shell className="gap-2">
                <DataTableSkeleton
                    columnCount={5}
                    cellWidths={["w-1/4", "w-1/4", "w-1/4", "w-1/4", "w-1/4"]}
                    shrinkZero
                />
            </Shell>
        );
    }

    if (error) {
        return (
            <Shell>
                <div className="text-red-500">Error: {error}</div>
            </Shell>
        );
    }

    if (!usersData) {
        return (
            <Shell>
                <div>No data available.</div>
            </Shell>
        );
    }
    
    return (
        <Shell>
            <UsersTable usersData={usersData} />
        </Shell>
    );
};

export default UsersPage;