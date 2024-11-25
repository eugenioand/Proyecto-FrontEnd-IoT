"use client";

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// import { Suspense } from 'react';

import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { DateRangePicker } from '@/components/date-range-picker';
import { SensorsTable } from './components/table';
import { Shell } from '@/components/shell';
import { getSensors } from '@/services/sensors';
import { toast } from 'sonner';

const SensorsPage = () => {
  interface SensorsData {
    data: any[];
    pageCount: number;
    totalCount: number;
    currentPage: number;
    perPage: number;
    error?: any;
  }

  const [sensorsData, setSensorsData] = React.useState<SensorsData | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    let updated = false;

    if (!params.page) {
      params.page = '1';
      updated = true;
    }
    if (!params.page_size) {
      params.page_size = '10';
      updated = true;
    }
    if (!params.sort) {
      params.sort = 'created_at.desc';
      updated = true;
    }

    if (updated) {
      const newSearchParams = new URLSearchParams(params);
      router.replace(`${window.location.pathname}?${newSearchParams.toString()}`);
    } else {
      const fetchData = async () => {
        const queryString = new URLSearchParams(params).toString();
        try {
          const data = await getSensors(params);
          setSensorsData(data);
        } catch (error) {
          toast.error(error?.message || '');
        }
      };

      fetchData();
    }
  }, [searchParams, router]); // Dependencias: cuando cambian searchParams o router

  if (!sensorsData) {
    return (
      <Shell className="gap-2">
        <DataTableSkeleton
          columnCount={5}
          cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem']}
          shrinkZero
        />
      </Shell>
    );
  }

  return (
    <Shell className="gap-2">
      <DateRangePicker
        triggerSize="sm"
        triggerClassName="ml-auto w-56 sm:w-60 mr-1"
        className="w-auto p-0 dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/50"
        align="end"
      />
      <SensorsTable sensorsData={sensorsData} />
    </Shell>
  );
};

// const SensorsPageWrapper = () => (
//   <Suspense fallback={<DataTableSkeleton columnCount={5} cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem']} shrinkZero />}>
//     <SensorsPage />
//   </Suspense>
// );

export default SensorsPage;