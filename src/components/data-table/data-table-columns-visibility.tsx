"use client"

import { useState } from "react"
import { LayoutIcon } from "@radix-ui/react-icons"
import { useHotkeys } from "react-hotkeys-hook"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Kbd } from "@/components/kbd"

import { useTableInstanceContext } from "./table-instance-provider"

export function DataTableColumnsVisibility() {
  const [open, setOpen] = useState(false)
  const { tableInstance: table } = useTableInstanceContext()

  useHotkeys("shift+c", () => {
    setTimeout(() => setOpen(true), 100)
  })

  const columnNamesInSpanish: Record<string, string> = {
    name: "Nombre",
    type_sensor: "Tipo de Sensor",
    status: "Estado",
    purchase_date: "Fecha de Compra",
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Toggle columns"
                variant="outline"
                size="sm"
                className="ml-auto hidden h-8 lg:flex"
              >
                <LayoutIcon className="mr-2 size-4" />
                Columnas
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent className="flex items-center gap-2 border bg-accent font-semibold text-foreground dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40">
            Alternar columnas
            <div>
              <Kbd variant="outline">⇧</Kbd> <Kbd variant="outline">C</Kbd>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent
        align="end"
        className="w-40 dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40"
      >
        <DropdownMenuLabel>Alternar columnas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            const spanishColumnName = columnNamesInSpanish[column.id] || column.id
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                onSelect={(e) => e.preventDefault()}
              >
                <span className="truncate" title={spanishColumnName}>{spanishColumnName}</span>
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
