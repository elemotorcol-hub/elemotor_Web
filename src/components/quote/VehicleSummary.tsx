import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Battery, Zap, Gauge, CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import { VehicleModel } from '@/types/inventory';
import { PaymentMethods } from '@/components/PaymentMethods';

const BANKS = [
    { name: 'Banco de Bogotá', bg: '#003087', text: '#FFFFFF', accent: '#1a4fa0' },
    { name: 'Bancolombia',     bg: '#FFD100', text: '#003366', accent: '#e6bc00' },
    { name: 'Sufi',            bg: '#00A859', text: '#FFFFFF', accent: '#008a47' },
    { name: 'BBVA',            bg: '#004481', text: '#FFFFFF', accent: '#1a5a9a' },
];


interface Props {
    vehicle?: VehicleModel;
}

export function VehicleSummary({ vehicle }: Props) {
    if (!vehicle) return null;

    // Obtener el primer trim para las specs principales
    const mainTrim = vehicle.trims && vehicle.trims.length > 0 ? vehicle.trims[0] : null;
    
    // Normalizar specs: el backend devuelve 'spec' (singular) y camelCase
    // El frontend espera 'specs' y snake_case.
    const rawSpecs: any = mainTrim?.specs || (mainTrim as any)?.spec;
    const specs = {
        range_wltp_km: rawSpecs?.rangeWltpKm || rawSpecs?.range_wltp_km || rawSpecs?.range_cltc_km,
        zero_to_100: rawSpecs?.zeroTo100 || rawSpecs?.zero_to_100,
        battery_kwh: rawSpecs?.batteryKwh || rawSpecs?.battery_kwh,
    };

    const imageUrl = vehicle.thumbnail || mainTrim?.images?.[0]?.url || '/placeholder-car.png';

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col group">
            {/* Image Section */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-800/50">
                <Image
                    src={imageUrl}
                    alt={vehicle.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A110F] via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-4 left-4">
                    <span className="bg-[#00D4AA] text-[#0A0F1C] text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg">
                        {vehicle.year} {vehicle.type}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex-1 flex flex-col">
                <div className="mb-6">
                    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight uppercase">{vehicle.name}</h3>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5 mb-8">
                    <div className="flex flex-col items-center text-center">
                        <Zap className="w-5 h-5 text-[#00D4AA] mb-2 opacity-80" />
                        <span className="text-[10px] text-slate-500 uppercase font-black mb-1">Autonomía</span>
                        <p className="text-sm font-bold text-white">{specs.range_wltp_km || 'N/A'} km</p>
                    </div>
                    <div className="flex flex-col items-center text-center border-x border-white/5 px-2">
                        <Gauge className="w-5 h-5 text-[#00D4AA] mb-2 opacity-80" />
                        <span className="text-[10px] text-slate-500 uppercase font-black mb-1">0-100 km/h</span>
                        <p className="text-sm font-bold text-white">{specs.zero_to_100 || 'N/A'}s</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <Battery className="w-5 h-5 text-[#00D4AA] mb-2 opacity-80" />
                        <span className="text-[10px] text-slate-500 uppercase font-black mb-1">Batería</span>
                        <p className="text-sm font-bold text-white">{specs.battery_kwh || 'N/A'} kWh</p>
                    </div>
                </div>

                {/* Highlights */}
                <div className="space-y-4 mb-8">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-[#00D4AA]/30"></span>
                        Características Destacadas
                    </h4>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-[#00D4AA] mt-0.5 shrink-0" />
                            <span className="text-sm text-slate-400 leading-relaxed">
                                {vehicle.description || 'Tecnología de vanguardia y diseño aerodinámico.'}
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Financing Section */}
                <div className="mt-6 rounded-2xl overflow-hidden border border-white/5 bg-[#060B14]/60">
                    <div className="p-7">
                        {/* Header row: texto + tarjetas apiladas */}
                        <div className="flex items-center justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                                <p className="text-[#00D4AA] text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                                    Financiamiento
                                </p>
                                <h3 className="text-2xl font-black text-white leading-tight mb-3">
                                    Financiamiento<br />disponible
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Tenemos convenios con los principales bancos del país para facilitar tu compra.
                                    Tasas competitivas y plazos flexibles.
                                </p>
                            </div>

                            {/* Tarjetas animadas — mismo componente que la landing */}
                            {/* position:absolute saca el deck del flujo → el wrapper
                                ocupa solo el espacio visual (176×110) sin whitespace extra.
                                overflow visible = la animación de abanico puede salir del borde */}
                            <div className="shrink-0 relative" style={{ width: '176px', height: '110px' }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%) scale(0.55)',
                                }}>
                                    <PaymentMethods variant="deck-only" />
                                </div>
                            </div>
                        </div>
                        <a
                            href="https://wa.me/573117762260?text=Hola%2C%20me%20interesa%20información%20sobre%20financiamiento%20para%20un%20vehículo%20eléctrico"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#00D4AA] text-[#00D4AA] font-semibold text-sm bg-transparent hover:bg-[#00D4AA]/10 transition-colors mt-5 mb-5"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Contactar un asesor
                        </a>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {BANKS.map((bank) => (
                                <span
                                    key={bank.name}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/10 text-slate-300"
                                >
                                    <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: bank.bg }}
                                    />
                                    {bank.name}
                                </span>
                            ))}
                        </div>
                        <p className="text-slate-600 text-xs">
                            * Consulta condiciones y requisitos con tu asesor Elemotor.
                        </p>
                    </div>

                    {/* Garantías button */}
                    <div className="px-7 pb-6">
                        <Link
                            href="/garantias"
                            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 text-slate-300 hover:border-[#00D4AA]/40 hover:text-[#00D4AA] font-semibold text-sm bg-white/5 hover:bg-[#00D4AA]/5 transition-all"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Política de Garantía
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
