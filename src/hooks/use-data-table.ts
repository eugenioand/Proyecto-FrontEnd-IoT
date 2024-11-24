"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { DataTableFilterField } from "@/types";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";

import { createQueryString } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface UseDataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pageCount: number;
  totalCount: number;
  currentPage: number;
  perPage: number;
  defaultPerPage?: number;
  defaultSort?: `${Extract<keyof TData, string | number>}.${"asc" | "desc"}`;
  filterFields?: DataTableFilterField<TData>[];
}

const schema = z.object({
  page: z.coerce.number().default(1),
  page_size: z.coerce.number().default(10),
  sort: z.string().default("createdAt.desc"),
});

export function useDataTable<TData, TValue>({
  data,
  columns,
  pageCount,
  totalCount,
  currentPage,
  perPage,
  defaultPerPage = 10,
  defaultSort = `${Object.keys(data[0] as object)[0]}.desc` as `${Extract<
    keyof TData,
    string | number
  >}.desc`,
  filterFields = [],
}: UseDataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = schema.parse(Object.fromEntries(searchParams));
  const page = search.page;
  const pageSize = search.page_size ?? defaultPerPage;
  const sort = search.sort ?? defaultSort;
  const [column, order] = sort?.split(".") ?? [];

  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    };
  }, [filterFields]);

  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    return Array.from(searchParams.entries()).reduce<ColumnFiltersState>(
      (filters, [key, value]) => {
        const filterableColumn = filterableColumns.find(
          (column) => column.value === key
        );
        const searchableColumn = searchableColumns.find(
          (column) => column.value === key
        );

        if (filterableColumn) {
          filters.push({
            id: key,
            value: value.split("."),
          });
        } else if (searchableColumn) {
          filters.push({
            id: key,
            value: [value],
          });
        }

        return filters;
      },
      []
    );
  }, [filterableColumns, searchableColumns, searchParams]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);

  const [{ pageIndex, pageSize: localPageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: page - 1,
      pageSize: pageSize,
    });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize: localPageSize,
    }),
    [pageIndex, localPageSize]
  );

  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: column ?? "",
      desc: order === "desc",
    },
  ]);

  const debouncedSearchableColumnFilters = JSON.parse(
    useDebounce(
      JSON.stringify(
        columnFilters.filter((filter) => {
          return searchableColumns.find((column) => column.value === filter.id);
        })
      ),
      500
    )
  ) as ColumnFiltersState;

  const filterableColumnFilters = columnFilters.filter((filter) => {
    return filterableColumns.find((column) => column.value === filter.id);
  });

  // Sincronizar cambios en la URL con el estado local
  React.useEffect(() => {
    const parsed = schema.parse(Object.fromEntries(searchParams));
    setPagination({
      pageIndex: parsed.page - 1,
      pageSize: parsed.page_size ?? defaultPerPage,
    });
  }, [searchParams, defaultPerPage]);

  // Sincronizar cambios en el estado local con la URL
  React.useEffect(() => {
    const newParams: { [key: string]: any } = {
      page: pageIndex + 1,
      page_size: localPageSize,
      sort: sorting[0]?.id
        ? `${sorting[0]?.id}.${sorting[0]?.desc ? "desc" : "asc"}`
        : undefined,
    };

    for (const column of debouncedSearchableColumnFilters) {
      if (typeof column.value === "string") {
        newParams[column.id] = column.value;
      }
    }

    for (const column of filterableColumnFilters) {
      if (typeof column.value === "object" && Array.isArray(column.value)) {
        newParams[column.id] = column.value.join(".");
      }
    }

    const queryString = createQueryString(newParams, searchParams);
    router.push(`${pathname}?${queryString}`, { scroll: false });
  }, [
    pageIndex,
    localPageSize,
    sorting,
    debouncedSearchableColumnFilters,
    filterableColumnFilters,
  ]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return { table };
}
