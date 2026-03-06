export type QuoteStatus = 'nuevo' | 'contactado' | 'negociacion' | 'ganado' | 'perdido';
export type LeadSource = 'organico' | 'ads' | 'referido';
export type DateRange = 'hoy' | 'semana' | 'mes';

export interface Note {
    id: string;
    text: string;
    author: string;
    createdAt: string; // ISO string
}

export interface UTMData {
    source: string;
    medium: string;
    campaign: string;
}

export interface Quote {
    id: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    modelInterest: string;
    budget: string;
    date: string; // ISO string
    advisor: string;
    source: LeadSource;
    status: QuoteStatus;
    utm: UTMData;
    notes: Note[];
    contactPreference?: 'tel' | 'email' | 'chat';
}

// Para compatibilidad con componentes existentes que usan 'Lead'
export type Lead = Quote;
export type LeadStatus = 'Nuevos' | 'Contactados' | 'En Negociación' | 'Ganados'; // Mantener por ahora si otros componentes lo usan
export type ContactPreference = 'tel' | 'email' | 'chat';
