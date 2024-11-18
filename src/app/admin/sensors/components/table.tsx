import * as React from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { TableInstanceProvider } from "@/components/data-table/table-instance-provider";
import { DataTableAdvancedToolbar } from "@/components/data-table/advanced/data-table-advanced-toolbar";
import { getColumns } from "./table-columns";
import { SensorsTableToolbarActions } from "./table-toolbar-actions";
import { SensorsTableFloatingBar } from "./table-floating-bar";

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
  // description: string;
  created_at: string;
  updated_at: string;
}

export function SensorsTable({ sensorsData }: SensorsTableProps) {
  const columns = React.useMemo(() => getColumns(), []);

  const filterFields = React.useMemo(() => {
    return columns
      .filter((column) => column.filterable)
      .map((column) => {
        return {
          label: column.Header,
          value: column.id,
          options: column.options,
        };
      });
  }, [columns]);

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