export interface VehicleSpecs {
    range: string;
    battery: string;
    power: string;
    zeroToHundred: string;
    fastCharge: string;
    bodyType: string;
    trunk: string;
    dimensions: string;
    equipment: string;
}

export interface VehicleModel {
    id: string;
    name: string;
    type: string;
    price: string;
    specs: VehicleSpecs;
    image: string;
    badge?: string;
}
