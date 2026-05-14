'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { modelService } from '@/services/model.service';
import type { VehicleModel } from '@/types/inventory';

function formatSpec(value: number | string | undefined, unit: string) {
    if (!value) return '—';
    return `${value}${unit}`;
}

function getCardImage(model: VehicleModel): string {
    const heroImg = model.trims?.[0]?.images?.find((i) => i.type === 'hero')?.url;
    const firstImg = model.trims?.[0]?.images?.[0]?.url;
    return heroImg ?? firstImg ?? '/placeholder-car.png';
}

function getTypeLabel(type: string) {
    const map: Record<string, string> = {
        suv: 'SUV', sedan: 'SEDAN', hatchback: 'HATCHBACK',
        pickup: 'PICKUP', van: 'VAN', coupe: 'COUPÉ',
    };
    return map[type] ?? type.toUpperCase();
}

function CardSkeleton() {
    return (
        <div className="rounded-3xl overflow-hidden bg-[#0d1829] border border-white/5 animate-pulse">
            <div className="aspect-[4/3] bg-slate-800" />
            <div className="p-6 space-y-4">
                <div className="h-6 w-3/4 bg-slate-700 rounded" />
                <div className="grid grid-cols-3 gap-3">
                    {[0,1,2].map(i => <div key={i} className="h-10 bg-slate-700 rounded" />)}
                </div>
                <div className="h-8 w-1/2 bg-slate-700 rounded" />
            </div>
        </div>
    );
}

export function ModelCarousel() {
    const [models, setModels] = React.useState<VehicleModel[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'center',
        loop: true,
        skipSnaps: false,
    });

    const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    React.useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        emblaApi.on('select', onSelect);
        onSelect();
        return () => { emblaApi.off('select', onSelect); };
    }, [emblaApi]);

    React.useEffect(() => {
        modelService.getModels({ featured: true, active: true, limit: 10 })
            .then((res) => setModels(res.data ?? []))
            .catch(() => setModels([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section id="modelos" className="relative py-24 overflow-hidden">

            {/* Base */}
            <div className="absolute inset-0 bg-[#0b1929]" />

            {/* Dot grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.18]"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(0,212,170,0.6) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

            {/* Teal blob top-right */}
            <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none opacity-20"
                style={{ background: 'radial-gradient(ellipse at center, #00D4AA 0%, transparent 70%)' }} />

            {/* Teal blob bottom-left */}
            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-15"
                style={{ background: 'radial-gradient(ellipse at center, #00D4AA 0%, transparent 70%)' }} />

            {/* SVG waves bottom */}
            <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,80 C240,140 480,20 720,80 C960,140 1200,20 1440,80 L1440,160 L0,160 Z" fill="rgba(0,212,170,0.06)" />
                <path d="M0,100 C360,40 720,160 1080,100 C1260,70 1380,120 1440,100 L1440,160 L0,160 Z" fill="rgba(0,212,170,0.04)" />
            </svg>

            {/* SVG waves top */}
            <svg className="absolute top-0 left-0 w-full pointer-events-none rotate-180" viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,50 C360,0 720,100 1080,50 C1260,25 1380,70 1440,50 L1440,100 L0,100 Z" fill="rgba(0,212,170,0.04)" />
            </svg>

            {/* Edge fades */}
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
                            <div>
                                <span className="text-[#00D4AA] font-bold tracking-widest uppercase text-sm mb-2 block">
                                    Exclusividad
                                </span>
                                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                    MODELOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">DESTACADOS</span>
                                </h2>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={scrollPrev} className="p-4 rounded-full border border-white/10 text-white hover:bg-[#00D4AA] hover:text-slate-900 transition-all duration-300 hover:scale-110 active:scale-95" aria-label="Anterior">
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button onClick={scrollNext} className="p-4 rounded-full border border-white/10 text-white hover:bg-[#00D4AA] hover:text-slate-900 transition-all duration-300 hover:scale-110 active:scale-95" aria-label="Siguiente">
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Carousel */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[0, 1, 2, 3].map((i) => <CardSkeleton key={i} />)}
                            </div>
                        ) : models.length === 0 ? (
                            <p className="text-slate-400 text-center py-12">No hay modelos destacados configurados aún.</p>
                        ) : (
                            <div className="embla overflow-hidden" ref={emblaRef}>
                                <div className="embla__container flex -ml-5 items-center">
                                    {models.map((model, index) => {
                                        const isActive = index === selectedIndex;
                                        const spec = (model.trims?.[0] as any)?.spec ?? {};
                                        const range = spec.rangeCltcKm ?? spec.rangeWltpKm;

                                        return (
                                            <div
                                                key={model.id}
                                                className="embla__slide flex-[0_0_85%] md:flex-[0_0_48%] lg:flex-[0_0_26%] min-w-0 pl-5 py-6"
                                            >
                                                <div
                                                    className={`rounded-3xl overflow-hidden border flex flex-col transition-all duration-500 ${
                                                        isActive
                                                            ? 'bg-[#0d1829] border-[#00D4AA]/30 shadow-[0_8px_40px_rgba(0,212,170,0.12)]'
                                                            : 'bg-[#0a1020] border-white/5 opacity-60'
                                                    }`}
                                                    style={{
                                                        transform: isActive ? 'scale(1)' : 'scale(0.94)',
                                                        transition: 'transform 0.5s ease, opacity 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease',
                                                    }}
                                                >
                                                    {/* Image */}
                                                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                                                        <Image
                                                            src={getCardImage(model)}
                                                            alt={`${model.brand?.name ?? ''} ${model.name}`}
                                                            fill
                                                            sizes="(max-width: 768px) 85vw, (max-width: 1200px) 48vw, 26vw"
                                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                            loading="lazy"
                                                        />
                                                        {/* Gradient overlay bottom */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1829] via-transparent to-transparent" />
                                                        {/* Type badge top-right */}
                                                        <span className="absolute top-4 right-4 bg-[#00D4AA] text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-md tracking-widest">
                                                            {getTypeLabel(model.type)}
                                                        </span>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-6 flex flex-col gap-5">
                                                        {/* Name */}
                                                        <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight">
                                                            {model.brand?.name} {model.name}
                                                        </h3>

                                                        {/* Specs 2×2 */}
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {[
                                                                { label: 'Autonomía', value: formatSpec(range, ' km') },
                                                                { label: '0 – 100', value: formatSpec(spec.zeroTo100, ' s') },
                                                                { label: 'Batería', value: formatSpec(spec.batteryKwh ? parseFloat(spec.batteryKwh) : undefined, ' kWh') },
                                                                { label: 'Potencia', value: formatSpec(spec.horsepower, ' hp') },
                                                            ].map(({ label, value }: { label: string; value: string }) => (
                                                                <div key={label} className="bg-white/[0.04] rounded-xl px-4 py-3 flex flex-col gap-1">
                                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
                                                                    <span className={`font-black text-base leading-none ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                                                        {value}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* CTA buttons */}
                                                        <div className="flex gap-3 pt-1 border-t border-white/5">
                                                            <Link
                                                                href={`/modelos/${model.slug}`}
                                                                className={`flex-1 py-2.5 text-center text-xs font-black uppercase tracking-wider rounded-xl transition-colors ${
                                                                    isActive
                                                                        ? 'bg-[#00D4AA] text-slate-900 hover:bg-[#00bfa0]'
                                                                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                                                }`}
                                                            >
                                                                Ver detalles
                                                            </Link>
                                                            <Link
                                                                href={`/cotizar?modelo=${model.slug}`}
                                                                className="flex-1 py-2.5 text-center text-xs font-black uppercase tracking-wider rounded-xl border border-white/10 text-white hover:border-[#00D4AA]/40 hover:text-[#00D4AA] transition-colors"
                                                            >
                                                                Cotizar
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
            </div>
        </section>
    );
}
