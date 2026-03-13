/**
 * useCatalogModels.ts
 *
 * React hook that fetches active vehicle models from the API and adapts them
 * to the `Vehicle` shape expected by ModelCard and CatalogGrid.
 *
 * Adapter mapping table:
 *   id          ← model.slug (URL-friendly, used in /modelos/[slug])
 *   brand       ← model.brand.name
 *   model       ← model.name
 *   category    ← model.type (SUV → SUV, Sedan → Sedán, Hatchback → Hatchback, Pickup → Pick-Up)
 *   price       ← first trim price (fallback: model.basePrice, then 0)
 *   battery     ← first trim spec.batteryKwh (Decimal string → number)
 *   range       ← first trim spec.rangeCltcKm or rangeWltpKm
 *   acceleration← first trim spec.zeroTo100 (Decimal string → number)
 *   image       ← first trim first image url, or '/placeholder-car.svg'
 *   stockStatus ← first trim status: stock → EN STOCK, transit → PREVENTA, order → POR PEDIDO
 */

'use client';

import * as React from 'react';
import { fetchActiveCatalogModels, CatalogModel } from '@/services/catalogModels.service';
import { Vehicle, CategoryTuple, VehicleCategories } from '@/data/models';

// ─── Adapter ─────────────────────────────────────────────────────────────────

const MODEL_TYPE_MAP: Record<CatalogModel['type'], CategoryTuple> = {
    SUV: 'SUV',
    Sedan: 'Sedán',
    Hatchback: 'Hatchback',
    Pickup: 'Pick-Up',
};

const TRIM_STATUS_MAP: Record<string, Vehicle['stockStatus']> = {
    stock: 'EN STOCK',
    transit: 'PREVENTA',
    order: 'POR PEDIDO',
};

function adaptModelToVehicle(model: CatalogModel): Vehicle {
    const firstTrim = model.trims[0] ?? null;
    const firstImage = firstTrim?.images[0] ?? null;
    const spec = firstTrim?.spec ?? null;

    // Prisma returns Decimal fields as strings via JSON serialization
    const parseDecimal = (val: string | null | undefined): number =>
        val != null ? parseFloat(val) : 0;

    const price = firstTrim?.price != null
        ? parseDecimal(firstTrim.price)
        : model.basePrice != null
            ? parseDecimal(model.basePrice)
            : 0;

    const battery = parseDecimal(spec?.batteryKwh);
    const range = spec?.rangeCltcKm ?? spec?.rangeWltpKm ?? 0;
    const acceleration = parseDecimal(spec?.zeroTo100);
    const topSpeed = spec?.topSpeed ?? 0;

    return {
        id: model.slug,
        brand: model.brand.name.toUpperCase(),
        model: model.name.toUpperCase(),
        category: MODEL_TYPE_MAP[model.type] ?? 'SUV',
        price,
        battery,
        range,
        acceleration,
        topSpeed,
        power: spec?.horsepower ?? 0,
        image: firstImage?.url ?? '/placeholder-car.svg',
        stockStatus: TRIM_STATUS_MAP[firstTrim?.status ?? 'stock'] ?? 'EN STOCK',
    };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseCatalogModelsResult {
    vehicles: Vehicle[];
    maxPrice: number;
    maxAutonomy: number;
    availableCategories: string[];
    isLoading: boolean;
    isError: boolean;
}

export function useCatalogModels(): UseCatalogModelsResult {
    const [status, setStatus] = React.useState<FetchStatus>('idle');
    const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);

    React.useEffect(() => {
        let cancelled = false;

        async function load() {
            setStatus('loading');
            try {
                const models = await fetchActiveCatalogModels();
                if (cancelled) return;

                const adapted = models.map(adaptModelToVehicle);
                setVehicles(adapted);
                setStatus('success');
            } catch (err) {
                if (cancelled) return;
                console.error('[useCatalogModels] Failed to fetch catalog models:', err);
                setStatus('error');
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

    const maxPrice = React.useMemo(
        () => (vehicles.length > 0 ? Math.max(...vehicles.map((v) => v.price)) : 100000),
        [vehicles],
    );

    const maxAutonomy = React.useMemo(
        () => (vehicles.length > 0 ? Math.max(...vehicles.map((v) => v.range)) : 700),
        [vehicles],
    );

    // Compute categories that actually appear in the live data (preserving static order)
    const availableCategories = React.useMemo(() => {
        const present = new Set(vehicles.map((v) => v.category));
        return ['Todos', ...VehicleCategories.filter((c) => present.has(c))];
    }, [vehicles]);

    return {
        vehicles,
        maxPrice,
        maxAutonomy,
        availableCategories,
        isLoading: status === 'idle' || status === 'loading',
        isError: status === 'error',
    };
}
