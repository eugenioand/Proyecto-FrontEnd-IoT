import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://proyecto-backend-iot.vercel.app/', // TODO: get from env variable
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;