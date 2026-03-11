import { fetchApi } from '../lib/api';

export const trimService = {
    createTrim: async (data: any) => {
        return fetchApi('/api/trims', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    
    createSpec: async (data: any) => {
        return fetchApi('/api/specs', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    createColor: async (data: any) => {
        return fetchApi('/api/colors', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateTrim: async (id: number, data: any) => {
        return fetchApi(`/api/trims/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteTrim: async (id: number) => {
        return fetchApi(`/api/trims/${id}`, {
            method: 'DELETE',
        });
    }
};
