import { useState, useEffect, useTransition } from "react";

import {
    ArrowUpIcon,
    CheckCircledIcon,
    Cross2Icon,
    DownloadIcon,
    TrashIcon,
} from "@radix-ui/react-icons";
import { SelectTrigger } from "@radix-ui/react-select";
import { type Table } from "@tanstack/react-table";
import { toast } from "sonner";

import { exportTableToCSV } from "@/lib/export";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/kbd";
import { LoaderIcon } from "@/components/loader-icon";

import { updateSensors, deleteSensors } from "@/lib/actions/sensors";
import { User } from "@/types/user";


const users = {
    status: {
        enumValues: ["active", "inactive"],
    },
    role: {
        enumValues: ["admin", "user"],
    }
}

interface UsersTableFloatingBarProps {
    table: Table<any>;
}

export function UsersTableFloatingBar({ table }: UsersTableFloatingBarProps) {
    const rows = table.getFilteredSelectedRowModel().rows

    const [isPending, startTransition] = useTransition()
    const [method, setMethod] = useState<
        "update-status" | "update-type" | "export" | "delete"
    >()

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                table.toggleAllRowsSelected(false)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [table])

    return (
        <div className="fixed inset-x-0 bottom-4 z-50 mx-auto w-fit px-4">
            <div className="w-full overflow-x-auto">
                <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-card p-2 shadow-2xl">
                    <div className="flex h-7 items-center rounded-md border border-dashed pl-2.5 pr-1">
                        <span className="whitespace-nowrap text-xs">
                            {rows.length} selected
                        </span>
                        <Separator orientation="vertical" className="ml-2 mr-1" />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-5 hover:border"
                                        onClick={() => table.toggleAllRowsSelected(false)}
                                    >
                                        <Cross2Icon
                                            className="size-3.5 shrink-0"
                                            aria-hidden="true"
                                        />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="flex items-center border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40">
                                    <p className="mr-2">Clear selection</p>
                                    <Kbd abbrTitle="Escape" variant="outline">
                                        Esc
                                    </Kbd>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <Separator orientation="vertical" className="hidden h-5 sm:block" />
                    <div className="flex items-center gap-1.5">
                        <Select
                            onValueChange={(value: User["status"]) => {
                                setMethod("update-status")

                                startTransition(async () => {
                                    const { error } = await updateSensors({
                                        ids: rows.map((row) => row.original.id),
                                        status: value,
                                    })

                                    if (error) {
                                        toast.error(error)
                                        return
                                    }

                                    toast.success("Sensors updated")
                                })
                            }}
                        >
                            <TooltipProvider>
                                <Tooltip delayDuration={250}>
                                    <SelectTrigger asChild>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="size-7 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                                                disabled={isPending}
                                            >
                                                {isPending && method === "update-status" ? (
                                                    <LoaderIcon
                                                        className="size-3.5 animate-spin"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <CheckCircledIcon
                                                        className="size-3.5"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                    </SelectTrigger>
                                    <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40">
                                        <p>Update status</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <SelectContent align="center">
                                <SelectGroup>
                                    {users.status.enumValues.map((status) => (
                                        <SelectItem
                                            key={status}
                                            value={status}
                                            className="capitalize"
                                        >
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select
                            onValueChange={(value: User["role"]["code"]) => {
                                setMethod("update-type")

                                startTransition(async () => {
                                    const { error } = await updateSensors({
                                        ids: rows.map((row) => row.original.id),
                                        type_sensor: value,
                                    })

                                    if (error) {
                                        toast.error(error)
                                        return
                                    }

                                    toast.success("Sensors updated")
                                })
                            }}
                        >
                            <TooltipProvider>
                                <Tooltip delayDuration={250}>
                                    <SelectTrigger asChild>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="size-7 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                                                disabled={isPending}
                                            >
                                                {isPending && method === "update-type" ? (
                                                    <LoaderIcon
                                                        className="size-3.5 animate-spin"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <ArrowUpIcon className="size-3.5" aria-hidden="true" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                    </SelectTrigger>
                                    <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40">
                                        <p>Update type</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <SelectContent align="center">
                                <SelectGroup>
                                    {users.role.enumValues.map((type) => (
                                        <SelectItem
                                            key={type}
                                            value={type}
                                            className="capitalize"
                                        >
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <TooltipProvider>
                            <Tooltip delayDuration={250}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="size-7 border"
                                        onClick={() => {
                                            setMethod("export")

                                            startTransition(() => {
                                                exportTableToCSV(table, {
                                                    excludeColumns: ["select", "actions"],
                                                    onlySelected: true,
                                                })
                                            })
                                        }}
                                        disabled={isPending}
                                    >
                                        {isPending && method === "export" ? (
                                            <LoaderIcon
                                                className="size-3.5 animate-spin"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <DownloadIcon className="size-3.5" aria-hidden="true" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40">
                                    <p>Exportar usuarios</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip delayDuration={250}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="size-7 border"
                                        onClick={() => {
                                            setMethod("delete")

                                            startTransition(async () => {
                                                const { error } = await deleteSensors(
                                                    rows.map((row) => row.original.id)
                                                )

                                                if (error) {
                                                    toast.error(error)
                                                    return
                                                }

                                                table.toggleAllRowsSelected(false)
                                            })
                                        }}
                                        disabled={isPending}
                                    >
                                        {isPending && method === "delete" ? (
                                            <LoaderIcon
                                                className="size-3.5 animate-spin"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <TrashIcon className="size-3.5" aria-hidden="true" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="border bg-accent font-semibold text-foreground dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40">
                                    <p>Eliminar usuario</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>
    )
}