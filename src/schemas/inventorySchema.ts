import { z } from 'zod';

export const vehicleModelSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    brand: z.string().min(2, 'La marca debe tener al menos 2 caracteres'),
    basePrice: z.coerce.number().min(1, 'El precio base debe ser mayor a 0'),
    status: z.enum(['Active', 'Draft']),
    description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    thumbnail: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
});

export type VehicleModelFormData = z.infer<typeof vehicleModelSchema>;
