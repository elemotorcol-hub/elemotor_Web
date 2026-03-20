'use client';

import React, { useEffect, useState } from 'react';
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
    MapPin,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { orderService } from '@/services/order.service';
import { Order, OrderStatus } from '@/types/orders';

const STATUS_MAP: Record<string, number> = {
    'confirmed': 1,
    'port_origin': 2,
    'transit': 3,
    'customs': 4,
    'nationalization': 5,
    'ready': 6,
    'delivered': 7
};

function getStatusIcon(index: number) {
    const icons = [CheckCircle2, Anchor, Ship, FileText, ClipboardCheck, Car, Flag];
    return icons[index] || Package;
}

const STEP_TITLES = [
    'Pedido Confirmado',
    'En Puerto de Origen',
    'En Tránsito Marítimo',
    'En Aduanas',
    'En Nacionalización',
    'Listo para Entrega',
    'Entregado'
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

export default function RastreoPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const fetchMyOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Pasamos includeDetails para recibir la data totalmente hidratada en una sola llamada (Evita N+1)
            const response = await orderService.fetchMyOrders({ includeDetails: true });
            const list = Array.isArray(response) ? response : response.data || [];
            
            setOrders(list.length > 0 ? [list[0]] : []);
        } catch (err: unknown) {
            console.error('Error fetching my orders:', err);
            setError((err as Error).message || 'Error al cargar tus pedidos');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrders();
    }, []);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin text-[#10B981] mb-4" />
                <p className="font-medium">Cargando la información de tu vehículo...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 max-w-md mx-auto text-center px-6">
                <AlertCircle className="w-12 h-12 text-red-500/50 mb-4" />
                <h3 className="text-white font-bold text-lg mb-2">Ups, algo salió mal</h3>
                <p className="text-sm mb-6">{error}</p>
                <button 
                    onClick={fetchMyOrders}
                    className="px-6 py-2.5 bg-[#10B981] text-[#0A110F] font-bold rounded-xl hover:bg-emerald-400 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 max-w-md mx-auto text-center px-6">
                <Package className="w-12 h-12 text-slate-700 mb-4" />
                <h3 className="text-white font-bold text-lg mb-2">No tienes pedidos activos</h3>
                <p className="text-sm mb-8">
                    Aún no hemos registrado ningún pedido para tu cuenta. Si acabas de realizar una compra, puede tardar un poco en aparecer aquí.
                </p>
                <Link 
                    href="/dashboard"
                    className="px-6 py-2.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                    Volver al Dashboard
                </Link>
            </div>
        );
    }

    const order = orders[0];
    const currentStatusIndex = STATUS_MAP[order.status] || 1;
    const progressPercent = Math.round((currentStatusIndex / 7) * 100);

    const vehicleImages = order?.trim?.images && order.trim.images.length > 0 
        ? order.trim.images.map((img: { url: string; public_url?: string }) => img.public_url || img.url || '/placeholder.jpg')
        : ['/placeholder.jpg'];

    return (
        <div className="min-h-full max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm font-medium">
                    <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Dashboard
                    </Link>
                    <span className="text-slate-600">|</span>
                    <span className="text-[#10B981] flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        {order.trim?.model?.brand?.name || 'Elemotor'}
                    </span>
                </div>
                <button 
                    onClick={fetchMyOrders}
                    className="flex items-center gap-2 px-4 py-2 bg-[#15201D] border border-white/5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Actualizar
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
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
                            {order.trackingCode}
                        </div>
                    </div>

                    <div className="w-full h-[220px] bg-gradient-to-b from-slate-900/50 to-slate-950 rounded-xl relative mb-8 overflow-hidden border border-white/5 group/carousel">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/40 via-[#0A110F] to-[#0A110F] z-0"></div>
                        <img
                            src={vehicleImages[currentImageIndex]}
                            alt={order.trim?.model?.name || "Vehículo"}
                            className="w-full h-full object-contain p-4 drop-shadow-2xl z-10 hover:scale-105 transition-transform duration-700 relative"
                        />
                        
                        {/* Controles del Carrusel */}
                        {vehicleImages.length > 1 && (
                            <>
                                <button
                                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? vehicleImages.length - 1 : prev - 1))}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-[#10B981] transition-all duration-300 backdrop-blur-md border border-white/10 shadow-xl z-20"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setCurrentImageIndex((prev) => (prev === vehicleImages.length - 1 ? 0 : prev + 1))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-[#10B981] transition-all duration-300 backdrop-blur-md border border-white/10 shadow-xl z-20"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                
                                {/* Indicadores */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/30 px-2 py-1 rounded-full backdrop-blur-md overflow-hidden">
                                    {vehicleImages.map((_: string, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                currentImageIndex === idx ? 'w-4 bg-[#10B981]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-4 mb-10">
                        <div className="flex items-center justify-between pb-4 border-b border-white/5">
                            <span className="text-xs font-bold text-slate-500 tracking-wider">MODELO</span>
                            <span className="text-sm font-bold text-white">{order.trim?.model?.name || order.vehicleModel || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between pb-4 border-b border-white/5">
                            <span className="text-xs font-bold text-slate-500 tracking-wider">VIN</span>
                            <span className="text-sm font-medium text-slate-400">{order.vin || 'Pendiente de asignación'}</span>
                        </div>
                    </div>

                    <div className="bg-[#0A110F] rounded-xl p-5 border border-white/5 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase flex-1">Progreso General</span>
                            <span className="text-sm font-bold text-[#10B981]">{progressPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                            <div className="h-full bg-[#10B981] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {STEP_DESCRIPTIONS[currentStatusIndex - 1]}
                        </p>
                    </div>
                </div>

                <div className="bg-[#15201D] border border-white/5 shadow-2xl rounded-2xl p-6 md:p-10">
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Seguimiento detallado</h2>
                    <p className="text-sm text-slate-400 mb-10">Historial completo de movimientos de tu pedido</p>

                    <div className="relative ml-2 md:ml-4 space-y-8 md:space-y-10">
                        {/* Línea vertical del timeline */}
                        <div className="absolute top-0 bottom-0 left-[19px] md:left-[21px] w-0.5 bg-slate-800/60 z-0"></div>

                        {STEP_TITLES.map((title, index) => {
                            const stepIndex = index + 1;
                            const Icon = getStatusIcon(index);
                            const isCompleted = stepIndex < currentStatusIndex;
                            const isCurrent = stepIndex === currentStatusIndex;
                            
                            const historyEntry = order.statusHistory?.find((h) => STATUS_MAP[h.status] === stepIndex);
                            const dateStr = historyEntry ? new Date(historyEntry.date).toLocaleString('es-CO', { 
                                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                            }) : '';

                            if (isCompleted) {
                                return (
                                    <div key={index} className="relative flex items-start gap-4 md:gap-5 z-10">
                                        <div className="shrink-0 w-10 md:w-11 h-10 md:h-11 rounded-full bg-[#0A110F] border-2 border-[#10B981] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                                        </div>
                                        <div className="flex flex-col pt-1">
                                            <h4 className="text-[#10B981] font-bold text-base mb-1">{title}</h4>
                                            <p className="text-sm text-slate-300 mb-2">{STEP_DESCRIPTIONS[index]}</p>
                                            {dateStr && (
                                                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                                                    <Icon className="w-3.5 h-3.5" /> {dateStr}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            }

                            if (isCurrent) {
                                return (
                                    <div key={index} className="relative flex items-start gap-4 md:gap-5 z-10">
                                        <div className="shrink-0 w-10 md:w-11 h-10 md:h-11 rounded-full bg-[#10B981]/10 border-2 border-teal-400 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.3)] relative">
                                            <Icon className="w-5 h-5 text-teal-400" />
                                            <div className="absolute inset-0 rounded-full border-2 border-teal-400 animate-ping opacity-20"></div>
                                        </div>
                                        <div className="flex flex-col pt-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                                <h4 className="text-white font-bold text-lg">{title}</h4>
                                                <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                                                    Estado Actual
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-300 leading-relaxed">{STEP_DESCRIPTIONS[index]}</p>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={index} className="relative flex items-start gap-4 md:gap-5 opacity-30 z-10">
                                    <div className="shrink-0 w-10 md:w-11 h-10 md:h-11 rounded-full bg-[#0A110F] border-2 border-slate-700 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div className="flex flex-col pt-1">
                                        <h4 className="text-slate-400 font-bold text-base mb-1">{title}</h4>
                                        <p className="text-sm text-slate-400">{STEP_DESCRIPTIONS[index]}</p>
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
