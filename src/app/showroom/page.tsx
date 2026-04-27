'use client';

/**
 * showroom/page.tsx
 *
 * Showroom 3D — Complete implementation.
 *
 * Desktop: 70% Three.js viewer | 30% config panel
 * Mobile:  Full-height viewer + swipeable bottom sheet
 *
 * Three.js is loaded lazily (dynamic import with ssr: false)
 * to avoid SSR issues and reduce initial bundle size.
 */

import dynamic from 'next/dynamic';
import { useRef, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { HelpCircle, Share2, RefreshCw, Sun, Moon } from 'lucide-react';

import { Navbar } from '@/components/Navbar';
import { ModelSelector, TrimSelector, ExteriorColorSelector, InteriorColorSelector } from '@/components/showroom/ShowroomSelectors';
import { SpecsGrid, CTAFooter } from '@/components/showroom/ShowroomConfig';
import { ViewToggle } from '@/components/showroom/ViewToggle';
import { ViewerLoader } from '@/components/showroom/ViewerLoader';
import { BottomSheet } from '@/components/showroom/BottomSheet';
import { useShowroomData } from '@/components/showroom/useShowroomData';
import type { ThreeViewerHandle } from '@/components/showroom/ThreeViewer';
import type { LightMode } from '@/components/showroom/ThreeViewer';

// ─── Lazy-load Three.js viewer (client-only, no SSR) ─────────────────────────

const ThreeViewer = dynamic(
    () => import('@/components/showroom/ThreeViewer'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full bg-[#050B09] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
            </div>
        ),
    },
);

// ─── Page Component ───────────────────────────────────────────────────────────

function ShowroomPageInner() {
    const viewerRef = useRef<ThreeViewerHandle>(null);
    const searchParams = useSearchParams();
    const initialSlug = searchParams.get('modelo');

    // 3D model loading state
    const [loadProgress, setLoadProgress] = useState(0);
    const [modelLoaded, setModelLoaded] = useState(false);
    const [viewerReady, setViewerReady] = useState(false);

    // Lighting controls
    const [lightMode, setLightMode] = useState<LightMode>('day');

    // Showroom data & state
    const {
        models,
        selectedModel,
        selectedTrim,
        exteriorColors,
        interiorColors,
        selectedExtColor,
        selectedIntColor,
        viewMode,
        model3dUrl,
        isLoadingModels,
        isLoading3d,
        error,
        selectModel,
        selectTrim,
        selectExtColor,
        selectIntColor,
        toggleViewMode,
        getQuoteParams,
    } = useShowroomData(initialSlug);

    // Derived accent color (from selected exterior color or fallback to emerald)
    const accentColor = selectedExtColor?.hexCode ?? '#10B981';
    const bodyColor = selectedExtColor?.hexCode ?? null;

    // ── Lighting toggle handlers ────────────────────────────────────────────────
    const handleToggleLightMode = useCallback(() => {
        setLightMode((prev) => (prev === 'day' ? 'night' : 'day'));
    }, []);

    // ── 3D model load handlers ─────────────────────────────────────────────────
    const handleProgress = useCallback((pct: number) => {
        setLoadProgress(pct);
        if (!viewerReady) setViewerReady(true);
    }, [viewerReady]);

    const handleLoaded = useCallback(() => {
        setModelLoaded(true);
    }, []);

    // Reset state when model changes
    const handleSelectModel = useCallback((slug: string) => {
        setModelLoaded(false);
        setLoadProgress(0);
        selectModel(slug);
    }, [selectModel]);

    const handleSelectTrim = useCallback((trimId: number) => {
        setModelLoaded(false);
        setLoadProgress(0);
        selectTrim(trimId);
    }, [selectTrim]);

    const handleResetCamera = useCallback(() => {
        viewerRef.current?.resetCamera();
    }, []);

    // ── Is loader showing? ─────────────────────────────────────────────────────
    // Show loader when: loading models initially, or a 3D model is being fetched/rendered
    const showLoader = isLoadingModels || isLoading3d || (!!model3dUrl && !modelLoaded);
    const loaderProgress = isLoadingModels ? 15 : isLoading3d ? 40 : loadProgress;

    // ── Lighting control buttons (shared between mobile and desktop) ───────────
    const LightingControls = (
        <>
            <button
                onClick={handleToggleLightMode}
                aria-label={lightMode === 'day' ? 'Cambiar a modo noche' : 'Cambiar a modo día'}
                title={lightMode === 'day' ? 'Modo noche' : 'Modo día'}
                className="w-10 h-10 rounded-full bg-[#15201D]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
                {lightMode === 'day'
                    ? <Moon className="w-4 h-4" />
                    : <Sun className="w-4 h-4 text-amber-400" />
                }
            </button>
        </>
    );

    // ── Shared configurator content (used in both desktop panel & mobile sheet) ─
    const ConfiguratorContent = (
        <div className="space-y-6">
            <ModelSelector
                models={models}
                selectedModel={selectedModel}
                onSelect={handleSelectModel}
                disabled={isLoadingModels}
            />
            <TrimSelector
                trims={selectedModel?.trims ?? []}
                selectedTrim={selectedTrim}
                onSelect={handleSelectTrim}
            />
            <div className="border-t border-white/5 pt-6 space-y-6">
                <SpecsGrid spec={selectedTrim?.spec ?? null} trim={selectedTrim} />
                <ExteriorColorSelector
                    colors={exteriorColors}
                    selectedColor={selectedExtColor}
                    onSelect={selectExtColor}
                />
                <InteriorColorSelector
                    colors={interiorColors}
                    selectedColor={selectedIntColor}
                    onSelect={selectIntColor}
                />
            </div>
        </div>
    );

    return (
        <>
            <Navbar />

            {/* ══════════════════════════════════════
                MOBILE LAYOUT  (< lg)
                Full viewer + bottom sheet
            ══════════════════════════════════════ */}
            <div className="lg:hidden min-h-screen bg-[#050B09] font-sans select-none pt-16">
                {/* 3D Viewer — 80% of viewport height */}
                <div className="relative h-[80dvh] bg-[#050B09]">
                    {/* Live badge */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-500 text-[9px] font-bold tracking-[0.15em]">
                            SHOWROOM VIRTUAL
                        </span>
                    </div>

                    {/* View toggle — top right */}
                    <div className="absolute top-4 right-4 z-20">
                        <ViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                    </div>

                    {/* Error state */}
                    {error && !isLoadingModels && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center px-6">
                            <p className="text-slate-400 text-sm">No se pudieron cargar los modelos.</p>
                            <p className="text-slate-600 text-xs mt-1">{error}</p>
                        </div>
                    )}

                    {/* No 3D model placeholder */}
                    {!isLoadingModels && !isLoading3d && !model3dUrl && !error && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center px-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-white/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                                </svg>
                            </div>
                            <p className="text-slate-500 text-xs tracking-wider">
                                MODELO 3D NO DISPONIBLE
                            </p>
                        </div>
                    )}

                    {/* Three.js viewer */}
                    <ThreeViewer
                        ref={viewerRef}
                        modelUrl={model3dUrl}
                        onLoadProgress={handleProgress}
                        onLoaded={handleLoaded}
                        accentColor={accentColor}
                        lightMode={lightMode}
                        bodyColor={bodyColor}
                    />

                    {/* Loading overlay */}
                    <ViewerLoader progress={loaderProgress} visible={showLoader} />

                    {/* Controls — bottom right (reset + lighting) */}
                    <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
                        <button
                            onClick={handleResetCamera}
                            aria-label="Resetear cámara"
                            className="w-9 h-9 rounded-full bg-[#15201D]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={handleToggleLightMode}
                            aria-label={lightMode === 'day' ? 'Modo noche' : 'Modo día'}
                            className="w-9 h-9 rounded-full bg-[#15201D]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                        >
                            {lightMode === 'day'
                                ? <Moon className="w-3.5 h-3.5" />
                                : <Sun className="w-3.5 h-3.5 text-amber-400" />
                            }
                        </button>
                        <button aria-label="Ayuda" className="w-9 h-9 rounded-full bg-[#15201D]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                            <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Radial glow */}
                    <div
                        className="absolute inset-0 pointer-events-none transition-all duration-1000"
                        style={{
                            background: `radial-gradient(ellipse 70% 50% at 50% 60%, ${accentColor}0A 0%, transparent 70%)`,
                        }}
                    />
                </div>

                {/* Mobile bottom sheet with configurator */}
                <BottomSheet>
                    {ConfiguratorContent}
                    <CTAFooter quoteParams={getQuoteParams()} trim={selectedTrim} />
                </BottomSheet>
            </div>

            {/* ══════════════════════════════════════
                DESKTOP LAYOUT  (≥ lg) — 70/30 split
            ══════════════════════════════════════ */}
            <div className="hidden lg:flex h-screen w-screen overflow-hidden bg-[#050B09] font-sans select-none pt-[72px]">

                {/* LEFT — 3D Viewer (70%) */}
                <div className="relative flex-[7] flex flex-col overflow-hidden">

                    {/* Live badge */}
                    <div className="absolute top-5 left-8 z-20 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-500 text-[9px] font-bold tracking-[0.15em]">
                            SHOWROOM VIRTUAL
                        </span>
                    </div>

                    {/* View toggle */}
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20">
                        <ViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                    </div>

                    {/* No 3D model placeholder */}
                    {!isLoadingModels && !isLoading3d && !model3dUrl && !error && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center">
                            <div className="w-20 h-20 mx-auto mb-5 rounded-full border border-white/10 flex items-center justify-center">
                                <svg className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                                </svg>
                            </div>
                            <p className="text-slate-600 text-xs tracking-[0.2em] font-semibold">
                                MODELO 3D NO DISPONIBLE PARA ESTE TRIM
                            </p>
                            <p className="text-slate-700 text-[10px] tracking-widest mt-1">
                                SELECCIONA OTRO TRIM O MODELO
                            </p>
                        </div>
                    )}

                    {/* Error state */}
                    {error && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center px-8">
                            <p className="text-slate-400 text-sm mb-2">No se pudieron cargar los modelos.</p>
                            <p className="text-slate-600 text-xs">{error}</p>
                        </div>
                    )}

                    {/* Three.js canvas */}
                    <div className="flex-1 relative">
                        <ThreeViewer
                            ref={viewerRef}
                            modelUrl={model3dUrl}
                            onLoadProgress={handleProgress}
                            onLoaded={handleLoaded}
                            accentColor={accentColor}
                            lightMode={lightMode}
                            bodyColor={bodyColor}
                        />
                        <ViewerLoader progress={loaderProgress} visible={showLoader} />
                    </div>

                    {/* Bottom-left info */}
                    <div className="absolute bottom-6 left-8 z-20">
                        <p className="text-emerald-500 text-[9px] font-bold tracking-[0.2em]">
                            DRAG TO ROTATE · SCROLL TO ZOOM
                        </p>
                        <p className="text-slate-500 text-[9px] font-semibold tracking-[0.15em] mt-0.5">
                            POWERED BY ELEMOTOR 3D ENGINE
                        </p>
                    </div>

                    {/* Desktop controls — bottom right */}
                    <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
                        <button
                            onClick={handleResetCamera}
                            aria-label="Resetear cámara"
                            title="Resetear cámara"
                            className="w-10 h-10 rounded-full bg-[#15201D]/80 backdrop-blur-md border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        {LightingControls}
                        <button aria-label="Ayuda" className="w-10 h-10 rounded-full bg-[#15201D]/80 backdrop-blur-md border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            <HelpCircle className="w-4 h-4" />
                        </button>
                        <button aria-label="Compartir" className="w-10 h-10 rounded-full bg-[#15201D]/80 backdrop-blur-md border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Radial background glow */}
                    <div
                        className="absolute inset-0 pointer-events-none transition-all duration-1000"
                        style={{
                            background: `radial-gradient(ellipse 60% 50% at 50% 60%, ${accentColor}0A 0%, transparent 70%)`,
                        }}
                    />
                </div>

                {/* RIGHT — Configurator Panel (30%) */}
                <div className="flex-[3] h-full flex flex-col bg-[#0A110F] border-l border-white/5 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20 overflow-hidden">
                    {/* Title Bar - Fixed */}
                    <div className="shrink-0 px-6 py-5 border-b border-white/5 bg-[#0f172a]/20 backdrop-blur-md">
                        <p className="text-[10px] font-bold tracking-[0.25em] text-emerald-500/80 mb-2">
                            CONFIGURADOR VIRTUAL
                        </p>
                        <h1 className="text-2xl font-light text-white leading-tight">
                            {selectedModel
                                ? (
                                    <>
                                        {selectedModel.brand.name}{' '}
                                        <span className="font-black">{selectedModel.name}</span>
                                        <span className="text-slate-500 text-base font-normal ml-2">
                                            {selectedModel.year}
                                        </span>
                                    </>
                                )
                                : (
                                    <span className="text-slate-600">Cargando...</span>
                                )}
                        </h1>
                        {selectedTrim && (
                            <p className="text-slate-500 text-xs mt-1">{selectedTrim.name}</p>
                        )}
                    </div>

                    {/* Scrollable content */}
                    <div className="flex-1 overflow-y-auto min-h-0 px-6 py-6 space-y-7">
                        <ModelSelector
                            models={models}
                            selectedModel={selectedModel}
                            onSelect={handleSelectModel}
                            disabled={isLoadingModels}
                        />
                        <TrimSelector
                            trims={selectedModel?.trims ?? []}
                            selectedTrim={selectedTrim}
                            onSelect={handleSelectTrim}
                        />
                        <SpecsGrid spec={selectedTrim?.spec ?? null} trim={selectedTrim} />
                        <ExteriorColorSelector
                            colors={exteriorColors}
                            selectedColor={selectedExtColor}
                            onSelect={selectExtColor}
                        />
                        <InteriorColorSelector
                            colors={interiorColors}
                            selectedColor={selectedIntColor}
                            onSelect={selectIntColor}
                        />
                    </div>

                    {/* CTA Footer — always visible, never cut off */}
                    <div className="shrink-0 px-6 pb-6 border-t border-white/5 bg-[#0A110F]">
                        <CTAFooter quoteParams={getQuoteParams()} trim={selectedTrim} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default function ShowroomPage() {
    return (
        <Suspense>
            <ShowroomPageInner />
        </Suspense>
    );
}
