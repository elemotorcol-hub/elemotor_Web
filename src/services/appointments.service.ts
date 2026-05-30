import { fetchApi } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface CreateAppointmentPayload {
    name: string;
    email: string;
    phone: string;
    workshopId?: number;
    preferredDate: string;
    preferredTime?: string;
    serviceType: string;
    notes?: string;
}

export async function createAppointment(payload: CreateAppointmentPayload): Promise<{ message: string; id: number }> {
    const res = await fetch(`${API_BASE}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? `Error ${res.status}`);
    }

    return res.json();
}

// ─── Admin methods (require auth) ────────────────────────────────────────────

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface AppointmentAdminFilters {
    status?: string;
    workshopId?: number;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
}

export const appointmentsAdminService = {
    getAll: async (filters?: AppointmentAdminFilters) => {
        const params = new URLSearchParams();
        if (filters?.status)      params.append('status', filters.status);
        if (filters?.workshopId)  params.append('workshopId', String(filters.workshopId));
        if (filters?.dateFrom)    params.append('dateFrom', filters.dateFrom);
        if (filters?.dateTo)      params.append('dateTo', filters.dateTo);
        if (filters?.page)        params.append('page', String(filters.page));
        if (filters?.limit)       params.append('limit', String(filters.limit));
        const qs = params.toString() ? `?${params.toString()}` : '';
        return fetchApi(`/api/appointments${qs}`, { method: 'GET' });
    },

    getById: async (id: number) =>
        fetchApi(`/api/appointments/${id}`, { method: 'GET' }),

    updateStatus: async (id: number, status: AppointmentStatus) =>
        fetchApi(`/api/appointments/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    remove: async (id: number) =>
        fetchApi(`/api/appointments/${id}`, { method: 'DELETE' }),
};
