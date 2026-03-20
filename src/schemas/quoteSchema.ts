import { z } from 'zod';

export const quoteSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido').optional(),
    phone: z.string().min(7, 'Teléfono muy corto').optional(),
    modelInterest: z.string().min(1, 'Selecciona un modelo').optional().or(z.literal('')),
    status: z.enum(['pending', 'contacted', 'responded', 'negotiation', 'closed_won', 'closed_lost']),
    budgetRange: z.number().min(0, 'El monto no puede ser negativo').optional(),
    assignedToId: z.number().optional(),
    notes: z.string().max(3000, 'Las notas no pueden superar los 3000 caracteres').optional().or(z.literal('')),
    
    // Level 3 Detection
    nickname: z.string().max(0, { message: 'Bot detected' }).optional(),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;
