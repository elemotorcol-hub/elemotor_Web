'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
    Gauge, Wrench, ShieldCheck, Zap,
    Calendar, ArrowRight, Timer, HardDrive,
    ChevronLeft, ChevronRight
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { orderService } from '@/services/order.service';

export default function MiVehiculoPage() {
    const router = useRouter();
    const [vehicleSpecs, setVehicleSpecs] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const data = await orderService.fetchMyVehicle();
                if (data) {
                    const mappedSpecs = {
                        brand: data.trim.model.brand.name,
                        model: data.trim.model.name,
                        year: data.trim.model.year.toString(),
                        vin: data.vin || 'En asignación',
                        color: { name: data.color.name, hex: `#${data.color.hexCode}` },
                        purchaseDate: new Date(data.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }),
                        images: data.trim.images?.length > 0 ? data.trim.images.map((img: any) => img.url) : ['/placeholder.jpg'],
                        trimName: data.trim.name,
                        specs: [
                            { label: 'Batería', value: data.trim.spec?.batteryKwh ? `${data.trim.spec.batteryKwh} kWh` : '-', icon: HardDrive, detail: 'Capacidad' },
                            { label: 'Autonomía', value: (data.trim.spec?.rangeWltpKm || data.trim.spec?.rangeCltcKm) ? `${data.trim.spec?.rangeWltpKm || data.trim.spec?.rangeCltcKm} km` : '-', icon: Zap, detail: 'Ciclo oficial' },
                            { label: 'Potencia', value: data.trim.spec?.horsepower ? `${data.trim.spec.horsepower} HP` : '-', icon: Gauge, detail: 'Potencia Máxima' },
                            { label: 'Aceleración', value: data.trim.spec?.zeroTo100 ? `${data.trim.spec.zeroTo100} s` : '-', icon: Timer, detail: '0-100 km/h' },
                            { label: 'Torque', value: data.trim.spec?.torque ? `${data.trim.spec.torque} Nm` : '-', icon: Wrench, detail: 'Torque Máximo' },
                            { label: 'Carga Rápida', value: data.trim.spec?.chargeTime3080 || '-', icon: Zap, detail: '30% a 80%' },
                        ]
                    };
                    setVehicleSpecs(mappedSpecs);
                }
            } catch (err: any) {
                console.error(err);
                if (err.status === 404) {
                    setError(null);
                } else {
                    setError('Error al cargar vehículo');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-[#10B981]/20 border-t-[#10B981] rounded-full animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Cargando tu vehículo...</p>
            </div>
        );
    }

    if (!vehicleSpecs) {
        return (
            <div className="flex flex-col gap-10 max-w-7xl mx-auto w-full pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
                            Mi <span className="text-[#10B981]">Vehículo</span>
                        </h1>
                        <p className="text-slate-400 font-medium">Especificaciones detalladas y estado técnico oficial.</p>
                    </div>
                </div>
                <div className="bg-[#15201D] border border-white/5 rounded-[40px] p-12 text-center flex flex-col items-center justify-center py-20">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <ShieldCheck className="w-10 h-10 text-slate-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Aún no tienes un vehículo activo</h3>
                    <p className="text-slate-400 max-w-md mx-auto">Cuando adquieras un vehículo con Elemotor, toda su información y estado en vivo aparecerá aquí.</p>
                </div>
            </div>
        );
    }

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

                {/* Left Side: Vehicle Image Carousel */}
                <div className="lg:w-[65%] h-[400px] lg:h-[500px] relative overflow-hidden bg-[#0A110F] group/carousel">
                    <img
                        src={vehicleSpecs.images[currentImageIndex]}
                        alt={`${vehicleSpecs.brand} ${vehicleSpecs.model}`}
                        className="w-full h-full object-contain p-8 transform transition-transform duration-700 ease-out"
                    />

                    {/* Carousel Controls */}
                    {vehicleSpecs.images.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? vehicleSpecs.images.length - 1 : prev - 1))}
                                className="absolute left-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-[#10B981] transition-all duration-300 backdrop-blur-md border border-white/10 shadow-xl z-20"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => setCurrentImageIndex((prev) => (prev === vehicleSpecs.images.length - 1 ? 0 : prev + 1))}
                                className="absolute right-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-[#10B981] transition-all duration-300 backdrop-blur-md border border-white/10 shadow-xl z-20"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                            
                            {/* Indicators */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-md overflow-hidden">
                                {vehicleSpecs.images.map((_: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            currentImageIndex === idx ? 'w-6 bg-[#10B981]' : 'w-2 bg-white/40 hover:bg-white/70'
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Artistic Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#15201D] hidden lg:block pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#15201D] to-transparent lg:hidden pointer-events-none" />
                </div>

                {/* Right Side: Primary Info */}
                <div className="lg:w-[35%] p-10 lg:p-12 flex flex-col justify-center relative z-10 bg-[#15201D]/50 backdrop-blur-sm">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-[#10B981] uppercase tracking-[0.2em] mb-4 w-fit">
                        {vehicleSpecs.brand} EXCLUSIVE
                    </div>
                    <h2 className="text-5xl font-black text-white mb-2 tracking-tighter leading-none">
                        {vehicleSpecs.model}
                        <span className="block text-xl text-slate-500 mt-2 font-bold tracking-normal">{vehicleSpecs.trimName} - {vehicleSpecs.year} Edition</span>
                    </h2>

                    <div className="space-y-6 mt-8 pt-8 border-t border-white/5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Color</span>
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <span className="w-4 h-4 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: vehicleSpecs.color.hex }} />
                                {vehicleSpecs.color.name}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">VIN</span>
                            <span className="text-sm font-mono text-slate-300 bg-white/5 px-2 py-1 rounded-md">{vehicleSpecs.vin}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Adquisición</span>
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <Calendar className="w-4 h-4 text-[#10B981]" />
                                {vehicleSpecs.purchaseDate}
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
                    {vehicleSpecs.specs.map((spec: any, idx: number) => {
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
