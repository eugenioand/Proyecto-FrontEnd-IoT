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
  id: number;
  name: string;
  type_sensor: {
    name: string;
    code: string;
  };
  status: string;
  purchase_date: Date;
  // created_at: string;
  // updated_at: string;
}
export interface Alarm {
  alert_id: number;
  description: string;
  node_id: number;
  severity: "CRITICAL" |"MAJOR" |"MINOR"| "WARNING" | "INDETERMINATE";
  status: 'Active' | 'Cleared';
  alert_date: Date;
  created_at: Date;
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
