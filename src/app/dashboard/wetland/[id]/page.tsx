"use client";
import { useEffect, useState } from "react";
import WetlandDetail from "../components/WetlandDetail";
import { getWetland } from "@/lib/actions/dashboard/wetlands";
import { Skeleton } from "@/components/ui/skeleton";

import { Wetland } from "@/types";

export default function WetlandDetailPage({ params }: {
    params: { id: string } 
}) {
    const [wetland, setWetland] = useState<Wetland>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWetland = async () => {
            setLoading(true);
            const result = await getWetland(params.id);
            
            if (result.error) {
                setError(result.error);
            } else {
                setWetland(result);
            }
            setLoading(false);
        }
        fetchWetland();
    }, [params.id]);

    const closeErrorModal = () => {
        setError(null);
    }

    if (loading) {
        return <WetlandSkeleton />;
    }

    return (
        wetland && (
            <WetlandDetail
                id={wetland.id}
                name={wetland.name}
                location={wetland.location}
                status={wetland.status as "good" | "warning" | "alert"}
                nodes={wetland.nodes}
            />
        )
    );
}

const WetlandSkeleton = () => {
    return (
        <div className="flex flex-col w-full gap-5">
            <Skeleton className="h-72" />
            <Skeleton className="h-52" />
        </div>
    );
}

// export default WetlandDetailPage;

