import { Order } from '@/types/orders';

export const MOCK_ORDERS = [
    {
        id: '1',
        trackingCode: 'ELE-2401-ABC',
        clientId: 'cli_1',
        clientName: 'Sarah Chen',
        vehicleModelId: 'm_s07',
        vehicleModel: 'Deepal S07',
        trimId: 't_max',
        trimName: 'MAX Premium',
        colorId: 'c_purple',
        colorName: 'Nebula Purple',
        status: 'ready',
        estimatedDelivery: '12 Mar, 2026',
        totalPrice: 42000,
        vin: 'WN3TR3459M1122334',
        notes: 'Cliente pago 50% anticipo. Requiere entrega en sucursal norte.',
        history: [
            { status: 'confirmed', date: '2026-01-15', description: 'Pedido ingresado a planta' },
            { status: 'port_origin', date: '2026-02-05', description: 'A la espera de buque contenedor' },
            { status: 'transit', date: '2026-02-18', description: 'Buque zarpó de Shanghai' },
            { status: 'customs', date: '2026-03-01', description: 'Nacionalización de importación' },
            { status: 'ready', date: '2026-03-10', description: 'PDI completado en taller local' }
        ]
    },
    {
        id: '2',
        trackingCode: 'ELE-2402-XYZ',
        clientId: 'cli_2',
        clientName: 'Marcus Johnson',
        vehicleModelId: 'm_avatr11',
        vehicleModel: 'AVATR 11',
        trimId: 't_ultra',
        trimName: 'Ultra AWD',
        colorId: 'c_white',
        colorName: 'Glacier White',
        status: 'transit',
        estimatedDelivery: '18 Mar, 2026',
        totalPrice: 85000,
        history: [
            { status: 'confirmed', date: '2026-01-20' },
            { status: 'port_origin', date: '2026-02-12' },
            { status: 'transit', date: '2026-02-28', description: 'Llegada aproximada a Buenaventura: 14 Mar' }
        ]
    },
    {
        id: '3',
        trackingCode: 'ELE-2403-LMN',
        clientId: 'cli_3',
        clientName: 'Lena Park',
        vehicleModelId: 'm_e8',
        vehicleModel: 'Galaxy E8',
        trimId: 't_base',
        trimName: 'Standard RWD',
        colorId: 'c_black',
        colorName: 'Cosmic Black',
        status: 'confirmed',
        estimatedDelivery: '25 Abr, 2026',
        totalPrice: 38000,
        notes: 'Vehículo financiado con banco Aliado.',
        history: [
            { status: 'confirmed', date: '2026-03-01', description: 'Programado para ensamblaje semana 12' }
        ]
    }
];
