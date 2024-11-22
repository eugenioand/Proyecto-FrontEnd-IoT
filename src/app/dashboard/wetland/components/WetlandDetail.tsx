import React, { useState } from "react";
import { MapPinIcon, SignalIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import Carousel from "./Carousel";

interface Sensor {
    name: string;
    sensor_code: string;
    unity: string;
    value: number;
    max: number;
    latitude: number;
    longitude: number;
}

interface Node {
    name: string;
    node_id: number;
    sensors: Sensor[];
    latitude: number;
    longitude: number;
    status: "good" | "warning" | "alert";
}

interface WetlandDetailProps {
    name: string;
    location: string;
    status: string;
    nodes: Node[];
}

const Maps = dynamic(() => import("@/components/NewMap"), {
    ssr: false,
});

const statusColors = {
    good: "bg-green-100 text-green-600",
    warning: "bg-yellow-100 text-yellow-600",
    alert: "bg-red-100 text-red-600",
};

const WetlandDetail: React.FC<WetlandDetailProps> = ({
    name,
    location,
    status,
    nodes,
}) => {
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

    // Maneja la selección de un nodo
    const handleNodeSelection = (node: Node) => {
        setSelectedNode(node);
        setSelectedSensor(null); // Resetea el sensor seleccionado al cambiar de nodo
    };

    // Maneja la selección de un sensor
    const handleSensorSelection = (sensor: Sensor) => {
        setSelectedSensor(sensor);
    };

    const mapNodesAndSensors = (nodes: Node[]) => {
        return nodes.flatMap((node) => [
            {
                name: node.name,
                latitude: node.latitude,
                longitude: node.longitude,
                type: "node",
                details: { status: node.status },
            },
            ...node.sensors.map((sensor) => ({
                name: sensor.name,
                latitude: sensor.latitude,
                longitude: sensor.longitude,
                type: "sensor",
                details: { value: sensor.value, unity: sensor.unity },
            })),
        ]);
    };

    const nodesAndSensors = mapNodesAndSensors(nodes);
    const mapData = selectedSensor
        ? [
                {
                    name: selectedSensor.name,
                    latitude: selectedSensor.latitude,
                    longitude: selectedSensor.longitude,
                    type: "sensor",
                    details: { value: selectedSensor.value, unity: selectedSensor.unity },
                },
            ]
        : selectedNode
        ? mapNodesAndSensors([selectedNode])
        : nodesAndSensors;

    return (
        <div className="flex flex-col w-full gap-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Información del Humedal */}
                <div className="flex flex-col w-full rounded-md p-6 bg-white shadow-md gap-4">
                    <h2 className="text-2xl font-semibold">{name}</h2>
                    <div className="flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-blue-500" />
                        <p className="text-sm text-gray-500">{location}</p>
                    </div>
                    <div className="h-60 w-full rounded-md overflow-hidden">
                        <Maps items={mapData} />
                    </div>
                </div>

                {/* Listado de Nodos */}
                <div className="flex flex-col w-full lg:w-1/5 bg-white shadow-md rounded-md p-4 gap-4 hidden">
                    <h2 className="text-lg font-medium border-b pb-2">Nodos</h2>
                    <ul className="flex flex-col gap-3">
                        {nodes.map((node) => (
                            <li
                                key={node.node_id}
                                onClick={() => handleNodeSelection(node)}
                                className={`p-4 flex items-center gap-4 rounded-md shadow-sm transition-transform transform hover:scale-105 cursor-pointer ${
                                    selectedNode?.node_id === node.node_id
                                        ? "bg-blue-100 border-2 border-blue-500 shadow-lg"
                                        : statusColors[node.status]
                                }`}
                            >
                                <SignalIcon
                                    className={`w-6 h-6 ${
                                        selectedNode?.node_id === node.node_id
                                            ? "text-blue-500"
                                            : ""
                                    }`}
                                />
                                <div>
                                    <h3 className="font-semibold">{node.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {node.sensors.length} sensores
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Carrusel de Sensores */}
            {selectedNode && selectedNode.sensors.length > 0 ? (
                <Carousel
                    items={selectedNode.sensors}
                    selectedSensor={selectedSensor}
                    onSelectSensor={handleSensorSelection}
                />
            ) : (
                <p className="text-center text-gray-500">
                    No hay sensores disponibles para este nodo.
                </p>
            )}
        </div>
    );
};

export default WetlandDetail;
