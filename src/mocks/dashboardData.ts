export interface DashboardData {
    user: {
        name: string;
        role: string;
        email: string;
        phone: string;
        avatarUrl?: string; // Optional, using initials fallback
        memberSince?: string;
        clientId?: string;
    };
    tracking: {
        status: string; // e.g., 'En Tránsito'
        title: string;
        description: string;
        progressPercentage: number;
        estimatedDate: string;
        currentLocation: string; // For the map widget location
    };
    vehicle: {
        id: string;
        name: string;
        color: string;
        horsepower: string;
        range: string;
        imageUrl: string;
    };
    recentActivities: Array<{
        id: string;
        date: string;
        title: string;
        description: string;
        type: 'transit' | 'document' | 'quote' | 'default';
    }>;
}

export const MOCK_DASHBOARD_DATA: DashboardData = {
    user: {
        name: 'Juan Pérez',
        role: 'Cliente Premium',
        email: 'juan.perez@example.com',
        phone: '+57 300 000 0000',
        memberSince: 'Enero 2024',
        clientId: '#ELEM-104928',
    },
    tracking: {
        status: 'En Tránsito',
        title: 'Tu Deepal S07 MAX está en camino',
        description: 'Tu vehículo ha salido del centro de distribución y se dirige a la concesionaria.',
        progressPercentage: 75,
        estimatedDate: '15 de Octubre',
        currentLocation: 'Puerto de Veracruz, MX' // Default mock location
    },
    vehicle: {
        id: 'v1',
        name: 'Deepal S07 MAX',
        color: 'Negro Cósmico',
        horsepower: '258 HP',
        range: '620 km',
        imageUrl: '/deepal-s07.avif' // Reusing existing assert
    },
    recentActivities: [
        {
            id: 'a1',
            date: 'Hoy, 09:42 AM',
            title: 'Pedido en tránsito',
            description: 'Tu vehículo ha salido del puerto y está siendo transportado al centro logístico regional.',
            type: 'transit'
        },
        {
            id: 'a2',
            date: 'Ayer, 14:20 PM',
            title: 'Documentos aprobados',
            description: 'La documentación de seguro y registro ha sido validada exitosamente.',
            type: 'document'
        },
        {
            id: 'a3',
            date: 'Hace 3 días',
            title: 'Cotización enviada',
            description: 'Se ha generado y enviado la cotización final para tu aprobación.',
            type: 'quote'
        }
    ]
};
