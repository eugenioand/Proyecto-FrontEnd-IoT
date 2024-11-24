import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"

import { updateSensors } from "@/services/sensors"
import type { Sensor } from "@/types"
import { unknownError } from "@/lib/constants"
import { toast } from "sonner"
import { LoaderIcon } from "@/components/loader-icon"

const sensorSchema = z.object({
  sensor_id: z.string(),
  name: z.string().min(1, "Name is required"),
  type_sensor: z.string().min(1, "Type is required"),
  status: z.string().min(1, "Status is required"),
  purchase_date: z.string().min(1, "Purchase date is required"),
})

type SensorFormValues = z.infer<typeof sensorSchema>

interface UpdateSensorSheetProps {
  sensor: Sensor
  open: boolean
  onOpenChange: (open: boolean) => void
  sensorTypes: Sensor["type_sensor"][]
}

export function UpdateSensorSheet({
  sensor,
  open,
  onOpenChange,
  sensorTypes,
}: UpdateSensorSheetProps) {
  const [isUpdatePending, startUpdateTransition] = React.useTransition()

  const form = useForm<SensorFormValues>({
    resolver: zodResolver(sensorSchema),
    defaultValues: {
      sensor_id: sensor.sensor_id.toString(),
      name: sensor.name,
      type_sensor: sensor.type_sensor?.code || "",
      status: sensor.status === "Activo" ? "ACTIVE" : sensor.status === "Inactivo" ? "INACTIVE" : sensor.status,
      purchase_date: sensor.purchase_date.toString(),
    },
  })

  function onSubmit(values: SensorFormValues) {
    startUpdateTransition(async () => {
      const { error } = await updateSensors({
        sensors: [values],
      })

      if (error) {
        toast.error(error)
        return
      }

      form.reset()
      onOpenChange(false)
      toast.success("Sensor actualizado")
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Actualizar Sensor</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="flex flex-col gap-4"
          >
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
              render={({ field }) => {
                console.log("field value before:", field.value);  // Verifica el valor antes de renderizar

                return (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        >
                        <FormControl>
                          <SelectTrigger>
                            {/* <SelectValue>{field.value || "Seleccione un tipo"}</SelectValue> Usamos el valor actual */}
                            <SelectValue placeholder="Seleccione un tipo" /> {/* Usamos el valor actual */}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {sensorTypes.length > 0 ? (
                              sensorTypes.map((type) => (
                                <SelectItem key={type.name} value={type.code} aria-label={type.name}>
                                  {type.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="" disabled>No hay disponible</SelectItem>
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}  // Usamos value en vez de defaultValue
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccciona el estado" />
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
            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
              </SheetClose>
              <Button disabled={isUpdatePending}>
                {isUpdatePending && (
                  <LoaderIcon
                    className="mr-1.5 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Actualizar Sensor
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
