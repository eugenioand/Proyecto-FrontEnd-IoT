import React from "react";
import { motion } from "framer-motion"; // Para las animaciones de transición
import { FaWater } from "react-icons/fa"; // Para el ícono de la gota de agua

type OxygenSensorProps = {
    value: number; // Valor de oxígeno disuelto
    max: number; // Máximo permitido
};

export default function OxygenSensor({ value, max }: OxygenSensorProps) {
    const percentage = (value / max) * 100;
    const isCritical = value >= max * 0.9; // Indicador de alerta si está cerca del máximo

    // Determina el color basado en el porcentaje
    const getColor = () => {
        if (percentage >= 90) return "bg-red-500"; // Crítico
        if (percentage >= 50) return "bg-yellow-500"; // Medio
        return "bg-blue-500"; // Bajo
    };

    return (
        <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-4 w-40">
            {/* Título */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Oxígeno Disuelto</h3>

            {/* Ícono de gota de agua */}
            <div className="flex items-center mb-2">
                <FaWater className="text-2xl text-blue-500 mr-2" />
                <span className="text-xl font-bold">{value} mg/L</span>
            </div>

            {/* Contenedor del medidor con animación */}
            <div className="relative w-20 h-40 bg-gray-300 rounded-lg overflow-hidden">
                <motion.div
                    className={`absolute bottom-0 ${getColor()} transition-all duration-700`}
                    style={{ height: `${percentage}%`, width: "100%" }}
                    initial={{ height: 0 }} // Animación al cargar
                    animate={{ height: `${percentage}%` }} // Animación para el llenado
                />
            </div>

            {/* Límite máximo */}
            <p className="text-sm text-gray-600 mt-1">
                Máximo permitido: <span className="font-semibold">{max} mg/L</span>
            </p>

            {/* Indicador de estado */}
            {isCritical && (
                <p className="text-sm text-red-500 font-semibold mt-2">
                    ¡Nivel crítico!
                </p>
            )}
        </div>
    );
}
