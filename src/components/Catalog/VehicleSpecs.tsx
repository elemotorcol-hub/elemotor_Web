import { Battery, Zap, Expand, Cpu, Gauge, Clock, BoxSelect, Weight, MonitorSmartphone, Layers } from 'lucide-react';
import type { DetailSpec } from '@/services/catalogModels.service';
import React from 'react';

interface VehicleSpecsProps {
    spec: DetailSpec | null;
    trimName?: string;
}

// Helper — parse Decimal strings to display strings
function d(val: string | null | undefined, decimals = 1): string | null {
    if (val == null) return null;
    const n = parseFloat(val);
    return isNaN(n) ? null : n.toFixed(decimals).replace(/\.0$/, '');
}

function n(val: number | null | undefined): string | null {
    return val != null ? String(val) : null;
}

interface SpecBlock {
    icon: React.ElementType;
    title: string;
    value: string;
    subText: string;
}

interface SpecRow {
    label: string;
    value: string;
    unit?: string;
}

export function VehicleSpecs({ spec, trimName }: VehicleSpecsProps) {
    // ── 4 highlight cards ────────────────────────────────────────────────────
    const highlights: SpecBlock[] = [];

    const zeroTo100 = d(spec?.zeroTo100, 1);
    const hp = n(spec?.horsepower);
    if (zeroTo100 || hp) {
        highlights.push({
            icon: Zap,
            title: 'PERFORMANCE',
            value: zeroTo100 ? `0‑100 en ${zeroTo100}s` : '—',
            subText: hp ? `${hp} HP Potencia` : '—',
        });
    }

    const range = n(spec?.rangeCltcKm ?? spec?.rangeWltpKm);
    const battery = d(spec?.batteryKwh, 1);
    if (range || battery) {
        highlights.push({
            icon: Battery,
            title: 'BATERÍA',
            value: range ? `${range} km` : '—',
            subText: battery ? `${battery} kWh` : '—',
        });
    }

    const length = n(spec?.lengthMm);
    const width = n(spec?.widthMm);
    if (length || width) {
        highlights.push({
            icon: Expand,
            title: 'DIMENSIONES',
            value: length ? `L: ${(parseInt(length) / 1000).toFixed(2)}m` : '—',
            subText: width ? `Ancho: ${(parseInt(width) / 1000).toFixed(2)}m` : '—',
        });
    }

    const adas = n(spec?.adasLevel);
    const screen = n(spec?.screenSize);
    if (adas || screen) {
        highlights.push({
            icon: Cpu,
            title: 'TECNOLOGÍA',
            value: adas ? `ADAS L${adas}` : '—',
            subText: screen ? `Pantalla ${screen}"` : '—',
        });
    }

    // ── Spec categories ───────────────────────────────────────────────────────
    type SpecItem = { label: string; value: string; unit?: string };
    type SpecCategory = { title: string; icon: React.ElementType; items: SpecItem[] };

    const specCategories: SpecCategory[] = [
        {
            title: 'Energía',
            icon: Battery,
            items: [
                spec?.batteryKwh ? { label: 'Batería', value: d(spec.batteryKwh) ?? '—', unit: 'kWh' } : null,
                spec?.rangeCltcKm ? { label: 'Autonomía CLTC', value: n(spec.rangeCltcKm) ?? '—', unit: 'km' } : null,
                spec?.rangeWltpKm ? { label: 'Autonomía WLTP', value: n(spec.rangeWltpKm) ?? '—', unit: 'km' } : null,
                spec?.kwhPer100km ? { label: 'Consumo', value: d(spec.kwhPer100km) ?? '—', unit: 'kWh/100km' } : null,
                spec?.chargeTime3080 ? { label: 'Carga 30→80%', value: spec.chargeTime3080, unit: 'min' } : null,
            ].filter(Boolean) as SpecItem[],
        },
        {
            title: 'Performance',
            icon: Zap,
            items: [
                spec?.horsepower ? { label: 'Potencia', value: n(spec.horsepower) ?? '—', unit: 'HP' } : null,
                spec?.torque ? { label: 'Torque', value: n(spec.torque) ?? '—', unit: 'Nm' } : null,
                spec?.zeroTo100 ? { label: '0 – 100', value: d(spec.zeroTo100) ?? '—', unit: 's' } : null,
                spec?.topSpeed ? { label: 'Vel. máxima', value: n(spec.topSpeed) ?? '—', unit: 'km/h' } : null,
            ].filter(Boolean) as SpecItem[],
        },
        {
            title: 'Dimensiones',
            icon: Expand,
            items: [
                spec?.lengthMm ? { label: 'Longitud', value: n(spec.lengthMm) ?? '—', unit: 'mm' } : null,
                spec?.widthMm ? { label: 'Ancho', value: n(spec.widthMm) ?? '—', unit: 'mm' } : null,
                spec?.heightMm ? { label: 'Alto', value: n(spec.heightMm) ?? '—', unit: 'mm' } : null,
                spec?.wheelbaseMm ? { label: 'Entre ejes', value: n(spec.wheelbaseMm) ?? '—', unit: 'mm' } : null,
                spec?.curbWeightKg ? { label: 'Peso vacío', value: n(spec.curbWeightKg) ?? '—', unit: 'kg' } : null,
                spec?.trunkLiters ? { label: 'Baúl', value: n(spec.trunkLiters) ?? '—', unit: 'L' } : null,
            ].filter(Boolean) as SpecItem[],
        },
        {
            title: 'Tecnología',
            icon: Cpu,
            items: [
                adas ? { label: 'ADAS', value: `Nivel ${adas}` } : null,
                screen ? { label: 'Pantalla', value: `${screen}"` } : null,
                spec?.softwareVersion ? { label: 'Software', value: n(spec.softwareVersion) ?? '—' } : null,
            ].filter(Boolean) as SpecItem[],
        },
    ].filter((cat) => cat.items.length > 0);

    if (!spec && highlights.length === 0 && specCategories.length === 0) {
        return (
            <section className="w-full">
                <h2 className="text-2xl font-bold text-white mb-4">Especificaciones Técnicas</h2>
                <p className="text-slate-500 text-sm">Especificaciones no disponibles para esta versión.</p>
            </section>
        );
    }

    return (
        <section className="w-full">
            {/* Section header */}
            <div className="flex items-end gap-4 mb-10">
                <div>
                    <span className="text-[#00D4AA] font-bold tracking-widest uppercase text-xs mb-1 block">Ficha técnica</span>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                        ESPECIFICACIONES
                        {trimName && (
                            <span className="ml-3 text-base font-normal text-[#00D4AA] tracking-widest uppercase align-middle">{trimName}</span>
                        )}
                    </h2>
                </div>
            </div>

            {/* Highlight cards */}
            {highlights.length > 0 && (
                <div className={`grid grid-cols-2 md:grid-cols-${Math.min(highlights.length, 4)} gap-3 mb-12`}>
                    {highlights.map((h, index) => {
                        const Icon = h.icon;
                        return (
                            <div key={index} className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/40 border border-white/5 rounded-2xl p-5 flex flex-col items-center text-center overflow-hidden group hover:border-[#00D4AA]/30 transition-colors">
                                <div className="absolute inset-0 bg-[#00D4AA]/0 group-hover:bg-[#00D4AA]/[0.03] transition-colors" />
                                <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center mb-3">
                                    <Icon className="w-5 h-5 text-[#00D4AA]" aria-hidden="true" />
                                </div>
                                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">{h.title}</span>
                                <span className="text-xl md:text-2xl font-black text-white leading-none mb-1">{h.value}</span>
                                <span className="text-[10px] text-[#00D4AA] font-bold tracking-wider">{h.subText}</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Spec categories */}
            {specCategories.length > 0 && (
                <div className="space-y-8">
                    {specCategories.map((cat, ci) => {
                        const CatIcon = cat.icon;
                        return (
                            <div key={ci}>
                                {/* Category header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-7 h-7 rounded-lg bg-[#00D4AA]/10 flex items-center justify-center flex-shrink-0">
                                        <CatIcon className="w-3.5 h-3.5 text-[#00D4AA]" />
                                    </div>
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{cat.title}</span>
                                    <div className="flex-1 h-px bg-white/5" />
                                </div>

                                {/* Spec grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {cat.items.map((item, ii) => (
                                        <div
                                            key={ii}
                                            className="bg-slate-900/40 border border-white/5 rounded-xl px-4 py-3 flex flex-col gap-1 hover:border-[#00D4AA]/20 transition-colors"
                                        >
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                                            <div className="flex items-baseline gap-1 flex-wrap">
                                                <span className="text-lg font-black text-white leading-none">{item.value}</span>
                                                {item.unit && <span className="text-[10px] text-[#00D4AA] font-bold">{item.unit}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
