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
                        Ver Estado Completo
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Telemetry Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Bateria Card */}
                <div className="bg-[#15201D] border border-white/5 rounded-3xl p-6 lg:p-8 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <span className="text-slate-400 text-sm font-medium">Batería</span>
                        <div className="flex items-center gap-1.5 bg-[#10B981]/10 text-[#10B981] px-2.5 py-1 rounded-lg text-xs font-bold border border-[#10B981]/20">
                            {mockData.telemetry.battery.status}
                            <BatteryCharging className="w-3.5 h-3.5" />
                        </div>
                    </div>
                    <div className="text-5xl font-bold text-white mb-6 relative z-10">
                        {mockData.telemetry.battery.percentage}%
                    </div>
                    <div className="h-1.5 w-full bg-[#0A110F] rounded-full overflow-hidden relative z-10 border border-white/5">
                        <div className="h-full bg-[#10B981] rounded-full relative" style={{ width: `${mockData.telemetry.battery.percentage}%` }}>
                            <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/30 blur-[2px]"></div>
                        </div>
                    </div>
                    {/* Background Glow */}
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#10B981] opacity-[0.03] blur-3xl rounded-full pointer-events-none transition-opacity group-hover:opacity-[0.06]"></div>
                </div>

                {/* Autonomia Card */}
                <div className="bg-[#15201D] border border-white/5 rounded-3xl p-6 lg:p-8 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <span className="text-slate-400 text-sm font-medium">Autonomía Est.</span>
                    </div>
                    <div className="text-5xl font-bold text-white mb-3 relative z-10 flex items-baseline gap-2">
                        {mockData.telemetry.range.value} <span className="text-xl text-slate-500 font-medium">{mockData.telemetry.range.unit}</span>
                    </div>
                    <div className="text-slate-500 text-sm relative z-10">Basado en uso reciente</div>
                    {/* Background Icon */}
                    <Map className="absolute -bottom-6 -right-6 w-32 h-32 text-white/[0.02] transform -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 pointer-events-none" />
                </div>

                {/* Odometro Card */}
                <div className="bg-[#15201D] border border-white/5 rounded-3xl p-6 lg:p-8 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <span className="text-slate-400 text-sm font-medium">Odómetro</span>
                    </div>
                    <div className="text-5xl font-bold text-white mb-3 relative z-10 flex items-baseline gap-2">
                        {mockData.telemetry.odometer.value} <span className="text-xl text-slate-500 font-medium">{mockData.telemetry.odometer.unit}</span>
                    </div>
                    <div className="text-slate-500 text-sm relative z-10">Total recorrido</div>
                    {/* Background Icon */}
                    <Gauge className="absolute -bottom-6 -right-6 w-32 h-32 text-white/[0.02] transform -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 pointer-events-none" />
                </div>
            </div>

            {/* Management Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Mantenimiento */}
                <div className="bg-[#15201D] border border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col h-full border-t-2 border-t-[#15201D] hover:border-t-orange-500/50 transition-colors group">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500/20 transition-colors">
                            <Wrench className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Mantenimiento</h3>
                    </div>

                    <div className="bg-[#0A110F] border border-white/5 rounded-xl p-5 mb-6">
                        <p className="text-slate-500 text-xs font-medium mb-1.5 uppercase tracking-wide">Próximo Servicio</p>
                        <p className="text-white font-bold text-base mb-1">{mockData.maintenance.nextService.name}</p>
                        <p className="text-orange-400 text-sm font-medium">Sugerido: {mockData.maintenance.nextService.suggestedDate}</p>
                    </div>

                    <div className="space-y-4 mb-8 flex-1">
                        <div className="flex items-center justify-between pb-4 border-b border-white/5">
                            <span className="text-slate-400 text-sm">Salud Batería</span>
                            <span className="text-[#10B981] text-sm font-bold">{mockData.maintenance.batteryHealth}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-sm">Presión Neumáticos</span>
                            <span className="text-white text-sm font-bold">{mockData.maintenance.tirePressure}</span>
                        </div>
                    </div>

                    <button className="mt-auto w-full py-3.5 rounded-xl border border-white/10 text-slate-300 font-semibold hover:bg-white/5 hover:text-white transition-colors text-sm">
                        Agendar Cita
                    </button>
                </div>

                {/* Garantia */}
                <div className="bg-[#15201D] border border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col h-full border-t-2 border-t-[#15201D] hover:border-t-blue-500/50 transition-colors group">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Garantía</h3>
                    </div>

                    <div className="space-y-8 flex-1">
                        {/* Limitada Basica */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-white text-sm font-bold">{mockData.warranty.basic.name}</span>
                                <span className="text-[#10B981] text-xs font-bold">{mockData.warranty.basic.status}</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#0A110F] rounded-full overflow-hidden mb-2 border border-white/5">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${mockData.warranty.basic.progress}%` }}></div>
                            </div>
                            <p className="text-slate-500 text-xs">{mockData.warranty.basic.expiration}</p>
                        </div>

                        {/* Bateria */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-white text-sm font-bold">{mockData.warranty.battery.name}</span>
                                <span className="text-[#10B981] text-xs font-bold">{mockData.warranty.battery.status}</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#0A110F] rounded-full overflow-hidden mb-2 border border-white/5">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${mockData.warranty.battery.progress}%` }}></div>
                            </div>
                            <p className="text-slate-500 text-xs">{mockData.warranty.battery.expiration}</p>
                        </div>
                    </div>

                    <button className="mt-8 w-full py-3.5 rounded-xl border border-white/10 text-slate-300 font-semibold hover:bg-white/5 hover:text-white transition-colors text-sm">
                        Ver Cobertura
                    </button>
                </div>

                {/* Documentacion */}
                <div className="bg-[#15201D] border border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col h-full border-t-2 border-t-[#15201D] hover:border-t-purple-500/50 transition-colors group">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500/20 transition-colors">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Documentación</h3>
                    </div>

                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                        Acceda a los manuales oficiales y documentos importantes de su vehículo.
                    </p>

                    <div className="space-y-3 mb-8 flex-1">
                        {mockData.documents.map((doc, index) => (
                            <div key={index} className="bg-[#0A110F] border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/10 hover:bg-[#0A110F]/80 transition-colors cursor-pointer sub-group">
                                <div className="w-10 h-10 rounded-lg bg-[#15201D] border border-white/5 flex items-center justify-center text-slate-400 transition-colors flex-shrink-0">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white text-sm font-bold truncate mb-0.5">{doc.name}</h4>
                                    <p className="text-slate-500 text-xs">{doc.info}</p>
                                </div>
                                <div className="w-8 h-8 flex items-center justify-center text-slate-500 transition-colors">
                                    {doc.actionType === 'download' ? (
                                        <Download className="w-4 h-4" />
                                    ) : (
                                        <ExternalLink className="w-4 h-4" />
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
