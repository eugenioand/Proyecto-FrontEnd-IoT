import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

import { updateSensor } from "@/lib/actions/sensors"
import { getErrorMessage } from "@/lib/handle-error"
import { Sensor } from "@/types"

const sensorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type_sensor: z.string().min(1, "Type is required"),
  status: z.enum(["active", "inactive"]),
  purchase_date: z.string().min(1, "Purchase date is required"),
})

type SensorFormValues = z.infer<typeof sensorSchema>

interface UpdateSensorSheetProps {
  sensor: Sensor
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateSensorSheet({
  sensor,
  open,
  onOpenChange,
}: UpdateSensorSheetProps) {
  const form = useForm<SensorFormValues>({
    resolver: zodResolver(sensorSchema),
    defaultValues: {
      name: sensor.name,
      type_sensor: sensor.type_sensor.code,
      status: sensor.status === "ACTIVE" ? "active" : "inactive",
      purchase_date: sensor.purchase_date,
    },
  })

  function onSubmit(values: SensorFormValues) {
    updateSensor(values)
      .then(() => {
        toast.success("Sensor updated successfully")
        onOpenChange(false)
      })
      .catch((err) => {
        toast.error(getErrorMessage(err))
      })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update Sensor</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Sensor name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type_sensor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Input placeholder="Sensor type" {...field} />
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
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="ACTIVE">Activo</SelectItem>
                          <SelectItem value="INACTIVE">Inactivo</SelectItem>
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
              name="purchase_date"
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
            <Button type="submit" className="w-full">
              Actualizar Sensor
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}