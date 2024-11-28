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

import { updateAlarms } from "@/services/dasboard/alarms"
import { getErrorMessage } from "@/lib/handle-error"
import { Alarm } from "@/types"

const alertSchema = z.object({
  alert_date: z.any().optional(),
  description: z.string().min(1, "Description is required"),
  node_id: z.number().min(1, "Node ID is required").optional(),
  severity: z.enum(["CRITICAL" ,"MAJOR" ,"MINOR", "WARNING","INDETERMINATE"]).optional(),
  status: z.enum(["Active", "Cleared"]),
  alert_id:z.any()
})

type AlertFormValues = z.infer<typeof alertSchema>

interface UpdateAlertSheetProps {
  alert: Alarm
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateAlertSheet({
  alert,
  open,
  onOpenChange,
}: UpdateAlertSheetProps) {
  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      alert_date: alert.alert_date,
      description: alert.description,
      node_id: alert.node_id,
      severity: alert.severity,
      status: alert.status,
      alert_id: alert.alert_id,
    },
  })

  function onSubmit(values: AlertFormValues) {
    console.log('values', values);
    updateAlarms(values)
      .then(() => {
        toast.success("Alert updated successfully")
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
          <SheetTitle>Update Alert</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="alert_date"
              disabled
              render={({ field }) => {

                console.log({field})
                return(
                <FormItem>
                  <FormLabel>Alert Date</FormLabel>
                  <FormControl>
                    <Input type="string" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="node_id"
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Node ID</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="severity"
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="CRITICAL">Critical</SelectItem>
                          <SelectItem value="INDETERMINATE">Indeterminate</SelectItem>
                          <SelectItem value="MAJOR">Major</SelectItem>
                          <SelectItem value="WARNING">Warning</SelectItem>
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
              name="description"
              
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Alert description" {...field} />
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
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Cleared">Cleared</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Update Alert
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
