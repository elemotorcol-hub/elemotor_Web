'use client';

import * as React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

const SEGMENTS = [
    { value: 'all',        label: 'Todos' },
    { value: 'particular', label: 'Particulares' },
    { value: 'corporate',  label: 'Empresariales' },
] as const;

type SegmentValue = 'all' | 'particular' | 'corporate';

interface CatalogFiltersProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    autonomyRange: [number, number];
    onAutonomyChange: (range: [number, number]) => void;
    maxAutonomy: number;
    selectedSegment: SegmentValue;
    onSegmentChange: (segment: SegmentValue) => void;
}

export function CatalogFilters({
    categories,
    selectedCategory,
    onSelectCategory,
    autonomyRange,
    onAutonomyChange,
    maxAutonomy,
    selectedSegment,
    onSegmentChange,
}: CatalogFiltersProps) {
    return (
        <div className="bg-[#0A0F1C] border border-white/5 rounded-3xl px-6 py-5 mb-12 relative z-20">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">

                {/* Pills: segmento + divisor + tipo — todo en una fila */}
                <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                    {/* Segmento */}
                    {SEGMENTS.map((seg) => (
                        <button
                            key={seg.value}
                            onClick={() => onSegmentChange(seg.value)}
                            className={cn(
                                "px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                                selectedSegment === seg.value
                                    ? "bg-[#00D4AA] text-slate-900 shadow-[0_0_15px_rgba(0,212,170,0.3)]"
                                    : "bg-transparent border border-white/10 text-slate-400 hover:text-white hover:border-white/30"
                            )}
                        >
                            {seg.label}
                        </button>
                    ))}

                    {/* Divisor vertical */}
                    {categories.length > 1 && (
                        <div className="w-px h-5 bg-white/15 mx-1 hidden sm:block" />
                    )}

                    {/* Tipo */}
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => onSelectCategory(cat)}
                            className={cn(
                                "px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                                selectedCategory === cat
                                    ? "bg-[#00D4AA]/10 border border-[#00D4AA] text-[#00D4AA] shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                                    : "bg-transparent border border-white/10 text-slate-400 hover:text-white hover:border-white/30"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Slider — derecha */}
                <div className="w-full lg:w-[260px] flex-shrink-0 space-y-2.5">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">Autonomía Total</span>
                        <span className="text-[#00D4AA]">{autonomyRange[0]} - {autonomyRange[1]} KM</span>
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
                        <Slider.Thumb className="block w-4 h-4 bg-[#00D4AA] shadow-[0_0_10px_rgba(34,211,238,0.5)] rounded-full hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4AA] transition-transform cursor-grab active:cursor-grabbing" aria-label="Min" />
                        <Slider.Thumb className="block w-4 h-4 bg-[#00D4AA] shadow-[0_0_10px_rgba(34,211,238,0.5)] rounded-full hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4AA] transition-transform cursor-grab active:cursor-grabbing" aria-label="Max" />
                    </Slider.Root>
                </div>
            </div>
        </div>
    );
}
