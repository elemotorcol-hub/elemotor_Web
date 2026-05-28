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
