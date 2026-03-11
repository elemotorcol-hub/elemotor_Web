import { z } from 'zod';

export const brandSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    name: z.string().min(2, 'Min 2 caracteres'),
    slug: z.string().min(2, 'Slug requerido'),
    logo_url: z.string().optional(),
    country: z.string().optional(),
    active: z.boolean(),
});

export type BrandFormData = z.infer<typeof brandSchema>;

export const colorSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Requerido'),
    hex_code: z.string().min(1, 'Requerido'),
    type: z.enum(['exterior', 'interior']),
    image_url: z.string().optional(),
    swatch_url: z.string().optional(),
    rawFile: z.any().optional(), // Holds native File before upload
});

export const specSchema = z.object({
    battery_kwh: z.coerce.number().min(0, 'Min 0').max(9999, 'Máximo superado').optional().or(z.literal(0)),
    range_cltc_km: z.coerce.number().min(0).max(9999).optional().or(z.literal(0)),
    range_wltp_km: z.coerce.number().min(0).max(9999).optional().or(z.literal(0)),
    horsepower: z.coerce.number().min(0).max(9999).optional().or(z.literal(0)),
    torque: z.coerce.number().min(0).max(9999).optional().or(z.literal(0)),
    zero_to_100: z.coerce.number().min(0).max(999.99, 'Máximo 999.99').optional().or(z.literal(0)),
    top_speed: z.coerce.number().min(0).max(999).optional().or(z.literal(0)),
    charge_time_30_80: z.string().max(100).optional(),
    trunk_liters: z.coerce.number().min(0).max(9999).optional().or(z.literal(0)),
    length_mm: z.coerce.number().min(0).max(99999).optional().or(z.literal(0)),
    width_mm: z.coerce.number().min(0).max(99999).optional().or(z.literal(0)),
    height_mm: z.coerce.number().min(0).max(99999).optional().or(z.literal(0)),
    wheelbase_mm: z.coerce.number().min(0).max(99999).optional().or(z.literal(0)),
    curb_weight_kg: z.coerce.number().min(0).max(99999).optional().or(z.literal(0)),
    kwh_per_100km: z.coerce.number().min(0).max(9999.99).optional().or(z.literal(0)),
    adas_level: z.string().max(50).optional(),
    screen_size: z.coerce.number().min(0).max(100).optional().or(z.literal(0)), // Was string earlier, wait checking...
    software_version: z.coerce.number().min(0).max(999).optional().or(z.literal(0)),
});

export const trimImageSchema = z.object({
    id: z.string(),
    url: z.string().min(1, 'Requerida'),
    alt_text: z.string().optional(),
    type: z.enum(['gallery', 'hero', 'interior', 'exterior', 'panoramic']),
    sort_order: z.number().default(0),
    rawFile: z.any().optional(), // Holds native File before upload
});

export const trimModel3DSchema = z.object({
    id: z.string(),
    file_url: z.string().min(1, 'Requerida'),
    file_size_mb: z.number().optional(),
    format: z.enum(['glb', 'gltf']),
    draco_compressed: z.boolean().default(true),
    lod_level: z.enum(['low', 'medium', 'high']).optional(),
    rawFile: z.any().optional(), // Holds native File before upload
});

export const trimSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Requerido'),
    price: z.coerce.number({ message: 'Debe ser un número' }).min(0, 'El precio no puede ser negativo').max(1000000000, 'Valor excesivamente grande'),
    available_quantity: z.coerce.number({ message: 'Debe ser un número' }).int('Debe ser número entero').min(0, 'No puede ser negativo').max(100000, 'Valor excesivamente grande'),
    status: z.enum(['stock', 'transit', 'order']),
    active: z.boolean().default(true),
    specs: specSchema,
    colors: z.array(colorSchema).default([]),
    images: z.array(trimImageSchema).default([]),
    model_3d: trimModel3DSchema.optional(),
});

export const vehicleModelSchema = z.object({
    id: z.string().optional(),
    brand_id: z.string().min(1, 'Selecciona una marca'),
    name: z.string().min(2, 'Min 2 caracteres'),
    slug: z.string().min(2, 'Slug requerido').regex(/^[a-z0-9-]+$/, 'Formato inválido (solo minúsculas y guiones)'),
    type: z.enum(['suv', 'sedan', 'hatchback', 'pickup', 'van', 'coupe']),
    year: z.coerce.number({ message: 'Debe ser un número' }).int('Año debe ser solo números enteros').min(1000, 'Año debe contener exactamente 4 números').max(9999, 'Año debe contener exactamente 4 números'),
    description: z.string().optional(),
    basePrice: z.coerce.number({ message: 'Debe ser un número' }).min(0, 'El precio no puede ser negativo').max(1000000000, 'Valor excesivamente grande'),
    featured: z.boolean().default(false),
    active: z.boolean().default(true),
    status: z.enum(['Active', 'Draft']),
    thumbnail: z.string().optional().or(z.literal('')),
    trims: z.array(trimSchema).default([]),
});

export type VehicleModelFormData = z.infer<typeof vehicleModelSchema>;
