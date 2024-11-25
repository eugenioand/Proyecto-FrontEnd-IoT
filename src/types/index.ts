export type LogoKeys = "unibarranquilla" | "ua" | "uniguajira";

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: Option[];
}

export interface DataTableFilterOption<TData> {
  id: string;
  label: string;
  value: keyof TData;
  options: Option[];
  filterValues?: string[];
  filterOperator?: string;
  isMulti?: boolean;
}

export interface Sensor {
  sensor_id: number;
  name: string;
  type_sensor: {
    name: string;
    code: string;
  };
  status: string;
  purchase_date: Date;
  longitude?: string;
  latitude?: string;
  created_at?: string;
  // updated_at: string;
}

export interface SensorType {
  name: string;
  code: string;
}

export interface Wetland {
  id: string;
  name: string;
  location: string;
  status: string;
  nodes: {
    [key: string]: {
      name: string;
      location: string;
      status: "good" | "warning" | "alert";
      sensors: {
        [key: string]: {
          name: string;
          unity: string;
          value: number;
          max: number;
        };
      };
    };
  };
}

export type SelectedItem = { id: number; type: "node" | "sensor" };

export type Column = string;

export interface TableSchema {
  columns: Column[];
  filterableFields: Column[];
}
