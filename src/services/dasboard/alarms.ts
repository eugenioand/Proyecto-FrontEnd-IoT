import axiosClient from "@/utils/axios-client";
import { unknownError } from '@/lib/constants';
import { SearchParams } from '@/lib/validations';

// export async function createAlarm(data: any) {
//     try {
//         const response = await axiosClient.post('/alerts', data);
//         return response.data;
//     } catch (error: any) {
//         return { error: error.response?.data?.message || unknownError};
//     }
// }

export async function getAlarms(params: SearchParams) {
    try {
        const response = await axiosClient.get('/alerts', { params });
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

export async function deleteAlarm(id: string) {
    try {
        const response = await axiosClient.delete(`/alerts/${id}`);
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError};
    }
}

export async function deleteAlarms(alerts: any) {
    try {
        const response = await axiosClient.delete('/alerts', { data: { alerts } });
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError};
    }
}

export async function updateAlarm(data: any) {
    try {
        const response = await axiosClient.put(`/alerts/${data.id}`, data);
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError};
    }
}

export async function updateAlarms(data: any) {
    try {
        const response = await axiosClient.put('/alerts', {
            alerts: [data]
        });
        return response.data;
    } catch (error: any) {
        return { error: error.response?.data?.message || unknownError};
    }
}