import React from "react";
import { motion } from "framer-motion";
import { FaSmog } from "react-icons/fa";

type TurbiditySensorProps = {
    value: number;
    max: number;
};

// 🎨 Función para generar color dinámico según turbidez
const getTurbidityColor = (value: number, max: number) => {
    const ratio = Math.min(value / max, 1);

    // Azul limpio → Marrón turbio
    const start = { r: 59, g: 130, b: 246 };  // blue-500
    const end = { r: 101, g: 67, b: 33 };     // marrón

    const r = Math.round(start.r + (end.r - start.r) * ratio);
    const g = Math.round(start.g + (end.g - start.g) * ratio);
    const b = Math.round(start.b + (end.b - start.b) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
};

function TurbiditySensor1({ value, max }: TurbiditySensorProps) {
    const percentage = (value / max) * 100;
    const isCritical = value >= max * 0.8; // puedes ajustar este umbral

    const color = getTurbidityColor(value, max);

    return (
        <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-4 w-full">
            {/* Título */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Turbidez
            </h3>

            {/* Valor */}
            <div className="flex items-center mb-2">
                <FaSmog className="text-2xl text-blue-500 mr-2" />
                <span className="text-xl font-bold">{value} NTU</span>
            </div>

            {/* Medidor */}
            <div className="relative w-20 h-40 bg-gray-300 rounded-lg overflow-hidden">
                <motion.div
                    className="absolute bottom-0 transition-all duration-700"
                    style={{
                        height: `${percentage}%`,
                        width: "100%",
                        background: `linear-gradient(to top, ${color}, rgba(255,255,255,0.3))`
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${percentage}%` }}
                />
            </div>

            {/* Máximo */}
            <p className="text-sm text-gray-600 mt-1">
                Máximo permitido: <span className="font-semibold">{max} NTU</span>
            </p>

            {/* Estado */}
            {isCritical && (
                <p className="text-sm text-red-500 font-semibold mt-2">
                    Alta turbidez
                </p>
            )}
        </div>
    );
}

export const TurbiditySensor = React.memo(TurbiditySensor1);