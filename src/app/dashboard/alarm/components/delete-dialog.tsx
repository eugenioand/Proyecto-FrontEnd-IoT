import { deleteSensor } from "@/services/sensors"
import { deleteAlarms } from "@/services/dasboard/alarms";
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
    console.log({sensorId})

    return (
        <DeleteDialog
            onDelete={() => deleteAlarms(sensorId.map((id) => parseInt(id)))}
            title="Sensor"
            description={description}
            showTrigger={showTrigger}
            open={open}
            onOpenChange={onOpenChange}
        />
    )
}