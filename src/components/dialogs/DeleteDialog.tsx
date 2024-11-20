import * as React from "react"
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
import { LoaderIcon } from "@/components/loader-icon"

interface DeleteDialogProps {
    onDelete: () => Promise<{ error?: string }>
    title: string
    description: string
    showTrigger?: boolean
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DeleteDialog({ onDelete, title, description, showTrigger = true, open, onOpenChange }: DeleteDialogProps) {
    const [isDeletePending, startDeleteTransition] = React.useTransition()

    function handleDelete() {
        startDeleteTransition(async () => {
            const { error } = await onDelete()

            if (error) {
                toast.error(error)
                return
            }

            toast.success(`${title} deleted`)
            onOpenChange(false)
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {showTrigger && (
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        Delete {title.toLowerCase()}
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete {title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 pt-2 sm:space-x-0">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={handleDelete} disabled={isDeletePending}>
                        {isDeletePending && <LoaderIcon className="mr-1.5 size-4 animate-spin" aria-hidden="true" />}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}