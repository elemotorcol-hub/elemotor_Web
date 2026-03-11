'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Loader2, Car, Images } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { modelService } from '@/services/model.service';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TrimImage {
    id: number;
    url: string;
    type: string;
    altText?: string;
}

interface TrimData {
    id: number;
    name: string;
    images: TrimImage[];
}

interface TrimGalleryPreviewProps {
    modelId: number;
    modelName: string;
    isOpen: boolean;
    onClose: () => void;
    /** Optional: callback to pass back the first image URL to the parent table */
    onFirstImageResolved?: (modelId: number, url: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TrimGalleryPreview({
    modelId,
    modelName,
    isOpen,
    onClose,
    onFirstImageResolved,
}: TrimGalleryPreviewProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [trims, setTrims] = useState<TrimData[]>([]);
    const [activeTrimIndex, setActiveTrimIndex] = useState(0);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Keep the callback in a ref so it's never part of any dependency array
    const onFirstImageResolvedRef = React.useRef(onFirstImageResolved);
    useEffect(() => {
        onFirstImageResolvedRef.current = onFirstImageResolved;
    }, [onFirstImageResolved]);

    useEffect(() => {
        if (!isOpen || !modelId) {
            // Reset when closed
            setTrims([]);
            setActiveTrimIndex(0);
            setActiveImageIndex(0);
            setError(null);
            return;
        }

        let cancelled = false;

        const run = async () => {
            setIsLoading(true);
            setError(null);
            setTrims([]);
            setActiveTrimIndex(0);
            setActiveImageIndex(0);

            try {
                const modelData = await modelService.getModelById(modelId);
                if (cancelled) return;

                const rawTrims: any[] = modelData?.trims ?? [];

                if (rawTrims.length === 0) {
                    return;
                }

                const trimsWithImages: TrimData[] = await Promise.all(
                    rawTrims.map(async (trim: any) => {
                        let images: TrimImage[] = [];
                        try {
                            const fetched = await fetchApi(`/api/images/by-trim/${trim.id}`, { method: 'GET' });
                            images = Array.isArray(fetched) ? fetched : [];
                        } catch {
                            // Trim simply has no images yet
                        }
                        return { id: trim.id, name: trim.name, images };
                    }),
                );

                if (cancelled) return;

                const populated = trimsWithImages.filter((t) => t.images.length > 0);
                setTrims(populated);

                // Notify parent about first image — stable ref, never triggers re-renders
                if (populated.length > 0 && onFirstImageResolvedRef.current) {
                    onFirstImageResolvedRef.current(modelId, populated[0].images[0].url);
                }
            } catch (err: any) {
                if (!cancelled) {
                    console.error('[TrimGalleryPreview]', err);
                    setError('No se pudo cargar la galería del modelo.');
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        run();

        // Cleanup: mark as cancelled if the effect re-runs before the fetch resolves
        return () => { cancelled = true; };
    // Only re-run when the modal opens for a new model
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, modelId]);

    // ─── Derived state ───────────────────────────────────────────────────────
    const currentTrim = trims[activeTrimIndex];
    const currentImages = currentTrim?.images ?? [];
    const currentImage = currentImages[activeImageIndex] ?? null;

    // ─── Navigation helpers ──────────────────────────────────────────────────
    const goNextImage = () => {
        if (activeImageIndex < currentImages.length - 1) {
            setActiveImageIndex((i) => i + 1);
        } else if (activeTrimIndex < trims.length - 1) {
            setActiveTrimIndex((t) => t + 1);
            setActiveImageIndex(0);
        }
    };

    const goPrevImage = () => {
        if (activeImageIndex > 0) {
            setActiveImageIndex((i) => i - 1);
        } else if (activeTrimIndex > 0) {
            const prevTrim = activeTrimIndex - 1;
            setActiveTrimIndex(prevTrim);
            setActiveImageIndex(trims[prevTrim].images.length - 1);
        }
    };

    const selectTrim = (idx: number) => {
        setActiveTrimIndex(idx);
        setActiveImageIndex(0);
    };

    // ─── Keyboard navigation ─────────────────────────────────────────────────
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goNextImage();
            if (e.key === 'ArrowLeft') goPrevImage();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, activeImageIndex, activeTrimIndex, trims]);

    if (!isOpen) return null;

    const hasImages = trims.length > 0;
    const canGoPrev =
        activeImageIndex > 0 ||
        activeTrimIndex > 0;
    const canGoNext =
        activeImageIndex < currentImages.length - 1 ||
        activeTrimIndex < trims.length - 1;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-5xl bg-[#0D1117] border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                            <Images size={16} className="text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white leading-tight">{modelName}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {isLoading
                                    ? 'Cargando recursos...'
                                    : hasImages
                                    ? `${trims.length} versión${trims.length !== 1 ? 'es' : ''} · ${currentImages.length} imagen${currentImages.length !== 1 ? 'es' : ''}`
                                    : 'Sin imágenes registradas'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        aria-label="Cerrar galería"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 py-16">
                            <Loader2 size={32} className="animate-spin text-cyan-500" />
                            <p className="text-sm font-medium animate-pulse">Cargando imágenes...</p>
                        </div>
                    )}

                    {/* Error */}
                    {!isLoading && error && (
                        <div className="flex-1 flex flex-col items-center justify-center gap-2 p-8 text-center text-red-400">
                            <span className="text-3xl">⚠️</span>
                            <p className="font-semibold text-sm">{error}</p>
                            <button
                                onClick={fetchGalleryData}
                                className="mt-2 px-4 py-1.5 text-xs bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    {/* No images */}
                    {!isLoading && !error && !hasImages && (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center text-slate-500">
                            <Car size={48} className="opacity-20" />
                            <p className="text-sm font-medium">Este modelo no tiene imágenes de galería.</p>
                            <p className="text-xs opacity-60">Agrega imágenes desde la sección de versiones.</p>
                        </div>
                    )}

                    {/* Gallery */}
                    {!isLoading && !error && hasImages && (
                        <>
                            {/* ── Trim tabs ── */}
                            <div className="shrink-0 px-6 pt-4 pb-3 border-b border-white/5 flex gap-2 overflow-x-auto">
                                {trims.map((t, idx) => (
                                    <button
                                        key={t.id}
                                        onClick={() => selectTrim(idx)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                                            activeTrimIndex === idx
                                                ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                                                : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'
                                        }`}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>

                            {/* ── Main image stage ── */}
                            <div className="relative shrink-0 w-full bg-black/50" style={{ height: '360px' }}>
                                {currentImage ? (
                                    <>
                                        <Image
                                            key={currentImage.id}
                                            src={currentImage.url}
                                            alt={currentImage.altText || `${modelName} — ${currentTrim.name}`}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 1024px) 100vw, 960px"
                                            priority
                                            loading="eager"
                                        />

                                        {/* Image-type badge */}
                                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                            <span className="text-white text-xs font-semibold uppercase tracking-wide">
                                                {currentImage.type}
                                            </span>
                                        </div>

                                        {/* Image counter */}
                                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-full text-white text-xs font-medium border border-white/10">
                                            {activeImageIndex + 1} / {currentImages.length}
                                        </div>

                                        {/* Prev / Next arrows */}
                                        {canGoPrev && (
                                            <button
                                                onClick={goPrevImage}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/65 hover:bg-cyan-600 text-white rounded-full backdrop-blur-sm transition-all border border-white/10 hover:scale-105 hover:border-cyan-500"
                                                aria-label="Imagen anterior"
                                            >
                                                <ChevronLeft size={22} />
                                            </button>
                                        )}
                                        {canGoNext && (
                                            <button
                                                onClick={goNextImage}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/65 hover:bg-cyan-600 text-white rounded-full backdrop-blur-sm transition-all border border-white/10 hover:scale-105 hover:border-cyan-500"
                                                aria-label="Imagen siguiente"
                                            >
                                                <ChevronRight size={22} />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-600">
                                        <Car size={40} />
                                    </div>
                                )}
                            </div>

                            {/* ── Thumbnail strip ── */}
                            <div className="shrink-0 bg-slate-950 border-t border-white/5 px-4 py-3">
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {currentImages.map((img, idx) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setActiveImageIndex(idx)}
                                            className={`relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                                                activeImageIndex === idx
                                                    ? 'border-cyan-500 opacity-100 shadow-md shadow-cyan-500/30'
                                                    : 'border-transparent opacity-50 hover:opacity-80 hover:border-slate-600'
                                            }`}
                                            aria-label={`Miniatura ${idx + 1}`}
                                        >
                                            <Image
                                                src={img.url}
                                                alt={`Miniatura ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                                loading="lazy"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
