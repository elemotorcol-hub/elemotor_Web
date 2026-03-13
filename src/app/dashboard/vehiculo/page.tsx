'use client';

import React from 'react';
import {
    BatteryCharging, Map, Gauge, Wrench, ShieldCheck, FileText,
    Calendar, ArrowRight, Download, ExternalLink
} from 'lucide-react';
import { MOCK_VEHICLE_DATA as mockData } from '@/mocks/clientPortalData';

export default function MiVehiculoPage() {
    return (
        <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-10">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Mi Vehículo</h1>
                    <p className="text-slate-400 text-sm md:text-base">Gestione los detalles y el estado de su vehículo.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#15201D] border border-white/5 text-xs font-semibold text-slate-300">
                        <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        {mockData.status}
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-[#15201D] border border-white/5 text-xs font-medium text-[#10B981]">
                        Actualizado: {mockData.lastUpdated}
                    </div>
                </div>
            </div>

            {/* Hero Card */}
            <div className="bg-[#15201D] border border-white/5 rounded-3xl overflow-hidden flex flex-col lg:flex-row relative">
                {/* Left Side: Vehicle Image */}
                <div className="lg:w-[60%] h-[300px] lg:h-auto relative">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2000&auto=format&fit=crop')" }}
                    ></div>
                    {/* Gradients to blend into the right side smoothly */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#15201D]/80 to-[#15201D] hidden lg:block"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#15201D] via-[#15201D]/40 to-transparent lg:hidden"></div>
                </div>

                {/* Right Side: Vehicle Info */}
                <div className="lg:w-[40%] p-8 lg:p-10 flex flex-col justify-center relative z-10 bg-[#15201D]">
                    <p className="text-[#10B981] text-xs font-bold tracking-wider mb-2">{mockData.modelYear}</p>
                    <h2 className="text-4xl font-bold text-white mb-3">{mockData.modelName}</h2>

                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-8">
                        <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[10px] text-slate-300">VIN</div>
                        <span>{mockData.vin}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8 pt-6 border-t border-white/5">
                        <div>
                            <p className="text-slate-500 text-xs mb-2">Color Exterior</p>
                            <div className="flex items-center gap-2 text-slate-200 text-sm font-medium">
                                <span className="w-4 h-4 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: mockData.exteriorColor.hex }}></span>
                                {mockData.exteriorColor.name}
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs mb-2">Fecha Compra</p>
                            <div className="flex items-center gap-2 text-slate-200 text-sm font-medium">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                {mockData.purchaseDate}
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-[#10B981] hover:bg-[#059669] text-[#0A110F] font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors duration-300 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                        Ver Detalles del Modelo
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Bottom Section: Autonomy and Documentation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Autonomia Card - Unified for EV status focus */}
                <div className="lg:col-span-1 bg-[#15201D] border border-white/5 rounded-3xl p-8 relative overflow-hidden group flex flex-col justify-center min-h-[300px]">
                    <div className="relative z-10">
                        <span className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4 block">Energía y Rango</span>
                        <div className="text-6xl font-black text-white mb-4 tracking-tighter">
                            {mockData.telemetry.range.value} <span className="text-2xl text-slate-500 font-bold">{mockData.telemetry.range.unit}</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-[200px]">
                            Autonomía estimada disponible basada en tu estilo de conducción reciente.
                        </p>
                    </div>
                    
                    {/* Background Icon */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#10B981] opacity-[0.02] rounded-full blur-3xl pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-500"></div>
                    <Map className="absolute top-1/2 right-4 -translate-y-1/2 w-40 h-40 text-white/[0.02] transform rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6 pointer-events-none" />
                </div>

                {/* Documentacion Card */}
                <div className="lg:col-span-2 bg-[#15201D] border border-white/5 rounded-3xl p-8 flex flex-col group">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">Documentación</h3>
                            <p className="text-slate-500 text-sm">Manuales y certificados oficiales de tu vehículo.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockData.documents.map((doc, index) => (
                            <div key={index} className="bg-[#0A110F] border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-[#10B981]/30 hover:bg-[#10B981]/5 transition-all cursor-pointer group/item">
                                <div className="w-12 h-12 rounded-xl bg-[#15201D] border border-white/5 flex items-center justify-center text-slate-400 group-hover/item:text-[#10B981] transition-colors shrink-0">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white text-base font-bold truncate mb-1">{doc.name}</h4>
                                    <p className="text-slate-500 text-xs font-semibold">{doc.info}</p>
                                </div>
                                <div className="text-slate-500 group-hover/item:text-white transition-colors">
                                    {doc.actionType === 'download' ? (
                                        <Download className="w-5 h-5" />
                                    ) : (
                                        <ExternalLink className="w-5 h-5" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
