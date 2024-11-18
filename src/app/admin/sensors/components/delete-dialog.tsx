import { deleteSensor } from "@/lib/actions/sensors"
import { DeleteDialog } from "@/components/dialogs/DeleteDialog"

interface DeleteSensorsDialogProps {
    sensorId: string;
    open: boolean
    onOpenChange: (open: boolean) => void
    showTrigger: boolean;
}

export default function DeleteSensorsDialog({ sensorId, open, onOpenChange, showTrigger }: DeleteSensorsDialogProps) {
    return (
        <DeleteDialog
            onDelete={() => deleteSensor(sensorId)}
            title="Sensor"
            description="Are you sure you want to delete this sensor? This action cannot be undone."
            showTrigger={showTrigger}
            open={open}
            onOpenChange={onOpenChange}
        />
    )
}