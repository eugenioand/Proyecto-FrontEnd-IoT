import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoaderIcon } from "@/components/loader-icon"

interface CreateDialogProps<T> {
    schema: any
    onSubmit: (data: T) => Promise<{ error?: string }>
    defaultValues: T
    fields: Array<{ name: keyof T; label: string; type: string; placeholder?: string }>
    title: string
    description: string
}

export function CreateDialog<T>({ schema, onSubmit, defaultValues, fields, title, description }: CreateDialogProps<T>) {
    const [open, setOpen] = React.useState(false)
    const [isCreatePending, startCreateTransition] = React.useTransition()

    const form = useForm<T>({
        resolver: zodResolver(schema),
        defaultValues,
    })

    function handleSubmit(data: T) {
        startCreateTransition(async () => {
            const { error } = await onSubmit(data)

            if (error) {
                toast.error(error)
                return
            }

            form.reset()
            setOpen(false)
            toast.success(`${title} created`)
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    New {title.toLowerCase()}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create {title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
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
                        <DialogFooter className="gap-2 pt-2 sm:space-x-0">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button disabled={isCreatePending}>
                                {isCreatePending && <LoaderIcon className="mr-1.5 size-4 animate-spin" aria-hidden="true" />}
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}