import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

interface ComparisonChartProps {
  filters: {
    humedal: string;
    nodo: string;
    sensor: string;
    startDate?: string;
    endDate?: string;
    humedalLabel: string;
    nodoLabel: string;
    sensorLabel: string;

  };
  filters2: {
    humedal: string;
    nodo: string;
    sensor: string;
    startDate?: string;
    endDate?: string;
    humedalLabel: string;
    nodoLabel: string;
    sensorLabel: string;
  };
  secondHumedal: string;
}

export function ComparisonChart({
  filters,
  filters2,
  secondHumedal,
}: ComparisonChartProps) {
  const [chartData, setChartData] = useState<any>({
    xAxisData: [],
    seriesData: [],
    unity: "",
  });
  const [chartData2, setChartData2] = useState<any>({
    xAxisData: [],
    seriesData: [],
    unity: "",
  });
  const [loading, setLoading] = useState(false);

  // Estado para los rangos de tiempo seleccionados
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const [timeRange2, setTimeRange2] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );

  const buildUrl = (baseUrl: string, params: any) => {
    const queryParams = new URLSearchParams();
    if (params.startDate)
      queryParams.append(
        "start_time",
        Math.floor(new Date(params.startDate).getTime()).toString()
      );
    if (params.endDate)
      queryParams.append(
        "end_time",
        Math.floor(new Date(params.endDate).getTime()).toString()
      );

    let url = baseUrl;
    if (params.humedal) url += `/${params.humedal}`;
    if (params.nodo) url += `/${params.nodo}`;
    if (params.sensor) url += `/${params.sensor}`;

    return `${url}?${queryParams.toString()}`;
  };

  const calculateDates = (range: "daily" | "weekly" | "monthly") => {
    const endDate = new Date();
    const startDate = new Date();

    if (range === "daily") {
      startDate.setDate(endDate.getDate() - 1);
    } else if (range === "weekly") {
      startDate.setDate(endDate.getDate() - 7);
    } else if (range === "monthly") {
      startDate.setMonth(endDate.getMonth() - 1);
    }

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  };

  const fetchData = async (
    currentFilters: any,
    setChartDataCallback: (data: any) => void,
    timeRange: "daily" | "weekly" | "monthly"
  ) => {
    const { startDate, endDate } = calculateDates(timeRange);
    const url = buildUrl(
      "https://proyecto-backend-iot.vercel.app/api/wetland-report-graph",
      { ...currentFilters, startDate, endDate }
    );

    try {
      setLoading(true);
      const response = await fetch(url);
      const json = await response.json();
      const data = json.data
        .map((entry: { sensor: any }) => entry.sensor)
        .filter(Boolean);

      const xAxisData = data.map(
        (sensor: { register_date: string }) => sensor.register_date
      );
      const seriesData = data.map((sensor: { value: number }) => sensor.value);

      setChartDataCallback({
        xAxisData,
        seriesData,
        unity: json.data[0]?.unity || "",
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
      setChartDataCallback({ xAxisData: [], seriesData: [], unity: "" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters, setChartData, timeRange);
  }, [filters, timeRange]);

  useEffect(() => {
    fetchData(filters2, setChartData2, timeRange2);
  }, [filters2, timeRange2]);

  const getOptions = (chartData: any, title: string, colorHumedal:string) => ({
    title: {
      text: title,
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: chartData.xAxisData,
    },
    yAxis: {
      type: "value",
    },
    dataZoom: [
      {
        type: "slider",
        xAxisIndex: 0,
        filterMode: "none",
        // handleIcon:
        // "M8.2,13.2V2.5h1.3v10.6c0,0.4-0.2,0.8-0.6,1c-0.3,0.2-0.7,0.2-1,0C8.4,14,8.2,13.6,8.2,13.2z M6.2,13.2V2.5h1.3v10.6c0,0.4-0.2,0.8-0.6,1c-0.3,0.2-0.7,0.2-1,0C6.4,14,6.2,13.6,6.2,13.2z",
        handleSize: "80%",
        handleStyle: {
          color: `${colorHumedal}`, // Color del mango
          shadowBlur: 3,
          shadowColor: "rgba(0, 0, 0, 0.6)",
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        backgroundColor: `${colorHumedal}`, // Color de fondo del área de dataZoom
        borderColor: `${colorHumedal}`, // Color del borde del área de dataZoom
      },
      {
        type: "slider",
        yAxisIndex: 0,
        filterMode: "none",
        backgroundColor: `${colorHumedal}`, // Color de fondo del área de dataZoom
        borderColor: `${colorHumedal}`,
      },
      {
        type: "inside",
        xAxisIndex: 0,
        filterMode: "none",
      },
      {
        type: "inside",
        yAxisIndex: 0,
        filterMode: "none",
      },
    ],
    series: [
      {
        data: chartData.seriesData,
        type: "line",
        smooth: true,
        itemStyle: {
          color: `${colorHumedal}`, // Cambia a tu color deseado aquí
        },
        lineStyle: {
          color: `${colorHumedal}`, // Cambia a tu color deseado aquí
          width: 2, // Opcional: Cambia el grosor de la línea
        },
      },
    ],
  });


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-16">
        {/* Gráfico 1 */}
        <div className="bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {filters?.humedalLabel} - {filters?.nodoLabel} - {filters?.sensorLabel}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange("daily")}
                className={`px-3 py-1 text-sm border rounded ${
                  timeRange === "daily" ? "bg-blue-600 text-white" : ""
                }`}
              >
                Diario
              </button>
              <button
                onClick={() => setTimeRange("weekly")}
                className={`px-3 py-1 text-sm border rounded ${
                  timeRange === "weekly" ? "bg-blue-600 text-white" : ""
                }`}
              >
                Semanal
              </button>
              <button
                onClick={() => setTimeRange("monthly")}
                className={`px-3 py-1 text-sm border rounded ${
                  timeRange === "monthly" ? "bg-blue-600 text-white" : ""
                }`}
              >
                Mensual
              </button>
            </div>
          </div>
          <ReactECharts
            option={getOptions(
              chartData,
              `${filters.humedalLabel || ''} - ${filters.sensorLabel || ''}`,
              "#2563eb"
            )}
            style={{ height: "350px", width: "100%" }}
          />
        </div>

        {/* Gráfico 2 */}
        <div className="bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {filters2?.humedalLabel} - {filters2?.nodoLabel} - {filters2?.sensorLabel}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange2("daily")}
                className={`px-3 py-1 text-sm border rounded ${
                  timeRange2 === "daily" ? "bg-blue-600 text-white" : ""
                }`}
              >
                Diario
              </button>
              <button
                onClick={() => setTimeRange2("weekly")}
                className={`px-3 py-1 text-sm border rounded ${
                  timeRange2 === "weekly" ? "bg-blue-600 text-white" : ""
                }`}
              >
                Semanal
              </button>
              <button
                onClick={() => setTimeRange2("monthly")}
                className={`px-3 py-1 text-sm border rounded ${
                  timeRange2 === "monthly" ? "bg-blue-600 text-white" : ""
                }`}
              >
                Mensual
              </button>
            </div>
          </div>
          <ReactECharts
            option={getOptions(
              chartData2,
              `  ${filters2.humedalLabel || ''} - ${filters2.sensorLabel || ''}`,
              "#c23531"
            )}
            style={{ height: "350px", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
