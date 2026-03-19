/**
 * Sanitization Utilities
 * Prevents Level 2 Security threats like XSS by cleaning user input.
 */

/**
 * Strips HTML tags from a string to prevent XSS.
 */
export function sanitizeHTML(str: string): string {
    if (!str) return '';
    return str.replace(/<[^>]*>?/gm, '');
}

/**
 * Sanitizes all string properties in an object.
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
    const sanitized = { ...obj };
    for (const key in sanitized) {
        if (typeof sanitized[key] === 'string') {
            sanitized[key] = sanitizeHTML(sanitized[key]) as any;
        } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null && !Array.isArray(sanitized[key])) {
            sanitized[key] = sanitizeObject(sanitized[key]);
        }
    }
    return sanitized;
}
export const formatCurrency = (value: string) => {
    // 1. Prevención: Si es null o undefined, devolvemos string vacío
    // 2. Limpieza: Quitamos todo lo que no sea número
    const number = (value || "").toString().replace(/\D/g, "");

    // 3. Retorno formateado (con comas para miles)
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Función extra para cuando necesites guardar el dato en la DB
export const deformatCurrency = (value: string) => {
    return parseInt((value || "").toString().replace(/,/g, "")) || 0;
};