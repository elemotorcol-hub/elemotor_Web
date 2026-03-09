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
});

export const specSchema = z.object({
    battery_kwh: z.coerce.number().optional(),
    range_cltc_km: z.coerce.number().optional(),
    range_wltp_km: z.coerce.number().optional(),
    horsepower: z.coerce.number().optional(),
    torque: z.coerce.number().optional(),
    zero_to_100: z.coerce.number().optional(),
    top_speed: z.coerce.number().optional(),
    charge_time_30_80: z.string().optional(),
    trunk_liters: z.coerce.number().optional(),
    length_mm: z.coerce.number().optional(),
    width_mm: z.coerce.number().optional(),
    height_mm: z.coerce.number().optional(),
    wheelbase_mm: z.coerce.number().optional(),
    curb_weight_kg: z.coerce.number().optional(),
    kwh_per_100km: z.coerce.number().optional(),
    adas_level: z.string().optional(),
    screen_size: z.string().optional(),
    software_version: z.string().optional(),
});

export const trimImageSchema = z.object({
    id: z.string(),
    url: z.string().min(1, 'Requerida'),
    alt_text: z.string().optional(),
    type: z.enum(['gallery', 'hero', 'interior', 'exterior', '360']),
    sort_order: z.number().default(0),
});

export const trimModel3DSchema = z.object({
    id: z.string(),
    file_url: z.string().min(1, 'Requerida'),
    file_size_mb: z.number().optional(),
    format: z.enum(['glb', 'gltf']),
    draco_compressed: z.boolean().default(true),
    lod_level: z.enum(['low', 'medium', 'high']).optional(),
});

export const trimSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Requerido'),
    price: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
    available_quantity: z.coerce.number().min(0, 'Mínimo 0'),
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
    slug: z.string().min(2, 'Slug requerido'),
    type: z.enum(['suv', 'sedan', 'hatchback', 'pickup', 'van', 'coupe']),
    year: z.coerce.number().min(1900, 'Año requerido'),
    description: z.string().optional(),
    basePrice: z.coerce.number().min(0, 'Mínimo 0'),
    featured: z.boolean().default(false),
    active: z.boolean().default(true),
    status: z.enum(['Active', 'Draft']),
    thumbnail: z.string().optional().or(z.literal('')),
    trims: z.array(trimSchema).default([]),
});

export type VehicleModelFormData = z.infer<typeof vehicleModelSchema>;
