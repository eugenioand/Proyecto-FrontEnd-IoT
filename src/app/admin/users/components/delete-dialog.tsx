import { deleteUser, deleteUsers } from "@/lib/actions/users";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";

interface DeleteUsersDialogProps {
    userId: string[];
    open: boolean
    onOpenChange: (open: boolean) => void
    showTrigger: boolean;
}

export default function DeleteUsersDialog({ userId, open, onOpenChange, showTrigger }: DeleteUsersDialogProps) {
    let description = "Are you sure you want to delete this user? This action cannot be undone."
    if (userId.length > 1) {
        description = "Are you sure you want to delete these users? This action cannot be undone."
    }

    return (
        <DeleteDialog
            onDelete={() => userId.length === 1 ? deleteUser(userId[0]) : deleteUsers(userId)}
            title="User"
            description={description}
            showTrigger={showTrigger}
            open={open}
            onOpenChange={onOpenChange}
        />
    )
}