'use client';

import React from 'react';
import { Search, Plus, FileText, Shield, CreditCard, BookOpen, MoreVertical, Download } from 'lucide-react';

import { ClientDocument } from '@/types/dashboard';
import { MOCK_DOCUMENTS_DATA as mockDocuments } from '@/mocks/clientPortalData';

const TABS = ['Todos', 'Legales', 'Mantenimiento', 'Facturas'];

const renderIcon = (type: ClientDocument['iconType'], colorClass: string) => {
    const iconProps = { className: `w-5 h-5 ${colorClass.split(' ')[0]}` };
    switch (type) {
        case 'receipt': return <FileText {...iconProps} />;
        case 'shield-check': return <Shield {...iconProps} />;
        case 'id-card': return <CreditCard {...iconProps} />;
        case 'shield-alert': return <Shield {...iconProps} />;
        case 'book': return <BookOpen {...iconProps} />;
        default: return <FileText {...iconProps} />;
    }
};

export default function DocumentosPage() {

    return (
        <div className="flex flex-col gap-8 max-w-[1400px] w-full pb-10">

            {/* Header y Estadísticas */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                        <span className="hover:text-slate-200 cursor-pointer transition-colors">Inicio</span>
                        <span>›</span>
                        <span className="text-white">Documentos</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Documentos del Vehículo</h1>
                    <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
                        Gestiona, visualiza y descarga los archivos importantes relacionados con tu
                        vehículo. Mantén todo al día.
                    </p>
                </div>

                <div className="flex items-center gap-3 self-start md:self-auto">
                    <div className="bg-[#15201D] border border-white/5 rounded-xl px-5 py-3 flex flex-col items-center justify-center min-w-[100px]">
                        <span className="text-slate-500 text-[10px] font-bold tracking-wider mb-1">TOTAL</span>
                        <span className="text-white text-2xl font-bold">12</span>
                    </div>
                    <div className="bg-[#15201D] border border-white/5 rounded-xl px-5 py-3 flex flex-col items-center justify-center min-w-[100px]">
                        <span className="text-slate-500 text-[10px] font-bold tracking-wider mb-1">VENCE PRONTO</span>
                        <span className="text-yellow-500 text-2xl font-bold">1</span>
                    </div>
                </div>
            </div>

            {/* Barra de Herramientas (Toolbar) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative w-full lg:w-[400px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar documento..."
                        className="w-full bg-[#15201D] border border-white/5 rounded-full pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-white/10 focus:ring-1 focus:ring-white/10 transition-all"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
                {TABS.map((tab, i) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0
                            ? 'bg-[#10B981] text-[#0A110F]'
                            : 'bg-transparent border border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Grid de Documentos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {/* Subir Documento Card */}
                <button className="h-[220px] rounded-2xl border-2 border-dashed border-[#10B981]/40 bg-[#10B981]/5 hover:bg-[#10B981]/10 transition-colors flex flex-col items-center justify-center gap-3 group">
                    <div className="w-12 h-12 rounded-full bg-[#10B981] flex items-center justify-center text-[#0A110F] shadow-lg shadow-[#10B981]/20 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                        <h4 className="text-[#10B981] font-bold text-sm mb-1">Subir Documento</h4>
                        <p className="text-slate-500 text-xs px-4">PDF, JPG o PNG (Max 5MB)</p>
                    </div>
                </button>

                {/* Document Cards */}
                {mockDocuments.map((doc) => (
                    <div key={doc.id} className="h-[220px] bg-[#15201D] border border-white/5 rounded-2xl p-5 flex flex-col hover:border-white/10 hover:bg-[#15201D]/80 transition-all group">

                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${doc.colorTheme}`}>
                                {renderIcon(doc.iconType, doc.colorTheme)}
                            </div>
                            <button className="text-slate-500 hover:text-slate-300 p-1">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Card Body */}
                        <div className="flex-1 mt-2">
                            <h4 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                                {doc.title}
                                {doc.isActive && <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>}
                            </h4>
                            {doc.warningMessage ? (
                                <p className="text-yellow-500 text-sm font-medium">{doc.warningMessage}</p>
                            ) : (
                                <p className="text-slate-500 text-sm">{doc.subtitle}</p>
                            )}
                        </div>

                        {/* Card Footer */}
                        <div className="flex items-end justify-between mt-auto">
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-600 text-[10px] font-bold tracking-wider uppercase">SUBIDO</span>
                                <span className="text-slate-400 text-xs font-medium">{doc.uploadDate}</span>
                            </div>
                            <button className="w-8 h-8 rounded-full bg-[#15201D] border border-white/10 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors group-hover:border-white/20">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

            </div>

            {/* Botón de Acción Inferior */}
            <div className="flex justify-center mt-6">
                <button
                    type="button"
                    className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                >
                    Ver documentos archivados
                    {/* // TODO: Implementar lógica de fetch o toggle state para mostrar archivos ocultos/archivados en el evento onClick */}
                </button>
            </div>

        </div>
    );
}
