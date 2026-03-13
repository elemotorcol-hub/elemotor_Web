import { fetchApi } from '../lib/api';
import { Brand } from '../types/inventory';

export const brandService = {
    getBrands: async (params?: Record<string, string>) => {
        const query = params ? `?${new URLSearchParams(params).toString()}` : '';
        return fetchApi(`/api/brands${query}`, { method: 'GET' });
    },
    
    getBrandById: async (id: string) => {
        return fetchApi(`/api/brands/${id}`, { method: 'GET' });
    },
    
    createBrand: async (data: Partial<Brand>) => {
        return fetchApi('/api/brands', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    
    updateBrand: async (id: string, data: Partial<Brand>) => {
        return fetchApi(`/api/brands/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    
    deleteBrand: async (id: string) => {
        return fetchApi(`/api/brands/${id}`, { method: 'DELETE' });
    }
};
