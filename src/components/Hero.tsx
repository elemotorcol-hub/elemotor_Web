'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

const SLIDES = [
    {
        bg: '/hero-bg.webp',
        accent: '#00D4AA',
        tint: 'rgba(0,212,170,0.04)',
    },
    {
        bg: '/hero-bg-02.jpeg',
        accent: '#3B82F6',
        tint: 'rgba(20,40,120,0.10)',
    },
    {
        bg: '/hero-bg-03.webp',
        accent: '#A78BFA',
        tint: 'rgba(10,5,30,0.20)',
    },
    {
        bg: '/hero-bg-04.webp',
        accent: '#F97316',
        tint: 'rgba(80,20,0,0.15)',
    },
    {
        bg: '/hero-bg-05.png',
        accent: '#00D4AA',
        tint: 'rgba(0,0,0,0.10)',
    },
];

export function Hero() {
    const [active, setActive] = useState(0);
    const [transitioning, setTransitioning] = useState(false);

    const goTo = useCallback((index: number) => {
        if (transitioning || index === active) return;
        setTransitioning(true);
        setActive(index);
        setTimeout(() => setTransitioning(false), 800);
    }, [active, transitioning]);

    useEffect(() => {
        const timer = setInterval(() => {
            setActive((prev) => (prev + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const slide = SLIDES[active];

    return (
        <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">

            {/* Background images — crossfade */}
            {SLIDES.map((s, i) => (
                <div
                    key={i}
                    className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
                    style={{
                        backgroundImage: `url("${s.bg}")`,
                        opacity: i === active ? 1 : 0,
                    }}
                />
            ))}

            {/* Gradient overlay — comentado temporalmente */}
            {/* <div
                className={`absolute inset-0 bg-gradient-to-b ${slide.overlay} z-10 transition-all duration-1000`}
            /> */}

            {/* Top fade — darkens navbar area so logo/links siempre se leen */}
            <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none" />

            {/* Color tint — per slide */}
            <div
                className="absolute inset-0 z-10 transition-all duration-1000 pointer-events-none"
                style={{ backgroundColor: slide.tint }}
            />

            {/* Content */}
            <div className="container relative z-20 px-6 text-center max-w-5xl mx-auto">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                    IMPORTAMOS EL VEHÍCULO <br />
                    <span
                        className="transition-colors duration-700"
                        style={{ color: slide.accent }}
                    >
                        ELÉCTRICO DE TUS SUEÑOS
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Lujo, tecnología y sostenibilidad sin límites. <br className="hidden md:block" />
                    Traemos a Colombia la vanguardia de la movilidad global.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
                    <Link
                        href="/modelos"
                        className="inline-flex items-center justify-center gap-2 rounded-lg font-bold px-8 py-5 text-lg w-full sm:w-[260px] text-slate-900 transition-colors duration-700"
                        style={{ backgroundColor: slide.accent }}
                        aria-label="Ir a la sección para explorar todos los modelos de vehículos eléctricos"
                    >
                        EXPLORAR MODELOS
                    </Link>
                    <Link
                        href="/showroom"
                        className="inline-flex items-center justify-center gap-2 rounded-lg font-bold px-8 py-5 text-lg w-full sm:w-[260px] border-2 text-white hover:bg-white/10 transition-colors duration-700"
                        style={{ borderColor: slide.accent + '99' }}
                        aria-label="Ver el showroom interactivo en 3D de los vehículos"
                    >
                        VER SHOWROOM
                    </Link>
                </div>
            </div>

            {/* Slide indicators */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        aria-label={`Slide ${i + 1}`}
                        className="rounded-full transition-all duration-500"
                        style={{
                            width: i === active ? '28px' : '8px',
                            height: '8px',
                            backgroundColor: i === active ? slide.accent : 'rgba(255,255,255,0.35)',
                        }}
                    />
                ))}
            </div>

            {/* Bottom accent bar */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none z-20" />
        </section>
    );
}
