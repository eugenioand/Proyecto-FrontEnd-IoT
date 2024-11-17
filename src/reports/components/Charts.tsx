import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

interface ChartsProps {
  filters: {
    humedal: string;
    nodo: string;
    sensor: string;
    endDate?: string;
    startDate?: string;
  };
}

export function Charts({ filters }: ChartsProps) {
  const [chartData, setChartData] = useState<any>({ xAxisData: [], seriesData: [] });
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

  const getOptions = () => ({
    title: {
      text: 'Datos del Sensor',
      subtext: `${filters.sensor} - ${filters.humedal} - ${filters.nodo}`,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.xAxisData
    },
    yAxis: {
      type: 'value'
    },
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: 0,
        filterMode: 'none'
      },
      {
        type: 'slider',
        yAxisIndex: 0,
        filterMode: 'none'
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'none'
      },
      {
        type: 'inside',
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

  if (loading) return <p>Loading...</p>;
  if (chartData.seriesData.length === 0) return <div className="bg-white p-4 rounded-lg text-center">No hay datos disponibles para mostrar.</div>;

  return (
    <div>
      <div className="bg-white p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {filters.sensor} - {filters.humedal} - {filters.nodo}
          </h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm border rounded  bg-blue-600 text-white">
              Diario
            </button>
            <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
              Semanal
            </button>
            <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
              Mensual
            </button>
          </div>
        </div>

        <ReactECharts option={getOptions()} style={{ height: '350px', width: '100%' }} />

        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <div>Valor Min: {Math.min(...chartData.seriesData).toFixed(1)}°C</div>
          <div>Valor Promedio: {(chartData.seriesData.reduce((a, b) => a + b, 0) / chartData.seriesData.length).toFixed(1)}°C</div>
          <div>Valor Max: {Math.max(...chartData.seriesData).toFixed(1)}°C</div>
        </div>
      </div>
    </div>
  );
}

export const ChartsTab = React.memo(Charts);
