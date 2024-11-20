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


export const createSchema = z.object({
    name: z.string().min(1),
    columns: z.string().array().optional(),
    filterParams: z
    .object({
        operator: z.enum(["and", "or"]).optional(),
        sort: z.string().optional(),
        filters: z
        .object({
            field: z.enum(["title", "status", "priority"]),
            value: z.string(),
            isMulti: z.boolean().default(false),
        })
        .array()
        .optional(),
    })
    .optional(),
});

export type CreateSchema = z.infer<typeof createSchema>;

export type FilterParams = NonNullable<z.infer<typeof createSchema>["filterParams"]>;
export type Operator = FilterParams["operator"];
export type Sort = FilterParams["sort"];
export type Filter = NonNullable<FilterParams["filters"]>[number];
