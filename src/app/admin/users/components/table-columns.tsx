"use client";

// import * as React from "react";
import { useState, useTransition } from "react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/types/user";
import { formatDate } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table";
import { UpdateUserSheet } from "./update-sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import DeleteUsersDialog  from "./delete-dialog";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";

export function getColumns(): ColumnDef<User>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected()
                            ? true
                            : table.getIsSomePageRowsSelected()
                                ? "indeterminate"
                                : false
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-0.5"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-0.5"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Nombre" />
            ),
            cell: ({ row }) => {
                const name = row.getValue("name") as string;
                const formattedName = name
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase());
                return <div className="max-w-48">{formattedName}</div>;
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
            cell: ({ row }) => {
                const email = row.getValue("email") as string;
                return <div className="w-60 break-words">{email}</div>;
            },
            // enableSorting: false,
            // enableHiding: false,
        },
        {
            accessorKey: "role",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Rol" />
            ),
            cell: ({ row }) => {
                const role = row.original.role;

                return (
                    <div className="flex space-x-2">
                        {/* {role.description && <Badge variant="outline">{role.description}</Badge>} */}
                        <span className="max-w-[31.25rem] truncate font-medium">
                            {role.description}
                        </span>
                    </div>
                )
            },
            // enableSorting: false,
            // enableHiding: false,
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Estado" />
            ),
            cell: ({ row }) => {
                const status = row.original.status
                if (!status) return null
                return (
                    <div className="flex w-[6.25rem] items-center">
                        <span className="capitalize">
                            {status.toLowerCase() === "active" ? "Activo" : "Inactivo"}
                        </span>
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                return Array.isArray(value) && value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Fecha de Registro" />
            ),
            cell: ({ cell }) => formatDate(cell.getValue() as Date),
        },
        {
            id: "actions",
            cell: function Cell({ row }) {
                const [isUpdatePending, startUpdateTransition] = useTransition();
                const [showUpdateUserSheet, setShowUpdateUserSheet] = useState(false);
                const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);

                return (
                    <>
                        <UpdateUserSheet
                            user={row.original}
                            isOpen={showUpdateUserSheet}
                            onOpenChange={setShowUpdateUserSheet}
                        />
                        <DeleteUsersDialog
                            userId={[row.original.id]}
                            open={showDeleteUserDialog}
                            onOpenChange={setShowDeleteUserDialog}
                            showTrigger={false}
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    aria-label="Open menu"
                                    variant="ghost"
                                    size="sm"
                                    className="flex size-8 p-0 data-[state=open]:bg-muted"
                                >
                                    <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                                align="end"
                                // sideOffset={5}
                                className="w-40 overflow-visible dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40"
                            >
                                <DropdownMenuItem
                                    onSelect={() => setShowUpdateUserSheet(true)}
                                >
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onSelect={() => setShowDeleteUserDialog(true)}
                                >
                                    Eliminar
                                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )
            },
            // enableSorting: false,
            // enableHiding: false,
        },
    ]
}