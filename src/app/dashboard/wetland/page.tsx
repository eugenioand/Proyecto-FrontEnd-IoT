"use client";

import { useState, useEffect } from 'react';
import WetlandCard from "@/components/WetlandCard";
import { getWetlands } from '@/lib/actions/dashboard/wetlands';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorModal from '@/components/dialogs/ErrorModal';

interface Wetland {
    id: number;
    name: string;
    location: string;
    status: 'good' | 'warning' | 'alert';
    sensors: {
        [key: string]: {
            name: string;
            unity: string;
            value: number;
            max: number;
        };
    };
    lastUpdated: string;
}


const Dashboard = () => {
    const [wetlands, setWetlands] = useState<Wetland[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWetlands = async () => {
            setLoading(true);
            const result = await getWetlands();
            console.log(result);
            if (result.error) {
                setError(result.error);
            } else {
                setWetlands(result);
            }
            setLoading(false);
        }
        fetchWetlands();
    }, []);

    const closeErrorModal = () => {
        setError(null);
    }

    if (loading) {
        return <WetlandSkeleton />;
    }

    return (
        <div className='mx-auto max-w-7xl'>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 xl:justify-center  gap-10 w-full mx-auto">
                {wetlands.map((wetland) => (
                    <WetlandCard
                        key={wetland.id}
                        id={wetland.id}
                        name={wetland.name}
                        location={wetland.location}
                        sensors={wetland.sensors}
                        status={wetland.status}
                        lastUpdated={wetland.lastUpdated}
                    />
                ))}
            </div>
            {error && <ErrorModal errorMessage={error} onClose={closeErrorModal} />}
        </div>
        // <div className="flex justify-center p-4">
        // </div>
    );
};

const WetlandSkeleton = () => {
    return (
        <div className='mx-auto max-w-7xl'>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 xl:justify-center gap-10 w-full mx-auto">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="w-full min-w-72 h-[12rem] md:w-[22rem] bg-white rounded-lg shadow-md" />
                ))}
            </div>
        </div>
    );
}


export default Dashboard;