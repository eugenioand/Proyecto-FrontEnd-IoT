// import { useState, useTransition } from "react";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoaderIcon } from "@/components/loader-icon";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/kbd";

import { CreateUserFormValues, createUserSchema } from "@/lib/validations/users";
import { createUser } from "@/lib/actions/users";

export function CreateUserDialog() {
    const [open, setOpen] = React.useState(false);
    const [isCreatePending, startCreateTransition] = React.useTransition();

    const form = useForm({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            firstName: "",
            secondName: "",
            lastName: "",
            secondLastName: "",
            email: "",
            password: "",
            role: "Administrador del sistema",
            status: "active",
        },
    });

    function handleSubmit(data: CreateUserFormValues) {
        startCreateTransition(async () => {
            const payload = {
                first_name: data.firstName,
                second_name: data.secondName,
                last_name: data.lastName,
                second_last_name: data.secondLastName,
                email: data.email,
                password: data.password,
                role_id: data.role,
                status: data.status,
            };
            const { error } = await createUser(payload);
            if (error) {
                toast.error(error);
                return;
            }
            form.reset();
            setOpen(false);
            toast.success("User created successfully");
        });
    }

    useHotkeys("shift+n", () => {
        setTimeout(() => setOpen(true), 100);
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                                <PlusIcon className="mr-2 size-4" aria-hidden="true" />
                                Crear usuario
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="flex items-center gap-2 border bg-accent font-semibold text-foreground dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40">
                        Agregar nuevo sensor
                        <div>
                            <Kbd variant="outline">⇧</Kbd> <Kbd variant="outline">N</Kbd>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear nuevo usuario</DialogTitle>
                    <DialogDescription>
                        Complete la información para agregar un nuevo usuario.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit, (e) => {
                            console.log("Formulario no válido", e); // Este log te ayudará a saber si la validación está fallando
                        })}
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="firstName">Nombre</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Nombre" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="secondName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="secondName">Segundo Nombre</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Segundo Nombre" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="lastName">Primer Apellido</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Primer Apellido" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="secondLastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="secondLastName">Segundo Apellido</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Segundo Apellido" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Correo electrónico" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="password">Contraseña</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" placeholder="Contraseña" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="role">Rol</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => field.onChange(value)}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un rol" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem key="Administrador del sistema" value="1">
                                                        Administrador del sistema
                                                    </SelectItem>
                                                    <SelectItem key="Usuario" value="2">
                                                        Usuario
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => field.onChange(value)}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione el estado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem key="11" value="active">Activo</SelectItem>
                                                    <SelectItem key="22" value="inactive">Inactivo</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isCreatePending}>
                                {isCreatePending ? <LoaderIcon /> : "Crear"}
                            </Button>
                            <DialogClose asChild>
                                <Button variant="ghost">Cancelar</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}