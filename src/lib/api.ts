import axiosClient, { API_URL as UTIL_API_URL } from "@/utils/axios-client";

export const API_URL = UTIL_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ?? 'https://proyecto-backend-iot.vercel.app/api';

export const apiClient = axiosClient;

export default apiClient;
