import * as React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons"
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
} from "@/components/ui/tooltip"
import { Kbd } from "@/components/kbd"

import { createSensor } from "@/lib/actions/sensors";

// Define the schema for validation
const sensorSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    type: z.string().min(1, "El tipo de sensor es obligatorio"),
    status: z.enum(["Activo", "Inactivo"], {
        required_error: "El estado es obligatorio",
    }),
    purchaseDate: z.string().refine(
        (date) => !isNaN(Date.parse(date)),
        "La fecha de compra debe ser válida"
    ),
});

// Function to handle form submission
async function handleSensorSubmit(data) {
    try {
        // Simulate an API call
        console.log("Submitting sensor data:", data);
        toast.success("Sensor creado exitosamente");
        return { error: undefined };
    } catch (error) {
        toast.error("Error al crear el sensor");
        return { error: "Ocurrió un error inesperado" };
    }
}

export function CreateSensorDialog() {
    const [open, setOpen] = React.useState(false);
    const [isCreatePending, startCreateTransition] = React.useTransition();

    const form = useForm({
        resolver: zodResolver(sensorSchema),
        defaultValues: {
            name: "",
            type: "",
            status: "Activo",
            purchaseDate: "",
        },
    });

    function handleSubmit(data) {
        startCreateTransition(async () => {
            const { error } = await createSensor(data);

            if (error) {
                toast.error(error);
                return;
            }

            form.reset();
            setOpen(false);
            toast.success("Sensor creado exitosamente");
        });
    }

    useHotkeys("shift+n", () => {
        setTimeout(() => setOpen(true), 100)
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <PlusIcon className="mr-2 size-4" aria-hidden="true" />
                                Crear Sensor
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
                    <DialogTitle>Crear nuevo sensor</DialogTitle>
                    <DialogDescription>
                        Complete la información para agregar un nuevo sensor.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        {/* Nombre */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ingrese el nombre del sensor" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Tipo de sensor */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de sensor</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ingrese el tipo de sensor" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Estado */}
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
                                                    <SelectItem value="Activo">Activo</SelectItem>
                                                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Fecha de compra */}
                        <FormField
                            control={form.control}
                            name="purchaseDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de compra</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
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