/* eslint-disable */
import * as React from "react";
import type { DataTableFilterField } from "@/types"
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { TableInstanceProvider } from "@/components/data-table/table-instance-provider";
import { DataTableAdvancedToolbar } from "@/components/data-table/advanced/data-table-advanced-toolbar";
import { getColumns } from "./table-columns";
import { SensorsTableToolbarActions } from "./table-toolbar-actions";
import { SensorsTableFloatingBar } from "./table-floating-bar";

// import { getStatusIcon, getSensorTypes } from "@/lib/utils";

import { Alarm } from "@/types"

interface SensorsTableProps {
  sensorsData: {
    data: Alarm[];
    pageCount: number;
    error?: string;
    totalCount:number;
  };
}

export function SensorsTable1({ sensorsData }: SensorsTableProps) {
  console.log('sensorsData', sensorsData);
  const columns = React.useMemo(() => getColumns(), []);

  const sensorStatus: Array<'active' | 'inactive'> = ["active", "inactive"];
  const sensorTypes = [
    { label: "Temperatura", value: "temperature" as const, code: "TMP" },
    { label: "Humedad", value: "humidity" as const, code: "HMD" },
    { label: "pH", value: "ph" as const, code: "PH" },
    { label: "Oxígeno Disuelto", value: "od" as const, code: "OD" },
    { label: "Turbidez", value: "turbidity" as const, code: "TBD" },
    { label: "Caudal de Entrada", value: "FlowRateInlet" as const, code: "FRI" },
    { label: "Caudal de Salida", value: "FlowRateOut" as const, code: "FRO" },
  ]
  

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: "Descripcion",
      value: "description",
      placeholder: "Filtrar por nombre...",
    },
    {
      label: "Estado",
      value: "status",
      options: sensorStatus.map((status) => ({
        label: status[0]?.toUpperCase() + status.slice(1),
        value: status,
        // icon: getStatusIcon(status),
        withCount: true,
      })),
    },
    {
      label: "Tipo",
      value: "type_sensor",
      options: sensorTypes.map((types) => ({
        label: types.label[0]?.toUpperCase() + types.label.slice(1),
        code: types.code,
        value: types.code,
        // icon: getSensorTypes(types.value),
        withCount: true,
      })),
    },
  ]

  const { table } = useDataTable({
    data: sensorsData.data,
    columns,
    pageCount: sensorsData.pageCount,
    totalCount: sensorsData.totalCount,
    currentPage: 1,
    perPage: 10,
    defaultPerPage: 10,
    // defaultSort: "purchase_date.desc",
    // filterFields,
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

export const SensorsTable = React.memo(SensorsTable1);
