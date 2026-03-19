import { getSession } from './auth.client';
import { refreshSessionAction, logoutAction } from '@/actions/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface CustomRequestInit extends RequestInit {
    _retry?: boolean;
}

// Global promise para encolar peticiones mientras se hace el refresh
let refreshPromise: Promise<any> | null = null;

export async function fetchApi<T = any>(endpoint: string, options: CustomRequestInit = {}): Promise<T> {
    const session = await getSession();
    
    const headers: Record<string, string> = {};
    
    // Si el cuerpo NO es FormData, seteamos application/json por defecto
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (session?.accessToken) {
        headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    const targetUrl = `${API_BASE_URL}${endpoint}`;
    console.log(`[fetchApi] Executing request to: ${targetUrl}`, config);

    let response;
    try {
        response = await fetch(targetUrl, config);
    } catch (e: unknown) {
        console.error(`[fetchApi] Network Exception targeting ${targetUrl}:`, e);
        throw e;
    }

    // Interceptor: Si es 401, no es un reintento, y no es el endpoint de refresh en sí ni logout
    if (response.status === 401 && !options._retry && !['/api/auth/login', '/api/auth/refresh', '/api/auth/logout'].includes(endpoint)) {
        console.log(`[fetchApi] 401 Unauthorized for ${endpoint}. Intentando refrescar token...`);
        
        if (!refreshPromise) {
            refreshPromise = refreshSessionAction().finally(() => {
                refreshPromise = null; // Resetear la promesa
            });
        }
        
        const refreshResult = await refreshPromise;

        if (refreshResult?.success) {
            console.log(`[fetchApi] Token refrescado con éxito. Reintentando petición a ${endpoint}`);
            options._retry = true;
            return fetchApi(endpoint, options);
        } else {
            console.error(`[fetchApi] Error refrescando el token. Redirigiendo a login.`, refreshResult?.error);
            await logoutAction();
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
            throw new Error('Sesión expirada. Por favor, vuelva a iniciar sesión.');
        }
    }

    // Para endpoints como logout que podrían retornar 204 No Content
    if (response.status === 204) {
        return null as any;
    }

    // Intentar parsear a JSON si tiene content-type y no fallar si está vacío
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        try {
            data = await response.json();
        } catch {
            data = null;
        }
    } else {
        try {
            data = await response.text();
        } catch {
            data = null;
        }
    }

    if (!response.ok) {
        // Log completo para debug — HttpExceptionFilter responde con {error: ...} no {message: ...}
        console.error(`[fetchApi] Error response body from ${endpoint}:`, data);
        const rawMessage = data?.message || data?.error || response.statusText;
        let errorMessage = typeof rawMessage === 'string' ? rawMessage : JSON.stringify(rawMessage);
        if (Array.isArray(rawMessage)) errorMessage = rawMessage.join(', ');
        const error: any = new Error(errorMessage || `API error: ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}
