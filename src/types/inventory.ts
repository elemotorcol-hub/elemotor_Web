export type Status = 'Active' | 'Draft';
export type BodyType = 'suv' | 'sedan' | 'hatchback' | 'pickup' | 'van' | 'coupe';
export type ImageType = 'gallery' | 'hero' | 'interior' | 'exterior' | 'panoramic';
export type Model3DFormat = 'glb' | 'gltf';

export interface Brand {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
    country?: string;
    active: boolean;
}

export interface Color {
    id: string;
    name: string;
    hex_code: string;
    type: 'exterior' | 'interior';
    image_url?: string;
    swatch_url?: string;
}

export interface Spec {
    battery_kwh?: number;
    range_cltc_km?: number;
    range_wltp_km?: number;
    horsepower?: number;
    torque?: number;
    zero_to_100?: number;
    top_speed?: number;
    charge_time_30_80?: string;
    trunk_liters?: number;
    length_mm?: number;
    width_mm?: number;
    height_mm?: number;
    wheelbase_mm?: number;
    curb_weight_kg?: number;
    kwh_per_100km?: number;
    adas_level?: string;
    screen_size?: number;
    software_version?: number;
}

export interface TrimImage {
    id: string;
    url: string;
    alt_text?: string;
    type: ImageType;
    sort_order: number;
}

export interface TrimModel3D {
    id: string;
    file_url: string;
    file_size_mb?: number;
    format: Model3DFormat;
    draco_compressed?: boolean;
    lod_level?: 'low' | 'medium' | 'high';
}

export interface Trim {
    id: string;
    name: string;
    price: number;
    available_quantity: number;
    status: 'stock' | 'transit' | 'order';
    active: boolean;
    specs: Spec;
    colors: Color[];
    images: TrimImage[];
    model_3d?: TrimModel3D;
}

export interface VehicleModel {
    id: string;
    brand_id: string;
    name: string;
    slug: string;
    type: BodyType;
    year: number;
    description?: string;
    basePrice: number;
    featured: boolean;
    active: boolean;
    status: Status; // Derived or mapped from active
    thumbnail: string; // Used for UI currently
    trims: Trim[];
    brand?: {
        id: string;
        name: string;
    };
    _count?: {
        trims: number;
    }
}
