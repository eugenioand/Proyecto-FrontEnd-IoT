import React from 'react';

interface TableProps {
  filters: {
    humedal: string;
    nodo: string;
    sensor: string;
  };
}

export function Table({ filters }: TableProps) {
  console.log({ filters });
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unidad
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array( filters.sensor === "1" ? 5 :3)].map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  2024-01-{String(i + 1).padStart(2, '0')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {String(8 + i).padStart(2, '0')}:00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {20 }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {filters.sensor === '1' ? '°C' : 'mg/L'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Mostrando 1-5 de 50 resultados
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            Anterior
          </button>
          <button className="px-3 py-1 border rounded bg-blue-600 text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}