"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { DataTableFilterField, DataTableFilterOption } from "@/types";
import { CaretSortIcon, PlusIcon } from "@radix-ui/react-icons";
import isEqual from "lodash.isequal";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DataTableFilterCombobox } from "@/components/data-table/advanced/data-table-filter-combobox";
import { DataTableColumnsVisibility } from "@/components/data-table/data-table-columns-visibility";
import type { SearchParams } from "@/lib/validations";

import { useTableInstanceContext } from "../table-instance-provider";
import { DataTableFilterItem } from "./data-table-filter-item";
import { DataTableMultiFilter } from "./data-table-multi-filter";
import {
  calcFilterParams,
  getIsFiltered,
} from "./views/utils";

interface DataTableAdvancedToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableAdvancedToolbar<TData>({
  filterFields = [],
  children,
  className,
  ...props
}: DataTableAdvancedToolbarProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { tableInstance: table } = useTableInstanceContext();

  const options = React.useMemo<DataTableFilterOption<TData>[]>(() => {
    return filterFields.map((field) => {
      return {
        id: crypto.randomUUID(),
        label: field.label,
        value: field.value,
        options: field.options ?? [],
      };
    });
  }, [filterFields]);

  const initialSelectedOptions = React.useMemo(() => {
    return options
      .filter((option) => searchParams.has(option.value as string))
      .map((option) => {
        const value = searchParams.get(String(option.value)) as string;
        const [filterValue, filterOperator, isMulti] =
          value?.split("~").filter(Boolean) ?? [];

        return {
          ...option,
          filterValues: filterValue?.split(".") ?? [],
          filterOperator,
          isMulti: !!isMulti,
        };
      });
  }, [options, searchParams]);

  const [selectedOptions, setSelectedOptions] = React.useState<
    DataTableFilterOption<TData>[]
  >(initialSelectedOptions);
  const [openFilterBuilder, setOpenFilterBuilder] = React.useState(
    initialSelectedOptions.length > 0 || false
  );
  const [openCombobox, setOpenCombobox] = React.useState(false);

  function onFilterComboboxItemSelect() {
    setOpenFilterBuilder(true);
    setOpenCombobox(true);
  }

  const multiFilterOptions = React.useMemo(
    () => selectedOptions.filter((option) => option.isMulti),
    [selectedOptions]
  );

  const selectableOptions = options.filter(
    (option) =>
      !selectedOptions.some(
        (selectedOption) => selectedOption.value === option.value
      )
  );

  const isFiltered = getIsFiltered(searchParams);

  const columns = table
    .getVisibleFlatColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    )
    .map((column) => column.id);
  const filterParams = calcFilterParams(selectedOptions, searchParams);

  React.useEffect(() => {
    const searchParamsObj = Object.fromEntries(searchParams);
    const newSelectedOptions: DataTableFilterOption<TData>[] = [];

    for (const [key, value] of Object.entries(searchParamsObj) as [
      keyof SearchParams,
      string,
    ][]) {
      const option = options.find((option) => option.value === key);
      if (!option) continue;

      const [filterValue, comparisonOperator, isMulti] = value.split("~") ?? [];
      newSelectedOptions.push({
        ...option,
        filterValues: filterValue?.split(".") ?? [],
        filterOperator: comparisonOperator,
        isMulti: !!isMulti,
      });
    }

    setSelectedOptions(newSelectedOptions);
    if (newSelectedOptions.length > 0) {
      setOpenFilterBuilder(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div
      className={cn(
        "flex w-full flex-col space-y-2.5 overflow-auto p-1",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-end justify-end gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          {children}
          {(options.length > 0 && selectedOptions.length > 0) ||
          openFilterBuilder ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenFilterBuilder(!openFilterBuilder)}
            >
              <CaretSortIcon
                className="mr-2 size-4 shrink-0"
                aria-hidden="true"
              />
              Filtro
            </Button>
          ) : (
            <DataTableFilterCombobox
              selectableOptions={selectableOptions}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              onSelect={onFilterComboboxItemSelect}
            />
          )}
          <DataTableColumnsVisibility />
        </div>
      </div>
      <div className="flex items-center justify-between">
        {openFilterBuilder && (
          <div className="flex h-8 items-center gap-2">
            {selectedOptions
              .filter((option) => !option.isMulti)
              .map((selectedOption) => (
                <DataTableFilterItem
                  key={String(selectedOption.value)}
                  selectedOption={selectedOption}
                  setSelectedOptions={setSelectedOptions}
                  defaultOpen={openCombobox}
                />
              ))}
            {selectedOptions.some((option) => option.isMulti) ? (
              <DataTableMultiFilter
                allOptions={options}
                options={multiFilterOptions}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                defaultOpen={openCombobox}
              />
            ) : null}
            {selectableOptions.length > 0 ? (
              <DataTableFilterCombobox
                selectableOptions={selectableOptions}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                onSelect={onFilterComboboxItemSelect}
              >
                <Button
                  variant="outline"
                  size="sm"
                  role="combobox"
                  className="h-7 rounded-full"
                  onClick={() => setOpenCombobox(true)}
                >
                  <PlusIcon
                    className="mr-2 size-4 opacity-50"
                    aria-hidden="true"
                  />
                  Añadir filtro
                </Button>
              </DataTableFilterCombobox>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}