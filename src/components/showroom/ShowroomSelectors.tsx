'use client';

/**
 * ShowroomSelectors.tsx
 *
 * Dynamic selector components for the Showroom 3D panel.
 * All data comes from the backend API via the useShowroomData hook.
 */

import { ChevronDown } from 'lucide-react';
import type { ShowroomModel, ShowroomTrim, ShowroomColor } from '@/types/showroom';
import { useState } from 'react';

// ─── Model Selector ───────────────────────────────────────────────────────────

interface ModelSelectorProps {
    models: ShowroomModel[];
    selectedModel: ShowroomModel | null;
    onSelect: (slug: string) => void;
    disabled?: boolean;
}

export function ModelSelector({ models, selectedModel, onSelect, disabled }: ModelSelectorProps) {
    const [open, setOpen] = useState(false);

    if (models.length === 0) {
        return (
            <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 mb-3">MODELO</p>
                <div className="h-10 bg-white/3 border border-white/5 rounded-xl animate-pulse" />
            </div>
        );
    }

    return (
        <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 mb-3">MODELO</p>
            <div className="relative">
                <button
                    onClick={() => setOpen((p) => !p)}
                    disabled={disabled}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-[#15201D]/60 hover:border-emerald-500/30 transition-all text-left disabled:opacity-50"
                >
                    <div>
                        <p className="text-sm font-semibold text-white leading-none">
                            {selectedModel
                                ? `${selectedModel.brand.name} ${selectedModel.name}`
                                : 'Seleccionar modelo'}
                        </p>
                        {selectedModel && (
                            <p className="text-[10px] text-slate-500 mt-0.5">
                                {selectedModel.type} · {selectedModel.year}
                            </p>
                        )}
                    </div>
                    <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-2 ${open ? 'rotate-180' : ''
                            }`}
                    />
                </button>

                {open && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#0A110F] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        {models.map((model) => {
                            const isSelected = model.id === selectedModel?.id;
                            return (
                                <button
                                    key={model.id}
                                    onClick={() => {
                                        onSelect(model.slug);
                                        setOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors border-b border-white/5 last:border-0 ${isSelected
                                        ? 'bg-emerald-950/40 text-emerald-400'
                                        : 'hover:bg-white/5 text-slate-200'
                                        }`}
                                >
                                    <div>
                                        <p className="text-sm font-semibold leading-none">
                                            {model.brand.name} {model.name}
                                        </p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">
                                            {model.type} · {model.year}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Trim Selector ────────────────────────────────────────────────────────────

interface TrimSelectorProps {
    trims: ShowroomTrim[];
    selectedTrim: ShowroomTrim | null;
    onSelect: (trimId: number) => void;
}

export function TrimSelector({ trims, selectedTrim, onSelect }: TrimSelectorProps) {
    if (trims.length === 0) return null;

    return (
        <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 mb-3">VERSIÓN</p>
            <div className="grid grid-cols-2 gap-2">
                {trims.map((trim) => {
                    const isActive = trim.id === selectedTrim?.id;
                    const price = trim.price
                        ? `$${Number(trim.price).toLocaleString('es-CO')}`
                        : null;
                    return (
                        <button
                            key={trim.id}
                            onClick={() => onSelect(trim.id)}
                            className={`text-left p-3 rounded-xl border transition-all duration-200 ${isActive
                                ? 'border-emerald-500 bg-emerald-950/40'
                                : 'border-white/10 hover:border-white/20'
                                }`}
                        >
                            <p
                                className={`text-sm font-bold leading-tight ${isActive ? 'text-emerald-400' : 'text-white'
                                    }`}
                            >
                                {trim.name}
                            </p>
                            {price && (
                                <p className="text-[10px] text-slate-500 mt-1 tabular-nums">
                                    {price}
                                </p>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Exterior Color Selector ──────────────────────────────────────────────────

interface ExteriorColorSelectorProps {
    colors: ShowroomColor[];
    selectedColor: ShowroomColor | null;
    onSelect: (colorId: number) => void;
}

export function ExteriorColorSelector({
    colors,
    selectedColor,
    onSelect,
}: ExteriorColorSelectorProps) {
    if (colors.length === 0) return null;

    return (
        <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 mb-3">
                COLOR EXTERIOR
            </p>
            <div className="flex flex-wrap gap-2.5">
                {colors.map((color) => {
                    const isActive = color.id === selectedColor?.id;
                    return (
                        <button
                            key={color.id}
                            onClick={() => onSelect(color.id)}
                            title={color.name}
                            aria-label={`Seleccionar color exterior ${color.name}`}
                            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${isActive
                                ? 'border-emerald-400 scale-115 ring-2 ring-emerald-400/25'
                                : 'border-white/20 hover:scale-110 hover:border-white/40'
                                }`}
                            style={{ backgroundColor: color.hexCode }}
                        />
                    );
                })}
            </div>
            {selectedColor && (
                <p className="text-xs text-slate-500 mt-2">{selectedColor.name}</p>
            )}
        </div>
    );
}

// ─── Interior Color Selector ──────────────────────────────────────────────────

interface InteriorColorSelectorProps {
    colors: ShowroomColor[];
    selectedColor: ShowroomColor | null;
    onSelect: (colorId: number) => void;
}

export function InteriorColorSelector({
    colors,
    selectedColor,
    onSelect,
}: InteriorColorSelectorProps) {
    if (colors.length === 0) return null;

    return (
        <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 mb-3">
                COLOR INTERIOR
            </p>
            <div className="space-y-1.5">
                {colors.map((color) => {
                    const isActive = color.id === selectedColor?.id;
                    return (
                        <button
                            key={color.id}
                            onClick={() => onSelect(color.id)}
                            className={`shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all group ${isActive
                                ? 'border-emerald-500/60 bg-emerald-950/30'
                                : 'border-white/5 hover:border-white/15'
                                }`}
                        >
                            <div
                                className="w-5 h-5 rounded-full border border-white/20 flex-shrink-0"
                                style={{ backgroundColor: color.hexCode }}
                            />
                            <span className="text-sm text-slate-200 font-medium">{color.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
