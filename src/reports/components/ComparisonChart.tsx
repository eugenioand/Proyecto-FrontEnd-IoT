import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
interface ComparisonChartProps {
  filters: {
    humedal: string;
    nodo: string;
    sensor: string;
  };
  filters2: {
    humedal: string;
    nodo: string;
    sensor: string;
  };
  secondHumedal: string;
}

export function ComparisonChart({
  filters,
  filters2,
  secondHumedal,
}: ComparisonChartProps) {
  const [chartData, setChartData] = useState<any>({ xAxisData: [], seriesData: [] });
  const [chartData2, setChartData2] = useState<any>({ xAxisData: [], seriesData: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const { humedal, nodo, sensor } = filters;
      const baseUrl = `https://proyecto-backend-iot.vercel.app/api/wetland-report-graph/${humedal}/${nodo}/${sensor}`;
      const startTime = filters.startDate ? Math.floor(new Date(filters.startDate).getTime()) : null;
      const endTime = filters.endDate ? Math.floor(new Date(filters.endDate).getTime()) : null;
      const url = `${baseUrl}?end_time=${endTime}&start_time=${startTime}`;

      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        const data = json.data.map(entry => entry.sensor).filter(Boolean); // Filtra para ignorar entradas sin sensor
        const xAxisData = data.map(sensor => sensor.register_date);
        const seriesData = data.map(sensor => sensor.value);
        
        if (seriesData.length > 0) {
          setChartData({ xAxisData, seriesData });
        } else {
          setChartData({ xAxisData: [], seriesData: [] }); // No hay datos
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setChartData({ xAxisData: [], seriesData: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);
  useEffect(() => {
    const fetchData = async () => {
      const { humedal, nodo, sensor } = filters2;
      const baseUrl = `https://proyecto-backend-iot.vercel.app/api/wetland-report-graph/${humedal}/${nodo}/${sensor}`;
      const startTime = filters2.startDate ? Math.floor(new Date(filters2.startDate).getTime()) : null;
      const endTime = filters2.endDate ? Math.floor(new Date(filters2.endDate).getTime()) : null;
      const url = `${baseUrl}?end_time=${endTime}&start_time=${startTime}`;

      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        const data = json.data.map(entry => entry.sensor).filter(Boolean); // Filtra para ignorar entradas sin sensor
        const xAxisData = data.map(sensor => sensor.register_date);
        const seriesData = data.map(sensor => sensor.value);
        
        if (seriesData.length > 0) {
          setChartData2({ xAxisData, seriesData });
        } else {
          setChartData2({ xAxisData: [], seriesData: [] }); // No hay datos
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setChartData2({ xAxisData: [], seriesData: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters2]);

  

  const getOptions = () => ({
    title: {
      text: 'Datos del Sensor',
      subtext: `${filters.sensor} - ${filters.humedal} - ${filters.nodo}`,
      left: 'center'
    },
     tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        if (!chartData.seriesData || chartData.seriesData.length === 0) {
          return 'No hay datos para comparar. Por favor, selecciona otro sensor.';
        }
        return params.map(param => `${param.marker} ${param.seriesName}: ${param.value}`).join('<br/>');
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData?.xAxisData
    },
    yAxis: {
      type: 'value'
    },
    dataZoom: [
      // Remove or comment out this block to remove the horizontal slider
      {
        type: 'slider',
        yAxisIndex: 0,
        filterMode: 'none'
      }
    ],
    series: [{
      data: chartData.seriesData,
      type: 'line',
      smooth: true
    }]
  });

  const getOptions2 = () => ({
    title: {
      text: "Datos del Sensor",
      subtext: `${filters.sensor} - ${filters.humedal} - ${filters.nodo}`,
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: chartData2?.xAxisData, // datos de ejemplo
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
          color: "#ff5733", // Color del mango
          shadowBlur: 3,
          shadowColor: "rgba(0, 0, 0, 0.6)",
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        backgroundColor: '#ff5733', // Color de fondo del área de dataZoom
        borderColor: '#ff5733' // Color del borde del área de dataZoom
      },
      {
        type: "slider",
        yAxisIndex: 0,
        filterMode: "none",
        backgroundColor: '#ff5733', // Color de fondo del área de dataZoom
        borderColor: '#ff5733' 
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
        data: chartData2.seriesData, // datos de ejemplo
        type: "line",
        smooth: true,
        itemStyle: {
          color: "#c23531", // Cambia a tu color deseado aquí
        },
        lineStyle: {
          color: "#c23531", // Cambia a tu color deseado aquí
          width: 2, // Opcional: Cambia el grosor de la línea
        },
      },
    ],
  });
  // if (chartData.seriesData.length === 0) return <div className="bg-white p-4 rounded-lg text-center">No hay datos disponibles para mostrar.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Comparación de {filters.sensor}
        </h3>
        {/* <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
            Diario
          </button>
          <button className="px-3 py-1 text-sm border rounded bg-blue-600 text-white">
            Semanal
          </button>
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
            Mensual
          </button>
        </div> */}
      </div>

      <div className="grid grid-cols-1 gap-16">
        <div className="h-80 w-full bg-white-50 rounded flex items-center justify-center">
          {
            // chartData.seriesData.length === 0 ? <div className="bg-white p-4 rounded-lg text-center">No hay datos disponibles para mostrar.</div>:
            <ReactECharts
            option={getOptions()}
            style={{ height: "350px", width: "100%" }}
          />

          }
         
        </div>

        <div className="h-80 w-full bg-white-50 rounded flex items-center justify-center">
        {
            chartData2.seriesData.length === 0 ? <div className="bg-white p-4 rounded-lg text-center">No hay datos disponibles para mostrar.</div>:
            <ReactECharts
            option={getOptions2()}
            style={{ height: "350px", width: "100%" }}
          />

          }
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium mb-2">Humedal 1</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Valor mínimo:</span>
                <span>{Math.min(...chartData.seriesData).toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between">
                <span>Valor promedio:</span>
                <span>{(chartData.seriesData.reduce((a, b) => a + b, 0) / chartData.seriesData.length).toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between">
                <span>Valor máximo:</span>
                <span>{Math.max(...chartData.seriesData).toFixed(1)}°C</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium mb-2">{secondHumedal}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Valor mínimo:</span>
                <span>{Math.min(...chartData2.seriesData).toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between">
                <span>Valor promedio:</span>
                <span>{(chartData.seriesData.reduce((a, b) => a + b, 0) / chartData2.seriesData.length).toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between">
                <span>Valor máximo:</span>
                <span>{Math.max(...chartData2.seriesData).toFixed(1)}°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
