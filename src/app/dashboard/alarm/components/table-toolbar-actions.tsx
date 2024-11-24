"use client"

// import { type Sensor } from "@/db/schema"
import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"
import { useHotkeys } from "react-hotkeys-hook"

import { exportTableToCSV } from "@/lib/export"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Kbd } from "@/components/kbd"

import { CreateSensorDialog }  from "./create-dialog"
import DeleteSensorsDialog from "./delete-dialog"

interface SensorsTableToolbarActionsProps {
    table: Table<any>
}

export function SensorsTableToolbarActions({
    table,
}: SensorsTableToolbarActionsProps) {
    useHotkeys("shift+e", () =>
        exportTableToCSV(table, {
            filename: "sensors",
            excludeColumns: ["select", "actions"],
        })
    )

    return (
        <div className="flex items-center gap-2">
            {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <DeleteSensorsDialog
                    sensorId={table
                        .getFilteredSelectedRowModel()
                        .rows.map((row) => row.original)}
                    open={false}
                    onOpenChange={function (open: boolean): void {
                            throw new Error("Function not implemented.")
                        } }
                    showTrigger={false}             
                />
            ) : null}
            <CreateSensorDialog />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                exportTableToCSV(table, {
                                    filename: "Alarmas_" + new Date().toISOString(),
                                    excludeColumns: ["select", "actions"],
                                })
                            }
                        >
                            <DownloadIcon className="mr-2 size-4" aria-hidden="true" />
                            Exportar
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="flex items-center gap-2 border bg-accent font-semibold text-foreground dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40">
                        Exportar csv
                        <div>
                            <Kbd variant="outline">⇧</Kbd> <Kbd variant="outline">E</Kbd>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}