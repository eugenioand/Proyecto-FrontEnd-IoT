export interface FiltersProps {
    filters: {
      humedal: string;
      nodo?: string;
      sensor?: string;
      startDate?: string;
      endDate?: string;
      typeSensor?: string;
    };
    title:string;
    onFilterChange: (filters: any) => void;
    compareMode: boolean;
    secondHumedal: string;
    setIsSidebarOpen: (value: boolean) => void;
    isSidebarOpen: boolean;
    onSecondHumedalChange: (humedal: string) => void;
    view: string;
  }