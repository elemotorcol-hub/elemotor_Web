'use client';

import React from 'react';
import Image from 'next/image';
import {
    Gauge, Wrench, ShieldCheck, Zap,
    Calendar, ArrowRight, Timer, HardDrive
} from 'lucide-react';

import { useRouter } from 'next/navigation';

// Using real data from models.ts for AVATR 11
const VEHICLE_SPECS = {
    brand: 'AVATR',
    model: '11',
    year: '2024',
    vin: '5YJ3E1EA...892',
    color: { name: 'Blanco Perla', hex: '#F8FAFC' },
    purchaseDate: '24 Oct, 2023',
    specs: [
        { label: 'Batería', value: '83 kWh', icon: HardDrive, detail: 'Litio-NCM' },
        { label: 'Autonomía', value: '610 km', icon: Zap, detail: 'Ciclo WLTP' },
        { label: 'Potencia', value: '578 HP', icon: Gauge, detail: 'Dual Motor AWD' },
        { label: 'Aceleración', value: '3.9 s', icon: Timer, detail: '0-100 km/h' },
        { label: 'Torque', value: '650 Nm', icon: Wrench, detail: 'Instantáneo' },
        { label: 'Carga Rápida', value: '25 min', icon: Zap, detail: '30% a 80%' },
    ]
};

export default function MiVehiculoPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-10 max-w-7xl mx-auto w-full pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
                        Mi <span className="text-[#10B981]">Vehículo</span>
                    </h1>
                    <p className="text-slate-400 font-medium">Especificaciones detalladas y estado técnico oficial.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <ShieldCheck className="w-4 h-4" />
                        Garantía de Fábrica Activa
                    </div>
                </div>
            </div>

            {/* Hero Card - Premium Presentation */}
            <div className="bg-[#15201D] border border-white/5 rounded-[40px] overflow-hidden flex flex-col lg:flex-row relative shadow-2xl group">
                {/* Visual Background Decoration */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#10B981]/5 to-transparent pointer-events-none" />

                {/* Left Side: Vehicle Image */}
                <div className="lg:w-[65%] h-[400px] lg:h-[500px] relative overflow-hidden bg-[#0A110F]">
                    <Image
                        src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2000&auto=format&fit=crop"
                        alt="AVATR 11 - Premium Edition"
                        fill
                        className="object-contain p-8 transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                        priority
                    />
                    {/* Artistic Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#15201D] hidden lg:block" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#15201D] to-transparent lg:hidden" />
                </div>

                {/* Right Side: Primary Info */}
                <div className="lg:w-[35%] p-10 lg:p-12 flex flex-col justify-center relative z-10 bg-[#15201D]/50 backdrop-blur-sm">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-[#10B981] uppercase tracking-[0.2em] mb-4 w-fit">
                        {VEHICLE_SPECS.brand} EXCLUSIVE
                    </div>
                    <h2 className="text-5xl font-black text-white mb-2 tracking-tighter leading-none">
                        {VEHICLE_SPECS.model}
                        <span className="block text-xl text-slate-500 mt-2 font-bold tracking-normal">{VEHICLE_SPECS.year} Edition</span>
                    </h2>

                    <div className="space-y-6 mt-8 pt-8 border-t border-white/5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Color</span>
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <span className="w-4 h-4 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: VEHICLE_SPECS.color.hex }} />
                                {VEHICLE_SPECS.color.name}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">VIN</span>
                            <span className="text-sm font-mono text-slate-300 bg-white/5 px-2 py-1 rounded-md">{VEHICLE_SPECS.vin}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Adquisición</span>
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <Calendar className="w-4 h-4 text-[#10B981]" />
                                {VEHICLE_SPECS.purchaseDate}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/dashboard/documentos')}
                        className="mt-10 w-full bg-[#10B981] hover:bg-emerald-400 text-[#0A110F] font-black py-5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 shadow-[0_10px_30px_rgba(16,185,129,0.2)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.4)] group/btn"
                    >
                        Manual del Propietario
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Technical Specs Grid */}
            <div className="space-y-6">
                <div className="flex items-center gap-4 px-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Especificaciones Técnicas</h3>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {VEHICLE_SPECS.specs.map((spec, idx) => {
                        const Icon = spec.icon;
                        return (
                            <div key={idx} className="bg-[#15201D] border border-white/5 p-8 rounded-[32px] hover:border-[#10B981]/30 transition-all duration-300 group hover:translate-y-[-4px] shadow-lg">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 bg-[#0A110F] rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-[#10B981] transition-colors border border-white/5 shadow-inner">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase py-1 px-2.5 rounded-full bg-white/5">
                                        Oficial
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{spec.label}</p>
                                    <h4 className="text-3xl font-black text-white mb-1 group-hover:text-[#10B981] transition-colors tracking-tighter">
                                        {spec.value}
                                    </h4>
                                    <p className="text-sm font-medium text-slate-400">{spec.detail}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
