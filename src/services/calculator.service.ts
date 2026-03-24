const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ElectricityRate {
    id: number;
    city: string;
    pricePerKwhCop: string;
    source: string | null;
    updatedAt: string;
}

export interface FuelPrice {
    id: number;
    city: string;
    fuelType: 'regular' | 'premium' | 'diesel';
    pricePerGallonCop: string;
    source: string | null;
    updatedAt: string;
}

export async function fetchElectricityRates(): Promise<ElectricityRate[]> {
    const response = await fetch(`${API_BASE_URL}/api/calculator-settings/electricity`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 3600 }, // Cache for 1 hour
    } as RequestInit);

    if (!response.ok) {
        throw new Error('Failed to fetch electricity rates');
    }

    return response.json();
}

export async function fetchFuelPrices(): Promise<FuelPrice[]> {
    const response = await fetch(`${API_BASE_URL}/api/calculator-settings/fuel`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 3600 }, // Cache for 1 hour
    } as RequestInit);

    if (!response.ok) {
        throw new Error('Failed to fetch fuel prices');
    }

    return response.json();
}
