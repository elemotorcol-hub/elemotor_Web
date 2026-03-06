'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import Image from 'next/image';

const models = [
    {
        name: 'TESLA MODEL S PLAID',
        price: '$125.000 USD',
        specs: { range: '600 km', zeroToHundred: '2.1s', battery: '100 kWh' },
        image: '/MODELOS/AVATR-11.avif',
        badge: 'NUEVO',
    },
    {
        name: 'LUCID AIR SAPPHIRE',
        price: '$249.000 USD',
        specs: { range: '687 km', zeroToHundred: '1.89s', battery: '118 kWh' },
        image: '/MODELOS/GALAXY_E8.avif',
        badge: 'PREMIUM',
    },
    {
        name: 'PORSCHE TAYCAN TURBO S',
        price: '$194.000 USD',
        specs: { range: '412 km', zeroToHundred: '2.8s', battery: '93 kWh' },
        image: '/MODELOS/BYD-SEALION7 (1).avif',
        badge: 'LUJO',
    },
    {
        name: 'RIVIAN R1S',
        price: '$84.000 USD',
        specs: { range: '516 km', zeroToHundred: '3.0s', battery: '135 kWh' },
        image: '/MODELOS/BYD BAO_3.webp',
        badge: 'AVENTURA',
    },
    {
        name: 'LOTUS ELETRE',
        price: '$107.000 USD',
        specs: { range: '600 km', zeroToHundred: '2.95s', battery: '112 kWh' },
        image: '/MODELOS/BYD DOLPHIN EDITION KNIGHT.avif',
        badge: 'DEPORTIVO',
    },
    {
        name: 'POLESTAR 3',
        price: '$83.000 USD',
        specs: { range: '482 km', zeroToHundred: '4.6s', battery: '111 kWh' },
        image: '/MODELOS/BYD YUAN PLUS -.webp',
        badge: 'DISEÑO',
    },
    {
        name: 'RIMAC NEVERA',
        price: '$2.100.000 USD',
        specs: { range: '490 km', zeroToHundred: '1.81s', battery: '120 kWh' },
        image: '/MODELOS/BMW IX1.avif',
        badge: 'EXTREMO',
    },
];

const BLUR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+pNPQAIXwM9ov86OQAAAABJRU5ErkJggg==';

export function ModelCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        loop: true,
        skipSnaps: false,
        dragFree: false,
    });

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <section id="modelos" className="py-24 bg-slate-900 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="max-w-7xl mx-auto">
                    {/* The "Box" requested by user */}
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
                                <button
                                    onClick={scrollPrev}
                                    className="p-4 rounded-full border border-white/10 text-white hover:bg-[#00D4AA] hover:text-slate-900 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-[#00D4AA]/20"
                                    aria-label="Anterior"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={scrollNext}
                                    className="p-4 rounded-full border border-white/10 text-white hover:bg-[#00D4AA] hover:text-slate-900 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-[#00D4AA]/20"
                                    aria-label="Siguiente"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Carousel Wrapper */}
                        <div className="embla overflow-hidden" ref={emblaRef}>
                            <div className="embla__container flex -ml-6">
                                {models.map((model) => (
                                    <div
                                        key={model.name}
                                        className="embla__slide flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-6"
                                    >
                                        <FeatureCard className="h-full flex flex-col p-6 bg-slate-900/40 border-white/5 hover:border-[#00D4AA]/30 group">
                                            {/* Image Container */}
                                            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-slate-800/50 shadow-inner">
                                                <Image
                                                    src={model.image}
                                                    alt={model.name}
                                                    fill
                                                    sizes="(max-width: 768px) 150px, (max-width: 1200px) 300px, 400px"
                                                    className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                                                    placeholder="blur"
                                                    blurDataURL={BLUR_DATA_URL}
                                                    loading="lazy"
                                                    unoptimized={true}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            </div>

                                            {/* Title & Badge */}
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-[#00D4AA] transition-colors duration-300">
                                                    {model.name}
                                                </h3>
                                                <span className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
                                                    {model.badge}
                                                </span>
                                            </div>

                                            {/* Specs Grid */}
                                            <div className="grid grid-cols-3 gap-2 py-6 border-y border-white/5 mb-6">
                                                <div className="text-center group-hover:translate-y-[-2px] transition-transform duration-300">
                                                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Rango</p>
                                                    <p className="text-sm font-bold text-white">{model.specs.range}</p>
                                                </div>
                                                <div className="text-center border-x border-white/5 px-2 group-hover:translate-y-[-2px] transition-transform duration-300 delay-75">
                                                    <p className="text-[10px] text-gray-500 uppercase font-black mb-1">0-100</p>
                                                    <p className="text-sm font-bold text-white">{model.specs.zeroToHundred}</p>
                                                </div>
                                                <div className="text-center group-hover:translate-y-[-2px] transition-transform duration-300 delay-150">
                                                    <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Batería</p>
                                                    <p className="text-sm font-bold text-white">{model.specs.battery}</p>
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="mt-auto flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500 uppercase font-black">Precio</span>
                                                    <span className="text-2xl font-black text-[#00D4AA] drop-shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                                                        {model.price}
                                                    </span>
                                                </div>
                                                <button className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#00D4AA] hover:text-slate-900 transition-all duration-300 group/btn shadow-xl">
                                                    <ChevronRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </FeatureCard>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
