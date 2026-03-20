'use server';

import { fetchApi } from '@/lib/api';

export async function submitQuoteAction(backendData: any) {
    try {
        // Ejecutar llamada real a la API del DMS
        const result = await fetchApi('/api/quotes', {
            method: 'POST',
            body: JSON.stringify(backendData)
        });

        console.log('Lead de Cotización procesado en servidor:', result);

        return { success: true, data: result };
    } catch (error: any) {
        console.error('Error procesando cotización:', error);
        return {
            success: false,
            error: error.message || 'Hubo un error contactando el sistema. Intenta más tarde.'
        };
    }
}

export async function getMyQuotesAction(query?: { page?: number; limit?: number }) {
    try {
        const queryString = query ? `?page=${query.page || 1}&limit=${query.limit || 10}` : '';
        const result = await fetchApi(`/api/quotes/my${queryString}`, {
            method: 'GET',
        });
        return { success: true, data: result };
    } catch (error: any) {
        console.error('Error fetching my quotes:', error);
        return {
            success: false,
            error: error.message || 'Error al obtener tus cotizaciones.'
        };
    }
}
