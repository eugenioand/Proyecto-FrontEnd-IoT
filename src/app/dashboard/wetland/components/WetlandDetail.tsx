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
import clsx from "clsx";
import { SelectionProvider, useSelection } from "@/context/SelectionContext";

interface Sensor {
    sensor_id: number;
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
    const { selectedItem, setSelectedItem } = useSelection();
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

    const nodeContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (selectedItem) {
            if (selectedItem.type === "node") {
                const node = nodes.find((node) => node.node_id === selectedItem.id);
                setSelectedNode(node || null);
                setSelectedSensor(null); // Resetea el sensor seleccionado
            } else if (selectedItem.type === "sensor") {
                const sensor = nodes.flatMap((node) => node.sensors)
                    .find((sensor) => sensor.sensor_id === selectedItem.id);
                if (sensor) {
                    const node = nodes.find((node) => node.sensors.includes(sensor)); // Encuentra el nodo que tiene este sensor
                    setSelectedNode(node || null); // Selecciona el nodo correspondiente al sensor
                    setSelectedSensor(sensor || null); // Selecciona el sensor
                } else {
                    setSelectedNode(null); // Si no se encuentra el sensor, resetea el nodo seleccionado
                    setSelectedSensor(null); // Resetea el sensor seleccionado
                }
            }
        } else {
            setSelectedNode(null);
            setSelectedSensor(null);
        }
    }, [selectedItem, nodes]);

    // Maneja la selección de nodos
    const handleNodeSelection = (node: Node) => {
        if (selectedNode?.node_id === node.node_id) {
            setSelectedItem(null);
        } else {
            setSelectedItem({ id: node.node_id, type: "node" });
        }
    };

    // Maneja la selección de sensores
    const handleSensorSelection = (sensor: Sensor) => {
        if (selectedSensor?.sensor_id === sensor.sensor_id) {
            setSelectedItem(null);
        } else {
            setSelectedItem({ id: sensor.sensor_id, type: "sensor" });
        }
    };

    const mapSensor = (sensor: Sensor) => ({
        id: sensor.sensor_id,
        code: sensor.sensor_code,
        name: sensor.name,
        latitude: sensor.latitude,
        longitude: sensor.longitude,
        type: "sensor",
        details: { value: sensor.value, unity: sensor.unity },
    });

    const mapNode = (node: Node) => [
        {
            id: node.node_id,
            name: node.name,
            latitude: node.latitude,
            longitude: node.longitude,
            type: "node",
            details: { status: node.status }
        },
        ...node.sensors.map(mapSensor),
    ];

    const mapNodesAndSensors = (nodes: Node[]) => nodes.flatMap(mapNode);

    const mapData = selectedSensor
        ? [
            {
                id: selectedSensor.sensor_id,
                code: selectedSensor.sensor_code,
                name: selectedSensor.name,
                latitude: selectedSensor.latitude,
                longitude: selectedSensor.longitude,
                type: "sensor",
                details: { value: selectedSensor.value, unity: selectedSensor.unity },
            },
        ]
        : selectedNode
            ? mapNodesAndSensors([selectedNode])
            : mapNodesAndSensors(nodes);

    return (
        <div className="flex flex-col w-full gap-6">
            <div className="flex flex-col lg:flex-row rounded-md gap-4">
                {/* Información del Humedal */}
                <div className="relative shadow-md w-full lg:w-[80%]">
                    <div className="absolute w-full flex justify-center -top-4 z-10 text-center overflow-hidden">
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <h2
                                    className="text-sm leading-3 px-4 py-2 max-w-[70%] h-8 font-semibold rounded-md bg-white cursor-pointer"
                                    aria-label={`Detalles del humedal: ${name}`}
                                >
                                    {name}
                                </h2>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                                <h2 className="line-clamp-2">{name}</h2>
                                <div className="flex items-center pt-2">
                                    <CalendarIcon className="mr-2 h-4 opacity-70" />
                                    <span className="text-xs text-muted-foreground">
                                        Última actualización: 2 horas
                                    </span>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                    <div
                        className="absolute bottom-1 left-1 flex items-center gap-2 px-2 rounded-md py-1 bg-white z-10"
                        title={location}
                    >
                        <MapPinIcon className="w-4 h-4 text-blue-500" />
                        <p className="text-xs truncate max-w-[80%] text-gray-500">{location}</p>
                    </div>
                    <div className="h-96 w-full rounded-md overflow-hidden">
                        <Maps items={mapData} />
                    </div>
                </div>

                {/* Listado de Nodos */}
                <div
                    ref={nodeContainerRef}
                    className="flex flex-col w-full max-h-96 lg:w-1/4 xl:w-1/5 bg-white shadow-md rounded-md p-4 gap-2"
                >
                    <h2 className="text-lg font-medium border-b pb-2">Nodos</h2>
                    <ul role="listbox" className="flex flex-col overflow-hidden overflow-y-auto p-2 gap-3">
                        {nodes.map((node) => (
                            <li
                                key={node.node_id}
                                role="option"
                                aria-selected={selectedNode?.node_id === node.node_id}
                                onClick={() => handleNodeSelection(node)}
                                className={clsx(
                                    "w-[90%] p-4 flex self-center items-center gap-4 rounded-md shadow-sm cursor-pointer transition-transform transform hover:scale-105",
                                    selectedNode?.node_id === node.node_id
                                        ? "bg-blue-100 border-2 border-blue-500 shadow-lg"
                                        : statusColors[node.status]
                                )}
                            >
                                <SignalIcon
                                    className={clsx("w-6 h-6", {
                                        "text-blue-500": selectedNode?.node_id === node.node_id,
                                    })}
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

const WetlandDetailWrapper = (props: WetlandDetailProps) => (
    <SelectionProvider>
        <WetlandDetail {...props} />
    </SelectionProvider>
);

export default WetlandDetailWrapper;