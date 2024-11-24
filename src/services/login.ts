import axiosClient from "@/utils/axios-client";
import { unknownError } from "../lib/constants";
import { toast } from "sonner";

export async function login(email: string, password: string) {
    try {
        const response = await axiosClient.post('/auth/login', { email, password });
        return response.data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || unknownError);
        return { error: error.response?.data?.message || unknownError };
    }
}

export async function logout() {
    try {
        const response = await axiosClient.post('/logout');
        toast.success(response.data.message);
        return response.data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || unknownError);
        return { error: error.response?.data?.message || unknownError };
    }
}

export async function verifyToken(token: string) {
    try {
        const response = await axiosClient.post('/verify-token', { token });
        toast.success(response.data.message);
        return response.data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || unknownError);
        return { error: error.response?.data?.message || unknownError };
    }
}

export async function refreshToken(token: string) {
    try {
        const response = await axiosClient.post('/refresh-token', { token });
        toast.success(response.data.message);
        return response.data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || unknownError);
        return { error: error.response?.data?.message || unknownError };
    }
}