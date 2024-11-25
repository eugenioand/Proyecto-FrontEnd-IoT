"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useTableInstanceContext } from "./table-instance-provider"

interface DataTablePaginationProps {
  pageSizeOptions?: number[]
}

export function DataTablePagination({
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTablePaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { tableInstance: table } = useTableInstanceContext()

  const page = Number(searchParams.get("page") || 1) - 1 // Convertir a índice 0 basado
  const perPage = Number(searchParams.get("page_size") || 10)

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.push(`?${params.toString()}`, undefined, { shallow: true })
  }

  const handlePageChange = (newPage: number) => {
    table.setPageIndex(newPage)
    updateQueryParams("page", (newPage + 1).toString())
  }

  const handlePageSizeChange = (newPageSize: number) => {
    table.setPageSize(newPageSize)
    updateQueryParams("page_size", newPageSize.toString())
    handlePageChange(0) // Volver a la primera página al cambiar el tamaño
  }

  return (
    <div className="flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8">
      <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} de{" "}
        {table.getFilteredRowModel().rows.length} filas(s) seleccionada(s).
      </div>
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        {/* Selector de filas por página */}
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap text-sm font-medium">Filas por página</p>
          <Select
            value={`${perPage}`}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[4.5rem]">
              <SelectValue placeholder={`${perPage}`} />
            </SelectTrigger>
            <SelectContent
              side="top"
              className="dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40"
            >
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Información de la página actual */}
        <div className="flex items-center justify-center text-sm font-medium">
          Página {page + 1} de {table.getPageCount()}
        </div>

        {/* Botones de paginación */}
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Ir a la primera página"
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => handlePageChange(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <DoubleArrowLeftIcon className="size-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Ir a la página anterior"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePageChange(page - 1)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="size-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Ir a la página siguiente"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => handlePageChange(page + 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="size-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Ir a la última página"
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => handlePageChange(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <DoubleArrowRightIcon className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
