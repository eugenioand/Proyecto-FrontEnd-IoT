export interface User {
    id: string;
    // name: string;
    firstName: string;
    lastName: string;
    secondName: string;
    secondLastName: string;
    email: string;
    role: Role;
    status: string;
    created_at?: string;
    updated_at?: string;
}

export interface ApiUser {
    user_id: string;
    first_name: string;
    second_name: string;
    last_name: string;
    second_last_name: string;
    email: string;
    role: string;
    created_at: string;
    status: number;
}

export interface Role {
    role_id: number;
    code: string;
    description: string;
}

export interface UserFilters {
    name: string;
    email: string;
    role: string;
    status: string;
}