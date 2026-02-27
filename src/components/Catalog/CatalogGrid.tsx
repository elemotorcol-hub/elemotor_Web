'use client';

import * as React from 'react';
import { CatalogFilters } from './CatalogFilters';
import { ModelCard } from './ModelCard';
import { Pagination } from './Pagination';
import { vehiclesData, VehicleCategories } from '@/data/models';

const ITEMS_PER_PAGE = 6;
const CATEGORIES = ['Todos', ...VehicleCategories];

// Pre-calculate max values dynamically ONCE before the component mounts
const MAX_PRICE = Math.max(...vehiclesData.map(v => v.price));
const MAX_AUTONOMY = Math.max(...vehiclesData.map(v => v.range));

export function CatalogGrid() {
    const [selectedCategory, setSelectedCategory] = React.useState('Todos');
    const [priceRange, setPriceRange] = React.useState<[number, number]>([0, MAX_PRICE]);
    const [autonomyRange, setAutonomyRange] = React.useState<[number, number]>([0, MAX_AUTONOMY]);
    const [currentPage, setCurrentPage] = React.useState(1);

    // Reset pagination when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, priceRange, autonomyRange]);

    // Derived State: Filtered Vehicles
    const filteredVehicles = React.useMemo(() => {
        return vehiclesData.filter((vehicle) => {
            const matchesCategory = selectedCategory === 'Todos' || vehicle.category === selectedCategory;
            const matchesPrice = vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];
            const matchesAutonomy = vehicle.range >= autonomyRange[0] && vehicle.range <= autonomyRange[1];

            return matchesCategory && matchesPrice && matchesAutonomy;
        });
    }, [selectedCategory, priceRange, autonomyRange]);

    // Derived State: Pagination
    const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
    const paginatedVehicles = filteredVehicles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="container mx-auto px-6 max-w-7xl -mt-8 relative z-20">
            {/* Encapsulamiento del Estado Interactivo */}
            <CatalogFilters
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                autonomyRange={autonomyRange}
                onAutonomyChange={setAutonomyRange}
                maxPrice={MAX_PRICE}
                maxAutonomy={MAX_AUTONOMY}
            />

            {/* Grilla de Resultados (Re-renderiza localmente rápido sin afectar toda la página) */}
            {paginatedVehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedVehicles.map((vehicle, i) => (
                        <ModelCard
                            key={vehicle.id}
                            vehicle={vehicle}
                            // Only prioritize loading for the first 3 images (above the fold in desktop)
                            priority={i < 3 && currentPage === 1}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-3xl bg-white/5">
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">No se encontraron modelos</h3>
                    <p className="text-slate-400">Intenta ajustar los filtros de precio o autonomía para ver más resultados.</p>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
