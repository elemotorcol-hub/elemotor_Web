'use client';

import React from 'react';
import { Car, ArrowRight, Search, FileText, CheckCircle2, Clock, AlertCircle, Calendar } from 'lucide-react';
import { MOCK_QUOTES_DATA as mockQuotes } from '@/mocks/clientPortalData';

export default function MisCotizacionesPage() {

    const renderStatusIcon = (statusCode: string) => {
        switch (statusCode) {
            case 'approved': return <CheckCircle2 className="w-4 h-4 text-[#10B981]" />;
            case 'pending': return <Clock className="w-4 h-4 text-blue-500" />;
            case 'expired': return <AlertCircle className="w-4 h-4 text-slate-500" />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-[1200px] w-full pb-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                        <span className="hover:text-slate-200 cursor-pointer transition-colors">Inicio</span>
                        <span>›</span>
                        <span className="text-white">Mis Cotizaciones</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Mis Cotizaciones</h1>
                    <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
                        Revisa el historial de precios y solicitudes que has hecho para adquirir tu próximo vehículo eléctrico.
                    </p>
                </div>

                <div className="flex items-center self-start md:self-auto gap-3">
                    <button className="bg-[#10B981] hover:bg-[#059669] text-[#0A110F] font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors duration-300 text-sm shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                        Nueva Cotización
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Config & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-[350px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar por modelo o código..."
                        className="w-full bg-[#15201D] border border-white/5 rounded-full pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-white/10 focus:ring-1 focus:ring-white/10 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 rounded-full text-sm font-medium bg-[#10B981] text-[#0A110F]">
                        Todas
                    </button>
                    <button className="px-4 py-2 rounded-full text-sm font-medium bg-transparent border border-white/5 text-slate-400 hover:text-white hover:bg-white/5">
                        Aprobadas
                    </button>
                    <button className="px-4 py-2 rounded-full text-sm font-medium bg-transparent border border-white/5 text-slate-400 hover:text-white hover:bg-white/5">
                        Expiradas
                    </button>
                </div>
            </div>

            {/* Listado de Cotizaciones */}
            <div className="grid grid-cols-1 gap-4">
                {mockQuotes.map((quote) => (
                    <div
                        key={quote.id}
                        className="bg-[#15201D] border border-white/5 rounded-2xl p-5 md:p-6 hover:border-white/10 hover:bg-[#15201D]/80 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                        {/* Info Principal */}
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-[#0A110F] border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:border-white/10 group-hover:bg-[#0A110F]/50 transition-colors">
                                <Car className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1">{quote.model}</h3>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="text-slate-400 font-medium">{quote.id}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                    <span className="text-slate-500 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {quote.date}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Detalles y Acciones */}
                        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 border-t border-white/5 md:border-0 pt-4 md:pt-0">

                            <div className="flex flex-col gap-1">
                                <span className="text-slate-500 text-[10px] font-bold tracking-wider uppercase">Valor Estimado</span>
                                <span className="text-slate-200 font-medium">{quote.amount}</span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-slate-500 text-[10px] font-bold tracking-wider uppercase">Estado</span>
                                <div className="flex items-center gap-1.5">
                                    {renderStatusIcon(quote.statusCode)}
                                    <span className="text-slate-300 font-medium text-sm">{quote.status}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-2 md:mt-0 justify-end md:justify-start w-full md:w-auto">
                                <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                    <FileText className="w-4 h-4" />
                                </button>
                                <button className="bg-transparent border border-[#10B981]/30 hover:bg-[#10B981]/10 text-[#10B981] font-bold py-2 px-6 rounded-xl transition-colors text-sm">
                                    Ver Detalle
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
