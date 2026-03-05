import { type QuoteStatus, type LeadSource, type Quote, type Note } from '@/types/crm';

export type { QuoteStatus, LeadSource, Quote, Note };
export type DateRange = 'hoy' | 'semana' | 'mes';

/* ─── Advisors ─────────────────────────────────── */
export const ADVISORS = [
    'María García',
    'Carlos Mendoza',
    'Sofía Herrera',
    'Andrés López',
] as const;

export type Advisor = typeof ADVISORS[number];

/* ─── Status config ────────────────────────────── */
export const STATUS_CONFIG: Record<QuoteStatus, { label: string; className: string }> = {
    nuevo: { label: 'Nuevo', className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    contactado: { label: 'Contactado', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    negociacion: { label: 'En Negociación', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    ganado: { label: 'Ganado', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    perdido: { label: 'Perdido', className: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
};

export const SOURCE_LABELS: Record<LeadSource, string> = {
    organico: 'Orgánico',
    ads: 'Instagram Ads',
    referido: 'Referido',
};

/* ─── Mock Data ────────────────────────────────── */
export const MOCK_QUOTES: Quote[] = [
    {
        id: 'Q-001',
        clientName: 'Laura Martínez',
        clientEmail: 'laura.martinez@gmail.com',
        clientPhone: '+57 310 234 5678',
        modelInterest: 'Deepal S07',
        budget: '$180.000.000',
        date: '2026-03-04T09:15:00',
        advisor: 'María García',
        source: 'ads',
        status: 'negociacion',
        utm: { source: 'instagram', medium: 'paid_social', campaign: 'deepal_s07_launch' },
        notes: [
            { id: 'N-001', text: 'Cliente muy interesado. Pidió demo en concesionario para el viernes.', author: 'María García', createdAt: '2026-03-04T10:00:00' },
            { id: 'N-002', text: 'Se envió cotización formal con financiamiento a 36 meses.', author: 'María García', createdAt: '2026-03-03T16:30:00' },
        ],
    },
    {
        id: 'Q-002',
        clientName: 'Pedro Ramírez',
        clientEmail: 'pedro.ramirez@hotmail.com',
        clientPhone: '+57 300 876 5432',
        modelInterest: 'BYD Atto 3',
        budget: '$150.000.000',
        date: '2026-03-04T10:45:00',
        advisor: 'Carlos Mendoza',
        source: 'organico',
        status: 'nuevo',
        utm: { source: 'google', medium: 'organic', campaign: '(not set)' },
        notes: [],
    },
    {
        id: 'Q-003',
        clientName: 'Valeria Ospina',
        clientEmail: 'vospina@empresa.co',
        clientPhone: '+57 315 456 7890',
        modelInterest: 'AVATR 11',
        budget: '$350.000.000',
        date: '2026-03-03T14:20:00',
        advisor: 'Sofía Herrera',
        source: 'referido',
        status: 'ganado',
        utm: { source: 'referral', medium: 'word_of_mouth', campaign: 'client_referral_q1' },
        notes: [
            { id: 'N-003', text: 'Cierre exitoso. Entrega programada para abril 2026.', author: 'Sofía Herrera', createdAt: '2026-03-03T17:00:00' },
        ],
    },
    {
        id: 'Q-004',
        clientName: 'Camilo Torres',
        clientEmail: 'ctorres@gmail.com',
        clientPhone: '+57 320 111 2233',
        modelInterest: 'Deepal S07',
        budget: '$170.000.000',
        date: '2026-03-03T08:00:00',
        advisor: 'Andrés López',
        source: 'ads',
        status: 'contactado',
        utm: { source: 'facebook', medium: 'paid_social', campaign: 'retargeting_marzo' },
        notes: [
            { id: 'N-004', text: 'Primer contacto realizado. Responde bien por WhatsApp.', author: 'Andrés López', createdAt: '2026-03-03T09:30:00' },
        ],
    },
    {
        id: 'Q-005',
        clientName: 'Diana Rueda',
        clientEmail: 'diana.rueda@gmail.com',
        clientPhone: '+57 312 909 8877',
        modelInterest: 'BYD Han',
        budget: '$220.000.000',
        date: '2026-03-02T15:10:00',
        advisor: 'María García',
        source: 'organico',
        status: 'perdido',
        utm: { source: 'google', medium: 'cpc', campaign: 'byd_han_search' },
        notes: [
            { id: 'N-005', text: 'Cliente decidió comprar en otra concesionaria por precio.', author: 'María García', createdAt: '2026-03-02T18:00:00' },
        ],
    },
    {
        id: 'Q-006',
        clientName: 'Juan Esteban Pérez',
        clientEmail: 'jeperez@outlook.com',
        clientPhone: '+57 301 667 3344',
        modelInterest: 'Deepal S07',
        budget: '$185.000.000',
        date: '2026-03-04T08:05:00',
        advisor: 'Carlos Mendoza',
        source: 'ads',
        status: 'nuevo',
        utm: { source: 'instagram', medium: 'paid_social', campaign: 'deepal_s07_launch' },
        notes: [],
    },
    {
        id: 'Q-007',
        clientName: 'Natalia Gómez',
        clientEmail: 'natgomez@gmail.com',
        clientPhone: '+57 318 234 9900',
        modelInterest: 'AVATR 11',
        budget: '$330.000.000',
        date: '2026-03-01T11:30:00',
        advisor: 'Sofía Herrera',
        source: 'referido',
        status: 'negociacion',
        utm: { source: 'referral', medium: 'word_of_mouth', campaign: 'client_referral_q1' },
        notes: [
            { id: 'N-006', text: 'Prueba de manejo agendada para el 10 de marzo.', author: 'Sofía Herrera', createdAt: '2026-03-01T14:00:00' },
        ],
    },
];
