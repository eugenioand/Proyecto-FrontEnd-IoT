import { useState, useEffect } from "react";
import { getTypes } from "@/services/sensors";
import type { SensorType } from "@/types";

export function useSensorTypes() {
    const [sensorTypes, setSensorTypes] = useState<SensorType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSensorTypes() {
            try {
                const response = await getTypes();
                if (response.error) {
                    setError(response.error);
                } else {
                    setSensorTypes(response.data.map((type) => ({ name: type.name, code: type.code }) ));
                }
            } catch (err) {
                console.error("Failed to fetch sensor types:", err);
                setError("Failed to fetch sensor types");
            } finally {
                setLoading(false);
            }
        }

        fetchSensorTypes();
    }, []);

    return { sensorTypes, loading, error };
}
