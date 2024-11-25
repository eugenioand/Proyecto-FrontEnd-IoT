import axiosClient from "@/utils/axios-client";
import { unknownError } from "../lib/constants";
import { SearchParams } from "../lib/validations";
import { ApiUser } from "@/types/user";

export async function createUser(data: any) {
    try {
        console.log("Enviando datos al servidor:", data);
        const response = await axiosClient.post('/users', data);
        console.log("Respuesta completa del servidor:", response);
        return response.data;
    } catch (error: any) {
        console.error("Error al crear usuario:", error);
        return { error: error.response?.data?.message || unknownError };
    }
}

export async function getUsers(params: SearchParams) {
    try {
        const response = await axiosClient.get('/users', { params });
        const data = response.data?.data || [];
        return {
            data: data.map((user: ApiUser) => ({
                id: user.user_id,
                name: `${user.first_name} ${user.second_name} ${user.last_name} ${user.second_last_name}`,
                firstName: user.first_name,
                secondName: user.second_name,
                lastName: user.last_name,
                secondLastName: user.second_last_name,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
                status: user.status,
            })),
            pageCount: response.data?.paging?.total_pages || 0,
            totalCount: response.data?.paging?.total_count || 0,
            currentPage: response.data?.paging?.current_page || 1,
            perPage: response.data?.paging?.per_page || 10,
            message: response.data?.message,
        };
    } catch (error: any) {
        return {
            data: [],
            pageCount: 0,
            totalCount: 0,
            currentPage: 1,
            perPage: 10,
            message: error.response?.data?.message || unknownError,
        };
    }
}

export async function deleteUser(id: string) {
    try {
        const response = await axiosClient.delete(`/users/${id}`);
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError };
    }
}

export async function deleteUsers(ids: any) {
    try {
        const response = await axiosClient.delete('/users', { data: { ids } });
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError };
    }
}

export async function updateUser(data: any) {
    try {
        const response = await axiosClient.put('/users', data);
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError };
    }
}

export async function getUser(id: string) {
    try {
        const response = await axiosClient.get(`/users/${id}`);
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError };
    }
}

export async function getRoles() {
    try {
        const response = await axiosClient.get('/role-select');
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError };
    }
}