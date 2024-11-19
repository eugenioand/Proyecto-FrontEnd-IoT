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

  const status = ["active", "inactive"];
  const types = ["temperature", "humidity", "ph", "od", "turbidity", "FlowRateInlet", "FlowRateOut"];
  

  const filterFields: DataTableFilterField<Sensor>[] = [
    {
      label: "Nombre",
      value: "name",
      placeholder: "Filtrar por nombre...",
    },
    {
      label: "Estado",
      value: "status",
      options: status.map((status) => ({
        label: status[0]?.toUpperCase() + status.slice(1),
        value: status,
        icon: getStatusIcon(status),
        withCount: true,
      })),
    },
    {
      label: "Tipo",
      value: "type",
      options: types.map((types) => ({
        label: types[0]?.toUpperCase() + types.slice(1),
        value: types,
        icon: getSensorTypes(types),
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