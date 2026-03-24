import { type QuoteStatus, type LeadSource, type Quote, type Note } from '@/types/crm';

export type { QuoteStatus, LeadSource, Quote, Note };
export type DateRange = 'hoy' | 'semana' | 'mes';

/* ─── Status config ────────────────────────────── */
export const STATUS_CONFIG: Record<QuoteStatus, { label: string; className: string }> = {
    pending: { label: 'Nuevo', className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    contacted: { label: 'Contactado', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    responded: { label: 'Respondió', className: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    negotiation: { label: 'En Negociación', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    closed_won: { label: 'Ganado', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    closed_lost: { label: 'Perdido', className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

export const SOURCE_LABELS: Record<string, string> = {
    web: 'Sitio Web',
    organico: 'Orgánico',
    ads: 'Instagram Ads',
    referido: 'Referido',
    whatsapp: 'WhatsApp',
};

// Advisors fallback (se cargarán dinámicamente si es posible)
export const ADVISORS = [
    'María García',
    'Carlos Mendoza',
    'Sofía Herrera',
    'Andrés López',
] as const;

export type Advisor = typeof ADVISORS[number];
