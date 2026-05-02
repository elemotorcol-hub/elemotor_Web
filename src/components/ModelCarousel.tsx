'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import Image from 'next/image';
import Link from 'next/link';
import { modelService } from '@/services/model.service';
import type { VehicleModel } from '@/types/inventory';

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatSpec(value: number | undefined, unit: string) {
    return value ? `${value} ${unit}` : '—';
}

function getCardImage(model: VehicleModel): string {
    const heroImg = model.trims?.[0]?.images?.find((i) => i.type === 'hero')?.url;
    const firstImg = model.trims?.[0]?.images?.[0]?.url;
    return heroImg ?? firstImg ?? '/placeholder-car.png';
}

function getTypeLabel(type: string) {
    const map: Record<string, string> = {
        suv: 'SUV', sedan: 'Sedán', hatchback: 'Hatchback',
        pickup: 'Pickup', van: 'Van', coupe: 'Coupé',
    };
    return map[type] ?? type.toUpperCase();
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
    return (
        <div className="h-full flex flex-col p-6 bg-slate-900/40 border border-white/5 rounded-2xl animate-pulse">
            <div className="aspect-[16/10] rounded-2xl bg-slate-800 mb-6" />
            <div className="h-5 w-3/4 bg-slate-700 rounded mb-4" />
            <div className="grid grid-cols-3 gap-2 py-6 border-y border-white/5 mb-6">
                {[0, 1, 2].map((i) => <div key={i} className="h-8 bg-slate-700 rounded" />)}
            </div>
            <div className="h-7 w-1/2 bg-slate-700 rounded mt-auto" />
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ModelCarousel() {
    const [models, setModels] = React.useState<VehicleModel[]>([]);
    const [loading, setLoading] = React.useState(true);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        loop: true,
        skipSnaps: false,
        dragFree: false,
    });

    const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    React.useEffect(() => {
        modelService.getModels({ featured: true, active: true, limit: 10 })
            .then((res) => setModels(res.data ?? []))
            .catch(() => setModels([]))
            .finally(() => setLoading(false));
    }, []);

    const items: VehicleModel[] = models;

    return (
        <section id="modelos" className="py-24 bg-slate-900 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-slate-800/20 border border-white/5 rounded-[40px] p-8 md:p-12 lg:p-16 shadow-2xl backdrop-blur-sm">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
                            <div>
                                <span className="text-[#00D4AA] font-bold tracking-widest uppercase text-sm mb-2 block animate-pulse">
                                    Exclusividad
                                </span>
                                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                    MODELOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">DESTACADOS</span>
                                </h2>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={scrollPrev} className="p-4 rounded-full border border-white/10 text-white hover:bg-[#00D4AA] hover:text-slate-900 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-[#00D4AA]/20" aria-label="Anterior">
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button onClick={scrollNext} className="p-4 rounded-full border border-white/10 text-white hover:bg-[#00D4AA] hover:text-slate-900 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-[#00D4AA]/20" aria-label="Siguiente">
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Carousel */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[0, 1, 2].map((i) => <CardSkeleton key={i} />)}
                            </div>
                        ) : items.length === 0 ? (
                            <p className="text-slate-400 text-center py-12">No hay modelos destacados configurados aún.</p>
                        ) : (
                            <div className="embla overflow-hidden" ref={emblaRef}>
                                <div className="embla__container flex -ml-6">
                                    {items.map((model) => {
                                        const spec = model.trims?.[0]?.specs ?? {};
                                        const range = spec.range_cltc_km ?? spec.range_wltp_km;
                                        return (
                                            <div key={model.id} className="embla__slide flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-6">
                                                <FeatureCard className="h-full flex flex-col p-6 bg-slate-900/40 border-white/5 hover:border-[#00D4AA]/30 group">
                                                    {/* Image */}
                                                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-slate-800/50 shadow-inner">
                                                        <Image
                                                            src={getCardImage(model)}
                                                            alt={`${model.brand?.name ?? ''} ${model.name}`}
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                    </div>

                                                    {/* Title & Badge */}
                                                    <div className="flex items-start justify-between mb-4">
                                                        <h3 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-[#00D4AA] transition-colors duration-300">
                                                            {model.brand?.name} {model.name}
                                                        </h3>
                                                        <span className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter shrink-0 ml-2">
                                                            {getTypeLabel(model.type)}
                                                        </span>
                                                    </div>

                                                    {/* Specs Grid */}
                                                    <div className="grid grid-cols-3 gap-2 py-6 border-y border-white/5 mb-6">
                                                        <div className="text-center group-hover:translate-y-[-2px] transition-transform duration-300">
                                                            <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Rango</p>
                                                            <p className="text-sm font-bold text-white">{formatSpec(range, 'km')}</p>
                                                        </div>
                                                        <div className="text-center border-x border-white/5 px-2 group-hover:translate-y-[-2px] transition-transform duration-300 delay-75">
                                                            <p className="text-[10px] text-gray-500 uppercase font-black mb-1">0-100</p>
                                                            <p className="text-sm font-bold text-white">{formatSpec(spec.zero_to_100, 's')}</p>
                                                        </div>
                                                        <div className="text-center group-hover:translate-y-[-2px] transition-transform duration-300 delay-150">
                                                            <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Batería</p>
                                                            <p className="text-sm font-bold text-white">{formatSpec(spec.battery_kwh, 'kWh')}</p>
                                                        </div>
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="mt-auto flex items-center justify-between">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] text-gray-500 uppercase font-black">Precio</span>
                                                            <span className="text-2xl font-black text-[#00D4AA] drop-shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                                                                ${model.basePrice.toLocaleString('en-US')} USD
                                                            </span>
                                                        </div>
                                                        <Link href={`/modelos/${model.slug}`} aria-label={`Ver detalles de ${model.name}`} className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#00D4AA] hover:text-slate-900 transition-all duration-300 group/btn shadow-xl">
                                                            <ChevronRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                                                        </Link>
                                                    </div>
                                                </FeatureCard>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
