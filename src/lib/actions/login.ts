import axios from "axios";
import { unknownError } from "../constants";
import { toast } from "sonner";

const API_URL = "https://proyecto-backend-iot.vercel.app/api";

export async function login(email: string, password: string) {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || unknownError);
        return { error: error.response?.data?.message || unknownError };
    }
}

export async function logout() {
    try {
        const response = await axios.post(`${API_URL}/logout`);
        toast.success(response.data.message);
        return response.data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || unknownError);
        return { error: error.response?.data?.message || unknownError };
    }
}

export async function verifyToken(token: string) {
    try {
        const response = await axios.post(`${API_URL}/verify-token`, { token });
        toast.success(response.data.message);
        return response.data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || unknownError);
        return { error: error.response?.data?.message || unknownError };
    }
}

export async function refreshToken(token: string) {
    try {
        const response = await axios.post(`${API_URL}/refresh-token`, { token });
        toast.success(response.data.message);
        return response.data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || unknownError);
        return { error: error.response?.data?.message || unknownError };
    }
}