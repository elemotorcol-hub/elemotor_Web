import { z } from 'zod';

export const orderStatusSchema = z.enum([
    'Fabricación',
    'En Puerto',
    'En Tránsito',
    'Aduanas',
    'Listo para Entrega'
]);

export const orderHistorySchema = z.object({
    status: orderStatusSchema,
    date: z.string(),
    description: z.string().optional()
});

export const orderSchema = z.object({
    id: z.string().optional(),
    trackingCode: z.string().min(1, 'El código de seguimiento es requerido'),
    clientName: z.string().min(3, 'El nombre del cliente debe tener al menos 3 caracteres'),
    vehicleModel: z.string().min(2, 'El modelo del vehículo es requerido'),
    trimName: z.string().min(1, 'La versión/trim es requerida'),
    colorName: z.string().min(1, 'El color es requerido'),
    totalPrice: z.number().min(0, 'El precio no puede ser negativo'),
    status: orderStatusSchema,
    estimatedDelivery: z.string().optional(),
    vin: z.string().optional(),
    notes: z.string().optional(),
    history: z.array(orderHistorySchema).optional()
});

export type OrderFormValues = z.infer<typeof orderSchema>;
