import React, { useEffect, useState } from "react";
import Select from "react-select";
import { FiltersProps } from "../interfaces";

interface Wetland {
  wetland_id: number;
  name: string;
}
interface Sensor {
  sensor_id: number;
  name: string;
}
interface Nodes {
  node_id: number;
  name: string;
}

export function Filters({
  filters,
  onFilterChange,
  compareMode,
  secondHumedal,
  onSecondHumedalChange,
}: FiltersProps) {
  const [wetlands, setWetlands] = useState<Wetland[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [nodes, setNodes] = useState<Nodes[]>([]);

  const [loadingWetlands, setLoadingWetlands] = useState(false);
  const [loadingSensors, setLoadingSensors] = useState(false);
  const [loadingNodes, setLoadingNodes] = useState(false);

  useEffect(() => {
    setLoadingWetlands(true);
    fetch(`https://proyecto-backend-iot.vercel.app/api/wetland-select`)
      .then((response) => response.json())
      .then(({ data }) =>
        setWetlands([{ name: "Todos los Humedales", wetland_id: 0 }, ...data])
      )
      .catch((error) => console.error(error))
      .finally(() => setLoadingWetlands(false));

    setLoadingNodes(true);
    fetch(`https://proyecto-backend-iot.vercel.app/api/nodes?page_size=100&page=1`)
      .then((response) => response.json())
      .then(({ data }) => setNodes(data))
      .catch((error) => console.error(error))
      .finally(() => setLoadingNodes(false));

    setLoadingSensors(true);
    fetch(`https://proyecto-backend-iot.vercel.app/api/sensors?page_size=100&page=1`)
      .then((response) => response.json())
      .then(({ data }) => setSensors(data))
      .catch((error) => console.error(error))
      .finally(() => setLoadingSensors(false));
  }, []);

  // Opciones para react-select
  const wetlandOptions = wetlands.map((wetland) => ({
    value: wetland.wetland_id,
    label: wetland.name,
  }));

  const nodeOptions = nodes.map((node) => ({
    value: node.node_id,
    label: node.name,
  }));

  const sensorOptions = sensors.map((sensor) => ({
    value: sensor.sensor_id,
    label: sensor.name,
  }));

  // Manejar el cambio de humedal y limpiar los demás filtros
  const handleWetlandChange = (selectedOption: any) => {
    const humedal = selectedOption ? selectedOption.value.toString() : "0";

    // Limpia los demás filtros y actualiza el humedal
    onFilterChange({
      humedal,
      nodo: "",
      sensor: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Humedales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {compareMode ? "Primer humedal" : "Escoger humedal"}
          </label>
          <Select
            options={wetlandOptions}
            isLoading={loadingWetlands}
            placeholder="Seleccionar humedal"
            value={wetlandOptions.find(
              (option) => option.value.toString() === filters.humedal
            )}
            onChange={handleWetlandChange}
            isClearable
          />
        </div>

        {/* Nodos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Escoger Nodo
          </label>
          <Select
            options={nodeOptions}
            isLoading={loadingNodes}
            placeholder="Seleccionar nodo"
            value={
              filters.nodo
                ? nodeOptions.find(
                    (option) => option.value.toString() === filters.nodo
                  )
                : null
            }
            onChange={(selectedOption) =>
              onFilterChange({
                ...filters,
                nodo: selectedOption ? selectedOption.value.toString() : "",
              })
            }
            isClearable
            isDisabled={filters.humedal === "0"}
          />
        </div>

        {/* Sensores */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Escoger sensor
          </label>
          <Select
            options={sensorOptions}
            isLoading={loadingSensors}
            placeholder="Seleccionar sensor"
            value={
              filters.sensor
                ? sensorOptions.find(
                    (option) => option.value.toString() === filters.sensor
                  )
                : null
            }
            onChange={(selectedOption) =>
              onFilterChange({
                ...filters,
                sensor: selectedOption ? selectedOption.value.toString() : "",
              })
            }
            isClearable
            isDisabled={filters.humedal === "0"}
          />
        </div>

        {/* Fechas */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Rango de fechas
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                onFilterChange({ ...filters, startDate: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                onFilterChange({ ...filters, endDate: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
