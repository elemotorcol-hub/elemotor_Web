import { ClientVehicleData, QuoteData, ClientDocument } from '@/types/dashboard';

export const MOCK_VEHICLE_DATA: ClientVehicleData = {
    status: 'Conectado',
    lastUpdated: 'hace 2 min',
    modelYear: 'MODELO 2024',
    modelName: 'Elemotor Model X',
    vin: '5YJ3E1EA...892',
    exteriorColor: { name: 'Midnight Silver', hex: '#64748b' },
    purchaseDate: '2023-10-24',
    telemetry: {
        battery: {
            percentage: 85,
            status: 'Cargando'
        },
        range: {
            value: 420,
            unit: 'km'
        },
        odometer: {
            value: '12,450',
            unit: 'km'
        }
    },
    maintenance: {
        nextService: {
            name: 'Rotación de Neumáticos',
            suggestedDate: '15 Nov, 2024'
        },
        batteryHealth: 'Excelente',
        tirePressure: '38 PSI (Todos)'
    },
    warranty: {
        basic: {
            name: 'Limitada Básica',
            status: 'Activa',
            expiration: 'Expira en 3 años o 60,000 km',
            progress: 40
        },
        battery: {
            name: 'Batería y Unidad de Potencia',
            status: 'Activa',
            expiration: 'Expira en 7 años',
            progress: 10
        }
    },
    documents: [
        {
            name: 'Manual del Propietario',
            info: 'PDF • 4.2 MB',
            actionType: 'download'
        },
        {
            name: 'Póliza de Seguro',
            info: 'Vence Dic 2024',
            actionType: 'external'
        }
    ]
};

export const MOCK_QUOTES_DATA: QuoteData[] = [
    {
        id: 'COT-2024-104',
        model: 'AVATR 11 Luxury Edition',
        date: '12 MAR, 2024',
        status: 'Aprobada',
        statusCode: 'approved',
        statusColor: 'bg-[#10B981]',
        amount: '$245,000,000 COP',
        validUntil: '12 ABR, 2024',
        imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=400&auto=format&fit=crop'
    },
    {
        id: 'COT-2024-098',
        model: 'Deepal S07 MAX',
        date: '08 MAR, 2024',
        status: 'Pendiente',
        statusCode: 'pending',
        statusColor: 'bg-blue-500',
        amount: '$165,000,000 COP',
        validUntil: '-',
        imageUrl: '/deepal-s07.avif'
    },
    {
        id: 'COT-2023-085',
        model: 'Neta GT Performance',
        date: '21 DIC, 2023',
        status: 'Expirada',
        statusCode: 'expired',
        statusColor: 'bg-slate-500',
        amount: '$190,000,000 COP',
        validUntil: '21 ENE, 2024',
        imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=400&auto=format&fit=crop'
    }
];

export const MOCK_DOCUMENTS_DATA: ClientDocument[] = [
    {
        id: '1',
        title: 'Factura de Compra',
        subtitle: 'Ref: #FAC-2023-001',
        uploadDate: '12 Oct, 2023',
        iconType: 'receipt',
        colorTheme: 'text-blue-400 bg-blue-400/10',
        category: 'Facturas'
    },
    {
        id: '2',
        title: 'SOAT Vigente',
        subtitle: 'Vence: 01 Ene, 2025',
        uploadDate: '01 Ene, 2024',
        iconType: 'shield-check',
        colorTheme: 'text-[#10B981] bg-[#10B981]/10',
        isActive: true,
        category: 'Legales'
    },
    {
        id: '3',
        title: 'Tarjeta de Propiedad',
        subtitle: 'Placa: XYZ-123',
        uploadDate: '15 Feb, 2023',
        iconType: 'id-card',
        colorTheme: 'text-purple-400 bg-purple-400/10',
        category: 'Legales'
    },
    {
        id: '4',
        title: 'Seguro Todo Riesgo',
        subtitle: '',
        uploadDate: '20 Mar, 2024',
        iconType: 'shield-alert',
        colorTheme: 'text-yellow-500 bg-yellow-500/10',
        warningMessage: 'Renovar pronto',
        category: 'Legales'
    },
    {
        id: '5',
        title: 'Manual de Usuario',
        subtitle: 'PDF - 12MB',
        uploadDate: '12 Oct, 2023',
        iconType: 'book',
        colorTheme: 'text-slate-400 bg-slate-400/10',
        category: 'Mantenimiento'
    }
];
