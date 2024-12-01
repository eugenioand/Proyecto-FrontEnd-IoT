import React, { useEffect, useState } from "react";

type TurbiditySensorProps = {
    value: number; // Valor de turbidez
    max: number; // Máximo permitido
};

 function TurbiditySensor1({ value, max }: TurbiditySensorProps) {
    const [bubbles, setBubbles] = useState<number[]>([]);

    useEffect(() => {
        // Genera burbujas dinámicas según la turbidez
        const interval = setInterval(() => {
            setBubbles((prev) => [...prev, Math.random()]);
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-72 bg-blue-100  overflow-hidden">
            <h3 className="text-lg font-semibold absolute top-2 left-2">Turbidez: {value} NTU</h3>
            {bubbles.map((bubble, idx) => (
                <div
                    key={idx}
                    className="absolute bg-white rounded-full opacity-50 animate-bubble"
                    style={{
                        left: `${Math.random() * 100}%`,
                        bottom: 0,
                        width: `${Math.random() * 10 + 5}px`,
                        height: `${Math.random() * 40 + 5}px`,
                        animationDuration: `${Math.random() * 3 + 2}s`,
                    }}
                />
            ))}
            <p className="absolute bottom-2 left-2 text-sm text-gray-600">
                Máximo permitido: {max} NTU
            </p>
        </div>
    );
}
export const TurbiditySensor = React.memo(TurbiditySensor1);
