'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const photos = [
    { src: '/nosotros/galeria-1.webp', alt: 'Equipo EleMotor' },
    { src: '/nosotros/galeria-2.webp', alt: 'Showroom EleMotor' },
    // { src: '/nosotros/galeria-3.webp', alt: 'Vehículos eléctricos' },
    //{ src: '/nosotros/galeria-4.webp', alt: 'Instalaciones EleMotor' },
    //{ src: '/nosotros/galeria-5.webp', alt: 'EleMotor en acción' },
];

export function AboutGallery() {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const goTo = useCallback((index: number) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrent(index);
        setTimeout(() => setIsAnimating(false), 600);
    }, [isAnimating]);

    const next = useCallback(() => {
        goTo((current + 1) % photos.length);
    }, [current, goTo]);

    useEffect(() => {
        const timer = setInterval(next, 4000);
        return () => clearInterval(timer);
    }, [next]);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Stacked cards */}
            <div className="relative w-full aspect-[4/5] max-w-sm">

                {/* Card behind (-2) */}
                {photos.map((photo, i) => {
                    const offset = (i - current + photos.length) % photos.length;
                    const isActive = offset === 0;
                    const isNext = offset === 1;
                    const isPrev = offset === photos.length - 1;

                    let transform = 'scale(0.82) translateY(8%) rotate(0deg)';
                    let zIndex = 0;
                    let opacity = 0;

                    if (isActive) {
                        transform = 'scale(1) translateY(0) rotate(0deg)';
                        zIndex = 30;
                        opacity = 1;
                    } else if (isNext) {
                        transform = 'scale(0.9) translateY(6%) rotate(3deg)';
                        zIndex = 20;
                        opacity = 0.7;
                    } else if (isPrev) {
                        transform = 'scale(0.9) translateY(6%) rotate(-3deg)';
                        zIndex = 10;
                        opacity = 0.5;
                    }

                    return (
                        <div
                            key={photo.src}
                            className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
                            style={{
                                transform,
                                zIndex,
                                opacity,
                                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        >
                            <Image
                                src={photo.src}
                                alt={photo.alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 400px"
                            />
                            {/* Subtle bottom gradient */}
                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
                            {isActive && (
                                <div className="absolute bottom-5 left-5">
                                    <p className="text-white/80 text-xs font-medium tracking-wider">{photo.alt}</p>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Glow behind active card */}
                <div className="absolute inset-0 -z-10 rounded-3xl bg-[#00D4AA]/20 blur-2xl scale-90" />
            </div>

            {/* Dot indicators */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {photos.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`transition-all duration-300 rounded-full ${
                            i === current
                                ? 'w-6 h-2 bg-[#00D4AA]'
                                : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'
                        }`}
                        aria-label={`Foto ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
