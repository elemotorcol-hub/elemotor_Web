import { fetchApi } from '@/lib/api';

export interface WorkshopHour {
    dayOfWeek: number;
    openTime: string | null;
    closeTime: string | null;
    isClosed: boolean;
}

export interface WorkshopResponse {
    id: number;
    name: string;
    address: string | null;
    city: string | null;
    state: string | null;
    latitude: number | null;
    longitude: number | null;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    googleMapsUrl: string | null;
    rating: number | null;
    reviewsCount?: number;
    description: string | null;
    isVerified: boolean;
    active: boolean;
    isOpen: boolean;
    distance?: number;
    services: string[]; // ServiceType enum values
    hours: WorkshopHour[];
    images: string[];
}

export const workshopService = {
    async fetchWorkshops(query: string = '') {
        return fetchApi<any>(`/api/workshops${query}`);
    },

    async fetchWorkshopById(id: number) {
        return fetchApi<WorkshopResponse>(`/api/workshops/${id}`);
    },

    async createWorkshop(data: any) {
        return fetchApi<WorkshopResponse>('/api/workshops', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateWorkshop(id: number, data: any) {
        return fetchApi<WorkshopResponse>(`/api/workshops/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async deleteWorkshop(id: number) {
        return fetchApi<void>(`/api/workshops/${id}`, {
            method: 'DELETE'
        });
    }
};
