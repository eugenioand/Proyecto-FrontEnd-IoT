"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { MapPinIcon, SignalIcon } from "@heroicons/react/24/solid";
import Carousel from "./Carousel";
import { getWetland } from "@/services/dasboard/wetlands";
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
    id:any
    name: string;
    location: string;
    status: string;
    nodes: any;
}

const statusColors = {
    good: "bg-green-100 text-green-600",
    warning: "bg-yellow-100 text-yellow-600",
    alert: "bg-red-100 text-red-600",
};

const WetlandDetail: React.FC<WetlandDetailProps> = ({
    id,
    name,
    location,
    status,
    nodes,
}) => {
    const { selectedItem, setSelectedItem } = useSelection();
    const nodeContainerRef = useRef<HTMLDivElement | null>(null);

    const handleNodeSelection = useCallback(
        (node: Node) => {
            const nodeId = (node as any).node_id ?? (node as any).id;
            if (selectedItem?.type === "node" && selectedItem.id === nodeId) {
                setSelectedItem(null);
            } else {
                setSelectedItem({ id: nodeId, type: "node" });
            }
        },
        [selectedItem, setSelectedItem]
    );

    const handleSensorSelection = useCallback(
        (sensor: Sensor) => {
            const sensorId = (sensor as any).sensor_id ?? (sensor as any).id ?? (sensor as any).sensor_code;
            if (selectedItem?.type === "sensor" && selectedItem.id === sensorId) {
                // find parent node and select it
                const parent = nodes.find((n: any) => (n.sensors || []).some((s: any) => ((s.sensor_id ?? s.id ?? s.sensor_code) === sensorId)));
                const parentId = parent ? (parent.node_id ?? parent.id) : null;
                setSelectedItem(parentId ? { id: parentId, type: "node" } : null);
            } else {
                setSelectedItem({ id: sensorId, type: "sensor" });
            }
        },
        [selectedItem, setSelectedItem, nodes]
    );

    // Component that manages sensors for the currently selected node and polls every 7s.
    const NodeSensorsManager: React.FC<{ wetlandId: any; nodes: any }> = ({ wetlandId, nodes }) => {
        const { selectedItem, setSelectedItem } = useSelection();
        const selectedNodeId = selectedItem?.type === "node" ? selectedItem.id : null;
        const [sensorsState, setSensorsState] = useState<Sensor[]>([]);
        const prevRef = useRef<any>(null);
        // read route params at top-level of component (valid hook usage)
        const params = useParams();
        const routeWetlandId = params && (params as any).id;

        useEffect(() => {
            let mounted = true;
            let interval: NodeJS.Timeout | null = null;

            const fetchSensors = async () => {
                if (!selectedNodeId) {
                    if (mounted) setSensorsState([]);
                    return;
                }

                try {
                    // Determine wetland id: prefer prop, then route param; if none, use provided nodes.
                    const fetchId = wetlandId ?? routeWetlandId;

                    let updatedNodes: any = nodes;

                    if (fetchId) {
                        const result = await getWetland(String(fetchId));
                        if (result && !result.error && result.nodes) {
                            updatedNodes = result.nodes;
                        }
                    }

                    // support both array and object map shapes
                    const nodesArray = Array.isArray(updatedNodes)
                        ? updatedNodes
                        : Object.values(updatedNodes || {});

                    const node = nodesArray.find((n: any) => ((n.node_id ?? n.id) === selectedNodeId));
                    const newSensors = node?.sensors ?? [];
                    const changed = JSON.stringify(newSensors) !== JSON.stringify(prevRef.current);
                    if (changed && mounted) {
                        prevRef.current = newSensors;
                        setSensorsState(newSensors);
                    }
                } catch (err) {
                    console.error(err);
                }
            };

            fetchSensors();
            interval = setInterval(fetchSensors, 7000);

            return () => {
                mounted = false;
                if (interval) clearInterval(interval);
            };
        }, [selectedNodeId, wetlandId, nodes, routeWetlandId]);

        const onSensorClick = useCallback(
            (sensor: any) => {
                const sensorId = sensor.sensor_id ?? sensor.id ?? sensor.sensor_code;
                if (!sensorId) return;
                if (selectedItem?.type === "sensor" && selectedItem.id === sensorId) {
                    // switch back to node
                    setSelectedItem(selectedNodeId ? { id: selectedNodeId, type: "node" } : null);
                } else {
                    setSelectedItem({ id: sensorId, type: "sensor" });
                }
            },
            [setSelectedItem, selectedItem, selectedNodeId]
        );

        const selectedSensorId = selectedItem?.type === "sensor" ? selectedItem.id : null;

        if (!selectedNodeId) {
            return <p className="text-center text-gray-500">Selecciona un nodo para ver sensores.</p>;
        }

        return sensorsState && sensorsState.length > 0 ? (
            <Carousel items={sensorsState} selectedSensor={selectedSensorId} onSelectSensor={onSensorClick} />
        ) : (
            <p className="text-center text-gray-500">No hay sensores disponibles para este nodo.</p>
        );
    };

    return (
        <div className="flex flex-col w-full gap-6">
            {/* Header with name and location */}
            <div className="bg-white shadow-md rounded-md p-4">
                <h1 className="text-xl font-bold">{name}</h1>
                <div className="flex items-center gap-2 mt-2">
                    <MapPinIcon className="w-4 h-4 text-blue-500" />
                    <p className="text-sm text-gray-500">{location}</p>
                </div>
            </div>

            {/* Listado de Nodos */}
            <div
                ref={nodeContainerRef}
                className="flex flex-col w-full max-h-96 bg-white shadow-md rounded-md p-4 gap-2"
            >
                <h2 className="text-lg font-medium border-b pb-2">Nodos</h2>
                <ul
                    role="listbox"
                    className="flex flex-col overflow-hidden overflow-y-auto p-2 gap-3"
                >
                    {nodes.map((node) => {
                        const nodeId = (node as any).node_id ?? (node as any).id;
                        const isNodeSelected = selectedItem?.type === "node" && selectedItem.id === nodeId;
                        return (
                            <li
                                key={nodeId}
                                role="option"
                                aria-selected={isNodeSelected}
                                onClick={() => handleNodeSelection(node)}
                                className={clsx(
                                    "w-[90%] p-4 flex self-center items-center gap-4 rounded-md shadow-sm cursor-pointer transition-transform transform hover:scale-105",
                                    isNodeSelected ? "bg-blue-100 border-2 border-blue-500 shadow-lg" : statusColors[node.status]
                                )}
                            >
                                <SignalIcon
                                    className={clsx("w-6 h-6", {
                                        "text-blue-500": isNodeSelected,
                                    })}
                                />
                                <div>
                                    <h3 className="font-semibold">{node.name}</h3>
                                    <p className="text-sm text-gray-500">{(node.sensors || []).length} sensores</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Carrusel de Sensores (gestiona su propio polling) */}
            <div>
                <NodeSensorsManager wetlandId={id} nodes={nodes} />
            </div>
        </div>
    );
};

// Memorizar el componente para evitar re-renderizados innecesarios
const MemoizedWetlandDetail = React.memo(WetlandDetail);

const WetlandDetailWrapper = (props: WetlandDetailProps) => (
    <SelectionProvider>
        <MemoizedWetlandDetail {...props} />
    </SelectionProvider>
);

export default WetlandDetailWrapper;
