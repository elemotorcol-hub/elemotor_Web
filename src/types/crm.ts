export type QuoteStatus = 'pending' | 'contacted' | 'responded' | 'negotiation' | 'closed_won' | 'closed_lost';
export type LeadSource = string; // El backend lo maneja como string flexible
export type DateRange = 'hoy' | 'semana' | 'mes';

export interface Note {
    id: string;
    text: string;
    author: string;
    createdAt: string; // ISO string
}

export interface UTMData {
    source?: string;
    medium?: string;
    campaign?: string;
}

export interface Quote {
    id: number;
    referenceCode: string;
    name: string;
    email: string;
    phone: string;
    city?: string;
    modelInterest?: string;
    budgetRange?: number;
    model?: {
        id: number;
        name: string;
        slug?: string;
    };
    message?: string;
    notes?: Note[];
    source?: string;
    status: QuoteStatus;
    assignedToId?: number;
    assignedTo?: {
        name: string;
    };
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
    preferredChannel: 'whatsapp' | 'call' | 'email';
}

// Para compatibilidad con componentes existentes que usan 'Lead'
export type Lead = Quote;
export type LeadStatus = 'Nuevos' | 'Contactados' | 'En Negociación' | 'Ganados'; // Mantener por ahora si otros componentes lo usan
export type ContactPreference = 'tel' | 'email' | 'chat';
