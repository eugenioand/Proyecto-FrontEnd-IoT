import React, { useState } from "react";
import { MapPinIcon, SignalIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import Carousel from "./Carousel";

interface Sensor {
    name: string;
    sensor_code: string;
    unity: string;
    value: number;
    max?: number; // Opcional
}

interface Node {
    name: string;
    node_id: number;
    sensors: Sensor[];
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
    const [selectedNode, setSelectedNode] = useState<Node | null>(
        nodes.length > 0 ? nodes[0] : null
    );

    // Maneja la selección de un nodo
    const handleNodeSelection = (node: Node) => {
        setSelectedNode(node);
    };
    
    const sensors = nodes.flatMap((node) => node.sensors);

    return (
        <div className="flex flex-col w-full gap-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Información del Humedal */}
                <div className="flex flex-col w-full rounded-md p-6 bg-white shadow-md gap-4 md:w-4/5">
                    <h2 className="text-2xl font-semibold">{name}</h2>
                    <div className="flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-blue-500" />
                        <p className="text-sm text-gray-500">{location}</p>
                    </div>
                    <div className="h-60 w-full rounded-md overflow-hidden">
                        <Maps center={[51.505, -0.09]} zoom={13} />
                    </div>
                </div>

                {/* Listado de Nodos */}
                <div className="flex flex-col w-full md:w-1/5 bg-white shadow-md rounded-md p-4 gap-4">
                    <h2 className="text-lg font-medium border-b pb-2">Nodos</h2>
                    <ul className="flex flex-col gap-3">
                        {nodes.map((node) => (
                            <li
                                key={node.node_id}
                                onClick={() => handleNodeSelection(node)}
                                className={`p-4 flex items-center gap-4 rounded-md shadow-sm transition-transform transform hover:scale-105 cursor-pointer  ${selectedNode?.node_id === node.node_id
                                        ? "bg-blue-100 text-blue-600"
                                        : statusColors[node.status]
                                }`}
                                // ${statusColors[node.status]}
                            >
                                <SignalIcon className="w-6 h-6" />
                                <div>
                                    <h3 className="font-semibold">{node.name}</h3>
                                    <p className="text-sm text-gray-500">{node.sensors.length} sensores</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Carrusel de Sensores */}
            {selectedNode && selectedNode.sensors.length > 0 ? (
                <Carousel items={selectedNode.sensors} />
            ) : (
                <p className="text-center text-gray-500">No hay sensores disponibles para este nodo.</p>
            )}
        </div>
    );
};

export default WetlandDetail;
