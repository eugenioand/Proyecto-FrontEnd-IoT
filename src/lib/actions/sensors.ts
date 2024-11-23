import axios from 'axios';
import { unknownError } from '../constants';
import { SearchParams } from '../validations';

// const API_URL = process.env.BACKEND_API_BASE_URL;
const API_URL = 'https://proyecto-backend-iot.vercel.app/api';

export async function createSensor(data: any) {
    try {
        const response = await axios.post(`${API_URL}/sensors`, data);
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError};
    }
}

export async function getSensors(params: SearchParams) {
    try {
        const response = await axios.get(`${API_URL}/sensors`, { params });
        console.log('response', response)
        return {
            data: response.data?.data || [],
            pageCount: response.data?.paging?.total_pages || 0,
            totalCount: response.data?.paging?.total_count || 0,
            currentPage: response.data?.paging?.current_page || 1,
            perPage: response.data?.paging?.per_page || 10,
            message: response.data?.message
        };
    } catch (error: any) {
        console.log('error', error)
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
        const response = await axios.delete(`${API_URL}/sensors/${id}`);
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError};
    }
}

export async function deleteSensors(ids: any) {
    try {
        const response = await axios.delete(`${API_URL}/sensors`, { data: { ids } });
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError};
    }
}

export async function updateSensor(data: any) {
    try {
        const response = await axios.put(`${API_URL}/sensors/${data.id}`, data);
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError};
    }
}

export async function updateSensors(data: any) {
    try {
        const response = await axios.put(`${API_URL}/sensors`, data);
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError};
    }
}