import * as React from "react";
import type { DataTableFilterField } from "@/types"
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { TableInstanceProvider } from "@/components/data-table/table-instance-provider";
import { DataTableAdvancedToolbar } from "@/components/data-table/advanced/data-table-advanced-toolbar";
import { getColumns } from "./table-columns";
import { SensorsTableToolbarActions } from "./table-toolbar-actions";
import { SensorsTableFloatingBar } from "./table-floating-bar";

import { getStatusIcon, getSensorTypes } from "@/lib/utils";

import type { Sensor } from "@/types"
import { useSensorTypes } from "@/hooks/useSensorTypes";

interface SensorsTableProps {
  sensorsData: {
    data: Sensor[];
    pageCount: number;
    error?: string;
  };
}

export function SensorsTable({ sensorsData }: SensorsTableProps) {
  const { sensorTypes, loading, error } = useSensorTypes();

  console.log("sensorTypes asdas das", sensorTypes);
  const columns = React.useMemo(() => getColumns({ sensorTypes }), [sensorTypes]);

  const sensorStatus = ["activo", "inactivo"];

  const filterFields: DataTableFilterField<Sensor>[] = [
    {
      label: "Nombre",
      value: "name",
      placeholder: "Filtrar por nombre...",
    },
    {
      label: "Estado",
      value: "status",
      options: sensorStatus.map((status) => ({
        label: status[0]?.toUpperCase() + status.slice(1),
        value: status,
        icon: getStatusIcon(status),
        withCount: true,
      })),
    },
    {
      label: "Tipo",
      value: "type_sensor",
      options: sensorTypes.map((type) => ({
        label: type.name[0]?.toUpperCase() + type.name.slice(1),
        code: type.code,
        value: type.name,
        icon: getSensorTypes(type.code),
        withCount: true,
      })),
    },
  ]

  const { table } = useDataTable({
    data: sensorsData.data,
    columns,
    pageCount: sensorsData.pageCount,
    totalCount: sensorsData.data.length,
    currentPage: 1,
    perPage: 10,
    defaultPerPage: 10,
    defaultSort: "purchase_date.desc",
    filterFields,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <TableInstanceProvider table={table}>
      <DataTable
        table={table}
        floatingBar={<SensorsTableFloatingBar table={table} />}
      >
        <DataTableAdvancedToolbar filterFields={filterFields}>
          <SensorsTableToolbarActions table={table} />
        </DataTableAdvancedToolbar>
      </DataTable>
    </TableInstanceProvider>
  );
}