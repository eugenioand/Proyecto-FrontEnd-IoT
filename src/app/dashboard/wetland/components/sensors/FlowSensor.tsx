type FlowSensorProps = {
    direction: "entrada" | "salida"; // Dirección del flujo
    value: number; // Valor del flujo
    max: number; // Máximo permitido
};

export default function FlowSensor({ direction, value, max }: FlowSensorProps) {
    return (
        <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">
                Caudal de {direction === "entrada" ? "Entrada" : "Salida"}: {value} L/s
            </h3>
            <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-6 h-6 ${direction === "entrada" ? "animate-flow-in" : "animate-flow-out"
                            } bg-blue-500 rounded-full`}
                    />
                ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">Máximo permitido: {max} L/s</p>
        </div>
    );
}
