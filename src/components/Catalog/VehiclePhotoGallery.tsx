'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, Play } from 'lucide-react';
import type { DetailImage } from '@/services/catalogModels.service';

type Tab = 'todas' | 'interior' | 'exterior';

interface VehiclePhotoGalleryProps {
    images: DetailImage[];
    modelName: string;
    videoUrl?: string;
}

export function VehiclePhotoGallery({ images, modelName, videoUrl }: VehiclePhotoGalleryProps) {
    const defaultTab: Tab = images.some((img) => img.type === 'exterior') ? 'exterior' : 'interior';
    const [tab, setTab] = useState<Tab>(defaultTab);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Only show interior and exterior images — exclude hero/gallery/panoramic
    const galleryImages = images.filter((img) => img.type === 'interior' || img.type === 'exterior');

    const hasInterior = galleryImages.some((img) => img.type === 'interior');
    const hasExterior = galleryImages.some((img) => img.type === 'exterior');

    const filtered = galleryImages.filter((img) => {
        if (tab === 'interior') return img.type === 'interior';
        if (tab === 'exterior') return img.type === 'exterior';
        return true;
    });

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const prev = useCallback(() =>
        setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null)),
        [filtered.length]
    );
    const next = useCallback(() =>
        setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null)),
        [filtered.length]
    );

    useEffect(() => {
        if (lightboxIndex === null) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [lightboxIndex, prev, next]);

    useEffect(() => {
        document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [lightboxIndex]);

    const GRID_LIMIT = 3;
    const gridImages = filtered.slice(0, GRID_LIMIT);
    const remaining = filtered.length - GRID_LIMIT;

    const TABS: { key: Tab; label: string }[] = [
        { key: 'exterior', label: 'Exterior' },
        { key: 'interior', label: 'Interior' },
    ];

    const showGallery = galleryImages.length > 0;
    const showVideo = !!videoUrl || true; // always render video section

    return (
        <>
            {/* ── GALLERY SECTION ─────────────────────────────────────────── */}
            {showGallery && (
                <section className="w-full py-20 bg-[#060B14]">

                    {/* Header — contained */}
                    <div className="container mx-auto px-6 max-w-7xl">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                            <div>
                                <span className="text-[#00D4AA] font-bold tracking-widest uppercase text-sm mb-2 block">
                                    Imágenes oficiales
                                </span>
                                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                    GALERÍA <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">DEL MODELO</span>
                                </h2>
                                <p className="text-xs text-slate-500 mt-3 max-w-xl">
                                    Imagen de referencia. Las características pueden variar y deberán verificarse en vitrina con el asesor comercial.
                                </p>
                            </div>

                            {/* Tabs */}
                            {(hasInterior || hasExterior) && (
                                <div className="flex gap-2">
                                    {TABS.filter((t) =>
                                        (t.key === 'interior' && hasInterior) ||
                                        (t.key === 'exterior' && hasExterior)
                                    ).map(({ key, label }) => (
                                        <button
                                            key={key}
                                            onClick={() => setTab(key)}
                                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                                                tab === key
                                                    ? 'bg-[#00D4AA] text-slate-900'
                                                    : 'border border-white/10 text-slate-400 hover:text-white hover:border-white/30'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Grid — full width */}
                    {filtered.length === 0 ? (
                        <p className="text-slate-500 text-sm py-16 text-center">
                            No hay imágenes en esta categoría.
                        </p>
                    ) : (
                        <div className="px-6 grid grid-cols-2 grid-rows-2 gap-4 h-[500px] md:h-[640px]">

                            {/* Large — left, full height */}
                            <div
                                className="row-span-2 relative overflow-hidden rounded-3xl cursor-pointer group"
                                onClick={() => openLightbox(0)}
                            >
                                <Image
                                    src={gridImages[0].url}
                                    alt={gridImages[0].altText ?? modelName}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                        <ZoomIn className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="row-span-2 flex flex-col gap-4">
                                {gridImages[1] && (
                                    <div
                                        className="flex-1 relative overflow-hidden rounded-3xl cursor-pointer group"
                                        onClick={() => openLightbox(1)}
                                    >
                                        <Image
                                            src={gridImages[1].url}
                                            alt={gridImages[1].altText ?? modelName}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="50vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                                <ZoomIn className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {gridImages[2] && (
                                    <div
                                        className="flex-1 relative overflow-hidden rounded-3xl cursor-pointer group"
                                        onClick={() => openLightbox(2)}
                                    >
                                        <Image
                                            src={gridImages[2].url}
                                            alt={gridImages[2].altText ?? modelName}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="50vw"
                                        />
                                        {remaining > 0 ? (
                                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1">
                                                <span className="text-white font-black text-4xl">+{remaining}</span>
                                                <span className="text-white/60 text-xs uppercase tracking-widest">más fotos</span>
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                                    <ZoomIn className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* ── LIGHTBOX ────────────────────────────────────────────────── */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/96 flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="Cerrar"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); next(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="Siguiente"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    <div
                        className="relative w-[92vw] h-[88vh] max-w-6xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={filtered[lightboxIndex].url}
                            alt={filtered[lightboxIndex].altText ?? modelName}
                            fill
                            className="object-contain"
                            sizes="92vw"
                            priority
                        />
                    </div>
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-sm tabular-nums">
                        {lightboxIndex + 1} / {filtered.length}
                    </div>
                </div>
            )}

            {/* ── VIDEO SECTION ────────────────────────────────────────────── */}
            {showVideo && (
                <section className="w-full py-20 bg-[#040810]">

                    {/* Header — contained */}
                    <div className="container mx-auto px-6 max-w-7xl mb-10">
                        <span className="text-[#00D4AA] font-bold tracking-widest uppercase text-sm mb-2 block">
                            En movimiento
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            VIDEO <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">OFICIAL</span>
                        </h2>
                    </div>

                    {/* Video — full width */}
                    <div>
                        {videoUrl ? (
                            <div className="w-full aspect-video overflow-hidden">
                                {/youtu\.be|youtube\.com|vimeo\.com/.test(videoUrl) ? (
                                    <iframe
                                        src={`${videoUrl.replace('youtu.be/', 'www.youtube.com/embed/').split('?')[0]}?autoplay=1&mute=1&loop=1&playlist=${videoUrl.split('/').pop()?.split('?')[0]}`}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title={`Video oficial ${modelName}`}
                                    />
                                ) : (
                                    <video
                                        src={videoUrl}
                                        className="w-full h-full object-cover"
                                        controls
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        title={`Video oficial ${modelName}`}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/5 bg-[#080E1C] flex flex-col items-center justify-center gap-5">
                                <div className="w-20 h-20 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                                    <Play className="w-9 h-9 text-white/20 ml-1" />
                                </div>
                                <div className="text-center">
                                    <p className="text-slate-400 font-semibold">Video próximamente</p>
                                    <p className="text-slate-600 text-sm mt-1">El video oficial del {modelName} estará disponible pronto</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </>
    );
}
