"use client";

import { useState, useEffect } from 'react';
import WetlandCard from "@/components/WetlandCard";
import { getWetlands } from '@/lib/actions/dashboard/wetlands';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorModal from '@/components/dialogs/ErrorModal';
import { useRouter } from "next/navigation";

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
    const router = useRouter();
    const [wetlands, setWetlands] = useState<Wetland[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCardDisabled, setIsCardDisabled] = useState(false);

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

    const handleCardClick = (id: number) => {
        setIsCardDisabled(true); // Deshabilitar todas las tarjetas
        console.log(`Tarjeta seleccionada: ${id}`);
        router.push(`/dashboard/wetland/${id}`);
    };

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
                        onClick={() => handleCardClick(wetland.id)}
                        disabled={isCardDisabled}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 xl:justify-center  gap-10 w-full mx-auto">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="flex flex-col justify-self-center p-4 rounded-lg shadow-md w-full min-w-72 h-[12rem] bg-white md:w-[22rem]" />
                ))}
            </div>
        </div>
    );
}


export default Dashboard;