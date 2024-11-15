import React, { use, useEffect, useState } from "react";
import Select from "react-select";
import { FiltersProps } from "../interfaces";

interface Wetland {
  wetland_id: number;
  name: string;
}
interface Sensor {
  sensor_id: number;
  name: string;
  type_sensor: string;
}
interface TypeSensor {
 id_type_sensor: number;
  // name: string;
  code: string;
}
interface Nodes {
  node_id: number;
  name: string;
}

export function Filters({
  filters,
  onFilterChange,
  compareMode,
}: // secondHumedal,
// onSecondHumedalChange,
FiltersProps) {
  const [wetlands, setWetlands] = useState<Wetland[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [nodes, setNodes] = useState<Nodes[]>([]);
  const [typeSensors, setTypeSensors] = useState<TypeSensor[]>([]);

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
  }, []);

  useEffect(() => {
    if (filters.humedal !== "0") {
      setLoadingNodes(true);
      fetch(
        `https://proyecto-backend-iot.vercel.app/api/node-select/${filters.humedal}`
      )
        .then((response) => response.json())
        .then(({ data }) => setNodes(data))
        .catch((error) => console.error(error))
        .finally(() => setLoadingNodes(false));
    }
  }, [filters.humedal]);

  useEffect(() => {
    if (filters.nodo !== "") {
      // setLoadingSensors(true);
      fetch(
        `https://proyecto-backend-iot.vercel.app/api/sensor-select/${filters.nodo}`
      )
        .then((response) => response.json())
        .then(({ data }) => setSensors(data))
        .catch((error) => console.error(error))
        // .finally(() => setLoadingSensors(false));
    }
  }, [filters.nodo]);


  useEffect(() => {
    setLoadingSensors(true);
    fetch(`https://proyecto-backend-iot.vercel.app/api/sensors/type_sensors`)
      .then((response) => response.json())
      .then(({ data }) => setTypeSensors(data))
      .catch((error) => console.error(error))
      .finally(() => setLoadingSensors(false));
  }, [filters.nodo]);

  // Opciones para react-select
  const wetlandOptions = wetlands.map((wetland) => ({
    value: wetland.wetland_id,
    label: wetland.name,
  }));

  const nodeOptions = nodes?.map((node) => ({
    value: node.node_id,
    label: node.name,
  }));

  const sensorTypeOptions = typeSensors?.map((sensor) => ({
    value: sensor.code,
    label: sensor.code,
  }));
  const sensorOptions = sensors?.map((sensor) => ({
    value: sensor.sensor_id,
    label: sensor.name,
  }));

  console.log({ filters });
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
  const [dateError, setDateError] = useState<string | null>(null);

const handleDateChange = (type: 'startDate' | 'endDate', value: string) => {
  const newFilters = { ...filters, [type]: value };

  // Validar si ambos campos están llenos o vacíos
  if ((type === 'startDate' && value && !newFilters.endDate) || (type === 'endDate' && value && !newFilters.startDate)) {
    setDateError('Es obligatorio llenar ambos campos de fecha si se digita alguno.');
  } else {
    setDateError(null);
  }

  onFilterChange(newFilters);
};
console.log({sensorTypeOptions})

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Humedales */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {compareMode ? "Primer humedal" : "Escoger humedal"}
          </label>
          <Select
            options={wetlandOptions}
            isLoading={loadingWetlands}
            defaultValue={{ label: "Todos los Humedales", value: 0 }}
            placeholder={
              loadingWetlands ? "Cargando humedales..." : "Seleccionar humedal"
            }
            value={wetlandOptions.find(
              (option) => option.value.toString() === filters.humedal
            )}
            onChange={handleWetlandChange}
            isClearable
            instanceId="humedal-select"
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
                ? nodeOptions?.find(
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
            instanceId="nodo-select"
            isDisabled={filters.humedal === "0"}
          />
        </div>

        {/* Sensores */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Escoger Tipo de sensor
          </label>
          <Select
            options={sensorTypeOptions}
            isLoading={loadingSensors}
            placeholder="Selecciona tipo del sensor"
            value={
              filters.typeSensor
                ? sensorTypeOptions?.find(
                    (option) => option.value.toString() === filters.typeSensor
                  )
                : null
            }
            onChange={(selectedOption) =>
              onFilterChange({
                ...filters,
                typeSensor: selectedOption ? selectedOption.value.toString() : "",
              })
            }
            isClearable
            isDisabled={filters.humedal === "0" || filters.nodo === ""}
            instanceId="sensor-select"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Escoger Nombre del sensor
          </label>
          <Select
            options={sensorOptions}
            isLoading={loadingSensors}
            placeholder="Seleccionar sensor"
            value={
              filters.sensor
                ? sensorOptions?.find(
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
            isDisabled={filters.humedal === "0" || filters.nodo === ""}
            instanceId="sensor-select"
          />
        </div>

        {/* Fechas */}
        <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Rango de fechas</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="datetime-local"
            value={filters.startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          />
          <input
            type="datetime-local"
            value={filters.endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          />
        </div>
        {dateError && <p className="text-sm text-red-500">{dateError}</p>}
      </div>
      </div>
    </div>
  );
}
