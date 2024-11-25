
import { updateUserSchema } from "@/lib/validations/users"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { UpdateUserFormValues } from "@/lib/validations/users"
import { User } from "@/types/user"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/handle-error"
import { updateUser } from "@/services/users"

interface UpdateUserSheetProps {
    user: User
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function UpdateUserSheet({
    user, isOpen, onOpenChange 
}: UpdateUserSheetProps) {
    const form = useForm<UpdateUserFormValues>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            id: user.id,
            firstName: user.firstName,
            secondName: user.secondName,
            lastName: user.lastName,
            secondLastName: user.secondLastName,
            email: user.email,
            role: user.role.role_id.toString(),
            status: user.status,
        },
    })

    function onSubmit(values: UpdateUserFormValues) {
        updateUser(values)
            .then(({ error }) => {
                if (error) {
                    return toast.error(error)
                }
                toast.success("Usuario actualizado")
                onOpenChange(false)
            })
            .catch((error) => {
                toast.error(getErrorMessage(error))
            })
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Actualizar usuario</SheetTitle>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Primer nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Primer nombre" {...field} />
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
                                    <FormLabel>Segundo nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Segundo nombre" {...field} />
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
                                    <FormLabel>Primer apellido</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Primer apellido" {...field} />
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
                                    <FormLabel>Segundo apellido</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Segundo apellido" {...field} />
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
                                    <FormLabel>Rol</FormLabel>
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

                        <Button type="submit" className="w-full">
                            Actualizar
                        </Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}