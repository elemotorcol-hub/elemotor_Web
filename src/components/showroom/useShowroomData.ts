'use client';

/**
 * useShowroomData.ts
 *
 * Central state hook for the Showroom 3D page.
 * Loads models from the API, manages selections, and fetches 3D model URLs per trim.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
    ShowroomModel,
    ShowroomTrim,
    ShowroomColor,
    ViewMode,
} from '@/types/showroom';
import {
    fetchShowroomModels,
    fetchShowroomModelBySlug,
    fetchModel3dByTrimId,
} from '@/services/showroom.service';

// ─── State shape ──────────────────────────────────────────────────────────────

interface UseShowroomDataReturn {
    // Data
    models: ShowroomModel[];
    selectedModel: ShowroomModel | null;
    selectedTrim: ShowroomTrim | null;
    exteriorColors: ShowroomColor[];
    interiorColors: ShowroomColor[];
    selectedExtColor: ShowroomColor | null;
    selectedIntColor: ShowroomColor | null;
    viewMode: ViewMode;
    model3dUrl: string | null;
    interiorImageUrl: string | null;

    // Loading/Error
    isLoadingModels: boolean;
    isLoading3d: boolean;
    error: string | null;

    // Actions
    selectModel: (slug: string) => void;
    selectTrim: (trimId: number) => void;
    selectExtColor: (colorId: number) => void;
    selectIntColor: (colorId: number) => void;
    toggleViewMode: () => void;
    getQuoteParams: () => URLSearchParams;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useShowroomData(initialSlug?: string | null): UseShowroomDataReturn {
    const [models, setModels] = useState<ShowroomModel[]>([]);
    const [selectedModel, setSelectedModel] = useState<ShowroomModel | null>(null);
    const [selectedTrim, setSelectedTrim] = useState<ShowroomTrim | null>(null);
    const [selectedExtColor, setSelectedExtColor] = useState<ShowroomColor | null>(null);
    const [selectedIntColor, setSelectedIntColor] = useState<ShowroomColor | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('exterior');
    const [model3dUrl, setModel3dUrl] = useState<string | null>(null);
    const [isLoadingModels, setIsLoadingModels] = useState(true);
    const [isLoading3d, setIsLoading3d] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ─── Abort Controllers ──────────────────────────────────────────────
    const modelsAbortRef = useRef<AbortController | null>(null);
    const model3dAbortRef = useRef<AbortController | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (modelsAbortRef.current) modelsAbortRef.current.abort();
            if (model3dAbortRef.current) model3dAbortRef.current.abort();
        };
    }, []);

    // ── Derived: colors per trim ───────────────────────────────────────────────
    const exteriorColors =
        selectedTrim?.colors.filter((c) => c.type === 'exterior') ?? [];
    const interiorColors =
        selectedTrim?.colors.filter((c) => c.type === 'interior') ?? [];

    // ── Derived: interior image URL (for interior view mode) ──────────────────
    const interiorImageUrl =
        selectedIntColor?.imageUrl ??
        (selectedTrim?.images ?? []).find((img) => img.type === 'interior')?.url ??
        null;

    // ── Load 3D model URL when trim changes ────────────────────────────────────
    const load3dUrl = useCallback(async (trimId: number) => {
        if (model3dAbortRef.current) model3dAbortRef.current.abort();
        const abortCtrl = new AbortController();
        model3dAbortRef.current = abortCtrl;
        const { signal } = abortCtrl;

        setIsLoading3d(true);
        setModel3dUrl(null);
        try {
            const model3d = await fetchModel3dByTrimId(trimId, { signal });
            if (!signal.aborted) {
                setModel3dUrl(model3d?.fileUrl ?? null);
            }
        } catch (err: any) {
            if (err.name !== 'AbortError' && !signal.aborted) {
                setModel3dUrl(null);
            }
        } finally {
            if (!signal.aborted) {
                setIsLoading3d(false);
            }
        }
    }, []);

    // ── Initial model load ─────────────────────────────────────────────────────
    useEffect(() => {
        if (modelsAbortRef.current) modelsAbortRef.current.abort();
        const abortCtrl = new AbortController();
        modelsAbortRef.current = abortCtrl;
        const { signal } = abortCtrl;

        async function loadModels() {
            setIsLoadingModels(true);
            setError(null);
            try {
                const data = await fetchShowroomModels({ signal });
                if (signal.aborted) return;
                setModels(data);

                // Auto-select the model from initialSlug or fallback to first
                if (data.length > 0) {
                    const targetSlug = initialSlug && data.find((m) => m.slug === initialSlug)
                        ? initialSlug
                        : data[0].slug;
                    const fullModel = await fetchShowroomModelBySlug(targetSlug, { signal });
                    if (signal.aborted) return;
                    setSelectedModel(fullModel);

                    const firstTrim = fullModel.trims[0] ?? null;
                    setSelectedTrim(firstTrim);

                    if (firstTrim) {
                        const extColors = firstTrim.colors.filter((c) => c.type === 'exterior');
                        const intColors = firstTrim.colors.filter((c) => c.type === 'interior');
                        setSelectedExtColor(extColors[0] ?? null);
                        setSelectedIntColor(intColors[0] ?? null);
                        load3dUrl(firstTrim.id);
                    }
                }
            } catch (err: any) {
                if (err.name !== 'AbortError' && !signal.aborted) {
                    setError(err instanceof Error ? err.message : 'Error cargando modelos');
                }
            } finally {
                if (!signal.aborted) {
                    setIsLoadingModels(false);
                }
            }
        }

        loadModels();
    }, [load3dUrl]); // Only runs on mount

    // ── Actions ────────────────────────────────────────────────────────────────

    const selectModel = useCallback(async (slug: string) => {
        if (modelsAbortRef.current) modelsAbortRef.current.abort();
        const abortCtrl = new AbortController();
        modelsAbortRef.current = abortCtrl;
        const { signal } = abortCtrl;

        setError(null);
        try {
            const fullModel = await fetchShowroomModelBySlug(slug, { signal });
            if (signal.aborted) return;
            setSelectedModel(fullModel);

            const firstTrim = fullModel.trims[0] ?? null;
            setSelectedTrim(firstTrim);

            if (firstTrim) {
                const extColors = firstTrim.colors.filter((c) => c.type === 'exterior');
                const intColors = firstTrim.colors.filter((c) => c.type === 'interior');
                setSelectedExtColor(extColors[0] ?? null);
                setSelectedIntColor(intColors[0] ?? null);
                load3dUrl(firstTrim.id);
            } else {
                setSelectedExtColor(null);
                setSelectedIntColor(null);
                if (model3dAbortRef.current) model3dAbortRef.current.abort();
                setModel3dUrl(null);
            }
        } catch (err: any) {
            if (err.name !== 'AbortError' && !signal.aborted) {
                setError(err instanceof Error ? err.message : 'Error cargando modelo');
            }
        }
    }, [load3dUrl]);

    const selectTrim = useCallback((trimId: number) => {
        if (!selectedModel) return;
        const trim = selectedModel.trims.find((t) => t.id === trimId) ?? null;
        setSelectedTrim(trim);

        if (trim) {
            const extColors = trim.colors.filter((c) => c.type === 'exterior');
            const intColors = trim.colors.filter((c) => c.type === 'interior');
            setSelectedExtColor(extColors[0] ?? null);
            setSelectedIntColor(intColors[0] ?? null);
            load3dUrl(trim.id);
        } else {
            if (model3dAbortRef.current) model3dAbortRef.current.abort();
            setModel3dUrl(null);
        }
    }, [selectedModel, load3dUrl]);

    const selectExtColor = useCallback((colorId: number) => {
        const color = exteriorColors.find((c) => c.id === colorId) ?? null;
        setSelectedExtColor(color);
    }, [exteriorColors]);

    const selectIntColor = useCallback((colorId: number) => {
        const color = interiorColors.find((c) => c.id === colorId) ?? null;
        setSelectedIntColor(color);
    }, [interiorColors]);

    const toggleViewMode = useCallback(() => {
        setViewMode((prev) => (prev === 'exterior' ? 'interior' : 'exterior'));
    }, []);

    const getQuoteParams = useCallback(() => {
        const params = new URLSearchParams();
        if (selectedModel) params.set('modelo', String(selectedModel.id));
        if (selectedTrim) params.set('trim', String(selectedTrim.id));
        if (selectedExtColor) {
            params.set('colorExt', String(selectedExtColor.id));
            params.set('color', selectedExtColor.name);
        }
        if (selectedIntColor) params.set('colorInt', String(selectedIntColor.id));
        return params;
    }, [selectedModel, selectedTrim, selectedExtColor, selectedIntColor]);

    return {
        models,
        selectedModel,
        selectedTrim,
        exteriorColors,
        interiorColors,
        selectedExtColor,
        selectedIntColor,
        viewMode,
        model3dUrl,
        interiorImageUrl,
        isLoadingModels,
        isLoading3d,
        error,
        selectModel,
        selectTrim,
        selectExtColor,
        selectIntColor,
        toggleViewMode,
        getQuoteParams,
    };
}
