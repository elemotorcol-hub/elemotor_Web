import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BatteryCharging, Navigation, Timer } from 'lucide-react';
import { Button } from '@/components/Button';
import { Vehicle } from '@/data/models';

interface ModelCardProps {
    vehicle: Vehicle;
    priority?: boolean;
}

export function ModelCard({ vehicle, priority = false }: ModelCardProps) {
    return (
        <div className="bg-[#0A0F1C] border border-white/5 rounded-2xl overflow-hidden group hover:border-[#00D4AA]/30 transition-all duration-500 shadow-2xl flex flex-col h-full relative">
            {/* Status Badge */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#00B38F]/10 border border-[#00D4AA]/20 rounded-md text-[10px] font-bold text-[#00D4AA] uppercase tracking-widest backdrop-blur-sm">
                {vehicle.stockStatus}
            </div>

            {/* Vehículo Image */}
            <div className="relative h-64 w-full bg-[#050B14] flex items-center justify-center p-6 overflow-hidden">
                {/* Generador de Brillo en Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent opacity-90 z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-[#00D4AA]/10 rounded-full blur-[70px] group-hover:bg-[#00D4AA]/30 transition-all duration-700 pointer-events-none" />

                <div className="relative w-full h-full z-20 group-hover:scale-105 transition-transform duration-700 ease-out">
                    <Image
                        src={vehicle.image}
                        alt={vehicle.model}
                        fill
                        className="object-contain object-center drop-shadow-2xl"
                        sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 30vw"
                        priority={priority}
                    />
                </div>
            </div>

            {/* Info Section */}
            <div className="p-6 md:p-8 flex flex-col flex-grow relative z-20 -mt-6 bg-gradient-to-b from-transparent to-[#0A0F1C]">
                {/* Brand & Name */}
                <div className="mb-8">
                    <span className="text-[10px] text-[#00D4AA] font-bold tracking-[0.2em] uppercase mb-1 block">
                        {vehicle.brand}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-none">
                        {vehicle.model}
                    </h3>
                </div>

                {/* Specs Grid */}
                <div className="flex justify-between gap-3 mb-8 py-2">
                    {/* Batería */}
                    <div className="flex-1 bg-slate-900/40 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 backdrop-blur-sm">
                        <BatteryCharging className="w-5 h-5 text-[#00D4AA]" />
                        <span className="text-white font-medium text-xs md:text-sm">
                            {vehicle.battery_kwh} <span className="text-slate-400 text-xs">kWh</span>
                        </span>
                    </div>
                    {/* Autonomía */}
                    <div className="flex-1 bg-slate-900/40 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 backdrop-blur-sm">
                        <Navigation className="w-5 h-5 text-[#00D4AA]" />
                        <span className="text-white font-medium text-xs md:text-sm">
                            {vehicle.range_wltp_km} <span className="text-slate-400 text-xs">km</span>
                        </span>
                    </div>
                    {/* Aceleración */}
                    <div className="flex-1 bg-slate-900/40 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 backdrop-blur-sm">
                        <Timer className="w-5 h-5 text-[#00D4AA]" />
                        <span className="text-white font-medium text-xs md:text-sm">
                            {vehicle.zero_to_100}<span className="text-slate-400 text-xs">s</span>
                        </span>
                    </div>
                </div>

                {/* Footer: Price & Actions */}
                <div className="mt-auto">
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-[0.15em]">
                            INVERSIÓN
                        </span>
                        <span className="text-3xl font-black text-[#00D4AA] leading-none tracking-tighter">
                            ${vehicle.price.toLocaleString('en-US')}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href={`/modelos/${vehicle.id}`} className="w-full">
                            <Button
                                variant="ghost"
                                className="w-full h-12 bg-transparent border border-white/10 hover:border-[#00D4AA]/50 hover:bg-[#00D4AA]/5 text-white font-bold text-xs tracking-widest uppercase transition-all rounded-lg"
                            >
                                DETALLES
                            </Button>
                        </Link>
                        <Link href={`#cotizar?modelo=${vehicle.id}`} className="w-full">
                            <Button
                                className="w-full h-12 bg-[#00D4AA] hover:bg-[#33DDBC] text-slate-900 font-black text-xs tracking-widest uppercase rounded-lg transition-all"
                            >
                                COTIZAR
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
