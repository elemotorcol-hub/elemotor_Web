export type VehicleInfo = {
    id: string;
    name: string;
    price: string;
    range: string;
    acceleration: string;
    imageUrl: string;
    highlights: string[];
    badge?: string;
};

export const MOCK_VEHICLES: VehicleInfo[] = [
    {
        id: '1',
        name: 'DEEPAL S07 MAX',
        price: '$189.900.000',
        range: '520 km',
        acceleration: '6.7 s',
        imageUrl: '/MODELOS/AVATR-11.avif',
        highlights: [
            'Pantalla táctil de 15.6" con rotación',
            'Techo panorámico inteligente',
            'Asistente de conducción L2+'
        ],
        badge: 'PREMIUM EV'
    },
    {
        id: '2',
        name: 'LUCID AIR SAPPHIRE',
        price: '$249.000.000',
        range: '687 km',
        acceleration: '1.89s',
        imageUrl: '/MODELOS/GALAXY_E8.avif',
        highlights: [
            'Tres motores de alto desempeño',
            'Sistema de infoentretenimiento envolvente',
            'Asientos premium de nivel aeroespacial'
        ],
        badge: 'LUXURY EV'
    },
    {
        id: '3',
        name: 'PORSCHE TAYCAN',
        price: '$194.000.000',
        range: '412 km',
        acceleration: '2.8 s',
        imageUrl: '/MODELOS/BYD-SEALION7 (1).avif',
        highlights: [
            'Chasis deportivo adaptativo',
            'Carga ultrarrápida de 800V',
            'Acústica deportiva Taycan'
        ],
        badge: 'PERFORMANCE EV'
    }
];
