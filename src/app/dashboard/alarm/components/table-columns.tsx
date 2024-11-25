import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Button } from "@/components/ui/button"
import { Alarm } from "@/types"
import { UpdateAlertSheet } from "./update-sheet"
import DeleteSensorsDialog from "./delete-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Checkbox } from "@/components/ui/checkbox"
const getBadgeVariant = (value: string) => {
  switch (value) {
    case "CRITICAL":
      return "destructive"; // Rojo o color crítico
    case "MAJOR":
      return "default"; // Default
    case "MINOR":
      return "secondary"; // Secondary
    case "WARNING":
      return "default"; // Outline
    case "INDETERMINATE":
      return "default"; // Default
    default:
      return "default"; // Default
  }
};
 export function getColumns(): ColumnDef<Alarm>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "alert_id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID de Alerta" />,
      cell: ({ row, column }) => <span>{row.getValue(column.id)}</span>,
    },
    
    {
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Descripción" />,
      cell: ({ row, column }) => <span>{row.getValue(column.id)}</span>,
    },
    {
      accessorKey: "severity",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Severidad" />,
      cell : ({ row, column }: { row: any; column: any }) => {
        const value = row.getValue(column.id); // Obtener el valor de la celda
        const variant = getBadgeVariant(value); // Obtener el color basado en el valor
      
        return <Badge variant={variant}>{value}</Badge>;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
      cell: ({ row , column }) => <span className="capitalize">{row.getValue(column.id)}</span>,
    },
    {
      accessorKey: "alert_date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha de Alerta" />,
      cell: ({ cell }) => formatDate(cell.getValue() as Date),

    },
   
    {
      accessorKey: "node_id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID del Nodo" />,
      cell: ({ row, column }) => <span>{row.getValue(column.id)}</span>,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
   
        const [isUpdatePending, startUpdateTransition] = React.useTransition()
        const [showUpdateSensorSheet, setShowUpdateSensorSheet] = React.useState(false)
        const [showDeleteSensorDialog, setShowDeleteSensorDialog] = React.useState(false)

        return (
          <>
            <UpdateAlertSheet
              open={showUpdateSensorSheet}
              onOpenChange={setShowUpdateSensorSheet}
              alert={row.original}
            />
            <DeleteSensorsDialog
              open={showDeleteSensorDialog}
              onOpenChange={setShowDeleteSensorDialog}
              sensorId={[row.original?.alert_id?.toString()]}
              showTrigger={false}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 overflow-visible dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40"
              >
                <DropdownMenuItem onSelect={() => setShowUpdateSensorSheet(true)}>
                  Editar
                </DropdownMenuItem>
                {/* <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={row.original.label}
                      onValueChange={(value) => {
                        startUpdateTransition(() => {
                          toast.promise(
                            updateSensor({
                              id: row.original.id,
                              label: value as Sensor["label"],
                            }),
                            {
                              loading: "Updating...",
                              success: "Label updated",
                              error: (err) => getErrorMessage(err),
                            }
                          )
                        })
                      }}
                    >
                      {["label1", "label2", "label3"].map((label) => (
                        <DropdownMenuRadioItem
                          key={label}
                          value={label}
                          className="capitalize"
                          disabled={isUpdatePending}
                        >
                          {label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setShowDeleteSensorDialog(true)}
                >
                  Eliminar
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      },
    },
  ]
}
// export const getColumns = React.memo(getColumns1);
