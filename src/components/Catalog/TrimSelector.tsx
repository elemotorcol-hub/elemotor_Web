'use client';

import * as React from 'react';
import { DetailTrim } from '@/services/catalogModels.service';

interface TrimSelectorProps {
    trims: DetailTrim[];
    selectedTrimId: number;
    onTrimChange: (trim: DetailTrim) => void;
}

const TRIM_STATUS_LABELS: Record<string, string> = {
    stock: 'EN STOCK',
    transit: 'PREVENTA',
    order: 'POR PEDIDO',
};

const TRIM_STATUS_COLORS: Record<string, string> = {
    stock: 'text-emerald-400',
    transit: 'text-amber-400',
    order: 'text-sky-400',
};

const DESKTOP_COLS: Record<number, string> = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
};

export function TrimSelector({ trims, selectedTrimId, onTrimChange }: TrimSelectorProps) {
    if (!trims || trims.length === 0) return null;

    const desktopCols = DESKTOP_COLS[Math.min(trims.length, 4)] ?? 'lg:grid-cols-4';

    return (
        <section className="w-full">
            <h2 className="text-xl font-bold text-white mb-5">Versiones disponibles</h2>
            <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${desktopCols}`}>
                {trims.map((trim) => {
                    const isSelected = trim.id === selectedTrimId;
                    const statusLabel = TRIM_STATUS_LABELS[trim.status] ?? trim.status;
                    const statusColor = TRIM_STATUS_COLORS[trim.status] ?? 'text-slate-400';

                    return (
                        <button
                            key={trim.id}
                            onClick={() => onTrimChange(trim)}
                            aria-pressed={isSelected}
                            className={`min-h-[160px] p-5 rounded-2xl border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4AA] ${
                                isSelected
                                    ? 'bg-[#00D4AA]/10 border-[#00D4AA]/50 shadow-[0_0_20px_rgba(0,212,170,0.1)]'
                                    : 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/60'
                            }`}
                        >
                            <div className="flex flex-col justify-between h-full gap-3">
                                {/* Top: nombre + badge seleccionado + status */}
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <span className="text-base font-black text-white leading-tight">
                                            {trim.name}
                                        </span>
                                        {isSelected && (
                                            <span className="shrink-0 text-[9px] font-black tracking-[0.2em] text-[#00D4AA] bg-[#00D4AA]/10 border border-[#00D4AA]/30 px-2 py-0.5 rounded-full uppercase">
                                                Seleccionado
                                            </span>
                                        )}
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-widest ${statusColor}`}>
                                        {statusLabel}
                                    </span>
                                </div>

                                {/* Medio: specs compactas */}
                                {trim.spec && (
                                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-400">
                                        {trim.spec.batteryKwh && (
                                            <span>{parseFloat(trim.spec.batteryKwh)} kWh</span>
                                        )}
                                        {(trim.spec.rangeCltcKm || trim.spec.rangeWltpKm) && (
                                            <span>{trim.spec.rangeCltcKm ?? trim.spec.rangeWltpKm} km</span>
                                        )}
                                        {trim.spec.horsepower && (
                                            <span>{trim.spec.horsepower} HP</span>
                                        )}
                                    </div>
                                )}

                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
