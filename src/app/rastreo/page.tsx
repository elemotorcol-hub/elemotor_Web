'use client';

import React, { useState } from 'react';
import {
    Truck, ArrowRight, Loader2, AlertCircle, ArrowLeft,
    CheckCircle2, Anchor, Ship, FileText, ClipboardCheck, Car, Flag, Package, MapPin
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import dynamic from 'next/dynamic';
import { orderService } from '@/services/order.service';

const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

const STATUS_MAP: Record<string, number> = {
    'confirmed': 1, 'port_origin': 2, 'transit': 3,
    'customs': 4, 'nationalization': 5, 'ready': 6, 'delivered': 7
};

const STEP_TITLES = [
    'Pedido Confirmado', 'En Puerto de Origen', 'En Tránsito Marítimo',
    'En Aduanas', 'En Nacionalización', 'Listo para Entrega', 'Entregado'
];

const STEP_DESCRIPTIONS = [
    'Tu pedido ha sido registrado y confirmado exitosamente.',
    'El vehículo se encuentra en el puerto de embarque en China.',
    'Tu vehículo está en camino. Tiempo estimado de llegada: 25-30 días.',
    'El vehículo será procesado por el servicio de aduanas.',
    'Se están tramitando los documentos de nacionalización del vehículo.',
    'Tu vehículo está preparado y listo para ser entregado en nuestro concesionario.',
    'El vehículo ha sido entregado al cliente.'
];

function getIcon(index: number) {
    const icons = [CheckCircle2, Anchor, Ship, FileText, ClipboardCheck, Car, Flag];
    return icons[index] || Package;
}

type TrackingResult = any;

export default function RastreoPage() {
    const [trackingCode, setTrackingCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<TrackingResult | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingCode.trim()) {
            setError('Por favor ingresa el código de seguimiento.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await orderService.trackOrder(trackingCode.trim());
            setResult(data);
        } catch (err: any) {
            setError(err.message || 'No encontramos un pedido con ese código. Verifica e intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setError(null);
        setTrackingCode('');
    };

    const currentStatusIndex = result ? (STATUS_MAP[result.status] ?? 1) : 0;
    const progressPercent = Math.round((currentStatusIndex / 7) * 100);

    return (
        <div className="min-h-screen bg-[#060b13] flex flex-col selection:bg-[#00D4AA] selection:text-[#060b13]">
            <header>
                <Navbar />
            </header>

            <main className="flex-grow flex flex-col items-center justify-center p-4 relative overflow-hidden mt-16 lg:mt-24 mb-12">
                {/* Decorative Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00D4AA]/5 rounded-full blur-[120px] pointer-events-none" />

                {/* FORM VIEW */}
                {!result && (
                    <div className="w-full max-w-md bg-[#0d131f]/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-8 z-10 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/20 mb-4">
                                <Truck className="w-7 h-7 text-[#00D4AA]" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-3">Rastrea Tu Vehículo</h1>
                            <p className="text-sm text-slate-400 font-medium px-2">
                                Ingresa tu código de seguimiento para ver el estado de tu importación en tiempo real.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="tracking-code" className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                                    Código de Seguimiento
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Truck className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        id="tracking-code"
                                        type="text"
                                        value={trackingCode}
                                        onChange={(e) => setTrackingCode(e.target.value)}
                                        placeholder="ELE-2026-XXXXX"
                                        className="w-full bg-[#060b13]/50 border border-slate-800 text-slate-200 text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-[#00D4AA]/50 focus:border-[#00D4AA]/50 transition-colors placeholder:text-slate-600"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-2 bg-[#00D4AA] hover:bg-[#00B38F] disabled:opacity-60 disabled:cursor-not-allowed text-[#0A0F1C] font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_15px_rgba(0,212,170,0.2)] hover:shadow-[0_6px_20px_rgba(0,212,170,0.3)]"
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Consultando...</>
                                ) : (
                                    <>Consultar Estado <ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
                            <p className="text-xs text-slate-400">
                                ¿Tienes problemas con tu código?{' '}
                                <a href="#" className="text-[#00D4AA] hover:text-[#00B38F] transition-colors font-medium">
                                    Contacta a soporte
                                </a>
                            </p>
                        </div>
                    </div>
                )}

                {/* RESULTS VIEW */}
                {result && (
                    <div className="w-full max-w-5xl z-10 space-y-6">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Nueva consulta
                            </button>
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-950/40 border border-[#00D4AA]/20 text-[#00D4AA] font-mono text-sm font-bold shadow-[0_0_15px_rgba(0,212,170,0.1)]">
                                {result.trackingCode}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
                            {/* Left Card */}
                            <div className="bg-[#0d131f]/80 border border-slate-800/80 rounded-2xl p-6 md:p-8 flex flex-col backdrop-blur-md shadow-2xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <Package className="w-4 h-4 text-slate-400" />
                                    <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Resumen del Pedido</h3>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Estado de tu Pedido</h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                        <span className="text-xs font-bold text-slate-500 tracking-wider">MODELO</span>
                                        <span className="text-sm font-bold text-white">
                                            {result.trim?.model?.name || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                        <span className="text-xs font-bold text-slate-500 tracking-wider">VERSIÓN</span>
                                        <span className="text-sm font-medium text-slate-300">{result.trim?.name || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                        <span className="text-xs font-bold text-slate-500 tracking-wider">COLOR</span>
                                        <div className="flex items-center gap-2">
                                            {result.color?.hexCode && (
                                                <span
                                                    className="w-4 h-4 rounded-full border border-white/10"
                                                    style={{ backgroundColor: `#${result.color.hexCode}` }}
                                                />
                                            )}
                                            <span className="text-sm font-medium text-slate-300">{result.color?.name || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                        <span className="text-xs font-bold text-slate-500 tracking-wider">VIN</span>
                                        <span className="text-sm font-medium text-slate-400 font-mono">
                                            {result.vin || 'Pendiente de asignación'}
                                        </span>
                                    </div>
                                    {result.estimatedDelivery && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-500 tracking-wider">ENTREGA EST.</span>
                                            <span className="text-sm font-medium text-[#00D4AA]">
                                                {new Date(result.estimatedDelivery).toLocaleDateString('es-CO', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-[#060b13]/60 rounded-xl p-5 border border-white/5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase flex-1">Progreso General</span>
                                        <span className="text-sm font-bold text-[#00D4AA]">{progressPercent}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                                        <div
                                            className="h-full bg-[#00D4AA] rounded-full shadow-[0_0_10px_rgba(0,212,170,0.5)] transition-all duration-1000"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        {STEP_DESCRIPTIONS[currentStatusIndex - 1]}
                                    </p>
                                </div>
                            </div>

                            {/* Right: Timeline */}
                            <div className="bg-[#0d131f]/80 border border-slate-800/80 rounded-2xl p-6 md:p-10 backdrop-blur-md shadow-2xl">
                                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Seguimiento Detallado</h2>
                                <p className="text-sm text-slate-400 mb-10">Historial completo de movimientos de tu pedido</p>

                                <div className="relative pl-6 md:pl-8 border-l-2 border-slate-800/60 ml-4 space-y-12">
                                    {STEP_TITLES.map((title, index) => {
                                        const stepIndex = index + 1;
                                        const Icon = getIcon(index);
                                        const isCompleted = stepIndex < currentStatusIndex;
                                        const isCurrent = stepIndex === currentStatusIndex;

                                        const historyEntry = result.statusHistory?.find(
                                            (h: any) => STATUS_MAP[h.status] === stepIndex
                                        );
                                        const dateStr = historyEntry
                                            ? new Date(historyEntry.date).toLocaleString('es-CO', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })
                                            : '';

                                        if (isCompleted) {
                                            return (
                                                <div key={index} className="relative">
                                                    <div className="absolute -left-[35px] md:-left-[43px] top-0 w-10 md:w-11 h-10 md:h-11 rounded-full bg-[#060b13] border-2 border-[#00D4AA] flex items-center justify-center shadow-[0_0_15px_rgba(0,212,170,0.2)]">
                                                        <CheckCircle2 className="w-5 h-5 text-[#00D4AA]" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <h4 className="text-[#00D4AA] font-bold text-base mb-1">{title}</h4>
                                                        <p className="text-sm text-slate-300 mb-2">{STEP_DESCRIPTIONS[index]}</p>
                                                        {dateStr && (
                                                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                                                                <Icon className="w-3.5 h-3.5" /> {dateStr}
                                                            </span>
                                                        )}
                                                        {historyEntry?.description && (
                                                            <p className="text-xs text-slate-400 mt-1 italic">{historyEntry.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        if (isCurrent) {
                                            return (
                                                <div key={index} className="relative">
                                                    <div className="absolute -left-[35px] md:-left-[43px] top-0 w-10 md:w-11 h-10 md:h-11 rounded-full bg-[#00D4AA]/10 border-2 border-teal-400 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.3)] z-10 relative">
                                                        <Icon className="w-5 h-5 text-teal-400" />
                                                        <div className="absolute inset-0 rounded-full border-2 border-teal-400 animate-ping opacity-20" />
                                                    </div>
                                                    <div className="flex flex-col -mt-1">
                                                        <div className="flex flex-wrap items-center gap-3 mb-1">
                                                            <h4 className="text-white font-bold text-lg">{title}</h4>
                                                            <span className="px-2.5 py-0.5 rounded-full bg-[#00D4AA]/20 border border-[#00D4AA]/30 text-[#00D4AA] text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,212,170,0.1)]">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
                                                                Estado Actual
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-300 leading-relaxed">{STEP_DESCRIPTIONS[index]}</p>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={index} className="relative opacity-30">
                                                <div className="absolute -left-[35px] md:-left-[43px] top-0 w-10 md:w-11 h-10 md:h-11 rounded-full bg-[#060b13] border-2 border-slate-700 flex items-center justify-center">
                                                    <Icon className="w-5 h-5 text-slate-500" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h4 className="text-slate-400 font-bold text-base mb-1">{title}</h4>
                                                    <p className="text-sm text-slate-500">{STEP_DESCRIPTIONS[index]}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
