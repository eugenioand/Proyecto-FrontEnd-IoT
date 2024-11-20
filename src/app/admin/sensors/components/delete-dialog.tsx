import { deleteSensor } from "@/lib/actions/sensors"
import { deleteSensors } from "@/lib/actions/sensors";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog"

interface DeleteSensorsDialogProps {
    sensorId: string[];
    open: boolean
    onOpenChange: (open: boolean) => void
    showTrigger: boolean;
}

export default function DeleteSensorsDialog({ sensorId, open, onOpenChange, showTrigger }: DeleteSensorsDialogProps) {
    let description = "Are you sure you want to delete this sensor? This action cannot be undone."
    if (sensorId.length > 1) {
        description = "Are you sure you want to delete these sensors? This action cannot be undone."
    }

    return (
        <DeleteDialog
            onDelete={() => deleteSensors(sensorId)}
            title="Sensor"
            description={description}
            showTrigger={showTrigger}
            open={open}
            onOpenChange={onOpenChange}
        />
    )
}