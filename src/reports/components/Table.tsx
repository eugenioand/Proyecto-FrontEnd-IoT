import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

interface TableProps {
  filters: {
    humedal?: string;
    nodo?: string;
    sensor?: string;
    typeSensor?: string;
    startDate?: string;
    endDate?: string;
  };
}

interface DataRow {
  fecha: string;
  hora: string;
  valor: number;
  unidad: string;
  localizacionNodo: string;
  nombreHumedal: string;
  tipoSensor: string;
}

const TableComponent = ({ filters }: TableProps) => {
  console.log('filters', filters);
  const [data, setData] = useState<DataRow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Tamaño de página por defecto
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Construcción dinámica del endpoint
  const buildEndpoint = () => {
    let endpoint = 'https://proyecto-backend-iot.vercel.app/api/wetland-report';
    if (filters.humedal && filters.humedal !== '0') endpoint += `/${filters.humedal}`;
    if (filters.nodo) endpoint += `/${filters.nodo}`;
    if (filters.sensor) endpoint += `/${filters.sensor}`;
    endpoint += `?page_size=${pageSize}&page=${page}`;

    const startTime = filters.startDate ? Math.floor(new Date(filters.startDate).getTime()) : null;
    const endTime = filters.endDate ? Math.floor(new Date(filters.endDate).getTime()) : null;

    if(filters.typeSensor) {
      endpoint += `&sensor_type=${filters.typeSensor}`;
    }

    if (startTime && endTime) {
      console.log('start', startTime, 'end', endTime);
      endpoint += `&start_time=${startTime}`;
      endpoint += `&end_time=${endTime}`;
    }
    // if (endTime) {
    // }

    return endpoint;
  };

  // Fetch data from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if(filters.startDate && filters.endDate && new Date(filters.startDate) > new Date(filters.endDate)) {
        setErrorMessage('La fecha de inicio no puede ser mayor a la fecha de fin.');
        setLoading(false);
        return
      }
      if(filters.startDate && !filters.endDate) {
        // setErrorMessage('Es necesario ingresar una fecha de fin.');
        setLoading(false);
        return
      }
      const response = await fetch(buildEndpoint());
      const result = await response.json();

      if (response.ok) {
        const transformedData = result.data.map((item: any) => ({
          fecha: new Date(item.sensor.register_date).toLocaleDateString(),
          hora: new Date(item.sensor.register_date).toLocaleTimeString(),
          valor: item.sensor.value,
          unidad: item.sensor.unity,
          localizacionNodo: item.node.location,
          nombreHumedal: item.wetland.name,
          tipoSensor: item.sensor.type_sensor,
        }));

        setData(transformedData);
        setTotalResults(result.paging.total_count);
        setTotalPages(result.paging.total_pages);
      } else {
        setData([]);
        setTotalResults(0);
        setTotalPages(0);
        setErrorMessage( 'No hay Data'|| 'Error desconocido al cargar los datos');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Definición de columnas
  const columns: ColumnDef<DataRow>[] = useMemo(
    () => [
      {
        accessorKey: 'fecha',
        header: 'Fecha',
      },
      {
        accessorKey: 'hora',
        header: 'Hora',
      },
      {
        accessorKey: 'valor',
        header: 'Valor',
      },
      {
        accessorKey: 'unidad',
        header: 'Unidad',
      },
      {
        accessorKey: 'localizacionNodo',
        header: 'Localización Nodo',
      },
      {
        accessorKey: 'nombreHumedal',
        header: 'Nombre Humedal',
      },
      {
        accessorKey: 'tipoSensor',
        header: 'Tipo de Sensor',
      },
    ],
    []
  );

  // Configuración de la tabla
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Manejo de eventos de paginación
  const handlePreviousPage = useCallback(() => {
    if (page > 1) setPage((prevPage) => prevPage - 1);
  }, [page]);

  const handleNextPage = useCallback(() => {
    if (page < totalPages) setPage((prevPage) => prevPage + 1);
  }, [page, totalPages]);

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setPage(1); // Reset page to 1 when page size changes
  };

  return (
    <div>
      {loading ? (
        <div className="text-center">Cargando datos...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {errorMessage ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4 text-red-500">
                    {errorMessage}
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    Parece que aun no hay datos
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {!loading && !errorMessage && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Mostrando {data.length > 0 ? (page - 1) * pageSize + 1 : 0} - {page * pageSize > totalResults ? totalResults : page * pageSize} de {totalResults} resultados
          </div>
          <div className="flex space-x-2 items-center">
            <button
              className="px-3 py-1 border rounded hover:bg-gray-50"
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span className="px-3 py-1 border rounded bg-blue-600 text-white">{page}</span>
            <button
              className="px-3 py-1 border rounded hover:bg-gray-50"
              onClick={handleNextPage}
              disabled={page >= totalPages}
            >
              Siguiente
            </button>
            <select
              className="px-3 py-1 border rounded"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
export const Table = React.memo(TableComponent);

