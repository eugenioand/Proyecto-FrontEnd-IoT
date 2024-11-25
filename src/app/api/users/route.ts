import api from '@/lib/axios';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const response = await api.post('/api/users', body);

        return NextResponse.json(response.data, { status: response.status });

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error en la solicitud POST /api/users', error.response?.data || error.message);
            if (error.response) {
                return NextResponse.json(
                    { error: error.response.data?.message || "Error en la solicitud externa" },
                    { status: error.response.status }
                );
            } else {
                return NextResponse.json(
                    { error: "No se recibió respuesta de la API externa" },
                    { status: 502 }
                );
            }
        } else {
            return NextResponse.json(
                { error: (error as Error).message || "Error inesperado en el servidor" },
                { status: 500 }
            );
        }
    }
}
