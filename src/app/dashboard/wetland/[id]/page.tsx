"use client";
import { useEffect, useState } from "react";
import WetlandDetail from "../components/WetlandDetail";
import { getWetland } from "@/lib/actions/dashboard/wetlands";
import { Skeleton } from "@/components/ui/skeleton";

export default function WetlandDetailPage({ params }: {
    params: { id: string } 
}) {
    const [wetland, setWetland] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWetland = async () => {
            setLoading(true);
            // const result = await getWetland(params.id);
            const result = {
                id: 1,
                name: 'Wetland 1',
                location: 'Location 1',
                status: 'good',
                nodes: {
                    node1: {
                        name: 'Node 1',
                        sensors: {
                            sensor1: {
                                name: 'Sensor 1',
                                unity: 'm',
                                value: 1,
                                max: 2,
                            },
                            sensor2: {
                                name: 'Sensor 2',
                                unity: 'm',
                                value: 2,
                                max: 3,
                            },
                        },
                    },
                    node2: {
                        name: 'Node 2',
                        sensors: {
                            sensor1: {
                                name: 'Sensor 1',
                                unity: 'm',
                                value: 1,
                                max: 2,
                            },
                            sensor2: {
                                name: 'Sensor 2',
                                unity: 'm',
                                value: 2,
                                max: 3,
                            },
                        },
                    },
                },
            }

            // if (result.error) {
            //     setError(result.error);
            // } else {
            //     setWetland(result);
            // }
            setWetland(result);
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
        <WetlandDetail
            id={wetland.id}
            name={wetland.name}
            location={wetland.location}
            status={wetland.status}
            nodes={wetland.nodes}
        />
    );
}

const WetlandSkeleton = () => {
    return (
        <div className="grid grid-cols-1 w-full mx-auto">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
        </div>
    );
}

// export default WetlandDetailPage;

