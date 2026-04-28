import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'https://proyecto-backend-iot.vercel.app/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;