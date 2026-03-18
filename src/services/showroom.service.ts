/**
 * showroom.service.ts
 *
 * Public-facing data service for the Showroom 3D page.
 * All endpoints are @Public() on the backend — no auth tokens required.
 * Uses native fetch (compatible with both server and client).
 */

import type { ShowroomModel, ShowroomModel3d } from '@/types/showroom';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// ─── Response type from GET /api/models ──────────────────────────────────────

interface ModelsApiResponse {
    data: ShowroomModel[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// ─── Fetch active models list ─────────────────────────────────────────────────

/**
 * Fetches all active models from the public catalog API.
 * Returns models with their first trim (for initial selection).
 */
export async function fetchShowroomModels(options?: { signal?: AbortSignal }): Promise<ShowroomModel[]> {
    const url = `${API_BASE}/api/models?active=true&limit=100&page=1`;
    const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // No cache in the browser — we want fresh data on each showroom visit
        cache: 'no-store',
        signal: options?.signal,
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch showroom models: ${res.status} ${res.statusText}`);
    }

    const json: ModelsApiResponse = await res.json();
    return json.data;
}

// ─── Fetch full model detail by slug ─────────────────────────────────────────

/**
 * Fetches the complete model detail: brand + all active trims with spec + colors + images.
 * Used when the user selects a model in the showroom selector.
 */
export async function fetchShowroomModelBySlug(slug: string, options?: { signal?: AbortSignal }): Promise<ShowroomModel> {
    const url = `${API_BASE}/api/models/slug/${encodeURIComponent(slug)}`;
    const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        signal: options?.signal,
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch model "${slug}": ${res.status} ${res.statusText}`);
    }

    return res.json() as Promise<ShowroomModel>;
}

// ─── Fetch 3D model by trimId ─────────────────────────────────────────────────

/**
 * Fetches the 3D model record for a given trim.
 * Returns null if the trim has no 3D model uploaded.
 */
export async function fetchModel3dByTrimId(trimId: number, options?: { signal?: AbortSignal }): Promise<ShowroomModel3d | null> {
    const url = `${API_BASE}/api/models-3d/by-trim/${trimId}`;
    const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        signal: options?.signal,
    });

    if (!res.ok) {
        // 404 means no 3D model for this trim — not an error
        if (res.status === 404) return null;
        throw new Error(`Failed to fetch 3D model for trim ${trimId}: ${res.status}`);
    }

    const data = await res.json();
    // The endpoint returns null directly if not found (per service implementation)
    if (!data) return null;

    return data as ShowroomModel3d;
}
