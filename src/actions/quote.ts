'use server';

export async function submitQuoteAction(formData: FormData) {
    try {
        // En un entorno de producción real:
        // 1. Extraeríamos los datos (const rawData = Object.fromEntries(formData))
        // 2. Validaríamos de nuevo en el servidor con Zod
        // 3. Guardaríamos en nuestra Base de Datos (ej. Prisma: prisma.lead.create({...}))
        // 4. Se dispararía un webhook a un CRM (Salesforce / HubSpot)
        // 5. Enviaríamos un email transaccional (Resend/SendGrid) al cliente.

        // Simulamos latencia de red contra una DB
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Log seguro en entorno backend, nunca expuesto en consola del cliente
        console.log('Lead de Cotización procesado en servidor:', Object.fromEntries(formData));

        return { success: true };
    } catch (error) {
        console.error('Error procesando cotización:', error);
        return { success: false, error: 'Hubo un error contactando el sistema. Intenta más tarde.' };
    }
}
