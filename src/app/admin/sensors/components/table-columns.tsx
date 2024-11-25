"use client"

import * as React from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"

import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

import DeleteSensorsDialog from "./delete-dialog"
import { UpdateSensorSheet } from "./update-sheet"

import type { Sensor } from "@/types"



export function getColumns({ sensorTypes }): ColumnDef<Sensor>[] {
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
      accessorKey: "name",
      header: ({ column }) => (
        console.log(`column`, column),
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
        const [showUpdateSensorSheet, setShowUpdateSensorSheet] = React.useState(false)
        const [showDeleteSensorDialog, setShowDeleteSensorDialog] = React.useState(false)

        console.log(`row`, row)
        return (
          <>
            {
              showUpdateSensorSheet &&
              <UpdateSensorSheet
                open={showUpdateSensorSheet}
                onOpenChange={setShowUpdateSensorSheet}
                sensor={row.original}
                sensorTypes={sensorTypes}
              />
            }
            <DeleteSensorsDialog
              open={showDeleteSensorDialog}
              onOpenChange={setShowDeleteSensorDialog}
              sensorId={[row.original?.sensor_id?.toString()]}
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