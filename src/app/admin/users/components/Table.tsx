import * as React from "react";
import type { DataTableFilterField } from "@/types"
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { TableInstanceProvider } from "@/components/data-table/table-instance-provider";
import { DataTableAdvancedToolbar } from "@/components/data-table/advanced/data-table-advanced-toolbar";
import { getColumns } from "./table-columns";
import { UsersTableToolbarActions } from "./table-toolbar-actions";
import { UsersTableFloatingBar } from "./table-floating-bar";


interface UsersTableProps {
    usersData: {
        data: any[];
        pageCount: number;
        error?: string;
    };
}

export function UsersTable1({ usersData }: UsersTableProps) {
    const columns = React.useMemo(() => getColumns(), []);
    
    const filterFields: DataTableFilterField<any>[] = [
        {
            label: "Nombre",
            value: "name",
            placeholder: "Filtrar por nombre...",
        },
        {
            label: "Correo",
            value: "email",
            placeholder: "Filtrar por correo...",
        },
        {
            label: "Rol",
            value: "role",
            placeholder: "Filtrar por rol...",
        },
        {
            label: "Estado",
            value: "status",
            placeholder: "Filtrar por estado...",
        },
    ];

    const { table } = useDataTable({
        data: usersData.data,
        columns,
        pageCount: usersData.pageCount,
        totalCount: usersData.data.length,
        currentPage: 1,
        perPage: 10,
        defaultPerPage: 10,
        defaultSort: "created_at.desc",
        filterFields,
    });

    return (
        <TableInstanceProvider table={table}>
            <DataTable
                table={table}
                floatingBar={<UsersTableFloatingBar table={table} />}
            >
                <DataTableAdvancedToolbar filterFields={filterFields}>
                    <UsersTableToolbarActions table={table} />
                </DataTableAdvancedToolbar>
            </DataTable>
        </TableInstanceProvider>
    );
}
export const UsersTable = React.memo(UsersTable1);
