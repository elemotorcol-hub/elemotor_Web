import { VehicleModel, Brand } from '@/types/inventory';

export const mockBrands: Brand[] = [
    { id: 'b1', name: 'Deepal', slug: 'deepal', active: true },
    { id: 'b2', name: 'Elemotor', slug: 'elemotor', active: true },
    { id: 'b3', name: 'Avatr', slug: 'avatr', active: true },
];

export const mockModels: VehicleModel[] = [
    {
        id: '1',
        brand_id: 'b1', // Deepal
        name: 'Deepal S07',
        slug: 'deepal-s07',
        type: 'suv',
        year: 2025,
        basePrice: 38900,
        featured: true,
        active: true,
        status: 'Active',
        description: 'A next-generation electric SUV combining cutting-edge technology with premium comfort.',
        thumbnail: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=300&q=80',
        trims: []
    },
    {
        id: '2',
        brand_id: 'b2', // Elemotor
        name: 'Elemotor X5',
        slug: 'elemotor-x5',
        type: 'suv',
        year: 2024,
        basePrice: 52400,
        featured: false,
        active: true,
        status: 'Active',
        description: 'A high-performance luxury SUV tailored for modern lifestyle and maximum efficiency.',
        thumbnail: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=300&q=80',
        trims: []
    },
    {
        id: '3',
        brand_id: 'b2',
        name: 'Elemotor S3',
        slug: 'elemotor-s3',
        type: 'sedan',
        year: 2024,
        basePrice: 29900,
        featured: false,
        active: true,
        status: 'Active',
        description: 'An affordable, compact EV designed for urban mobility without compromising features.',
        thumbnail: 'https://images.unsplash.com/photo-1606132787834-ffce1057e93b?w=300&q=80',
        trims: []
    },
    {
        id: '4',
        brand_id: 'b2',
        name: 'Elemotor GT',
        slug: 'elemotor-gt',
        type: 'coupe',
        year: 2025,
        basePrice: 67500,
        featured: false,
        active: false,
        status: 'Draft',
        description: 'The ultimate sports touring EV with dual motors and extraordinary acceleration.',
        thumbnail: 'https://images.unsplash.com/photo-1562095241-8c6714fd4178?w=300&q=80',
        trims: []
    },
    {
        id: '5',
        brand_id: 'b2',
        name: 'Elemotor R7',
        slug: 'elemotor-r7',
        type: 'sedan',
        year: 2024,
        basePrice: 45200,
        featured: false,
        active: true,
        status: 'Active',
        description: 'A sleek, aerodynamic sedan providing a long-range comfortable journey.',
        thumbnail: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&q=80',
        trims: []
    }
];
