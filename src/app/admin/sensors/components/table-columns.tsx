"use client"

import * as React from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/handle-error"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

import { updateSensor } from "@/lib/actions/sensors"
import DeleteSensorsDialog from "./delete-dialog"
import { UpdateSensorSheet } from "./update-sheet"

export function getColumns(): ColumnDef<Sensor>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
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
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nombre" />
      ),
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        const formattedName = name
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase());
        return <div className="w-20">{formattedName}</div>;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "type_sensor",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo" />
      ),
      cell: ({ row }) => {
        const type = row.original.type_sensor
        console.log(row.original)

        return (
          <div className="flex space-x-2">
            {type.name && <Badge variant="outline">{type.code}</Badge>}
            <span className="max-w-[31.25rem] truncate font-medium">
              {type.name}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => {
        const status = row.original.status

        if (!status) return null

        return (
          <div className="flex w-[6.25rem] items-center">
            <span className="capitalize">
              {status.toLowerCase() === "active" ? "Activo" : "Inactivo"}
            </span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "purchase_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha de compra" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition()
        const [showUpdateSensorSheet, setShowUpdateSensorSheet] = React.useState(false)
        const [showDeleteSensorDialog, setShowDeleteSensorDialog] = React.useState(false)

        return (
          <>
            <UpdateSensorSheet
              open={showUpdateSensorSheet}
              onOpenChange={setShowUpdateSensorSheet}
              sensor={row.original}
            />
            <DeleteSensorsDialog
              open={showDeleteSensorDialog}
              onOpenChange={setShowDeleteSensorDialog}
              sensors={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
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