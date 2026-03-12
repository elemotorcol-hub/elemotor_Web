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

export function TrimSelector({ trims, selectedTrimId, onTrimChange }: TrimSelectorProps) {
    if (!trims || trims.length === 0) return null;

    const formatPrice = (price: string | null): string => {
        if (!price) return 'Consultar';
        const num = parseFloat(price);
        return `$${num.toLocaleString('en-US')} USD`;
    };

    return (
        <section className="w-full">
            <h2 className="text-xl font-bold text-white mb-5">Versiones disponibles</h2>
            <div className="flex flex-col gap-3">
                {trims.map((trim) => {
                    const isSelected = trim.id === selectedTrimId;
                    const statusLabel = TRIM_STATUS_LABELS[trim.status] ?? trim.status;
                    const statusColor = TRIM_STATUS_COLORS[trim.status] ?? 'text-slate-400';

                    return (
                        <button
                            key={trim.id}
                            onClick={() => onTrimChange(trim)}
                            aria-pressed={isSelected}
                            className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4AA] ${
                                isSelected
                                    ? 'bg-[#00D4AA]/10 border-[#00D4AA]/50 shadow-[0_0_20px_rgba(0,212,170,0.1)]'
                                    : 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/60'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                                        <span className={`text-base font-black text-white truncate`}>
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
                                    {trim.spec && (
                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-slate-400">
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
                                <div className="text-right shrink-0">
                                    <span className={`text-xl font-black leading-none ${isSelected ? 'text-[#00D4AA]' : 'text-white'}`}>
                                        {formatPrice(trim.price)}
                                    </span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
