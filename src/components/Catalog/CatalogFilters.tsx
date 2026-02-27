'use client';

import * as React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface CatalogFiltersProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    priceRange: [number, number];
    onPriceChange: (range: [number, number]) => void;
    autonomyRange: [number, number];
    onAutonomyChange: (range: [number, number]) => void;
    maxPrice: number;
    maxAutonomy: number;
}

export function CatalogFilters({
    categories,
    selectedCategory,
    onSelectCategory,
    priceRange,
    onPriceChange,
    autonomyRange,
    onAutonomyChange,
    maxPrice,
    maxAutonomy
}: CatalogFiltersProps) {
    return (
        <div className="bg-[#0A0F1C] border border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start lg:items-center justify-between mb-12 relative z-20">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onSelectCategory(cat)}
                        className={cn(
                            "px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                            selectedCategory === cat
                                ? "bg-[#00D4AA]/10 border border-[#00D4AA] text-[#00D4AA] shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                                : "bg-transparent border border-white/10 text-slate-400 hover:text-white hover:border-white/30"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Sliders Container */}
            <div className="flex flex-col sm:flex-row gap-10 w-full lg:w-[600px] flex-shrink-0">
                {/* Price Slider */}
                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">Precio Total</span>
                        <span className="text-[#00D4AA]">
                            ${(priceRange[0] / 1000).toFixed(0)}K - ${(priceRange[1] / 1000).toFixed(0)}K
                        </span>
                    </div>
                    <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-5"
                        defaultValue={[0, maxPrice]}
                        value={priceRange}
                        max={maxPrice}
                        step={1000}
                        onValueChange={(val) => onPriceChange(val as [number, number])}
                    >
                        <Slider.Track className="bg-slate-800 relative grow rounded-full h-1.5 overflow-hidden">
                            <Slider.Range className="absolute bg-[#00D4AA] rounded-full h-full" />
                        </Slider.Track>
                        <Slider.Thumb className="block w-4 h-4 bg-[#00D4AA] shadow-[0_0_10px_rgba(34,211,238,0.5)] rounded-full hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4AA] transition-transform cursor-grab active:cursor-grabbing" aria-label="Min Price" />
                        <Slider.Thumb className="block w-4 h-4 bg-[#00D4AA] shadow-[0_0_10px_rgba(34,211,238,0.5)] rounded-full hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4AA] transition-transform cursor-grab active:cursor-grabbing" aria-label="Max Price" />
                    </Slider.Root>
                </div>

                {/* Autonomy Slider */}
                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">Autonomía Total</span>
                        <span className="text-[#00D4AA]">
                            {autonomyRange[0]} - {autonomyRange[1]} KM
                        </span>
                    </div>
                    <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-5"
                        defaultValue={[0, maxAutonomy]}
                        value={autonomyRange}
                        max={maxAutonomy}
                        step={10}
                        onValueChange={(val) => onAutonomyChange(val as [number, number])}
                    >
                        <Slider.Track className="bg-slate-800 relative grow rounded-full h-1.5 overflow-hidden">
                            <Slider.Range className="absolute bg-[#00D4AA] rounded-full h-full" />
                        </Slider.Track>
                        <Slider.Thumb className="block w-4 h-4 bg-[#00D4AA] shadow-[0_0_10px_rgba(34,211,238,0.5)] rounded-full hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4AA] transition-transform cursor-grab active:cursor-grabbing" aria-label="Min Range" />
                        <Slider.Thumb className="block w-4 h-4 bg-[#00D4AA] shadow-[0_0_10px_rgba(34,211,238,0.5)] rounded-full hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4AA] transition-transform cursor-grab active:cursor-grabbing" aria-label="Max Range" />
                    </Slider.Root>
                </div>
            </div>
        </div>
    );
}
