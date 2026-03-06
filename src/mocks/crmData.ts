import { Lead } from '@/types/crm';

export const MOCK_LEADS: Lead[] = [
    // Nuevos
    {
        id: 'L-001',
        clientName: 'Alex Romanov',
        clientEmail: 'alex.romanov@example.com',
        clientPhone: '+57 300 111 2233',
        modelInterest: 'Elemotor GT',
        budget: '$40k - $50k',
        date: '2026-02-28T10:00:00',
        advisor: 'María García',
        source: 'organico',
        status: 'nuevo',
        utm: { source: 'google', medium: 'organic', campaign: '' },
        notes: [],
        contactPreference: 'chat'
    },
    {
        id: 'L-002',
        clientName: 'Fatima Al-Rashid',
        clientEmail: 'fatima.al@example.com',
        clientPhone: '+57 310 222 3344',
        modelInterest: 'Elemotor Cruiser',
        budget: '$55k - $65k',
        date: '2026-03-01T11:30:00',
        advisor: 'Carlos Mendoza',
        source: 'ads',
        status: 'nuevo',
        utm: { source: 'instagram', medium: 'social', campaign: 'cruiser_launch' },
        notes: [],
        contactPreference: 'email'
    },
    {
        id: 'L-003',
        clientName: 'Tom Bradley',
        clientEmail: 'tom.b@example.com',
        clientPhone: '+57 320 333 4455',
        modelInterest: 'Elemotor GT',
        budget: '$42k - $48k',
        date: '2026-03-02T09:15:00',
        advisor: 'Sofía Herrera',
        source: 'referido',
        status: 'nuevo',
        utm: { source: 'referral', medium: 'direct', campaign: '' },
        notes: [],
        contactPreference: 'tel'
    },

    // Contactados
    {
        id: 'L-004',
        clientName: 'Priya Sharma',
        clientEmail: 'priya.s@example.com',
        clientPhone: '+57 301 444 5566',
        modelInterest: 'Elemotor Nova',
        budget: '$35k - $45k',
        date: '2026-02-25T14:20:00',
        advisor: 'Andrés López',
        source: 'organico',
        status: 'contactado',
        utm: { source: 'google', medium: 'organic', campaign: '' },
        notes: [],
        contactPreference: 'email'
    },
    {
        id: 'L-005',
        clientName: 'Luis Mendoza',
        clientEmail: 'luis.mendoza@example.com',
        clientPhone: '+57 311 555 6677',
        modelInterest: 'Elemotor GT',
        budget: '$45k - $55k',
        date: '2026-02-22T16:45:00',
        advisor: 'María García',
        source: 'ads',
        status: 'contactado',
        utm: { source: 'facebook', medium: 'social', campaign: 'gt_promo' },
        notes: [],
        contactPreference: 'chat'
    },

    // En Negociación
    {
        id: 'L-006',
        clientName: 'Emma Johansson',
        clientEmail: 'emma.j@example.com',
        clientPhone: '+57 321 666 7788',
        modelInterest: 'Elemotor Cruiser',
        budget: '$58k - $68k',
        date: '2026-02-18T10:30:00',
        advisor: 'Carlos Mendoza',
        source: 'referido',
        status: 'negociacion',
        utm: { source: 'referral', medium: 'direct', campaign: '' },
        notes: [],
        contactPreference: 'email'
    },
    {
        id: 'L-007',
        clientName: 'Wei Zhang',
        clientEmail: 'wei.zhang@example.com',
        clientPhone: '+57 302 777 8899',
        modelInterest: 'Elemotor GT',
        budget: '$48k - $52k',
        date: '2026-02-15T13:10:00',
        advisor: 'Sofía Herrera',
        source: 'organico',
        status: 'negociacion',
        utm: { source: 'google', medium: 'organic', campaign: '' },
        notes: [],
        contactPreference: 'chat'
    },
    {
        id: 'L-008',
        clientName: 'Natasha Volkov',
        clientEmail: 'natasha.v@example.com',
        clientPhone: '+57 312 888 9900',
        modelInterest: 'Elemotor Nova',
        budget: '$38k - $44k',
        date: '2026-02-20T15:50:00',
        advisor: 'Andrés López',
        source: 'ads',
        status: 'negociacion',
        utm: { source: 'instagram', medium: 'social', campaign: 'nova_launch' },
        notes: [],
        contactPreference: 'tel'
    },

    // Ganados
    {
        id: 'L-009',
        clientName: 'Kenji Nakamura',
        clientEmail: 'kenji.n@example.com',
        clientPhone: '+57 322 999 0011',
        modelInterest: 'Elemotor GT',
        budget: '$46k - $50k',
        date: '2026-02-10T09:25:00',
        advisor: 'María García',
        source: 'referido',
        status: 'ganado',
        utm: { source: 'referral', medium: 'direct', campaign: '' },
        notes: [],
        contactPreference: 'tel'
    },
    {
        id: 'L-010',
        clientName: 'Clara Hoffmann',
        clientEmail: 'clara.h@example.com',
        clientPhone: '+57 303 000 1122',
        modelInterest: 'Elemotor Cruiser',
        budget: '$60k - $70k',
        date: '2026-02-05T11:40:00',
        advisor: 'Carlos Mendoza',
        source: 'organico',
        status: 'ganado',
        utm: { source: 'google', medium: 'organic', campaign: '' },
        notes: [],
        contactPreference: 'email'
    }
];
