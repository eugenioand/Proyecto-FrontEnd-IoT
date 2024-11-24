import type { ReadonlyURLSearchParams } from "next/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { SearchParams } from "@/lib/validations";
import { FilterParams, Filter, Operator, Sort } from "./validations";

import {
  ValueIcon,
  ValueNoneIcon
} from "@radix-ui/react-icons";

import {
  Thermostat,
  Water,
  WaterDrop,
  Science,
  Waves,
  ArrowForward,
  ArrowBack,
  Sensors
} from "@mui/icons-material"

import { DataTableFilterOption, TableSchema } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

/**
 * Stole this from the @radix-ui/primitive
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}

export type Params = Partial<
  Record<keyof SearchParams, string | number | null | undefined>
>;

export function createQueryString(
  params: Params,
  searchParams: ReadonlyURLSearchParams
) {
  const newSearchParams = new URLSearchParams(searchParams?.toString());

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, String(value));
    }
  }

  return newSearchParams.toString();
}

export function getIsMacOS() {
  if (typeof navigator === "undefined") return false;
  return navigator.userAgent?.includes("Mac");
}

export function getStatusIcon(status: string) {
  const statusIcons = {
    activo: ValueIcon,
    inactivo: ValueNoneIcon,
  };

  return statusIcons[status];
}

const types = {
  temperature: Thermostat,
  humidity: WaterDrop,
  ph: Science,
  od: Water,
  turbidity: Waves,
  FlowRateInlet: ArrowForward,
  FlowRateOut: ArrowBack,
  default: Sensors,
};

export function getSensorTypes(type: string) {
  return types[type] || types.default;
}

export function calcFilterParams<T = unknown>(
  selectedOptions: DataTableFilterOption<T>[],
  searchParams: ReadonlyURLSearchParams
): FilterParams {
  const filterItems: Filter[] = selectedOptions
    .filter((option) => option.filterValues && option.filterValues.length > 0)
    .map((option) => ({
      field: option.value as Filter["field"],
      value: `${option.filterValues?.join(".")}~${option.filterOperator}`,
      isMulti: !!option.isMulti,
    }));
  const filterParams: FilterParams = {
    filters: filterItems,
  };
  filterParams.operator = (searchParams.get("operator") as Operator) || "and";
  if (searchParams.get("sort")) {
    filterParams.sort = searchParams.get("sort") as Sort;
  }
  return filterParams;
}

// Función para calcular la URL de los parámetros de búsqueda de una vista
export function calcViewSearchParamsURL(view: any, tableSchema: TableSchema) {
  const searchParamsObj: Record<string, string> = {};
  const filterParams = view.filterParams;
  if (!filterParams) return;

  for (const item of filterParams.filters ?? []) {
    if (tableSchema.filterableFields.includes(item.field)) {
      const value = item.isMulti ? `${item.value}~multi` : item.value;
      searchParamsObj[item.field] = value;
    }
  }
  if (filterParams.operator) {
    searchParamsObj.operator = filterParams.operator;
  }
  if (filterParams.sort) {
    searchParamsObj.sort = filterParams.sort;
  }
  searchParamsObj.page = "1";
  searchParamsObj.per_page = "10";
  searchParamsObj.viewId = view.id;

  return new URLSearchParams(searchParamsObj).toString();
}

// Función para verificar si hay filtros aplicados
export function getIsFiltered(
  searchParams: ReadonlyURLSearchParams,
  tableSchema: TableSchema
) {
  const filters = [];
  const filterObj = Object.fromEntries(searchParams);
  for (const [key, value] of Object.entries(filterObj)) {
    if (key === "sort" && value === "createdAt.desc") {
      continue;
    }

    if (key === "operator" && value === "and") {
      continue;
    }

    if (tableSchema.filterableFields.includes(key)) {
      filters.push({ key, value });
    }
  }
  return filters.length > 0;
}