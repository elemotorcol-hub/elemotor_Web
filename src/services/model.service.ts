import { fetchApi } from '../lib/api';
import { VehicleModel } from '../types/inventory';

export const modelService = {
    getModels: async (params?: Record<string, string | number | boolean>) => {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, String(value));
                }
            });
        }
        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return fetchApi(`/api/models${query}`, { method: 'GET' });
    },
    
    createModel: async (data: any) => {
        return fetchApi('/api/models', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getModelById: async (id: number) => {
        return fetchApi(`/api/models/admin/${id}`, { method: 'GET' });
    },
    
    updateModel: async (id: number, data: any) => {
        return fetchApi(`/api/models/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteModel: async (id: number) => {
        return fetchApi(`/api/models/${id}`, {
            method: 'DELETE',
        });
    }
};
