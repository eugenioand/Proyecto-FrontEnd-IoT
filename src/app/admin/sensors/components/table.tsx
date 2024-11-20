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

interface SensorsTableProps {
  sensorsData: {
    data: Sensor[];
    pageCount: number;
    error?: string;
  };
}

type Sensor = {
  id: number;
  name: string;
  type: string;
  status: string;
  // description: string;
  created_at: string;
  updated_at: string;
}

export function SensorsTable({ sensorsData }: SensorsTableProps) {
  const columns = React.useMemo(() => getColumns(), []);

  const sensorStatus = ["active", "inactive"];
  const sensorTypes = [
    { label: "Temperatura", value: "temperature", code: "TMP" },
    { label: "Humedad", value: "humidity", code: "HMD" },
    { label: "pH", value: "ph", code: "PH" },
    { label: "Oxígeno Disuelto", value: "od", code: "OD" },
    { label: "Turbidez", value: "turbidity", code: "TBD" },
    { label: "Caudal de Entrada", value: "FlowRateInlet", code: "FRI" },
    { label: "Caudal de Salida", value: "FlowRateOut", code: "FRO" },
  ]
  

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
      value: "type",
      options: sensorTypes.map((types) => ({
        label: types.label[0]?.toUpperCase() + types.label.slice(1),
        code: types.code,
        value: types.code,
        icon: getSensorTypes(types.value),
        withCount: true,
      })),
    },
  ]

  const { table } = useDataTable({
    data: sensorsData.data,
    columns,
    pageCount: sensorsData.pageCount,
    defaultPerPage: 10,
    defaultSort: "created_at.desc",
    filterFields,
  });

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