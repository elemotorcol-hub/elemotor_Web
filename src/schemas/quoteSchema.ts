import { z } from 'zod';

export const quoteSchema = z.object({
    id: z.string().optional(),
    clientName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    modelInterest: z.string().min(1, 'Selecciona un modelo'),
    status: z.enum(['nuevo', 'contactado', 'negociacion', 'ganado', 'perdido']),
    totalAmount: z.number().min(0, 'El monto no puede ser negativo'),
    advisor: z.string().min(1, 'Selecciona un asesor'),
    notes: z.string().max(1000, 'Las notas no pueden superar los 1000 caracteres').optional().or(z.literal('')),
    
    // Level 3 Detection
    nickname: z.string().max(0, { message: 'Bot detected' }).optional(),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;
