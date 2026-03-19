'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
    Car, ArrowRight, Search, FileText,
    CheckCircle2, Clock, AlertCircle,
    Calendar, Filter, ChevronRight,
    ArrowUpRight, DollarSign, RefreshCcw,
    X, Wallet, Timer as TimerIcon, Info,
    Check, Download, Eye, MapPin, Smartphone
} from 'lucide-react';
import { MOCK_QUOTES_DATA as mockQuotes } from '@/mocks/clientPortalData';
import { useRouter } from 'next/navigation';
import { vehiclesData } from '@/data/models';
import { QuoteData } from '@/types/dashboard';
import { formatCurrency, sanitizeHTML, deformatCurrency } from '@/lib/utils/sanitizationUtils';

export default function MisCotizacionesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'expired'>('all');
    const [quotes, setQuotes] = useState<QuoteData[]>(mockQuotes);

    // Modal New Quote State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Details Modal State
    const [selectedQuote, setSelectedQuote] = useState<QuoteData | null>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        modelId: '',
        initialPayment: '',
        installments: '12',
        comments: ''
    });

    const filteredQuotes = useMemo(() => {
        return quotes.filter(quote => {
            const matchesSearch = quote.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                quote.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = statusFilter === 'all' || quote.statusCode === statusFilter;
            return matchesSearch && matchesFilter;
        });
    }, [searchQuery, statusFilter, quotes]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const numericValue = deformatCurrency(formData.initialPayment);

        if (numericValue < 100000000) {
            setPaymentError('La cuota inicial mínima es de $5,000,000');
            return;
        }
        if (numericValue > 500000000) {
            setPaymentError('La cuota inicial máxima es de $500,000,000');
            return;
        }

        setPaymentError(null);
        setIsSubmitting(true);

        const sanitizedComments = sanitizeHTML(formData.comments);
        const vehicle = vehiclesData.find(v => v.id === formData.modelId);

        setTimeout(() => {
            const newQuote: QuoteData = {
                id: `COT-${Math.floor(1000 + Math.random() * 9000)}`,
                model: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Vehículo Genérico',
                amount: vehicle ? `$${(vehicle.price * 4000).toLocaleString()}` : `$45.900.000`,
                date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
                status: 'En Revisión',
                statusCode: 'pending',
                statusColor: 'text-blue-400',
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
                imageUrl: vehicle?.image || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=400&auto=format&fit=crop'
            };

            setQuotes(prev => [newQuote, ...prev]);
            setIsSubmitting(false);
            setIsSuccess(true);

            setTimeout(() => {
                setIsModalOpen(false);
                setIsSuccess(false);
                setFormData({ modelId: '', initialPayment: '', installments: '12', comments: '' });
            }, 2000);
        }, 1500);
    };

    const downloadQuotePDF = (quote: QuoteData) => {
        const content = `
        ──────────────────────────────────────────
                   ELEMOTOR COLOMBIA
                  COTIZACIÓN OFICIAL
        ──────────────────────────────────────────
        ID Cotización: ${quote.id}
        Fecha: ${quote.date}
        ──────────────────────────────────────────
        CLIENTE: Juan Pérez (Session User)
        VEHÍCULO: ${quote.model}
        PRECIO BASE: ${quote.amount}
        ESTADO: ${quote.status}
        ──────────────────────────────────────────
        PLAN FINANCIERO ESTIMADO:
        Cuota Inicial: $20.000.000 (Simulación)
        Plazo: 36 Meses
        Tasa: 1.2% N.M.
        ──────────────────────────────────────────
        WWW.ELEMOTOR.COM.CO
        ──────────────────────────────────────────
        `;

        const blob = new Blob([content], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Cotizacion-${quote.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const renderStatusIcon = (statusCode: string) => {
        switch (statusCode) {
            case 'approved': return <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />;
            case 'pending': return <Clock className="w-3.5 h-3.5 text-blue-400" />;
            case 'expired': return <AlertCircle className="w-3.5 h-3.5 text-slate-500" />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col gap-10 max-w-7xl mx-auto w-full pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                        <span className="hover:text-white cursor-pointer transition-colors" onClick={() => router.push('/dashboard')}>Dashboard</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-[#10B981]">Cotizaciones</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
                        Mis <span className="text-[#10B981]">Cotizaciones</span>
                    </h1>
                    <p className="text-slate-400 font-medium">Gestiona tus procesos de adquisición y precios oficiales.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#10B981] hover:bg-emerald-400 text-[#0A110F] font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 shadow-[0_10px_30px_rgba(16,185,129,0.15)] group"
                >
                    Nueva Cotización
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="relative w-full lg:w-[450px] group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#10B981] transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Busca por modelo o ID de cotización..."
                        className="w-full bg-[#15201D] border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#10B981]/30 transition-all shadow-inner"
                    />
                </div>

                <div className="flex items-center gap-2 p-1.5 bg-[#15201D] border border-white/5 rounded-2xl overflow-x-auto no-scrollbar">
                    {[
                        { id: 'all', label: 'Todas' },
                        { id: 'approved', label: 'Aprobadas' },
                        { id: 'pending', label: 'En Revisión' },
                        { id: 'expired', label: 'Expiradas' }
                    ].map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setStatusFilter(filter.id as any)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === filter.id
                                ? 'bg-[#10B981] text-[#0A110F] shadow-[0_5px_15px_rgba(16,185,129,0.2)]'
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List Section */}
            <div className="grid grid-cols-1 gap-6">
                {filteredQuotes.length > 0 ? (
                    filteredQuotes.map((quote) => (
                        <div
                            key={quote.id}
                            className="bg-[#15201D] border border-white/5 rounded-[32px] p-6 lg:p-8 hover:border-[#10B981]/30 hover:bg-white/[0.01] transition-all duration-500 group flex flex-col lg:flex-row lg:items-center gap-8 relative overflow-hidden shadow-xl"
                        >
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                            {/* Vehicle Visual */}
                            <div className="w-full lg:w-48 h-32 relative bg-[#0A110F] border border-white/5 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                <Image
                                    src={quote.imageUrl || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=400&auto=format&fit=crop'}
                                    alt={quote.model}
                                    fill
                                    className="object-contain p-4"
                                    unoptimized
                                />
                            </div>

                            {/* Main Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[10px] font-black text-[#10B981] tracking-[0.2em]">{quote.id}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 tracking-widest">
                                        <Calendar className="w-3 h-3" />
                                        {quote.date}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 tracking-tighter leading-tight">{quote.model}</h3>

                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Inversión</span>
                                        <div className="flex items-center gap-1.5 text-slate-100 font-bold">
                                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                                            {quote.amount}
                                        </div>
                                    </div>
                                    <div className="w-px h-8 bg-white/5" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Estado</span>
                                        <div className={`flex items-center gap-1.5 text-sm font-bold ${quote.statusCode === 'approved' ? 'text-[#10B981]' :
                                            quote.statusCode === 'pending' ? 'text-blue-400' : 'text-slate-400'
                                            }`}>
                                            {renderStatusIcon(quote.statusCode)}
                                            {quote.status}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center lg:flex-col justify-between lg:justify-center gap-4 lg:pl-8 lg:border-l border-white/5">
                                <button
                                    onClick={() => downloadQuotePDF(quote)}
                                    className="p-4 rounded-xl bg-[#0A110F] border border-white/5 text-slate-400 hover:text-[#10B981] hover:border-[#10B981]/30 transition-all group/action"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setSelectedQuote(quote)}
                                    className="flex-1 lg:flex-none py-4 px-8 rounded-xl bg-white/5 border border-white/10 hover:bg-[#10B981] hover:text-[#0A110F] hover:border-[#10B981] text-xs font-black uppercase tracking-widest transition-all duration-300"
                                >
                                    Ver Detalle
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-[#15201D]/50 border border-white/5 border-dashed rounded-[40px] text-center px-10">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <RefreshCcw className="w-10 h-10 text-slate-600 animate-spin-slow" />
                        </div>
                        <h4 className="text-xl font-black text-white mb-2">No encontramos coincidencias</h4>
                        <p className="text-slate-500 max-w-xs text-sm">Prueba ajustando tus filtros o el término de búsqueda.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                            className="mt-6 text-[#10B981] font-black text-xs uppercase tracking-widest hover:text-emerald-400 transition-colors"
                        >
                            Restablecer Todo
                        </button>
                    </div>
                )}
            </div>

            {/* Modal de Detalle de Cotización */}
            {selectedQuote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0A110F]/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedQuote(null)} />
                    <div className="bg-[#15201D] border border-white/10 w-full max-w-4xl rounded-[40px] overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col md:flex-row">
                        <button onClick={() => setSelectedQuote(null)} className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-all">
                            <X className="w-5 h-5" />
                        </button>

                        {/* Visual Side */}
                        <div className="w-full md:w-1/2 bg-[#0A110F] p-10 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#10B981]/10 to-transparent pointer-events-none" />
                            <div className="relative aspect-video scale-110 mb-8">
                                <Image
                                    src={selectedQuote.imageUrl || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=400&auto=format&fit=crop'}
                                    alt={selectedQuote.model}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                            <div className="space-y-4 relative z-10">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[10px] font-black uppercase tracking-widest">
                                    <Car className="w-3.5 h-3.5" />
                                    Vehículo Premium
                                </div>
                                <h2 className="text-4xl font-black text-white leading-none">{selectedQuote.model}</h2>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="w-full md:w-1/2 p-10 flex flex-col">
                            <div className="mb-10">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{selectedQuote.id}</span>
                                <h3 className="text-2xl font-black text-white mt-1">Detalles de <span className="text-[#10B981]">Cotización</span></h3>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha de Solicitud</p>
                                        <p className="text-white font-bold">{selectedQuote.date}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor Estimado</p>
                                        <p className="text-[#10B981] font-black text-xl">{selectedQuote.amount}</p>
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Concesionario</p>
                                                <p className="text-white text-xs font-bold">Elemotor Bogotá Norte</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                <Smartphone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asesor</p>
                                                <p className="text-white text-xs font-bold">Andrés G.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Proceso Actual</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${selectedQuote.statusCode === 'approved' ? 'bg-[#10B981] text-[#0A110F]' :
                                            selectedQuote.statusCode === 'pending' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
                                            }`}>
                                            {selectedQuote.status}
                                        </div>
                                        {selectedQuote.statusCode === 'pending' && (
                                            <span className="text-xs text-blue-400 font-bold animate-pulse">En verificación por perito</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8 pt-8 border-t border-white/5">
                                <button
                                    onClick={() => downloadQuotePDF(selectedQuote)}
                                    className="flex-1 bg-[#10B981] hover:bg-emerald-400 text-[#0A110F] font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg"
                                >
                                    <Download className="w-4 h-4" />
                                    Descargar PDF
                                </button>
                                <button className="p-4 rounded-2xl border border-white/10 hover:bg-white/5 text-slate-400 transition-all">
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Nueva Cotización */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-[#0A110F]/80 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => !isSubmitting && setIsModalOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="bg-[#15201D] border border-white/10 w-full max-w-2xl rounded-[40px] overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
                        {/* Header Image/Pattern */}
                        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />

                        <div className="p-8 md:p-10">
                            <button
                                onClick={() => !isSubmitting && setIsModalOpen(false)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {!isSuccess ? (
                                <>
                                    <div className="mb-10">
                                        <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Nueva <span className="text-[#10B981]">Cotización</span></h2>
                                        <p className="text-slate-400 font-medium">Completa los detalles para recibir una oferta personalizada.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Vehicle Selection */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                                <Car className="w-3 h-3" />
                                                Modelo de Interés
                                            </label>
                                            <select
                                                required
                                                value={formData.modelId}
                                                onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                                                className="w-full bg-[#0A110F] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-[#10B981]/30 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled>Selecciona un vehículo...</option>
                                                {vehiclesData.map(v => (
                                                    <option key={v.id} value={v.id}>{v.brand} {v.model}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Initial Payment */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                                    <Wallet className="w-3 h-3" />
                                                    Cuota Inicial (Estimada)
                                                </label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                    <input
                                                        type="text"
                                                        placeholder="Ej: 20,000,000"
                                                        value={formData.initialPayment}
                                                        onKeyDown={(e) => {
                                                            if (!/[0-9]/.test(e.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            const formatted = formatCurrency(e.target.value);
                                                            setFormData({ ...formData, initialPayment: formatted });
                                                        }}
                                                        className={`w-full bg-[#0A110F] border rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none transition-all ${paymentError ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#10B981]/30'
                                                            }`}
                                                    />
                                                </div>
                                                {paymentError && (
                                                    <p className="text-[10px] text-red-500 font-bold mt-2 animate-in fade-in slide-in-from-top-1">
                                                        {paymentError}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Financing installments */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                                    <TimerIcon className="w-3 h-3" />
                                                    Plazo (Meses)
                                                </label>
                                                <select
                                                    value={formData.installments}
                                                    onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                                                    className="w-full bg-[#0A110F] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-[#10B981]/30 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="12">12 Meses</option>
                                                    <option value="24">24 Meses</option>
                                                    <option value="36">36 Meses</option>
                                                    <option value="48">48 Meses</option>
                                                    <option value="60">60 Meses</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Comments */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                                <Info className="w-3 h-3" />
                                                Comentarios Adicionales
                                            </label>
                                            <textarea
                                                rows={3}
                                                placeholder="Ej: Color preferido, trade-in, etc."
                                                value={formData.comments}
                                                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                                className="w-full bg-[#0A110F] border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-[#10B981]/30 transition-all resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-[#10B981] hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#0A110F] font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 shadow-[0_15px_40px_rgba(16,185,129,0.2)] mt-4"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <RefreshCcw className="w-5 h-5 animate-spin" />
                                                    Procesando...
                                                </>
                                            ) : (
                                                <>
                                                    Solicitar Cotización Oficial
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="py-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                                    <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                                        <Check className="w-12 h-12 text-[#10B981]" />
                                    </div>
                                    <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">¡Solicitud <span className="text-[#10B981]">Enviada!</span></h2>
                                    <p className="text-slate-400 font-medium max-w-sm mb-8">
                                        Tu asesor comercial ha recibido la solicitud y se pondrá en contacto contigo en las próximas 24 horas.
                                    </p>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#10B981] animate-progress-modal" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
