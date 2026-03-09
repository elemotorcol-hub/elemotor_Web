import { getSession } from './auth.client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
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
        const errorMessage = data?.message || typeof data === 'string' ? data : response.statusText;
        throw new Error(errorMessage || `API error: ${response.status}`);
    }

    return data;
}
