import * as z from "zod"

export const createSensorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type_sensor: z.string().min(1, "Type is required"),
  status: z.enum(["active", "inactive"]),
  purchase_date: z.string().min(1, "Purchase date is required"),
})

export type CreateSensorSchema = z.infer<typeof createSensorSchema>