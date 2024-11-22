import React, { useState, useRef, useEffect } from "react";
import { MapPinIcon, SignalIcon } from "@heroicons/react/24/solid";
import { CalendarIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Carousel from "./Carousel";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { NodeFilter } from "./NodeFilter";

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

    const nodeContainerRef = useRef<HTMLDivElement | null>(null); // Ref para el contenedor de nodos
    const sensorContainerRef = useRef<HTMLDivElement | null>(null); // Ref para el contenedor de sensores
    const mapContainerRef = useRef<HTMLDivElement | null>(null); // Ref para el contenedor del mapa

    // Maneja la selección de un nodo
    const handleNodeSelection = (node: Node) => {
        if (selectedNode?.node_id === node.node_id) {
            setSelectedNode(null); // Deselecciona el nodo si ya está seleccionado
        } else {
            setSelectedNode(node);
            setSelectedSensor(null); // Resetea el sensor seleccionado al cambiar de nodo
        }
    };

    // Maneja la selección de un sensor
    const handleSensorSelection = (sensor: Sensor) => {
        if (selectedSensor?.sensor_code === sensor.sensor_code) {
            setSelectedSensor(null); // Deselecciona el sensor si ya está seleccionado
        } else {
            setSelectedSensor(sensor);
        }
    };

    // Cerrar selección si el clic es fuera del contenedor de nodos y sensores
    const handleClickOutside = (event: MouseEvent) => {
        if (
            (nodeContainerRef.current && !nodeContainerRef.current.contains(event.target as Node)) &&
            (sensorContainerRef.current && !sensorContainerRef.current.contains(event.target as Node)) &&
            (mapContainerRef.current && !mapContainerRef.current.contains(event.target as Node))
        ) {
            setSelectedNode(null); // Deselecciona el nodo
            setSelectedSensor(null); // Deselecciona el sensor
        }
    };

    // Configura el evento de clic fuera del contenedor
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
            <div className="flex flex-col lg:flex-row rounded-md gap-4">
                {/* Información del Humedal */}
                <div className="relative shadow-md w-full lg:w-[80%]" >
                    <div className="absolute w-full -top-4 z-10 text-center justify-items-center overflow-hidden">
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <h2 className="text-sm leading-4 text-ellipsis content-center px-4 py-2 max-w-[70%] h-8 font-semibold rounded-md bg-white">{name}</h2>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                                <h2 className="line-clamp-2">{name}</h2>
                                <div className="flex items-center pt-2">
                                    <CalendarIcon className="mr-2 h-4 opacity-70" />
                                    <span className="text-xs text-muted-foreground">Última actualización: 2 horas</span>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                    <div className="absolute bottom-1 left-1 flex items-center gap-2 px-2 rounded-md py-1 bg-white z-10" title={location}>
                        <MapPinIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <p className="text-xs truncate max-w-[80%] text-gray-500 overflow-hidden">{location}</p>
                    </div>
                    <div className="h-96 w-full rounded-md overflow-hidden">
                        <Maps items={mapData} />
                    </div>
                </div>

                {/* Listado de Nodos */}
                <div className="flex flex-col w-full max-h-96 lg:w-1/5 bg-white shadow-md rounded-md p-4 gap-4">
                    <h2 className="text-lg font-medium border-b pb-2">Nodos</h2>
                    <ul className="flex flex-col gap-3">
                        {nodes.map((node) => (
                            <li
                                key={node.node_id}
                                onClick={() => handleNodeSelection(node)}
                                className={`p-4 flex items-center gap-4 rounded-md shadow-sm transition-transform transform hover:scale-x-105 cursor-pointer ${selectedNode?.node_id === node.node_id
                                    ? "bg-blue-100 border-2 border-blue-500 shadow-lg"
                                    : statusColors[node.status]
                                    }`}
                            >
                                <SignalIcon
                                    className={`w-6 h-6 ${selectedNode?.node_id === node.node_id
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
                <div>
                    <Carousel
                        items={selectedNode.sensors}
                        selectedSensor={selectedSensor}
                        onSelectSensor={handleSensorSelection}
                    />
                </div>
            ) : (
                <p className="text-center text-gray-500">
                    No hay sensores disponibles para este nodo.
                </p>
            )}
        </div>
    );
};

export default WetlandDetail;
