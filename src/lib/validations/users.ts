import * as z from "zod";

export const createUserSchema = z.object({
    firstName: z.string().min(1, "Primer nombre es requerido"),
    secondName: z.string(),
    lastName: z.string().min(1, "Apellido es requerido"),
    secondLastName: z.string(),
    email: z.string().email("Correo electrónico inválido"),
    password: z.string()
        .min(8, "Debe tener al menos 8 caracteres")
        .regex(/[a-z]/, "Debe tener al menos una letra minúscula")
        .regex(/[A-Z]/, "Debe tener al menos una letra mayúscula")
        .regex(/[0-9]/, "Debe tener al menos un número")
        .regex(/[^a-zA-Z0-9]/, "Debe tener al menos un carácter especial"),
    // role_id: z.number().int(),
    role: z.string().min(1, "Rol es requerido"),
    status: z.string().min(1, "Estado es requerido"),
});

export const updateUserSchema = z.object({
    id: z.string(),
    firstName: z.string().min(1, "Primer nombre es requerido"),
    secondName: z.string().optional(),
    lastName: z.string().min(1, "Apellido es requerido"),
    secondLastName: z.string().optional(),
    email: z.string().email("Correo electrónico inválido"),
    // password: z.string()
    //     .min(8, "Debe tener al menos 8 caracteres")
    //     .regex(/[a-z]/, "Debe tener al menos una letra minúscula")
    //     .regex(/[A-Z]/, "Debe tener al menos una letra mayúscula")
    //     .regex(/[0-9]/, "Debe tener al menos un número")
    //     .regex(/[^a-zA-Z0-9]/, "Debe tener al menos un carácter especial"),
    role: z.string().min(1, "Rol es requerido"),
    status: z.string().min(1, "Estado es requerido"),
});

export const deleteUserSchema = z.object({
    id: z.string(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;