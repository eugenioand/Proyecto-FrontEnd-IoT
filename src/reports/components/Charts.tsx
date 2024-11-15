import React from 'react';

interface ChartsProps {
  filters: {
    humedal: string;
    nodo: string;
    sensor: string;
  };
}

export function Charts({ filters }: ChartsProps) {
  return (
    <div>
      <div className="bg-white p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {filters.sensor} - {filters.humedal} - {filters.nodo}
          </h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
              Diario
            </button>
            <button className="px-3 py-1 text-sm border rounded bg-blue-600 text-white">
              Semanal
            </button>
            <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
              Mensual
            </button>
          </div>
        </div>

        <div className="h-80 w-full bg-gray-50 rounded flex items-center justify-center">
          <p className="text-gray-500">
            Aquí se mostrará el gráfico con los datos seleccionados
          </p>
        </div>

        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <div>Valor Min: 20.1°C</div>
          <div>Valor Promedio: 22.5°C</div>
          <div>Valor Max: 25.3°C</div>
        </div>
      </div>
    </div>
  );
}
