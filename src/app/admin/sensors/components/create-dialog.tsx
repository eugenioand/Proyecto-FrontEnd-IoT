import { createSensor } from "@/lib/actions/sensors"
import { createSensorSchema, type CreateSensorSchema } from "@/lib/validations/sensors"
import { CreateDialog } from "@/components/dialogs/CreateDialog"

export default function CreateSensorPage() {
    return (
        <CreateDialog<CreateSensorSchema>
            schema={createSensorSchema}
            onSubmit={createSensor}
            defaultValues={{ name: "", type_sensor: "", status: "", purchase_date: "" }}
            fields={[
                { name: "name", label: "Name", type: "text", placeholder: "Sensor name" },
                { name: "type_sensor", label: "Type", type: "text", placeholder: "Sensor type" },
                { name: "status", label: "Status", type: "text", placeholder: "Sensor status" },
                { name: "purchase_date", label: "Purchase Date", type: "date" },
            ]}
            title="Sensor"
            description="Fill in the details below to create a new sensor."
        />
    )
}