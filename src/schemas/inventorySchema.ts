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
    dbId: z.union([z.string(), z.number()]).optional(), // Real DB id when in edit mode
    name: z.string().min(1, 'Requerido'),
    hex_code: z.string().min(1, 'Requerido'),
    type: z.enum(['exterior', 'interior']),
    image_url: z.string().optional(),
    public_id: z.string().optional(),
    swatch_url: z.string().optional(),
    rawFile: z.any().optional(), // Holds native File before upload
    _deleted: z.boolean().optional(), // Marks for deletion in edit mode
});

export const specSchema = z.object({
    battery_kwh: z.number().min(0).max(9999).optional(),
    range_cltc_km: z.number().min(0).max(9999).optional(),
    range_wltp_km: z.number().min(0).max(9999).optional(),
    horsepower: z.number().min(0).max(9999).optional(),
    torque: z.number().min(0).max(9999).optional(),
    zero_to_100: z.number().min(0).max(999.99).optional(),
    top_speed: z.number().min(0).max(999).optional(),
    charge_time_30_80: z.string().max(100).optional(),
    trunk_liters: z.number().min(0).max(9999).optional(),
    length_mm: z.number().min(0).max(99999).optional(),
    width_mm: z.number().min(0).max(99999).optional(),
    height_mm: z.number().min(0).max(99999).optional(),
    wheelbase_mm: z.number().min(0).max(99999).optional(),
    curb_weight_kg: z.number().min(0).max(99999).optional(),
    kwh_per_100km: z.number().min(0).max(9999.99).optional(),
    adas_level: z.string().max(50).optional(),
    screen_size: z.number().min(0).max(100).optional(),
    software_version: z.number().min(0).max(999).optional(),
});

export const trimImageSchema = z.object({
    id: z.string(),
    dbId: z.union([z.string(), z.number()]).optional(), // Real DB id when in edit mode
    url: z.string().min(1, 'Requerida'),
    public_id: z.string().optional(),
    alt_text: z.string().optional(),
    type: z.enum(['gallery', 'hero', 'interior', 'exterior', 'panoramic']),
    sort_order: z.number().default(0),
    rawFile: z.any().optional(), // Holds native File before upload
    _deleted: z.boolean().optional(), // Marks for deletion in edit mode
});

export const trimModel3DSchema = z.object({
    id: z.string(),
    dbId: z.union([z.string(), z.number()]).optional(), // Real DB id when in edit mode
    file_url: z.string().min(1, 'Requerida'),
    public_id: z.string().optional(),
    file_size_mb: z.number().optional(),
    format: z.enum(['glb', 'gltf']),
    draco_compressed: z.boolean().default(true),
    lod_level: z.enum(['low', 'medium', 'high']).optional(),
    rawFile: z.any().optional(), // Holds native File before upload
    _deleted: z.boolean().optional(), // Marks for deletion in edit mode
});

export const trimSchema = z.object({
    id: z.string(), // UUID for new trims; numeric string for DB trims in edit mode
    dbId: z.union([z.string(), z.number()]).optional(), // Real DB id when editing
    specDbId: z.union([z.string(), z.number()]).optional(), // DB id of associated spec record
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
    name: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre es demasiado largo'),
    slug: z.string()
        .min(2, 'Slug requerido')
        .max(120, 'Slug demasiado largo')
        .regex(/^[a-z0-9-]+$/, 'Formato inválido (solo minúsculas y guiones)'),
    type: z.enum(['suv', 'sedan', 'hatchback', 'pickup']),
    year: z.coerce.number({ message: 'Debe ser un número' })
        .int('Año debe ser solo números enteros')
        .min(1900, 'Año inválido')
        .max(2100, 'Año fuera de rango'),
    description: z.string()
        .max(2000, 'La descripción no puede superar los 2000 caracteres')
        .optional()
        .or(z.literal('')),
    basePrice: z.coerce.number({ message: 'Debe ser un número' })
        .min(0, 'El precio no puede ser negativo')
        .max(1000000000, 'Valor excesivamente grande'),
    featured: z.boolean().default(false),
    active: z.boolean().default(true),
    status: z.enum(['Active', 'Draft']),
    thumbnail: z.string().optional().or(z.literal('')),
    video_url: z.string().url('URL inválida').optional().or(z.literal('')),
    datasheet: z.object({
        file_url: z.string().min(1, 'Requerida'),
        public_id: z.string().optional().or(z.literal('')),
        file_size_mb: z.number().optional(),
        rawFile: z.any().optional(),
        _deleted: z.boolean().optional(),
    }).optional(),
    trims: z.array(trimSchema).default([]),

    // Level 3 Detection
    nickname: z.string().max(0, { message: 'Bot detected' }).optional(),
});




export type VehicleModelFormData = z.infer<typeof vehicleModelSchema>;
