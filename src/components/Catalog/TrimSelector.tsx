'use client';

import * as React from 'react';
import Link from 'next/link';
import { BatteryCharging, Navigation, Zap, Gauge, ChevronRight, ChevronLeft, FileText } from 'lucide-react';
import { DetailTrim } from '@/services/catalogModels.service';

interface TrimSelectorProps {
    trims: DetailTrim[];
    selectedTrimId: number;
    onTrimChange: (trim: DetailTrim) => void;
    modelId: number;
    datasheetUrl?: string | null;
}

const STATUS_LABEL: Record<string, string> = {
    stock: 'EN STOCK',
    transit: 'PREVENTA',
    order: 'POR PEDIDO',
};
const STATUS_DOT: Record<string, string> = {
    stock: 'bg-emerald-400',
    transit: 'bg-amber-400',
    order: 'bg-sky-400',
};

function extractTraction(name: string): string | null {
    if (/\b4WD\b/i.test(name)) return '4WD';
    if (/\b2WD\b/i.test(name)) return '2WD';
    if (/\bAWD\b/i.test(name)) return 'AWD';
    if (/\bRWD\b/i.test(name)) return 'RWD';
    if (/\bFWD\b/i.test(name)) return 'FWD';
    return null;
}

const VISIBLE = 4; // cards visible at once before showing arrows

export function TrimSelector({ trims, selectedTrimId, onTrimChange, modelId, datasheetUrl }: TrimSelectorProps) {
    if (!trims || trims.length === 0) return null;

    const scrollRef = React.useRef<HTMLDivElement>(null);
    const showArrows = trims.length > VISIBLE;

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const card = scrollRef.current.querySelector('[data-card]') as HTMLElement | null;
        const amount = card ? card.offsetWidth + 16 : scrollRef.current.clientWidth / VISIBLE;
        scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
    };

    return (
        <section className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white">Versiones disponibles</h2>
                {showArrows && (
                    <div className="flex gap-2">
                        <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Cards — grid up to 4, then horizontal scroll */}
            <div
                ref={scrollRef}
                className={`${showArrows ? 'flex gap-4 overflow-x-auto pb-1' : 'grid gap-4'} ${
                    !showArrows && (
                        trims.length === 1 ? 'grid-cols-1' :
                        trims.length === 2 ? 'grid-cols-2' :
                        trims.length === 3 ? 'grid-cols-3' :
                        'grid-cols-4'
                    )
                }`}
                style={{ scrollbarWidth: 'none' }}
            >
                {trims.map((trim, idx) => {
                    const isSelected = trim.id === selectedTrimId;
                    const statusLabel = STATUS_LABEL[trim.status] ?? trim.status;
                    const dotColor = STATUS_DOT[trim.status] ?? 'bg-slate-400';
                    const traction = extractTraction(trim.name);
                    const range = trim.spec?.rangeCltcKm ?? trim.spec?.rangeWltpKm;
                    const battery = trim.spec?.batteryKwh ? parseFloat(trim.spec.batteryKwh) : null;
                    const hp = trim.spec?.horsepower;
                    const cotizarHref = `/cotizar?modelo=${modelId}&trim=${trim.id}`;

                    return (
                        <div
                            key={trim.id}
                            data-card
                            className={`${showArrows ? 'shrink-0 w-[calc(25%-12px)]' : 'w-full'} flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden ${
                                isSelected
                                    ? 'border-[#00D4AA]/60 bg-[#0A1A14] shadow-[0_0_30px_rgba(0,212,170,0.12)]'
                                    : 'border-white/8 bg-[#0d1117] hover:border-white/20'
                            }`}
                        >
                            {/* Card top — clickable to select */}
                            <button
                                onClick={() => onTrimChange(trim)}
                                className="text-left p-5 flex-1 focus:outline-none"
                            >
                                {/* Badges row */}
                                <div className="flex items-center justify-between mb-3">
                                    {idx === 0 ? (
                                        <span className="text-[9px] font-black tracking-[0.18em] uppercase bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/30 px-2 py-0.5 rounded">
                                            RECOMENDADA
                                        </span>
                                    ) : <span />}
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                                        {statusLabel}
                                    </span>
                                </div>

                                {/* Name */}
                                <h3 className="text-lg font-black text-white leading-snug mb-4">
                                    {trim.name}
                                </h3>

                                {/* Spec icons grid */}
                                <div className="grid grid-cols-4 gap-2 mb-5">
                                    {battery != null && (
                                        <div className="flex flex-col items-center gap-1">
                                            <BatteryCharging className="w-5 h-5 text-[#00D4AA]" strokeWidth={1.5} />
                                            <span className="text-white text-[11px] font-bold">{battery} kWh</span>
                                            <span className="text-slate-500 text-[9px] leading-tight text-center">Batería</span>
                                        </div>
                                    )}
                                    {range != null && (
                                        <div className="flex flex-col items-center gap-1">
                                            <Navigation className="w-5 h-5 text-[#00D4AA]" strokeWidth={1.5} />
                                            <span className="text-white text-[11px] font-bold">{range} km</span>
                                            <span className="text-slate-500 text-[9px] leading-tight text-center">Autonomía</span>
                                        </div>
                                    )}
                                    {hp != null && (
                                        <div className="flex flex-col items-center gap-1">
                                            <Zap className="w-5 h-5 text-[#00D4AA]" strokeWidth={1.5} />
                                            <span className="text-white text-[11px] font-bold">{hp} HP</span>
                                            <span className="text-slate-500 text-[9px] leading-tight text-center">Potencia</span>
                                        </div>
                                    )}
                                    {traction && (
                                        <div className="flex flex-col items-center gap-1">
                                            <Gauge className="w-5 h-5 text-[#00D4AA]" strokeWidth={1.5} />
                                            <span className="text-white text-[11px] font-bold">{traction}</span>
                                            <span className="text-slate-500 text-[9px] leading-tight text-center">Tracción</span>
                                        </div>
                                    )}
                                </div>

                                {/* Price */}
                                <p className="text-slate-400 text-sm text-center border-t border-white/5 pt-4">
                                    Precio bajo cotización
                                </p>
                            </button>

                            {/* Action buttons */}
                            <div className="px-4 pb-4 flex gap-2">
                                <Link
                                    href={cotizarHref}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#00D4AA] hover:bg-[#00bfa0] text-[#060B14] font-black text-[11px] uppercase tracking-wider py-2.5 px-3 rounded-xl transition-all"
                                >
                                    Cotizar <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                                {datasheetUrl ? (
                                    <a
                                        href={`/api/upload/pdf-download?url=${encodeURIComponent(datasheetUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-[11px] uppercase tracking-wider py-2.5 px-3 rounded-xl transition-all"
                                    >
                                        <FileText className="w-3.5 h-3.5" />
                                        Ficha
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
