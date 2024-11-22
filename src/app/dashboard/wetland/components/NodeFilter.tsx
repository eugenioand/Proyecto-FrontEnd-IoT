"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

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

interface NodeFilterProps {
    nodes: Node[]
    selectedNodes: Node[]
    setSelectedNodes: React.Dispatch<React.SetStateAction<Node[]>>
}

export function NodeFilter({ nodes, selectedNodes, setSelectedNodes }: NodeFilterProps) {
    const [open, setOpen] = React.useState(false);

    const handleSelectNode = (node: Node) => {
        if (selectedNodes.some((selected) => selected.id === node.id)) {
            setSelectedNodes([]);
        } else {
            setSelectedNodes([node]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                    {selectedNodes.length === 1 ? selectedNodes[0].name : "Seleccionar nodo"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
                <Command>
                    <CommandInput placeholder="Buscar nodo..." />
                    <CommandList>
                        <CommandEmpty>No hay nodos disponibles.</CommandEmpty>
                        <CommandGroup>
                            {nodes.map((node) => (
                                console.log(node),
                                <CommandItem
                                    key={node.node_id}
                                    value={node.name}
                                    onSelect={() => handleSelectNode(node)}
                                >
                                    {selectedNodes.some((selected) => selected.node_id === node.node_id) && "✓ "}
                                    {node.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
