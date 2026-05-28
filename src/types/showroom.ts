/**
 * showroom.ts
 *
 * TypeScript types for the Showroom 3D page.
 * These types match the real API responses from the backend.
 */

// ─── Color ────────────────────────────────────────────────────────────────────

export interface ShowroomColor {
    id: number;
    name: string;
    hexCode: string;
    type: 'exterior' | 'interior';
    imageUrl: string | null;
    swatchUrl: string | null;
}

// ─── Spec ─────────────────────────────────────────────────────────────────────

export interface ShowroomSpec {
    id: number;
    trimId: number;
    batteryKwh: string | null;
    rangeCltcKm: number | null;
    rangeWltpKm: number | null;
    horsepower: number | null;
    torque: number | null;
    zeroTo100: string | null;
    topSpeed: number | null;
    chargeTime3080: string | null;
    trunkLiters: number | null;
    lengthMm: number | null;
    widthMm: number | null;
    heightMm: number | null;
    wheelbaseMm: number | null;
    curbWeightKg: number | null;
    kwhPer100km: string | null;
    adasLevel: number | null;
    screenSize: number | null;
}

// ─── Model 3D ─────────────────────────────────────────────────────────────────

export interface ShowroomModel3d {
    id: number;
    trimId: number;
    fileUrl: string;
    publicId: string;
}

// ─── Trim ─────────────────────────────────────────────────────────────────────

export interface ShowroomTrim {
    id: number;
    name: string;
    price: string | null;
    availableQuantity: number;
    status: 'stock' | 'transit' | 'order';
    active: boolean;
    spec: ShowroomSpec | null;
    colors: ShowroomColor[];
    images: ShowroomTrimImage[];
    models3d?: { id: number } | null;
}

export interface ShowroomTrimImage {
    id: number;
    url: string;
    altText: string | null;
    type: string;
    sortOrder: number;
}

// ─── Model ────────────────────────────────────────────────────────────────────

export interface ShowroomBrand {
    id: number;
    name: string;
    slug: string;
    logoUrl: string | null;
}

export interface ShowroomModel {
    id: number;
    name: string;
    slug: string;
    type: 'SUV' | 'Sedan' | 'Hatchback' | 'Pickup';
    year: number;
    description: string | null;
    basePrice: string | null;
    featured: boolean;
    active: boolean;
    brand: ShowroomBrand;
    trims: ShowroomTrim[];
}

// ─── Showroom State ───────────────────────────────────────────────────────────

export type ViewMode = 'exterior' | 'interior';

export interface ShowroomState {
    models: ShowroomModel[];
    selectedModel: ShowroomModel | null;
    selectedTrim: ShowroomTrim | null;
    selectedExtColor: ShowroomColor | null;
    selectedIntColor: ShowroomColor | null;
    viewMode: ViewMode;
    model3dUrl: string | null;
    isLoadingModels: boolean;
    isLoading3d: boolean;
    error: string | null;
}
