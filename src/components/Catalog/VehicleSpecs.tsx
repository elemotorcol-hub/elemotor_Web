import { Battery, Zap, Expand, Cpu, Gauge, Clock, BoxSelect, Weight, MonitorSmartphone, Layers } from 'lucide-react';
import type { DetailSpec } from '@/services/catalogModels.service';

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

    // ── Full spec table rows ─────────────────────────────────────────────────
    const rows: SpecRow[] = [
        { label: 'Batería', value: d(spec?.batteryKwh) ?? '—', unit: 'kWh' },
        { label: 'Autonomía CLTC', value: n(spec?.rangeCltcKm) ?? '—', unit: 'km' },
        { label: 'Autonomía WLTP', value: n(spec?.rangeWltpKm) ?? '—', unit: 'km' },
        { label: 'Potencia', value: n(spec?.horsepower) ?? '—', unit: 'HP' },
        { label: 'Torque', value: n(spec?.torque) ?? '—', unit: 'Nm' },
        { label: 'Aceleración 0‑100', value: d(spec?.zeroTo100) ?? '—', unit: 's' },
        { label: 'Velocidad máxima', value: n(spec?.topSpeed) ?? '—', unit: 'km/h' },
        { label: 'Carga 30→80%', value: spec?.chargeTime3080 ?? '—' },
        { label: 'Consumo', value: d(spec?.kwhPer100km) ?? '—', unit: 'kWh/100km' },
        { label: 'Baúl', value: n(spec?.trunkLiters) ?? '—', unit: 'L' },
        { label: 'Longitud', value: n(spec?.lengthMm) ?? '—', unit: 'mm' },
        { label: 'Ancho', value: n(spec?.widthMm) ?? '—', unit: 'mm' },
        { label: 'Alto', value: n(spec?.heightMm) ?? '—', unit: 'mm' },
        { label: 'Distancia entre ejes', value: n(spec?.wheelbaseMm) ?? '—', unit: 'mm' },
        { label: 'Peso en vacío', value: n(spec?.curbWeightKg) ?? '—', unit: 'kg' },
        { label: 'ADAS', value: adas ? `Nivel ${adas}` : '—' },
        { label: 'Pantalla', value: screen ? `${screen}"` : '—' },
        { label: 'Versión de software', value: n(spec?.softwareVersion) ?? '—' },
    ].filter((r) => r.value !== '—');

    if (!spec && highlights.length === 0 && rows.length === 0) {
        return (
            <section className="w-full">
                <h2 className="text-2xl font-bold text-white mb-4">Especificaciones Técnicas</h2>
                <p className="text-slate-500 text-sm">Especificaciones no disponibles para esta versión.</p>
            </section>
        );
    }

    return (
        <section className="w-full">
            <h2 className="text-2xl font-bold text-white mb-8 text-center md:text-left">
                Especificaciones Técnicas
                {trimName && (
                    <span className="ml-3 text-sm font-normal text-[#00D4AA] tracking-widest uppercase">{trimName}</span>
                )}
            </h2>

            {/* Highlight cards */}
            {highlights.length > 0 && (
                <div className={`grid grid-cols-2 md:grid-cols-${Math.min(highlights.length, 4)} gap-4 lg:gap-6 mb-10`}>
                    {highlights.map((spec, index) => {
                        const Icon = spec.icon;
                        return (
                            <div key={index} className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center transition-colors hover:border-[#00D4AA]/30">
                                <Icon className="w-6 h-6 text-[#00D4AA] mb-4 stroke-[1.5]" aria-hidden="true" />
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">{spec.title}</span>
                                <span className="text-lg md:text-2xl font-black text-white leading-tight mb-1">{spec.value}</span>
                                <span className="text-[10px] text-[#00D4AA] font-bold tracking-widest">{spec.subText}</span>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Full spec table */}
            {rows.length > 0 && (
                <div className="border border-white/5 rounded-2xl overflow-hidden">
                    {rows.map((row, i) => (
                        <div
                            key={i}
                            className={`flex justify-between items-center px-5 py-3.5 gap-4 ${
                                i % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/10'
                            } hover:bg-[#00D4AA]/5 transition-colors`}
                        >
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{row.label}</span>
                            <span className="text-sm text-white font-bold text-right">
                                {row.value}
                                {row.unit && <span className="text-slate-500 font-normal ml-1 text-xs">{row.unit}</span>}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
