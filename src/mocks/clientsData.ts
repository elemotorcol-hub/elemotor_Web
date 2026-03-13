export interface ClientUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    city?: string;
    avatar?: string;
    status: 'active' | 'inactive';
    registrationDate: string;
}

export const clientsData: ClientUser[] = [
    {
        id: 'CLI-001',
        name: 'Carlos Ramírez',
        email: 'carlos.ramirez@example.com',
        phone: '+57 300 123 4567',
        city: 'Bogotá',
        avatar: 'https://i.pravatar.cc/150?u=carlos',
        status: 'active',
        registrationDate: '2023-11-15T10:30:00Z'
    },
    {
        id: 'CLI-002',
        name: 'Maria Fernanda Gómez',
        email: 'maria.gomez@example.com',
        phone: '+57 311 987 6543',
        city: 'Medellín',
        status: 'active',
        registrationDate: '2023-11-20T14:45:00Z'
    },
    {
        id: 'CLI-003',
        name: 'Andrés Felipe Mejía',
        email: 'andres.mejia@example.com',
        phone: '+57 322 456 7890',
        city: 'Cali',
        avatar: 'https://i.pravatar.cc/150?u=andres',
        status: 'inactive',
        registrationDate: '2023-10-05T09:15:00Z'
    },
    {
        id: 'CLI-004',
        name: 'Diana Patricia Castro',
        email: 'diana.castro@example.com',
        phone: '+57 315 789 0123',
        city: 'Barranquilla',
        status: 'active',
        registrationDate: '2024-01-10T16:20:00Z'
    },
    {
        id: 'CLI-005',
        name: 'Jorge Luis Torres',
        email: 'jorge.torres@example.com',
        phone: '+57 301 234 5678',
        city: 'Bogotá',
        avatar: 'https://i.pravatar.cc/150?u=jorge',
        status: 'active',
        registrationDate: '2024-02-28T11:05:00Z'
    }
];
