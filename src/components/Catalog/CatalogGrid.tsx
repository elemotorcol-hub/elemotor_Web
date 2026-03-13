'use client';

import * as React from 'react';
import { CatalogFilters } from './CatalogFilters';
import { ModelCard } from './ModelCard';
import { Pagination } from './Pagination';
import { useCatalogModels } from '@/hooks/useCatalogModels';

const ITEMS_PER_PAGE = 6;

// ─── Skeleton Card ────────────────────────────────────────────────────────────
// Matches the visual dimensions of ModelCard while content loads
function ModelCardSkeleton() {
    return (
        <div className="bg-[#0A0F1C] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full animate-pulse">
            {/* Image area */}
            <div className="h-64 w-full bg-slate-900/80" />
            {/* Info area */}
            <div className="p-6 md:p-8 flex flex-col grow -mt-6">
                {/* Brand + model name */}
                <div className="mb-8 space-y-2">
                    <div className="h-2.5 w-16 rounded-full bg-slate-800" />
                    <div className="h-5 w-40 rounded-full bg-slate-800" />
                </div>
                {/* Specs row */}
                <div className="flex justify-between gap-3 mb-8">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="flex-1 bg-slate-900/40 border border-white/5 rounded-xl p-3 h-16" />
                    ))}
                </div>
                {/* Price + buttons */}
                <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="h-3 w-20 rounded-full bg-slate-800" />
                        <div className="h-7 w-28 rounded-full bg-slate-800" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-12 rounded-lg bg-slate-800" />
                        <div className="h-12 rounded-lg bg-slate-800" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── CatalogGrid ──────────────────────────────────────────────────────────────

export function CatalogGrid() {
    const { vehicles, maxPrice, maxAutonomy, availableCategories, isLoading, isError } =
        useCatalogModels();

    const [selectedCategory, setSelectedCategory] = React.useState('Todos');
    const [priceRange, setPriceRange] = React.useState<[number, number]>([0, maxPrice]);
    const [autonomyRange, setAutonomyRange] = React.useState<[number, number]>([0, maxAutonomy]);
    const [currentPage, setCurrentPage] = React.useState(1);

    // Sync slider upper bounds when data loads
    React.useEffect(() => {
        setPriceRange([0, maxPrice]);
    }, [maxPrice]);

    React.useEffect(() => {
        setAutonomyRange([0, maxAutonomy]);
    }, [maxAutonomy]);

    // Reset pagination when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, priceRange, autonomyRange]);

    // Derived State: Filtered Vehicles
    const filteredVehicles = React.useMemo(() => {
        return vehicles.filter((vehicle) => {
            const matchesCategory =
                selectedCategory === 'Todos' || vehicle.category === selectedCategory;
            const matchesPrice =
                vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];
            const matchesAutonomy =
                vehicle.range >= autonomyRange[0] && vehicle.range <= autonomyRange[1];
            return matchesCategory && matchesPrice && matchesAutonomy;
        });
    }, [vehicles, selectedCategory, priceRange, autonomyRange]);

    // Derived State: Pagination
    const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
    const paginatedVehicles = filteredVehicles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    return (
        <div className="container mx-auto px-6 max-w-7xl -mt-8 relative z-20">
            {/* Filters — always rendered so the UI doesn't jump */}
            <CatalogFilters
                categories={availableCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                autonomyRange={autonomyRange}
                onAutonomyChange={setAutonomyRange}
                maxPrice={maxPrice}
                maxAutonomy={maxAutonomy}
            />

            {/* Loading skeleton */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                        <ModelCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Error state */}
            {isError && !isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-red-500/20 rounded-3xl bg-red-500/5">
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
                        No se pudo cargar el catálogo
                    </h3>
                    <p className="text-slate-400">
                        Estamos teniendo problemas de conexión. Por favor, intenta recargar la página.
                    </p>
                </div>
            )}

            {/* Results grid */}
            {!isLoading && !isError && (
                <>
                    {paginatedVehicles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedVehicles.map((vehicle, i) => (
                                <ModelCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    // Only prioritize loading the first 3 images (above the fold on desktop)
                                    priority={i < 3 && currentPage === 1}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-3xl bg-white/5">
                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
                                No se encontraron modelos
                            </h3>
                            <p className="text-slate-400">
                                Intenta ajustar los filtros de precio o autonomía para ver más resultados.
                            </p>
                        </div>
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
}
