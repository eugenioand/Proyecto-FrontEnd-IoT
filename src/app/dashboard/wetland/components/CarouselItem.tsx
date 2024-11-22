import React from "react";
import { motion } from "framer-motion";
import PHGaugeChart from "./sensors/PHIndicator";
import OxygenSensor from "./sensors/OxygenSensor";
import TurbiditySensor from "./sensors/TurbiditySensor";
import FlowSensor from "./sensors/FlowSensor";

interface Sensor {
    name: string;
    sensor_code: string;
    unity: string;
    value: number;
    max: number;
}

// Mapeo de sensor a su componente
const sensorComponents = {
    PH: PHGaugeChart,
    Oxygen: OxygenSensor,
    Turbidity: TurbiditySensor,
    FlowIn: FlowSensor,
    FlowOut: FlowSensor,
};

// Componente por defecto para sensores no mapeados
const DefaultSensor: React.FC<Sensor> = ({ name, value, max, unity }) => {
    const percentage = Math.min((value / max) * 100, 100); // Calcula el porcentaje (máximo 100%)
    const isCritical = percentage > 80; // Estado crítico si supera el 80%

    return (
        <div className="relative flex flex-col justify-between bg-white shadow rounded-lg w-full h-64 p-4">
            {/* Nombre en la parte superior */}
            <h3 className="text-left text-lg font-semibold text-gray-700">{name}</h3>

            {/* Contenedor del "líquido" */}
            <div className="relative flex justify-center items-end h-full w-full bg-gray-300 rounded-lg overflow-hidden mt-4 shadow-inner">
                {/* Fondo animado del líquido */}
                <motion.div
                    className="absolute bottom-0 left-0 w-full bg-blue-500"
                    style={{
                        height: `${percentage}%`,

                    }}
                    animate={{
                        y: value < max ? [-2, 2, -2] : 0, // Movimiento de onda
                        backgroundColor: isCritical ? ["#ff6347", "#e63946"] : "#1e90ff",
                    }}
                    transition={{
                        duration: 2,
                        repeat: isCritical ? Infinity : 0,
                        repeatType: "reverse",
                    }}
                >
                </motion.div>

                {/* Indicador de valor actual */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center text-white font-bold text-xl">
                    {value}
                    <span className="text-sm ml-1">{unity}</span>
                </div>
            </div>

            {/* Máximo al final */}
            <div className="text-right text-sm text-gray-600 mt-2">
                Máximo: <span className="font-semibold">{max}</span>
            </div>
        </div>
    );
};


// Componente principal de cada ítem del carrusel
const CarouselItem: React.FC<{ sensor: Sensor, selectedSensor: boolean }> = ({ sensor, selectedSensor }) => {
    console.log("Sensor", sensor); // Muestra el sensor para depuración
    console.log("selectedSensor", selectedSensor); // Muestra el sensor para depuración
    // Se obtiene el componente del sensor correspondiente, o el componente por defecto si no está mapeado
    const SensorComponent = sensorComponents[sensor.sensor_code] || DefaultSensor;

    return (
        <div className={`flex-shrink-0 w-full h-full rounded-md ${selectedSensor ? "border-2 border-blue-500" : ""}`}>
            <SensorComponent
                name={sensor.name}
                value={sensor.value}
                max={sensor.max}
                unity={sensor.unity}
            />
        </div>
    );
};

export default CarouselItem;
