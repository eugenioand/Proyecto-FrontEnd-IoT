import React from "react";

type PHIndicatorProps = {
    value: number;
};

export default function PHIndicator({ value }: PHIndicatorProps) {
    
    return (
        <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">Nivel de pH</h3>
            {/* <GaugeChart
                id="ph-gauge"
                // nrOfLevels={14}
                colors={["#f94144", "#f9c74f", "#43aa8b", "#277da1"]}
                arcWidth={0.3}
                percent={value / 14} // Convertir el valor en porcentaje
                textColor="#000"
            /> */}
            <div className="flex justify-between w-full text-sm mt-2">
                <span>Ácido (0)</span>
                <span>Neutro (7)</span>
                <span>Alcalino (14)</span>
            </div>
        </div>
    );
}