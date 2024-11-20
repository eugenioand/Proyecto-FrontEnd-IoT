import * as z from "zod"

export const searchParamsSchema = z.object({
    page: z.coerce.number().default(1),
    page_size: z.coerce.number().default(10),
    sort: z.string().optional(),
    title: z.string().optional(),
    status: z.string().optional(),
    priority: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    operator: z.enum(["and", "or"]).optional(),
    viewId: z.string().uuid().optional(),
})

export type SearchParams = z.infer<typeof searchParamsSchema>

