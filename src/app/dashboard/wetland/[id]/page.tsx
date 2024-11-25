"use client";
import { useEffect, useState } from "react";
import WetlandDetail from "../components/WetlandDetail";
import { getWetland } from "@/services/dasboard/wetlands";
import { Skeleton } from "@/components/ui/skeleton";
import { SelectionProvider } from "@/context/SelectionContext";

import { Wetland } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorModal from "@/components/dialogs/ErrorModal";

// Hook personalizado para manejar la lógica de obtención de datos
const useWetland = (id: string) => {
    const [wetland, setWetland] = useState<Wetland | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("El ID es obligatorio.");
            setLoading(false);
            return;
        }

        const fetchWetland = async () => {
            try {
                setLoading(true);
                const result = await getWetland(id);

                if (result.error) {
                    throw new Error(result.error);
                }

                setWetland(result);
            } catch (err: any) {
                setError(err.message || "Ocurrió un error desconocido.");
            } finally {
                setLoading(false);
            }
        };

        fetchWetland();
    }, [id]);

    return { wetland, loading, error, setError };
};

export default function WetlandDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const { wetland, loading, error, setError } = useWetland(params.id);

    const closeErrorModal = () => {
        setError(null);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorModal errorMessage={error} onClose={closeErrorModal} />;
    }

    return (
        wetland && (
            <SelectionProvider>
                <WetlandDetail
                    id={wetland.id}
                    name={wetland.name}
                    location={wetland.location}
                    status={wetland.status as "good" | "warning" | "alert"}
                    nodes={wetland.nodes}
                />
            </SelectionProvider>
        )
    );
}

// Componente Skeleton para mostrar mientras se carga el contenido
const WetlandSkeleton = () => {
    return (
        <div className="flex flex-col w-full gap-5">
            <Skeleton className="h-72" />
            <Skeleton className="h-52" />
        </div>
    );
};
