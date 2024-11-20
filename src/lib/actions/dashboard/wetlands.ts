import axios from 'axios';
import { unknownError } from '@/lib/constants';

// const API_URL = process.env.BACKEND_API_BASE_URL;
const API_URL = 'https://proyecto-backend-iot.vercel.app/api';

export async function getWetlands() {
    try {
        const response = await axios.get(`${API_URL}/wetlands-overview`);
        // maps the response to { wetland_id, name, location, sensors, status, last_updated}
        const wetlands = response.data?.data.map((wetland: any) => ({
            wetland_id: wetland.id,
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