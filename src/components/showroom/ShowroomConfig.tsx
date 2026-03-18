'use client';

/**
 * ShowroomConfig.tsx
 *
 * Specs grid and CTA footer for the Showroom, powered by real API data.
 */

import Link from 'next/link';
import type { ShowroomSpec, ShowroomTrim } from '@/types/showroom';

// ─── Specs Grid ───────────────────────────────────────────────────────────────

interface SpecsGridProps {
    spec: ShowroomSpec | null;
    trim: ShowroomTrim | null;
}

interface SpecItem {
    value: string;
    unit: string;
    label: string;
}

function buildSpecItems(spec: ShowroomSpec | null): SpecItem[] {
    if (!spec) return [];

    const items: SpecItem[] = [];

    // Autonomía WLTP (preferida) o CLTC
    if (spec.rangeWltpKm != null) {
        items.push({ value: String(spec.rangeWltpKm), unit: 'km', label: 'AUTONOMÍA WLTP' });
    } else if (spec.rangeCltcKm != null) {
        items.push({ value: String(spec.rangeCltcKm), unit: 'km', label: 'AUTONOMÍA CLTC' });
    }

    // 0-100
    if (spec.zeroTo100 != null) {
        items.push({ value: String(spec.zeroTo100), unit: 's', label: '0–100 KM/H' });
    }

    // Velocidad máxima
    if (spec.topSpeed != null) {
        items.push({ value: String(spec.topSpeed), unit: 'km/h', label: 'VEL. MÁXIMA' });
    }

    // Potencia (si no llenamos 3 items)
    if (items.length < 3 && spec.horsepower != null) {
        items.push({ value: String(spec.horsepower), unit: 'HP', label: 'POTENCIA' });
    }

    // Batería (si no llenamos 3 items)
    if (items.length < 3 && spec.batteryKwh != null) {
        items.push({ value: String(spec.batteryKwh), unit: 'kWh', label: 'BATERÍA' });
    }

    return items.slice(0, 3);
}

export function SpecsGrid({ spec, trim }: SpecsGridProps) {
    const items = buildSpecItems(spec ?? trim?.spec ?? null);

    if (items.length === 0) {
        return (
            <div className="py-5 border-y border-white/5">
                <p className="text-slate-600 text-xs text-center tracking-wider">
                    SIN ESPECIFICACIONES DISPONIBLES
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-4 py-5 border-y border-white/5">
            {items.map(({ value, unit, label }) => (
                <div key={label} className="text-center">
                    <p className="text-white font-black text-xl leading-none tabular-nums">
                        {value}
                        <span className="text-emerald-400 text-xs font-bold ml-0.5">{unit}</span>
                    </p>
                    <p className="text-slate-500 text-[9px] tracking-widest font-semibold mt-1.5">
                        {label}
                    </p>
                </div>
            ))}
        </div>
    );
}

// ─── CTA Footer ───────────────────────────────────────────────────────────────

interface CTAFooterProps {
    quoteParams: URLSearchParams;
    trim: ShowroomTrim | null;
}

function formatPrice(price: string | null): string {
    if (!price) return 'Consultar precio';
    const num = Number(price);
    return isNaN(num) ? price : `$${num.toLocaleString('es-CO')}`;
}

export function CTAFooter({ quoteParams, trim }: CTAFooterProps) {
    const price = formatPrice(trim?.price ?? null);
    const cotizarHref = `/cotizar?${quoteParams.toString()}`;

    return (
        <div className="space-y-4 pt-5">
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-[9px] tracking-[0.2em] text-slate-500 font-semibold">
                        PRECIO ESTIMADO
                    </p>
                    <p className="text-white font-black text-2xl leading-tight mt-0.5 tabular-nums">
                        {price}
                    </p>
                </div>
                {trim && (
                    <div className="text-right">
                        <p className="text-slate-500 text-[10px] tracking-widest font-semibold">
                            {trim.status === 'stock'
                                ? 'EN STOCK'
                                : trim.status === 'transit'
                                    ? 'EN TRÁNSITO'
                                    : 'BAJO PEDIDO'}
                        </p>
                    </div>
                )}
            </div>

            <Link
                href={cotizarHref}
                className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-bold text-sm tracking-widest py-4 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20"
            >
                COTIZAR ESTA CONFIGURACIÓN <span className="text-base">→</span>
            </Link>

            <p className="text-center text-[9px] text-slate-600 tracking-widest">
                INCLUYE INCENTIVOS TRIBUTARIOS LOCALES
            </p>
        </div>
    );
}
