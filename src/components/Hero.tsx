'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

const SLIDES = [
    {
        car: '/MODELOS/BYD BAO_3.webp',
        brand: 'BYD',
        model: 'BAO 3',
        headline: 'IMPORTAMOS EL VEHÍCULO',
        highlight: 'ELÉCTRICO DE TUS SUEÑOS',
        desc: 'Lujo, tecnología y sostenibilidad sin límites. Traemos a Colombia la vanguardia de la movilidad global.',
        accent: '#00D4AA',
        glow: 'rgba(0,212,170,0.18)',
        spotColor: 'rgba(0,212,170,0.15)',
    },
    {
        car: '/MODELOS/BYD YUAN PLUS -.webp',
        brand: 'BYD',
        model: 'YUAN PLUS',
        headline: 'TECNOLOGÍA DE',
        highlight: 'VANGUARDIA GLOBAL',
        desc: 'Potencia inteligente, autonomía extraordinaria. Experimenta la nueva era del transporte eléctrico premium.',
        accent: '#3B82F6',
        glow: 'rgba(59,130,246,0.18)',
        spotColor: 'rgba(59,130,246,0.15)',
    },
    {
        car: '/MODELOS/Volkswagen- ID3 OUTSTANGING.webp',
        brand: 'VOLKSWAGEN',
        model: 'ID.3',
        headline: 'EL FUTURO DE LA',
        highlight: 'MOVILIDAD ELÉCTRICA',
        desc: 'Ingeniería alemana, cero emisiones. Descubre el equilibrio perfecto entre diseño urbano y rendimiento eléctrico.',
        accent: '#F59E0B',
        glow: 'rgba(245,158,11,0.18)',
        spotColor: 'rgba(245,158,11,0.12)',
    },
];

export function Hero() {
    const [active, setActive] = useState(0);
    const [prev, setPrev] = useState<number | null>(null);
    const [transitioning, setTransitioning] = useState(false);

    const goTo = useCallback((index: number) => {
        if (transitioning || index === active) return;
        setPrev(active);
        setTransitioning(true);
        setActive(index);
        setTimeout(() => {
            setPrev(null);
            setTransitioning(false);
        }, 700);
    }, [active, transitioning]);

    useEffect(() => {
        const timer = setInterval(() => {
            goTo((active + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [active, goTo]);

    const slide = SLIDES[active];

    return (
        <section className="relative h-screen min-h-[700px] w-full flex items-center overflow-hidden bg-[#060B14]">

            {/* Static dark background */}
            <div
                className="absolute inset-0 z-0 bg-fixed bg-cover bg-center opacity-30"
                style={{ backgroundImage: 'url("/hero-bg.webp")' }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-900" />

            {/* Accent glow — transitions with slide */}
            <div
                className="absolute inset-0 z-0 pointer-events-none transition-colors duration-700"
                style={{ background: `radial-gradient(ellipse at 70% 50%, ${slide.glow} 0%, transparent 60%)` }}
            />

            {/* Car images — crossfade */}
            <div className="absolute right-0 top-0 w-full lg:w-[58%] h-full z-10 pointer-events-none">
                {SLIDES.map((s, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
                        style={{ opacity: i === active ? 1 : 0 }}
                    >
                        {/* Spotlight glow behind car */}
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
                            style={{ background: `radial-gradient(ellipse at center, ${s.spotColor} 0%, transparent 65%)` }}
                        />
                        <div className="relative w-full h-[65%] lg:h-[80%]">
                            <Image
                                src={s.car}
                                alt={`${s.brand} ${s.model}`}
                                fill
                                className="object-contain drop-shadow-2xl brightness-110"
                                sizes="(max-width: 1024px) 100vw, 58vw"
                                priority={i === 0}
                            />
                        </div>
                    </div>
                ))}

                {/* Left gradient mask so text is readable */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#060B14] via-[#060B14]/60 to-transparent lg:from-[#060B14]/80 lg:via-[#060B14]/20" />
            </div>

            {/* Content */}
            <div className="container relative z-20 px-6 max-w-7xl mx-auto w-full">
                <div className="max-w-xl lg:max-w-2xl">

                    {/* Brand chip */}
                    <div
                        key={`brand-${active}`}
                        className="inline-flex items-center gap-2 mb-5 animate-fade-in"
                    >
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: slide.accent }}
                        />
                        <span
                            className="text-xs font-black tracking-[0.25em] uppercase"
                            style={{ color: slide.accent }}
                        >
                            {slide.brand} · {slide.model}
                        </span>
                    </div>

                    {/* Headline */}
                    <h1
                        key={`h1-${active}`}
                        className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 leading-tight animate-fade-in"
                    >
                        {slide.headline} <br />
                        <span style={{ color: slide.accent }}>{slide.highlight}</span>
                    </h1>

                    {/* Description */}
                    <p
                        key={`desc-${active}`}
                        className="text-base md:text-lg text-gray-300 mb-10 max-w-lg leading-relaxed animate-fade-in"
                    >
                        {slide.desc}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-start gap-4 w-full">
                        <Link
                            href="/modelos"
                            className="inline-flex items-center justify-center gap-2 rounded-lg transition-colors font-bold px-8 py-4 text-base w-full sm:w-auto text-slate-900"
                            style={{ backgroundColor: slide.accent }}
                            aria-label="Explorar todos los modelos de vehículos eléctricos"
                        >
                            EXPLORAR MODELOS
                        </Link>
                        <Link
                            href="/showroom"
                            className="inline-flex items-center justify-center gap-2 rounded-lg transition-colors border-2 text-white hover:bg-white/10 font-bold px-8 py-4 text-base w-full sm:w-auto"
                            style={{ borderColor: `${slide.accent}60` }}
                            aria-label="Ver el showroom interactivo en 3D de los vehículos"
                        >
                            VER SHOWROOM
                        </Link>
                    </div>
                </div>
            </div>

            {/* Slide indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
                {SLIDES.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Slide ${i + 1}: ${s.brand} ${s.model}`}
                        className="transition-all duration-300 rounded-full"
                        style={{
                            width: i === active ? '28px' : '8px',
                            height: '8px',
                            backgroundColor: i === active ? slide.accent : 'rgba(255,255,255,0.3)',
                        }}
                    />
                ))}
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none z-20" />
        </section>
    );
}
