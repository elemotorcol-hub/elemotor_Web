'use client';

import { motion } from 'framer-motion';
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

    if (!spec && highlights.length === 0 && specCategories.length === 0) return null;

    return (
        <section className="relative w-full py-24 overflow-hidden bg-[#060B14]">

            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.15]"
                    style={{ backgroundImage: 'radial-gradient(circle, rgba(0,212,170,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute -top-60 -right-60 w-[700px] h-[700px] rounded-full opacity-10 blur-3xl"
                    style={{ background: 'radial-gradient(ellipse at center, #00D4AA 0%, transparent 70%)' }} />
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
                    style={{ background: 'radial-gradient(ellipse at center, #00D4AA 0%, transparent 70%)' }} />
            </div>

            <div className="relative z-10 container mx-auto px-6 max-w-7xl">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-14"
                >
                    <span className="text-[#00D4AA] font-bold tracking-widest uppercase text-sm mb-2 block">Ficha técnica</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        ESPECIFICACIONES
                        {trimName && <span className="ml-3 text-lg font-normal text-[#00D4AA] tracking-widest uppercase align-middle">{trimName}</span>}
                    </h2>
                </motion.div>

                {/* Highlight stats — horizontal bar */}
                {highlights.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden mb-16 border border-white/5"
                    >
                        {highlights.map((h, i) => {
                            const Icon = h.icon;
                            return (
                                <div key={i} className="relative bg-[#080E1C] px-8 py-8 flex flex-col gap-3 group hover:bg-[#0d1829] transition-colors duration-300 overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D4AA]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="w-9 h-9 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-4 h-4 text-[#00D4AA]" />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{h.title}</span>
                                    </div>
                                    <span className="text-3xl md:text-4xl font-black text-white leading-none">{h.value}</span>
                                    <span className="text-xs text-[#00D4AA] font-bold tracking-wider">{h.subText}</span>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {/* Spec categories */}
                {specCategories.length > 0 && (
                    <div className="space-y-12">
                        {specCategories.map((cat, ci) => {
                            const CatIcon = cat.icon;
                            return (
                                <motion.div
                                    key={ci}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ duration: 0.5, delay: ci * 0.07 }}
                                >
                                    {/* Category header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-2xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center flex-shrink-0">
                                            <CatIcon className="w-5 h-5 text-[#00D4AA]" />
                                        </div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">{cat.title}</h3>
                                        <div className="flex-1 h-px bg-gradient-to-r from-[#00D4AA]/20 to-transparent" />
                                    </div>

                                    {/* Spec cards */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                        {cat.items.map((item, ii) => (
                                            <motion.div
                                                key={ii}
                                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                                className="relative bg-[#080E1C] border border-white/5 rounded-2xl px-5 py-5 flex flex-col gap-2 group overflow-hidden cursor-default hover:border-[#00D4AA]/25 transition-colors duration-300"
                                            >
                                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,212,170,0.06)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.label}</span>
                                                <div className="flex items-baseline gap-1.5 flex-wrap">
                                                    <span className="text-2xl font-black text-white leading-none">{item.value}</span>
                                                    {item.unit && <span className="text-[11px] text-[#00D4AA] font-black tracking-wider">{item.unit}</span>}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
