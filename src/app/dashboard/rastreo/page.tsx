'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowLeft,
    RefreshCw,
    Package,
    CheckCircle2,
    Anchor,
    Ship,
    FileText,
    ClipboardCheck,
    Car,
    Flag,
    MapPin
} from 'lucide-react';

const TRACKING_STEPS = [
    {
        title: 'Pedido Confirmado',
        description: 'Tu pedido ha sido registrado y confirmado exitosamente.',
        date: '12 Mar 2026, 09:30',
        icon: CheckCircle2,
        status: 'completed' // past completed
    },
    {
        title: 'En Puerto de Origen',
        description: 'El vehículo se encuentra en el puerto de embarque en China.',
        date: '18 Mar 2026, 14:15',
        icon: Anchor,
        status: 'completed'
    },
    {
        title: 'En Tránsito Marítimo',
        description: 'Tu vehículo está en camino. Tiempo estimado de llegada: 25-30 días.',
        date: '',
        icon: Ship,
        status: 'current' // currently pulsating
    },
    {
        title: 'En Aduanas',
        description: 'El vehículo será procesado por el servicio de aduanas.',
        date: '',
        icon: FileText,
        status: 'pending-60' // future steps
    },
    {
        title: 'En Nacionalización',
        description: 'Se están tramitando los documentos de nacionalización del vehículo.',
        date: '',
        icon: ClipboardCheck,
        status: 'pending-50'
    },
    {
        title: 'Listo para Entrega',
        description: 'Tu vehículo está preparado y listo para ser entregado en nuestro concesionario.',
        date: '',
        icon: Car,
        status: 'pending-40'
    },
    {
        title: 'Entregado',
        description: 'El vehículo ha sido entregado al cliente.',
        date: '',
        icon: Flag,
        status: 'pending-30'
    }
];

export default function RastreoPage() {
    return (
        <div className="min-h-full max-w-7xl mx-auto space-y-6">
            {/* Top Bar Navigation (Internal to page) */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm font-medium">
                    <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Dashboard
                    </Link>
                    <span className="text-slate-600">|</span>
                    <span className="text-[#10B981] flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        Elemotor
                    </span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#15201D] border border-white/5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Actualizar
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
                {/* Left Card: Order Status */}
                <div className="bg-[#15201D] border border-white/5 shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-slate-400" />
                        <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                            Rastreo de Pedido
                        </h3>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">Estado de tu Pedido</h2>

                    <div className="mb-6">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Codigo de rastreo</p>
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-950/40 border border-[#10B981]/20 text-[#10B981] font-mono text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            ELE-2026-00124
                        </div>
                    </div>

                    {/* Car Image Placeholder */}
                    <div className="w-full h-[220px] bg-gradient-to-b from-slate-900/50 to-slate-950 rounded-xl relative mb-8 overflow-hidden border border-white/5 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/40 via-[#0A110F] to-[#0A110F]"></div>
                        <Image
                            src="/MODELOS/AVATR-11.avif"
                            alt="AVATR 11"
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-contain p-4 drop-shadow-2xl z-10 hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    {/* Info Rows */}
                    <div className="space-y-4 mb-10">
                        <div className="flex items-center justify-between pb-4 border-b border-white/5">
                            <span className="text-xs font-bold text-slate-500 tracking-wider">MODELO</span>
                            <span className="text-sm font-bold text-white">AVATR 11</span>
                        </div>
                        <div className="flex items-center justify-between pb-4 border-b border-white/5">
                            <span className="text-xs font-bold text-slate-500 tracking-wider">VIN</span>
                            <span className="text-sm font-medium text-slate-400">Pendiente de asignación</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-[#0A110F] rounded-xl p-5 border border-white/5 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase flex-1">Progreso General</span>
                            <span className="text-sm font-bold text-[#10B981]">35%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                            <div className="h-full bg-[#10B981] rounded-full w-[35%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Tu vehículo se encuentra actualmente en tránsito marítimo.
                        </p>
                    </div>
                </div>

                {/* Right Card: Detail Tracking */}
                <div className="bg-[#15201D] border border-white/5 shadow-2xl rounded-2xl p-6 md:p-10">
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Seguimiento detallado</h2>
                    <p className="text-sm text-slate-400 mb-10">Historial completo de movimientos de tu pedido</p>

                    <div className="relative pl-6 md:pl-8 border-l-2 border-slate-800/60 ml-4 space-y-12">

                        {TRACKING_STEPS.map((step, index) => {
                            const Icon = step.icon;

                            if (step.status === 'completed') {
                                return (
                                    <div key={index} className="relative">
                                        <div className="absolute -left-[35px] md:-left-[43px] top-0 w-10 md:w-11 h-10 md:h-11 rounded-full bg-[#0A110F] border-2 border-[#10B981] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                            <Icon className="w-5 h-5 text-[#10B981]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="text-[#10B981] font-bold text-base mb-1">{step.title}</h4>
                                            <p className="text-sm text-slate-300 mb-2">{step.description}</p>
                                            {step.date && (
                                                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                                                    <Icon className="w-3.5 h-3.5" /> {step.date}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            }

                            if (step.status === 'current') {
                                return (
                                    <div key={index} className="relative">
                                        <div className="absolute -left-[35px] md:-left-[43px] top-0 w-10 md:w-11 h-10 md:h-11 rounded-full bg-[#10B981]/10 border-2 border-teal-400 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.3)] z-10 relative">
                                            <Icon className="w-5 h-5 text-teal-400" />
                                            <div className="absolute inset-0 rounded-full border-2 border-teal-400 animate-ping opacity-20"></div>
                                        </div>
                                        <div className="flex flex-col -mt-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                                <h4 className="text-white font-bold text-lg">{step.title}</h4>
                                                <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                                                    Estado Actual
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                );
                            }

                            const opacityMap: Record<string, string> = {
                                'pending-60': 'opacity-60',
                                'pending-50': 'opacity-50',
                                'pending-40': 'opacity-40',
                                'pending-30': 'opacity-30'
                            };

                            return (
                                <div key={index} className={`relative ${opacityMap[step.status] || 'opacity-30'}`}>
                                    <div className="absolute -left-[35px] md:-left-[43px] top-0 w-10 md:w-11 h-10 md:h-11 rounded-full bg-[#0A110F] border-2 border-slate-700 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-slate-400 font-bold text-base mb-1">{step.title}</h4>
                                        <p className="text-sm text-slate-400">{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}









                    </div>
                </div>
            </div>
        </div>
    );
}
