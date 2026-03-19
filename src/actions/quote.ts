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
