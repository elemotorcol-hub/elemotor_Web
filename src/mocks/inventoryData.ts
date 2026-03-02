import { VehicleModel } from '@/types/inventory';

export const mockModels: VehicleModel[] = [
    {
        id: '1',
        name: 'Deepal S07',
        brand: 'Deepal',
        basePrice: 38900,
        status: 'Active',
        description: 'A next-generation electric SUV combining cutting-edge technology with premium comfort.',
        thumbnail: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=300&q=80',
        trims: []
    },
    {
        id: '2',
        name: 'Elemotor X5',
        brand: 'Elemotor',
        basePrice: 52400,
        status: 'Active',
        description: 'A high-performance luxury SUV tailored for modern lifestyle and maximum efficiency.',
        thumbnail: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=300&q=80',
        trims: []
    },
    {
        id: '3',
        name: 'Elemotor S3',
        brand: 'Elemotor',
        basePrice: 29900,
        status: 'Active',
        description: 'An affordable, compact EV designed for urban mobility without compromising features.',
        thumbnail: 'https://images.unsplash.com/photo-1606132787834-ffce1057e93b?w=300&q=80',
        trims: []
    },
    {
        id: '4',
        name: 'Elemotor GT',
        brand: 'Elemotor',
        basePrice: 67500,
        status: 'Draft',
        description: 'The ultimate sports touring EV with dual motors and extraordinary acceleration.',
        thumbnail: 'https://images.unsplash.com/photo-1562095241-8c6714fd4178?w=300&q=80',
        trims: []
    },
    {
        id: '5',
        name: 'Elemotor R7',
        brand: 'Elemotor',
        basePrice: 45200,
        status: 'Active',
        description: 'A sleek, aerodynamic sedan providing a long-range comfortable journey.',
        thumbnail: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&q=80',
        trims: []
    }
];
