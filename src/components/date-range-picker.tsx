"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof PopoverContent>, 'onChange'> {
  /**
   * The selected date range.
   * @default undefined
   * @type DateRange
   * @example { from: new Date(), to: new Date() }
   */
  dateRange?: DateRange

  /**
   * The number of days to display in the date range picker.
   * @default undefined
   * @type number
   * @example 7
   */
  dayCount?: number

  /**
   * The placeholder text of the calendar trigger button.
   * @default "Pick a date"
   * @type string | undefined
   */
  placeholder?: string

  /**
   * The variant of the calendar trigger button.
   * @default "outline"
   * @type "default" | "outline" | "secondary" | "ghost"
   */
  triggerVariant?: Exclude<ButtonProps["variant"], "destructive" | "link">

  /**
   * The size of the calendar trigger button.
   * @default "default"
   * @type "default" | "sm" | "lg"
   */
  triggerSize?: Exclude<ButtonProps["size"], "icon">

  /**
   * The class name of the calendar trigger button.
   * @default undefined
   * @type string
   */
  triggerClassName?: string
  /**
   * Callback invoked when the selected date range changes.
   */
  onChange?: (dateRange?: DateRange) => void
}

export function DateRangePicker({
  dateRange,
  dayCount,
  placeholder = "Pick a date",
  triggerVariant = "outline",
  triggerSize = "default",
  triggerClassName,
  className,
  onChange,
  ...props
}: DateRangePickerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const safeSearchParams = (searchParams ?? (new URLSearchParams() as unknown as ReadonlyURLSearchParams)) as ReadonlyURLSearchParams

  const fromParam = safeSearchParams.get("from")
  const toParam = safeSearchParams.get("to")

  function calcDateRange() {
    let fromDay: Date | undefined
    let toDay: Date | undefined

    if (dateRange) {
      fromDay = dateRange.from
      toDay = dateRange.to
    } else if (dayCount) {
      toDay = new Date()
      fromDay = addDays(toDay, -dayCount)
    }

    return {
      from: fromParam ? new Date(fromParam) : fromDay,
      to: toParam ? new Date(toParam) : toDay,
    }
  }

  const initialRange = calcDateRange()

  const [date, setDate] = React.useState<DateRange | undefined>(() =>
    initialRange
  )

  const [displayMonth, setDisplayMonth] = React.useState<Date>(() =>
    (initialRange.from ?? new Date()) as Date
  )

  const [fromTime, setFromTime] = React.useState<string>(() =>
    initialRange.from ? format(initialRange.from, "HH:mm") : "00:00"
  )

  const [toTime, setToTime] = React.useState<string>(() =>
    initialRange.to ? format(initialRange.to, "HH:mm") : "23:59"
  )

  // Update query string
  React.useEffect(() => {
    const newSearchParams = new URLSearchParams(safeSearchParams)
    if (date?.from) {
      try {
        newSearchParams.set("from", date.from.toISOString())
      } catch (e) {
        newSearchParams.set("from", format(date.from, "yyyy-MM-dd"))
      }
    } else {
      newSearchParams.delete("from")
    }

    if (date?.to) {
      try {
        newSearchParams.set("to", date.to.toISOString())
      } catch (e) {
        newSearchParams.set("to", format(date.to, "yyyy-MM-dd"))
      }
    } else {
      newSearchParams.delete("to")
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`, {
      scroll: false,
    })

    if (typeof onChange === "function") {
      try {
        onChange(date)
      } catch (e) {
        // ignore callback errors
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date?.from, date?.to])

  // React.useEffect(() => {
  //   const dateRange = calcDateRange()

  //   setDate(dateRange)

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [fromParam, toParam])

  const mergeDateWithTime = (d?: Date, time?: string) => {
    if (!d) return undefined
    const result = new Date(d)
    if (!time) return result
    const [hh, mm] = time.split(":").map((v) => parseInt(v, 10))
    if (!isNaN(hh)) result.setHours(hh)
    if (!isNaN(mm)) result.setMinutes(mm)
    result.setSeconds(0)
    result.setMilliseconds(0)
    return result
  }

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) return setDate(range)
    const mergedFrom = mergeDateWithTime(range.from ?? undefined, fromTime)
    const mergedTo = mergeDateWithTime(range.to ?? undefined, toTime)
    setDate({ from: mergedFrom, to: mergedTo })
    if (mergedFrom) setDisplayMonth(new Date(mergedFrom.getFullYear(), mergedFrom.getMonth(), 1))
  }

  const handleFromTimeChange = (value: string) => {
    setFromTime(value)
    if (date?.from) {
      setDate({ ...date, from: mergeDateWithTime(date.from, value) })
    }
  }

  const handleToTimeChange = (value: string) => {
    setToTime(value)
    if (date?.to) {
      setDate({ ...date, to: mergeDateWithTime(date.to, value) })
    }
  }

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className={cn(
              "w-full justify-start truncate text-left font-normal",
              !date && "text-muted-foreground",
              triggerClassName
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y HH:mm")} - {format(date.to, "LLL dd, y HH:mm")}
                </>
              ) : (
                format(date.from, "LLL dd, y HH:mm")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-auto p-0", className)} {...props}>
          <div className="p-3 border-b flex items-center gap-2">
            <select
              aria-label="Mes"
              className="border rounded p-1 text-sm"
              value={displayMonth.getMonth()}
              onChange={(e) =>
                setDisplayMonth(new Date(displayMonth.getFullYear(), Number(e.target.value), 1))
              }
            >
              {months.map((m, idx) => (
                <option value={idx} key={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              aria-label="Año"
              className="border rounded p-1 text-sm"
              value={displayMonth.getFullYear()}
              onChange={(e) =>
                setDisplayMonth(new Date(Number(e.target.value), displayMonth.getMonth(), 1))
              }
            >
              {years.map((y) => (
                <option value={y} key={y}>
                  {y}
                </option>
              ))}
            </select>

            <div className="ml-auto flex items-center gap-2">
              <label className="text-sm">Desde</label>
              <input
                type="time"
                value={fromTime}
                onChange={(e) => handleFromTimeChange(e.target.value)}
                className="border rounded p-1 text-sm"
              />
              <label className="text-sm">Hasta</label>
              <input
                type="time"
                value={toTime}
                onChange={(e) => handleToTimeChange(e.target.value)}
                className="border rounded p-1 text-sm"
              />
            </div>
          </div>

          <Calendar
            mode="range"
            month={displayMonth}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
