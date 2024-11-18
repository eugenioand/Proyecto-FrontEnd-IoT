import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoaderIcon } from "@/components/loader-icon"

interface UpdateDialogProps<T> {
    schema: any
    onSubmit: (data: T) => Promise<{ error?: string }>
    defaultValues: T
    fields: Array<{ name: keyof T; label: string; type: string; placeholder?: string }>
    title: string
    description: string
}

export function UpdateDialog<T>({ schema, onSubmit, defaultValues, fields, title, description }: UpdateDialogProps<T>) {
    const [open, setOpen] = React.useState(false)
    const [isUpdatePending, startUpdateTransition] = React.useTransition()

    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues,
    })

    function handleSubmit(data: T) {
        startUpdateTransition(async () => {
            const { error } = await onSubmit(data)

            if (error) {
                toast.error(error)
                return
            }

            form.reset()
            setOpen(false)
            toast.success(`${title} updated`)
        })
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                    Update {title.toLowerCase()}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Update {title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                        {fields.map((field) => (
                            <FormField
                                key={field.name as string}
                                control={form.control}
                                name={field.name as string}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{field.label}</FormLabel>
                                        <FormControl>
                                            <Input type={field.type} placeholder={field.placeholder} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                            <SheetClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </SheetClose>
                            <Button disabled={isUpdatePending}>
                                {isUpdatePending && <LoaderIcon className="mr-1.5 size-4 animate-spin" aria-hidden="true" />}
                                Update
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}