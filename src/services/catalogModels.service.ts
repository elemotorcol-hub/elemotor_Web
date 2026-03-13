/**
 * catalogModels.service.ts
 *
 * Public-facing service for the vehicle catalog (/modelos).
 * Uses native fetch directly (no auth tokens needed — the endpoint is @Public() on the backend).
 * This keeps the catalog renderable on both server and client without session dependencies.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// ─── Types that match the enhanced MODEL_LIST_SELECT response ──────────────

export type CatalogTrimStatus = 'stock' | 'transit' | 'order';

export interface CatalogTrimSpec {
    batteryKwh: string | null;   // Decimal comes as string from Prisma/JSON
    rangeCltcKm: number | null;
    rangeWltpKm: number | null;
    horsepower: number | null;
    zeroTo100: string | null;    // Decimal comes as string from Prisma/JSON
    topSpeed: number | null;
}

export interface CatalogTrimImage {
    url: string;
    altText: string | null;
    type: string;
}

export interface CatalogTrim {
    id: number;
    name: string;
    price: string | null;        // Decimal comes as string from Prisma/JSON
    status: CatalogTrimStatus;
    spec: CatalogTrimSpec | null;
    images: CatalogTrimImage[];
}

export interface CatalogModel {
    id: number;
    name: string;
    slug: string;
    type: 'SUV' | 'Sedan' | 'Hatchback' | 'Pickup';
    year: number;
    basePrice: string | null;   // Decimal comes as string from Prisma/JSON
    featured: boolean;
    active: boolean;
    brand: {
        id: number;
        name: string;
        slug: string;
        logoUrl: string | null;
    };
    trims: CatalogTrim[];
    _count: { trims: number };
}

export interface CatalogApiResponse {
    data: CatalogModel[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Fetches ALL active models for the public catalog in a single API call.
 * Returns up to 100 models (sufficient for any realistic catalog).
 */
export async function fetchActiveCatalogModels(): Promise<CatalogModel[]> {
    const url = `${API_BASE_URL}/api/models?active=true&limit=100&page=1`;

    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Allow Next.js to revalidate this data every 60 seconds (ISR-friendly)
        next: { revalidate: 60 },
    } as RequestInit);

    if (!response.ok) {
        throw new Error(`Failed to fetch catalog models: ${response.status} ${response.statusText}`);
    }

    const json: CatalogApiResponse = await response.json();
    return json.data;
}

// ─── Detail page types (GET /api/models/slug/:slug response) ─────────────────

export interface DetailSpec {
    id: number;
    trimId: number;
    batteryKwh: string | null;    // Decimal serialised as string by Prisma
    rangeCltcKm: number | null;
    rangeWltpKm: number | null;
    horsepower: number | null;
    torque: number | null;
    zeroTo100: string | null;     // Decimal serialised as string by Prisma
    topSpeed: number | null;
    chargeTime3080: string | null;
    trunkLiters: number | null;
    lengthMm: number | null;
    widthMm: number | null;
    heightMm: number | null;
    wheelbaseMm: number | null;
    curbWeightKg: number | null;
    kwhPer100km: string | null;   // Decimal serialised as string by Prisma
    adasLevel: number | null;
    screenSize: number | null;
    softwareVersion: number | null;
}

export interface DetailColor {
    id: number;
    name: string;
    hexCode: string;
    type: 'exterior' | 'interior';
    imageUrl: string | null;
    swatchUrl: string | null;
}

export interface DetailImage {
    id: number;
    url: string;
    altText: string | null;
    type: string;
    sortOrder: number;
}

export interface DetailTrim {
    id: number;
    name: string;
    price: string | null;         // Decimal serialised as string by Prisma
    availableQuantity: number;
    status: 'stock' | 'transit' | 'order';
    active: boolean;
    spec: DetailSpec | null;
    colors: DetailColor[];
    images: DetailImage[];
}

export interface DetailBrand {
    id: number;
    name: string;
    slug: string;
    logoUrl: string | null;
    country: string | null;
}

export interface DetailModel {
    id: number;
    name: string;
    slug: string;
    type: 'SUV' | 'Sedan' | 'Hatchback' | 'Pickup';
    year: number;
    description: string | null;
    basePrice: string | null;     // Decimal serialised as string by Prisma
    featured: boolean;
    active: boolean;
    brand: DetailBrand;
    trims: DetailTrim[];
}

// ─── Fetch detail by slug ─────────────────────────────────────────────────────

/**
 * Fetches the full model detail (brand + trims + spec + colors + images)
 * for the public vehicle detail page at /modelos/[slug].
 */
export async function fetchModelBySlug(slug: string): Promise<DetailModel> {
    const url = `${API_BASE_URL}/api/models/slug/${encodeURIComponent(slug)}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 60 },
    } as RequestInit);

    if (response.status === 404) {
        throw new Error(`MODEL_NOT_FOUND:${slug}`);
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch model "${slug}": ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<DetailModel>;
}
