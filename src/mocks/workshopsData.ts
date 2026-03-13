export interface WorkshopSchedule {
  lunesViernes: string;
  sabado: string;
  domingo: string;
  // Representación simple para UI, en BD podría ser `{ day: number, open: string, close: string }[]`
}

export interface WorkshopService {
  id: string;
  title: string;
  description: string;
  iconName: string; // e.g. 'Zap', 'Wrench', 'MapPin'
}

export interface Workshop {
  id: string;
  name: string;
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  city: string;
  address: string;
  description: string;
  phone: string;
  whatsapp: boolean;
  location: {
    lat: number;
    lng: number;
  };
  schedule: WorkshopSchedule;
  services: WorkshopService[];
  amenities: string[];
  status: 'active' | 'inactive';
  images: string[];
}

export const mockWorkshops: Workshop[] = [
  {
    id: 'WS-001',
    name: 'AutoVolt Center',
    isVerified: true,
    rating: 4.8,
    reviewsCount: 124,
    city: 'Bogotá',
    address: 'Av. Carrera 15 #123-45',
    description: 'Especialistas certificados en mantenimiento de vehículos eléctricos de alta gama. Contamos con tecnología de punta para diagnóstico de baterías, sistemas de carga y electrónica avanzada. Nuestro equipo está capacitado directamente por los fabricantes para garantizar el mejor servicio para tu EV.',
    phone: '+57 (1) 555-0123',
    whatsapp: true,
    location: { lat: 4.6983, lng: -74.0321 },
    schedule: {
      lunesViernes: '08:00 - 18:00',
      sabado: '09:00 - 14:00',
      domingo: 'Cerrado'
    },
    services: [
      { id: 'srv-1', title: 'Diagnóstico Eléctrico', description: 'Escaneo completo de sistemas HV', iconName: 'Zap' },
      { id: 'srv-2', title: 'Mantenimiento General', description: 'Frenos, suspensión y filtros', iconName: 'Wrench' },
      { id: 'srv-3', title: 'Llantas y Alineación', description: 'Especial para peso EV', iconName: 'Disc' },
      { id: 'srv-4', title: 'Estación de Carga', description: 'Carga rápida nivel 3 disponible', iconName: 'BatteryCharging' },
    ],
    amenities: ['Wi-Fi Gratis', 'Cafetería', 'Sala de Espera VIP'],
    status: 'active',
    images: ['/taller-1.jpg']
  },
  {
    id: 'WS-002',
    name: 'ElectroMechanics Medellín',
    isVerified: false,
    rating: 4.5,
    reviewsCount: 89,
    city: 'Medellín',
    address: 'Carrera 43A #1-50',
    description: 'Taller experto en reparación y mantenimiento integral de vehículos híbridos y eléctricos. Brindamos asesoría personalizada y repuestos originales.',
    phone: '+57 (4) 333-4455',
    whatsapp: true,
    location: { lat: 6.2442, lng: -75.5812 },
    schedule: {
      lunesViernes: '07:30 - 17:30',
      sabado: '08:00 - 13:00',
      domingo: 'Cerrado'
    },
    services: [
      { id: 'srv-1', title: 'Diagnóstico Eléctrico', description: 'Escaneo completo de sistemas HV', iconName: 'Zap' },
      { id: 'srv-2', title: 'Mantenimiento General', description: 'Frenos, suspensión y filtros', iconName: 'Wrench' },
    ],
    amenities: ['Wi-Fi Gratis', 'Sala de Espera'],
    status: 'active',
    images: ['/taller-2.jpg']
  },
  {
    id: 'WS-003',
    name: 'EcoDrive Cali',
    isVerified: true,
    rating: 4.9,
    reviewsCount: 210,
    city: 'Cali',
    address: 'Calle 5 #66-12',
    description: 'El primer centro integral automotriz 100% dedicado a la electromovilidad en el Valle del Cauca.',
    phone: '+57 (2) 444-9988',
    whatsapp: false,
    location: { lat: 3.4215, lng: -76.5205 },
    schedule: {
      lunesViernes: '08:00 - 18:00',
      sabado: 'Cerrado',
      domingo: 'Cerrado'
    },
    services: [
      { id: 'srv-1', title: 'Diagnóstico Eléctrico', description: 'Escaneo completo', iconName: 'Zap' },
      { id: 'srv-4', title: 'Estación de Carga', description: 'Puntos de carga AC', iconName: 'BatteryCharging' },
    ],
    amenities: ['Tienda de Accesorios'],
    status: 'inactive',
    images: []
  }
];
