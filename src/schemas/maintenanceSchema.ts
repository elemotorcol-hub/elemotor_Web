import { z } from 'zod';

/**
 * Maintenance Appointment Schema
 * Implements Level 1 (User) and Level 2 (Security) validations.
 */
export const maintenanceSchema = z.object({
    workshopId: z.string().min(1, 'Debes seleccionar un centro de servicio'),
    
    date: z.string().refine((val) => {
        const selectedDate = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    }, { message: 'La fecha no puede ser anterior a hoy' }),
    
    time: z.string().min(1, 'Debes seleccionar una hora'),
    
    serviceType: z.string().min(1, 'Selecciona un tipo de servicio'),
    
    phone: z.string()
        .min(10, 'El teléfono debe tener al menos 10 dígitos')
        .max(15, 'El teléfono es demasiado largo')
        .regex(/^[0-9+]+$/, 'Solo se permiten números y el signo +'),
    
    email: z.string()
        .email('Correo electrónico inválido')
        .min(5, 'Email demasiado corto')
        .max(100, 'Email demasiado largo'),
    
    notes: z.string()
        .max(500, 'La descripción no puede superar los 500 caracteres')
        .optional()
        .or(z.literal('')),
    
    // Level 3: Honey Pot (Bot trap)
    nickname: z.string().max(0, { message: 'Bot detected' }).optional(),
});

export type MaintenanceFormData = z.infer<typeof maintenanceSchema>;
