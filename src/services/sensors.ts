import axiosClient from "@/utils/axios-client";
import { unknownError } from '../lib/constants';
import { SearchParams } from '../lib/validations';

export async function createSensor(data: any) {
    try {
        const response = await axiosClient.post('/sensors', data);
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError};
    }
}

export async function getSensors(params: SearchParams) {
    try {
        const response = await axiosClient.get('/sensors', { params });
        return {
            data: response.data?.data || [],
            pageCount: response.data?.paging?.total_pages || 0,
            totalCount: response.data?.paging?.total_count || 0,
            currentPage: response.data?.paging?.current_page || 1,
            perPage: response.data?.paging?.per_page || 10,
            message: response.data?.message
        };
    } catch (error: any) {
        return {
            data: [],
            pageCount: 0,
            totalCount: 0,
            currentPage: 1,
            perPage: 10,
            message: error.response?.data?.message || unknownError
        };
    }
}

export async function deleteSensor(id: string) {
    try {
        const response = await axiosClient.delete(`/sensors/${id}`);
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError};
    }
}

export async function deleteSensors(ids: any) {
    try {
        const response = await axiosClient.delete('/sensors', { data: { ids } });
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError};
    }
}

export async function updateSensor(data: any) {
    try {
        const response = await axiosClient.put(`/sensors/${data.id}`, data);
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError};
    }
}

export async function updateSensors(data: any) {
    try {
        const response = await axiosClient.put('/sensors', data);
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError};
    }
}