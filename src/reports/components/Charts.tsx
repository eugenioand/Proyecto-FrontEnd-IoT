import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import apiClient from "@/lib/api";

interface ChartsProps {
  filters: {
    humedal: string;
    nodo: string;
    sensor: string;
    endDate?: string;
    startDate?: string;
    humedalLabel: string;
    nodoLabel: string;
    sensorLabel: string;
  };
}

export function Charts({ filters }: ChartsProps) {
  const [chartData, setChartData] = useState<any>({
    xAxisData: [],
    seriesData: [],
    unity: "",
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );

  useEffect(() => {
    const fetchData = async () => {
      const { humedal, nodo, sensor } = filters;

      let startDate: string | undefined;
      const endDate: string | undefined = new Date().toISOString();

      if (timeRange === "daily") {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = yesterday.toISOString();
      } else if (timeRange === "weekly") {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        startDate = lastWeek.toISOString();
      } else if (timeRange === "monthly") {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        startDate = lastMonth.toISOString();
      }

      const buildPath = () => {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append("start_time", Math.floor(new Date(startDate).getTime()).toString());
        if (endDate) queryParams.append("end_time", Math.floor(new Date(endDate).getTime()).toString());

        let path = `/wetland-report-graph`;
        if (humedal) path += `/${humedal}`;
        if (nodo) path += `/${nodo}`;
        if (sensor) path += `/${sensor}`;
        return `${path}?${queryParams.toString()}`;
      };

      try {
        setLoading(true);
        const response = await apiClient.get(buildPath());
        const json = response.data;

        const data = json.data
          .map(
            (entry: { sensor: { register_date: string; value: number } }) =>
              entry.sensor
          )
          .filter(Boolean)
          .sort((a: { register_date: string }, b: { register_date: string }) =>
            new Date(a.register_date).getTime() - new Date(b.register_date).getTime()
          ); // ← FIX: ordenar de más antiguo a más reciente

        const xAxisData = data.map(
          (sensor: { register_date: string; value: number }) =>
            sensor.register_date
        );
        const seriesData = data.map(
          (sensor: { register_date: string; value: number }) => sensor.value
        );

        setChartData({
          xAxisData,
          seriesData,
          unity: json.data[0]?.unity || "",
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
        setChartData({ xAxisData: [], seriesData: [], unity: "" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, timeRange]);

  const getOptions = () => ({
    title: {
      text: "Datos del Sensor",
      subtext: `${filters.humedalLabel || ""} - ${filters.nodoLabel || ""} - ${
        filters.sensorLabel || ""
      }`,
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
      },
      {
        type: "slider",
        yAxisIndex: 0,
        filterMode: "none",
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
      },
    ],
  });

  if (loading) return <p>Loading...</p>;

  function sanitizeValue(value: any) {
    if (typeof value !== "number" || !isFinite(value) || isNaN(value)) {
      return "";
    }
    return value;
  }

  return (
    <div>
      <div className="bg-white p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {filters.humedalLabel || ""} - {filters.nodoLabel || ""} -{" "}
            {filters.sensorLabel || ""}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange("daily")}
              className={`px-3 py-1 text-sm border rounded ${
                timeRange === "daily"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              Diario
            </button>
            <button
              onClick={() => setTimeRange("weekly")}
              className={`px-3 py-1 text-sm border rounded ${
                timeRange === "weekly"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setTimeRange("monthly")}
              className={`px-3 py-1 text-sm border rounded ${
                timeRange === "monthly"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              Mensual
            </button>
          </div>
        </div>
        <ReactECharts
          option={getOptions()}
          style={{ height: "350px", width: "100%" }}
        />
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <div>
            Valor Min:{" "}
            {sanitizeValue(Math.min(...chartData.seriesData).toFixed(1))}{" "}
            {chartData.unity}
          </div>
          <div>
            Valor Promedio:{" "}
            {sanitizeValue(
              (
                chartData.seriesData.reduce(
                  (a: number, b: number) => a + b,
                  0
                ) / chartData.seriesData.length
              ).toFixed(1)
            )}{" "}
            {chartData.unity}
          </div>
          <div>
            Valor Max:{" "}
            {sanitizeValue(Math.max(...chartData.seriesData).toFixed(1))}{" "}
            {chartData.unity}
          </div>
        </div>
      </div>
    </div>
  );
}

export const ChartsTab = React.memo(Charts);