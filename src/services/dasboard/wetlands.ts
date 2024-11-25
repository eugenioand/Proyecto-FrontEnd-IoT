import axiosClient from "@/utils/axios-client";
import { unknownError } from '@/lib/constants';

export async function getWetlands() {
    try {
        const response = await axiosClient.get('/wetlands-overview');
        // maps the response to { wetland_id, name, location, sensors, status, last_updated}
        const wetlands = response.data?.data.map((wetland: any) => ({
            id: wetland.wetland_id,
            name: wetland.name,
            location: wetland.location,
            sensors: wetland.sensors,
            status: wetland.status,
            lastUpdated: wetland.last_updated,
        }));
        return wetlands || [];
    } catch (error: any) {
        return {
            data: [],
            error: error.response?.data?.message || unknownError,
        };
    }
}

export async function getWetland(id: string) {
    try {
        const response = await axiosClient.get(`/wetlands-overview/${id}`);
        return response.data.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError };
    }
}