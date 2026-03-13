import { getSession } from './auth.client';
import { refreshSessionAction, logoutAction } from '@/actions/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface CustomRequestInit extends RequestInit {
    _retry?: boolean;
}

// Global promise para encolar peticiones mientras se hace el refresh
let refreshPromise: Promise<any> | null = null;

export async function fetchApi(endpoint: string, options: CustomRequestInit = {}) {
    const session = await getSession();
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

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
    } catch (e: any) {
        console.error(`[fetchApi] Network Exception targeting ${targetUrl}:`, e);
        throw e;
    }

    // Interceptor: Si es 401, no es un reintento, y no es el endpoint de refresh en sí ni logout
    if (response.status === 401 && !options._retry && !['/api/auth/refresh', '/api/auth/logout'].includes(endpoint)) {
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
        return null;
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
        let errorMessage = typeof data === 'string' ? data : (data?.message || response.statusText);
        if (Array.isArray(errorMessage)) errorMessage = errorMessage.join(', ');
        throw new Error(errorMessage || `API error: ${response.status}`);
    }

    return data;
}
