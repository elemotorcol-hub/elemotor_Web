export interface ServiceItem {
    id: string;
    icon: string; // Icon name reference
    title: string;
    description: string;
}

export interface WorkshopHour {
    day: string; // Lunes, Martes...
    open_time: string; // Format HH:mm, e.g., "08:00"
    close_time: string; // Format HH:mm, e.g., "18:00"
    is_closed: boolean; // Replaces isOpen for admin alignment
}

export interface Workshop {
    id: string;
    name: string;
    rating: number;
    reviews: number;
    isOpen: boolean; // Indicates current real-time status
    type: string;
    images: string[]; // Replaces single image for multiple upload capability
    address: string;
    city: string; // New field for filters
    state: string; // New field for filters
    x: number;
    y: number;
    isVerified?: boolean;
    description?: string;
    services?: ServiceItem[];
    amenities?: string[];
    hoursList?: WorkshopHour[];
    phone?: string;
    estimatedTime?: string;
    estimatedDistance?: string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
    { id: '1', icon: 'zap', title: 'Diagnóstico Eléctrico', description: 'Escaneo completo de sistemas HV' },
    { id: '2', icon: 'wrench', title: 'Mantenimiento General', description: 'Frenos, suspensión y filtros' },
    { id: '3', icon: 'tire', title: 'Llantas y Alineación', description: 'Especial para peso EV' },
    { id: '4', icon: 'battery', title: 'Estación de Carga', description: 'Carga rápida nivel 3 disponible' }
];

const DEFAULT_HOURS: WorkshopHour[] = [
    { day: 'Lunes - Viernes', open_time: '08:00', close_time: '18:00', is_closed: false },
    { day: 'Sábado', open_time: '09:00', close_time: '14:00', is_closed: false },
    { day: 'Domingo', open_time: '', close_time: '', is_closed: true }
];

export const WORKSHOPS_DATA: Workshop[] = [
    {
        id: 'w1',
        name: 'AutoVolt Center - Bogotá',
        rating: 4.8,
        reviews: 120,
        isOpen: true,
        type: 'Mantenimiento',
        images: ['/MODELOS/E-SUV.avif', '/MODELOS/SEDAN-1.avif'],
        address: 'Av. Carrera 15 #123-45',
        city: 'Bogotá',
        state: 'Cundinamarca',
        x: 45,
        y: 35,
        isVerified: true,
        description: 'Especialistas certificados en mantenimiento de vehículos eléctricos de alta gama. Contamos con tecnología de punta para diagnóstico de baterías, sistemas de carga y electrónica avanzada. Nuestro equipo está capacitado directamente por los fabricantes para garantizar el mejor servicio para tu EV.',
        services: DEFAULT_SERVICES,
        amenities: ['Wi-Fi Gratis', 'Cafetería', 'Sala de Espera VIP'],
        hoursList: DEFAULT_HOURS,
        phone: '+57 (1) 555-0123',
        estimatedDistance: '3.2 km',
        estimatedTime: '12 min'
    },
    {
        id: 'w2',
        name: 'ElectroTaller Norte',
        rating: 4.5,
        reviews: 85,
        isOpen: false,
        type: 'Frenos',
        images: ['/MODELOS/SEDAN-1.avif'],
        address: 'Autopista Norte #170-45',
        city: 'Bogotá',
        state: 'Cundinamarca',
        x: 60,
        y: 25,
        isVerified: true,
        description: 'Taller especializado en frenos regenerativos y mecánicos especiales. Diagnóstico preciso para mantener la seguridad de tu automóvil eléctrico intacta.',
        services: [DEFAULT_SERVICES[1], DEFAULT_SERVICES[2]],
        amenities: ['Wi-Fi Gratis'],
        hoursList: DEFAULT_HOURS,
        phone: '+57 (1) 555-0456',
        estimatedDistance: '8.5 km',
        estimatedTime: '25 min'
    },
    {
        id: 'w3',
        name: 'E-Station Chapinero',
        rating: 4.9,
        reviews: 42,
        isOpen: true,
        type: 'Cargadores',
        images: ['/MODELOS/AVATR-11.avif'],
        address: 'Carrera 7 #65-10',
        city: 'Bogotá',
        state: 'Cundinamarca',
        x: 52,
        y: 50,
        isVerified: false,
        description: 'Estación de carga ultrarrápida (DC Fast Charging) 24/7. Cómoda sala de espera mientras tu vehículo recupera autonomía.',
        services: [DEFAULT_SERVICES[3]],
        amenities: ['Cafetería', 'Baños', 'Minimarket'],
        hoursList: [{ day: 'Lunes - Domingo', open_time: '00:00', close_time: '23:59', is_closed: false }],
        phone: '+57 (1) 555-0789',
        estimatedDistance: '1.1 km',
        estimatedTime: '5 min'
    },
    {
        id: 'w4',
        name: 'ServiTech Medellín',
        rating: 4.7,
        reviews: 210,
        isOpen: true,
        type: 'General',
        images: ['/MODELOS/ElemotorGT.avif'],
        address: 'Carrera 43A #1-50',
        city: 'Medellín',
        state: 'Antioquia',
        x: 30,
        y: 65,
        isVerified: true,
        description: 'El principal centro de diagnóstico general en Medellín para autos eléctricos. Resolvemos cualquier eventualidad con repuestos originales.',
        services: DEFAULT_SERVICES,
        amenities: ['Wi-Fi Gratis', 'Coworking'],
        hoursList: DEFAULT_HOURS,
        phone: '+57 (4) 333-0101',
        estimatedDistance: '420 km',
        estimatedTime: '8h 30m'
    },
    {
        id: 'w5',
        name: 'E-Station Poblado',
        rating: 4.6,
        reviews: 15,
        isOpen: true,
        type: 'Cargadores',
        images: ['/MODELOS/ElemotorGT.avif'],
        address: 'Calle 10 #42-45',
        city: 'Medellín',
        state: 'Antioquia',
        x: 25,
        y: 70,
        isVerified: true,
        description: 'Punto de recarga estratégico en la zona de El Poblado. Conexión rápida nivel 2 y nivel 3.',
        services: [DEFAULT_SERVICES[3]],
        amenities: ['Cajeros ATM', 'Cafetería'],
        hoursList: [{ day: 'Lunes - Domingo', open_time: '00:00', close_time: '23:59', is_closed: false }],
        phone: '+57 (4) 333-0202',
        estimatedDistance: '425 km',
        estimatedTime: '8h 40m'
    }
];

export const WORKSHOP_FILTERS = ['Todos', 'Mantenimiento', 'Cargadores', 'Frenos', 'General'];
