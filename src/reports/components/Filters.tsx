import React, { use, useEffect, useState } from "react";
import Select from "react-select";
import { FiltersProps } from "../interfaces";
import axiosClient from "@/utils/axios-client";

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
  onSecondHumedalChange,
  secondHumedal,
  title,
  isSidebarOpen,
  setIsSidebarOpen,
  view,
}: FiltersProps) {
  const [wetlands, setWetlands] = useState<Wetland[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [nodes, setNodes] = useState<Nodes[]>([]);
  const [typeSensors, setTypeSensors] = useState<TypeSensor[]>([]);

  const [loadingWetlands, setLoadingWetlands] = useState(false);
  const [loadingSensors, setLoadingSensors] = useState(false);
  const [loadingNodes, setLoadingNodes] = useState(false);
  const [errors, setErrors] = useState({
    humedal: false,
    nodo: false,
    sensor: false,
    startDate: false,
    endDate: false,
  });

  useEffect(() => {
    setLoadingWetlands(true);
    axiosClient.get(`https://proyecto-backend-iot.vercel.app/api/wetland-select`)
      .then((response) => response)
      .then(({ data }) =>{
        console.log({data})
        setWetlands([{ name: "Todos los Humedales", wetland_id: 0 }, ...data.data])
      }
      )
      .catch((error) => console.error(error))
      .finally(() => setLoadingWetlands(false));
  }, []);

  useEffect(() => {
    if (filters.humedal !== "0") {
      setLoadingNodes(true);
      axiosClient.get(
        `https://proyecto-backend-iot.vercel.app/api/node-select/${filters.humedal}`
      )
        .then((response) => response)
        .then(({ data }) => setNodes(data.data))
        .catch((error) => console.error(error))
        .finally(() => setLoadingNodes(false));
    }
  }, [filters.humedal]);

  useEffect(() => {
    if (filters.nodo !== "") {
      // setLoadingSensors(true);
      axiosClient.get(
        `https://proyecto-backend-iot.vercel.app/api/sensor-select/${filters.nodo}`
      )
        .then((response) => response)
        .then(({ data }) => setSensors(data.data))
        .catch((error) => console.error(error));
      // .finally(() => setLoadingSensors(false));
    }
  }, [filters.nodo]);

  useEffect(() => {
    setLoadingSensors(true);
    axiosClient.get(`https://proyecto-backend-iot.vercel.app/api/sensors/type_sensors`)
      .then((response) => response)
      .then(({ data }) => setTypeSensors(data.data))
      .catch((error) => console.error(error))
      .finally(() => setLoadingSensors(false));
  }, [filters.nodo]);

  /* Charts  */
  useEffect(() => {
    if (view === "charts") {
      setErrors({
        humedal: !filters.humedal,
        nodo: !filters.nodo,
        sensor: !filters.sensor,
        startDate: !filters.startDate,
        endDate: !filters.endDate,
      });
    }
  }, [filters, view]);

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

  //console.log({ filters });
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

  const handleDateChange = (type: "startDate" | "endDate", value: string) => {
    const newFilters = { ...filters, [type]: value };

    // Validar si ambos campos están llenos o vacíos
    if (
      (type === "startDate" && value && !newFilters.endDate) ||
      (type === "endDate" && value && !newFilters.startDate)
    ) {
      setDateError(
        "Es obligatorio llenar ambos campos de fecha si se digita alguno."
      );
    } else {
      setDateError(null);
    }

    onFilterChange(newFilters);
  };
  const handleSelectChange = (key: string, selectedOption: any) => {
    const value = selectedOption ? selectedOption.value.toString() : "";
    const label = selectedOption ? selectedOption.label : "";
    console.log({ label})
    onFilterChange({ ...filters, [key]: value , [key + "Label"]: label});
    if (view === "charts") {
      setErrors((prev) => ({ ...prev, [key]: !value }));
    }
    if (key === "humedal") {
      //console.log('humedal', value);
      onFilterChange({
        ...filters,
        humedal: value,
        nodo: "",
        sensor: "",
        startDate: "",
        endDate: "",
        typeSensor: "",
        humedalLabel: label,
        nodoLabel: "",
        sensorLabel: "",
      });
    }
  };
  // w-80 bg-white border-r min-h-[calc(100vh-64px)] p-4 scrollbar  overflow-y-auto 
  console.log({title})
  return (
    <div
    className={`
      ${isSidebarOpen ? "block" : "hidden"}
         xl:block
         w-full  xl:w-64 2xl:w-80 bg-white border-r
         ${view === "table" ? "lg:w-40" : ""}
         scrollbar
         fixed xl:relative
         ${title === "Humedal 2" ? "top-[500px] xl:top-0" : "top-0"}
         left-0
         ${title === "Humedal 1" ? "h-full" : "h-full"}
         
         xl:h-auto
         z-50 xl:z-0
         overflow-y-auto
         transition-all duration-300
   `}
    >
      <div className="p-4">
        <div className="space-y-6">
          {/* {view === "charts" && Object.values(errors).some((e) => e) && (
        <div
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-xl dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          Todos los campos son requeridos para la visualización de gráficos.
        </div>
      )} */}
          <div className="bg-white border-4 border-black-500 rounded-lg p-4 mb-4">
            {/* Humedales */}
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold mb-4">{title}</h2>
              <button
                className="text-xl xl:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                x
              </button>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {compareMode ? "Primer humedal" : " humedal"}
              </label>
              <Select
                options={wetlandOptions}
                className="w-full  rounded-md p-2"
                isLoading={loadingWetlands}
                defaultValue={{ label: "Todos los Humedales", value: 0 }}
                placeholder={
                  loadingWetlands
                    ? "Cargando humedales..."
                    : "Seleccionar humedal"
                }
                value={wetlandOptions.find(
                  (option) => option.value.toString() === filters.humedal
                )}
                // onChange={handleWetlandChange}
                onChange={(selectedOption) =>{
                  console.log({selectedOption})
                  handleSelectChange("humedal", selectedOption)
                }
                }
                isClearable
                instanceId="humedal-select"
              />
            </div>

            {/* Nodos */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nodo
              </label>
              <Select
                options={nodeOptions}
                isLoading={loadingNodes}
                className="w-full  rounded-md p-2"
                placeholder="Seleccionar nodo"
                value={
                  filters.nodo
                    ? nodeOptions?.find(
                        (option) => option.value.toString() === filters.nodo
                      )
                    : null
                }
                // onChange={(selectedOption) =>
                //   onFilterChange({
                //     ...filters,
                //     nodo: selectedOption ? selectedOption.value.toString() : "",
                //   })
                // }
                onChange={(selectedOption) =>
                  handleSelectChange("nodo", selectedOption)
                }
                isClearable
                instanceId="nodo-select"
                isDisabled={filters.humedal === "0"}
              />
            </div>

            {/* Sensores */}
            {view === "table" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de sensor
                </label>
                <Select
                  options={sensorTypeOptions}
                  className="w-full  rounded-md p-2"
                  isLoading={loadingSensors}
                  placeholder="Selecciona tipo sensor"
                  value={
                    filters.typeSensor
                      ? sensorTypeOptions?.find(
                          (option) =>
                            option.value.toString() === filters.typeSensor
                        )
                      : null
                  }
                  // onChange={(selectedOption) =>
                  //   onFilterChange({
                  //     ...filters,
                  //     typeSensor: selectedOption ? selectedOption.value.toString() : "",
                  //   })
                  // }
                  onChange={(selectedOption) =>
                    handleSelectChange("typeSensor", selectedOption)
                  }
                  isClearable
                  isDisabled={filters.humedal === "0" || filters.nodo === ""}
                  instanceId="sensor-select"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del sensor
              </label>
              <Select
                options={sensorOptions}
                isLoading={loadingSensors}
                className="w-full  rounded-md p-2"
                placeholder="Seleccionar sensor"
                value={
                  filters.sensor
                    ? sensorOptions?.find(
                        (option) => option.value.toString() === filters.sensor
                      )
                    : null
                }
                // onChange={(selectedOption) =>
                //   onFilterChange({
                //     ...filters,
                //     sensor: selectedOption ? selectedOption.value.toString() : "",
                //   })
                // }
                onChange={(selectedOption) =>
                  handleSelectChange("sensor", selectedOption)
                }
                isClearable
                isDisabled={filters.humedal === "0" || filters.nodo === ""}
                instanceId="sensor-select"
              />
            </div>

            {/* Fechas */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Rango de fechas
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="datetime-local"
                  value={filters.startDate}
                  // onChange={(e) => handleDateChange('startDate', e.target.value)}
                  onChange={(e) =>
                    handleDateChange("startDate", e.target.value)
                  }
                  className="flex-1 border rounded-md p-2"
                />
                <input
                  type="datetime-local"
                  value={filters.endDate}
                  // onChange={(e) => handleDateChange('endDate', e.target.value)}
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                  className="flex-1 border rounded-md p-2"
                />
              </div>
              {dateError && <p className="text-sm text-red-500">{dateError}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
