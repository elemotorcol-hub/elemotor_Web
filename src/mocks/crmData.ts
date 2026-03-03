import { Lead } from '@/types/crm';

export const MOCK_LEADS: Lead[] = [
    // Nuevos
    {
        id: 'L-001',
        clientName: 'Alex Romanov',
        vehicleModel: 'Elemotor GT',
        budgetRange: '$40k - $50k',
        requestDate: '28 Feb, 2026',
        contactPreference: 'chat',
        status: 'Nuevos'
    },
    {
        id: 'L-002',
        clientName: 'Fatima Al-Rashid',
        vehicleModel: 'Elemotor Cruiser',
        budgetRange: '$55k - $65k',
        requestDate: '01 Mar, 2026',
        contactPreference: 'email',
        status: 'Nuevos'
    },
    {
        id: 'L-003',
        clientName: 'Tom Bradley',
        vehicleModel: 'Elemotor GT',
        budgetRange: '$42k - $48k',
        requestDate: '02 Mar, 2026',
        contactPreference: 'tel',
        status: 'Nuevos'
    },

    // Contactados
    {
        id: 'L-004',
        clientName: 'Priya Sharma',
        vehicleModel: 'Elemotor Nova',
        budgetRange: '$35k - $45k',
        requestDate: '25 Feb, 2026',
        contactPreference: 'email',
        status: 'Contactados'
    },
    {
        id: 'L-005',
        clientName: 'Luis Mendoza',
        vehicleModel: 'Elemotor GT',
        budgetRange: '$45k - $55k',
        requestDate: '22 Feb, 2026',
        contactPreference: 'chat',
        status: 'Contactados'
    },

    // En Negociación
    {
        id: 'L-006',
        clientName: 'Emma Johansson',
        vehicleModel: 'Elemotor Cruiser',
        budgetRange: '$58k - $68k',
        requestDate: '18 Feb, 2026',
        contactPreference: 'email',
        status: 'En Negociación'
    },
    {
        id: 'L-007',
        clientName: 'Wei Zhang',
        vehicleModel: 'Elemotor GT',
        budgetRange: '$48k - $52k',
        requestDate: '15 Feb, 2026',
        contactPreference: 'chat',
        status: 'En Negociación'
    },
    {
        id: 'L-008',
        clientName: 'Natasha Volkov',
        vehicleModel: 'Elemotor Nova',
        budgetRange: '$38k - $44k',
        requestDate: '20 Feb, 2026',
        contactPreference: 'tel',
        status: 'En Negociación'
    },

    // Ganados
    {
        id: 'L-009',
        clientName: 'Kenji Nakamura',
        vehicleModel: 'Elemotor GT',
        budgetRange: '$46k - $50k',
        requestDate: '10 Feb, 2026',
        contactPreference: 'tel',
        status: 'Ganados'
    },
    {
        id: 'L-010',
        clientName: 'Clara Hoffmann',
        vehicleModel: 'Elemotor Cruiser',
        budgetRange: '$60k - $70k',
        requestDate: '05 Feb, 2026',
        contactPreference: 'email',
        status: 'Ganados'
    }
];
