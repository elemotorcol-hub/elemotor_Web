export type LeadStatus = 'Nuevos' | 'Contactados' | 'En Negociación' | 'Ganados';

export type ContactPreference = 'tel' | 'email' | 'chat';

export interface Lead {
    id: string;
    clientName: string;
    vehicleModel: string;
    budgetRange: string;
    requestDate: string;
    contactPreference: ContactPreference;
    status: LeadStatus;
}
