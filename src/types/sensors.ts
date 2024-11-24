export const sensorTypes = [
    { label: "Temperatura", value: "temperature" as const, code: "TMP" },
    { label: "Humedad", value: "humidity" as const, code: "HMD" },
    { label: "pH", value: "ph" as const, code: "PH" },
    { label: "Oxígeno Disuelto", value: "od" as const, code: "OD" },
    { label: "Turbidez", value: "turbidity" as const, code: "TBD" },
    { label: "Caudal de Entrada", value: "FlowRateInlet" as const, code: "FRI" },
    { label: "Caudal de Salida", value: "FlowRateOut" as const, code: "FRO" },
];
