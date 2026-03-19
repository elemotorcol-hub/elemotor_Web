import { fetchApi } from '../lib/api';

export interface ElectricityRate {
    id: number;
    city: string;
    pricePerKwhCop: number;
    source?: string;
}

export interface FuelPrice {
    id: number;
    city: string;
    fuelType: 'regular' | 'premium';
    pricePerGallonCop: number;
    source?: string;
}

export const settingsService = {
    // ─── Electricity Rates ───────────────────────────────────────────────────
    getElectricityRates: async (): Promise<ElectricityRate[]> => {
        return fetchApi('/api/calculator-settings/electricity');
    },

    createElectricityRate: async (data: Omit<ElectricityRate, 'id'>): Promise<ElectricityRate> => {
        return fetchApi('/api/calculator-settings/electricity', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateElectricityRate: async (id: number, data: Omit<ElectricityRate, 'id'>): Promise<ElectricityRate> => {
        return fetchApi(`/api/calculator-settings/electricity/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteElectricityRate: async (id: number): Promise<void> => {
        return fetchApi(`/api/calculator-settings/electricity/${id}`, {
            method: 'DELETE',
        });
    },

    // ─── Fuel Prices ─────────────────────────────────────────────────────────
    getFuelPrices: async (): Promise<FuelPrice[]> => {
        return fetchApi('/api/calculator-settings/fuel');
    },

    createFuelPrice: async (data: Omit<FuelPrice, 'id'>): Promise<FuelPrice> => {
        return fetchApi('/api/calculator-settings/fuel', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateFuelPrice: async (id: number, data: Omit<FuelPrice, 'id'>): Promise<FuelPrice> => {
        return fetchApi(`/api/calculator-settings/fuel/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteFuelPrice: async (id: number): Promise<void> => {
        return fetchApi(`/api/calculator-settings/fuel/${id}`, {
            method: 'DELETE',
        });
    },
};
