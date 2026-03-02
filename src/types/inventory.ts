export type Status = 'Active' | 'Draft';

export interface Color {
    id: string;
    name: string;
    hex: string;
}

export interface Spec {
    range: number; // km
    topSpeed: number; // km/h
    acceleration: number; // sec (0-100 km/h)
    battery: number; // kWh
    motorPower: number; // kW
    torque: number; // Nm
    wheelbase: number; // mm
    cargoVolume: number; // L
}

export interface Trim {
    id: string;
    name: string;
    description: string;
    specs: Spec;
    availableColors: Color[];
    gallery: string[];
}

export interface VehicleModel {
    id: string;
    name: string;
    brand: string;
    basePrice: number;
    status: Status;
    description: string;
    thumbnail: string;
    trims: Trim[];
}
