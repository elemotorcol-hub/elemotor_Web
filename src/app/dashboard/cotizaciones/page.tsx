'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import {
    Car, ArrowRight, Search,
    CheckCircle2, Clock, AlertCircle,
    Calendar, ChevronRight,
    ArrowUpRight, DollarSign, RefreshCcw,
    X, Download, MapPin, Info, Smartphone,
    ChevronLeft, Mail, MessageCircle, Phone,
    User, ExternalLink, Globe, CreditCard,
    Palette, Hash
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ExtendedQuoteData, ApiQuoteResponse } from '@/types/dashboard';
import { getMyQuotesAction } from '@/actions/quote';
import { getSession } from '@/lib/auth.client';
import { downloadQuotePDF } from '@/lib/utils/pdfGenerator';
import { QuoteForm } from '@/components/quote/QuoteForm';
import { modelService } from '@/services/model.service';
import { VehicleModel } from '@/types/inventory';
import { fetchApi } from '@/lib/api';

// ─── Sub-Component: Quote Detail Modal ───────────────────────────────────────
function QuoteDetailModal({
    quote,
    onClose,
    onDownload,
}: {
    quote: ExtendedQuoteData;
    onClose: () => void;
    onDownload: () => void;
}) {
    const [copied, setCopied] = useState(false);
    const quoteUrl = typeof window !== 'undefined' ? `${window.location.origin}/cotizacion/${quote.id}` : `/cotizacion/${quote.id}`;

    const copyLink = () => {
        navigator.clipboard.writeText(quoteUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const STATUS_INTERNAL: Record<string, string> = {
        pending: 'Pendiente de revisión',
        contacted: 'Contactado',
        responded: 'Propuesta enviada',
        negotiation: 'En negociación',
        closed_won: 'Ganada',
        closed_lost: 'Cerrada',
    };

    const CHANNEL_LABEL: Record<string, string> = {
        whatsapp: 'WhatsApp',
        call: 'Llamada',
        phone: 'Teléfono',
        email: 'Correo electrónico',
    };

    const PAYMENT_LABEL: Record<string, string> = {
        cash: 'Contado',
        financing: 'Financiamiento',
        leasing: 'Leasing',
        trade_in: 'Entrega de vehículo',
        credito_banco: 'Crédito bancario',
        recursos_propios: 'Recursos propios',
        no_definido: 'No definido',
    };

    const BUDGET_RANGE_LABELS: Record<number, string> = {
        65000000:  '60M – 80M COP',
        90000000:  '80M – 100M COP',
        125000000: '100M – 150M COP',
        175000000: '150M – 200M COP',
        250000000: 'Más de 200M COP',
    };

    const SEGMENT_LABEL: Record<string, string> = {
        particular: 'Particular',
        corporate: 'Corporativo',
        corporativo: 'Corporativo',
    };

    const advisor = quote.assignedTo;
    const advisorInitials = advisor?.name
        ? advisor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : 'EL';

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-xl animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Panel — slide up on mobile, centered on desktop */}
            <div className="relative w-full sm:max-w-5xl bg-[#0F1A17] border border-white/8 sm:rounded-[36px] rounded-t-[36px] shadow-2xl animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-400 flex flex-col max-h-[95dvh] overflow-hidden">

                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-transparent via-[#10B981] to-transparent shrink-0" />

                {/* Header strip */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] font-black text-[#10B981] tracking-[0.2em] bg-[#10B981]/10 border border-[#10B981]/20 px-3 py-1 rounded-full">
                            {quote.id}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            quote.statusCode === 'approved'
                                ? 'bg-[#10B981]/12 text-[#10B981] border-[#10B981]/25'
                                : quote.statusCode === 'pending'
                                ? 'bg-blue-500/12 text-blue-400 border-blue-500/25'
                                : 'bg-slate-700/40 text-slate-400 border-slate-700/50'
                        }`}>
                            {quote.statusCode === 'approved' ? <CheckCircle2 className="w-3 h-3" />
                                : quote.statusCode === 'pending' ? <Clock className="w-3 h-3" />
                                : <AlertCircle className="w-3 h-3" />}
                            {quote.status}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body — two columns on desktop, scrollable on mobile */}
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">

                    {/* ── Left: Vehicle visual ─────────────────────────────── */}
                    <div className="w-full lg:w-[380px] bg-[#0A110F] flex flex-col shrink-0 border-b lg:border-b-0 lg:border-r border-white/5">
                        {/* Image */}
                        <div className="relative h-48 lg:h-52 mx-6 mt-6 mb-4 rounded-2xl overflow-hidden bg-[#050C0A]">
                            <div className="absolute inset-0 bg-radial-gradient from-[#10B981]/8 to-transparent" />
                            <Image
                                src={quote.images?.[0] || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=400&auto=format&fit=crop'}
                                alt={quote.model}
                                fill
                                className="object-contain p-4"
                                unoptimized
                            />
                        </div>

                        {/* Vehicle info */}
                        <div className="px-6 pb-6 space-y-3 flex-1">
                            {quote.trimName && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[10px] font-black uppercase tracking-widest">
                                    <Car className="w-3 h-3" /> {quote.trimName}
                                </span>
                            )}
                            <h2 className="text-2xl font-black text-white leading-tight tracking-tighter">{quote.model}</h2>

                            <div className="space-y-2 pt-1">
                                {quote.color && (
                                    <div className="flex items-center gap-2">
                                        <Palette className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                        <span className="text-slate-400 text-xs font-medium capitalize">{quote.color}</span>
                                    </div>
                                )}
                                {quote.city && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                        <span className="text-slate-400 text-xs font-medium capitalize">{quote.city}{quote.country ? `, ${quote.country}` : ''}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <span className="text-slate-400 text-xs font-medium">{quote.date}</span>
                                </div>
                            </div>

                            {/* Budget highlight */}
                            <div className="mt-4 p-4 rounded-2xl bg-[#10B981]/8 border border-[#10B981]/15">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Presupuesto</p>
                                <p className="text-xl font-black text-[#10B981] leading-tight">
                                    {quote.budgetRange
                                        ? (BUDGET_RANGE_LABELS[quote.budgetRange] ?? `$${Number(quote.budgetRange).toLocaleString('es-CO')}`)
                                        : 'Sin definir'}
                                </p>
                                {quote.paymentMethod && (
                                    <p className="text-[10px] text-slate-400 font-medium mt-1.5 flex items-center gap-1">
                                        <CreditCard className="w-3 h-3 shrink-0" />
                                        {PAYMENT_LABEL[quote.paymentMethod] ?? quote.paymentMethod.replace(/_/g, ' ')}
                                    </p>
                                )}
                                {quote.segment && (
                                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                                        {SEGMENT_LABEL[quote.segment] ?? quote.segment}
                                    </p>
                                )}
                            </div>

                            {/* Link de cotización */}
                            <div className="mt-3 p-3 rounded-2xl bg-white/4 border border-white/8">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <ExternalLink className="w-3 h-3" /> Link de cotización
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="flex-1 text-[10px] text-slate-400 font-mono truncate">/cotizacion/{quote.id}</span>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            onClick={copyLink}
                                            className={`p-1.5 rounded-lg transition-all text-[10px] font-bold flex items-center gap-1 ${
                                                copied
                                                    ? 'bg-[#10B981]/20 text-[#10B981]'
                                                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                                            }`}
                                            title="Copiar link"
                                        >
                                            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Hash className="w-3.5 h-3.5" />}
                                        </button>
                                        <a
                                            href={`/cotizacion/${quote.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                            title="Abrir"
                                        >
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Details scroll ─────────────────────────────── */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">

                        {/* ── Asesor asignado ── */}
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-[#10B981]" /> Asesor asignado
                            </p>
                            <div className="p-4 rounded-2xl bg-[#10B981]/6 border border-[#10B981]/15 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border-2 border-[#10B981]/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                                    <span className="text-[#10B981] font-black text-base">{advisorInitials}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-black text-base leading-tight">
                                        {advisor?.name || 'Equipo Elemotor'}
                                    </p>
                                    <p className="text-slate-500 text-[10px] font-medium mt-0.5">Asesor Comercial</p>
                                    {advisor?.email && (
                                        <p className="text-slate-400 text-[10px] mt-1 flex items-center gap-1 truncate">
                                            <Mail className="w-3 h-3 shrink-0" /> {advisor.email}
                                        </p>
                                    )}
                                    {advisor?.phone && (
                                        <p className="text-slate-400 text-[10px] mt-0.5 flex items-center gap-1">
                                            <Phone className="w-3 h-3 shrink-0" /> {advisor.phone}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 shrink-0">
                                    <a
                                        href={`https://wa.me/${(advisor?.phone || '573117762260').replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/12 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/22 transition-all text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                                    </a>
                                    {advisor?.email && (
                                        <a
                                            href={`mailto:${advisor.email}`}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
                                        >
                                            <Mail className="w-3.5 h-3.5" /> Email
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── Modelo de interés (texto libre) ── */}
                        {quote.modelInterest && (
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <Car className="w-3.5 h-3.5 text-[#10B981]" /> Modelo de interés
                                </p>
                                <div className="bg-white/4 border border-white/6 rounded-2xl px-4 py-3">
                                    <p className="text-white text-sm font-bold">{quote.modelInterest}</p>
                                </div>
                            </div>
                        )}

                        {/* ── Estado detallado ── */}
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <Info className="w-3.5 h-3.5 text-[#10B981]" /> Estado del proceso
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/4 border border-white/6 rounded-2xl p-4">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Etapa actual</p>
                                    <p className="text-white font-bold text-sm">
                                        {STATUS_INTERNAL[quote.rawStatus || ''] || quote.status}
                                    </p>
                                </div>
                                <div className="bg-white/4 border border-white/6 rounded-2xl p-4">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Válido hasta</p>
                                    <p className="text-white font-bold text-sm">{quote.validUntil}</p>
                                </div>
                                <div className="bg-white/4 border border-white/6 rounded-2xl p-4">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Smartphone className="w-3 h-3" /> Canal preferido</p>
                                    <p className="text-white font-bold text-sm capitalize">
                                        {CHANNEL_LABEL[quote.preferredChannel || 'email'] || quote.preferredChannel}
                                    </p>
                                </div>
                                {quote.trackingCode && (
                                    <div className="bg-white/4 border border-white/6 rounded-2xl p-4">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Hash className="w-3 h-3" /> Tracking</p>
                                        <p className="text-white font-mono text-xs truncate">{quote.trackingCode}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Datos del solicitante ── */}
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-[#10B981]" /> Tus datos de contacto
                            </p>
                            <div className="bg-white/4 border border-white/6 rounded-2xl divide-y divide-white/5 overflow-hidden">
                                {[
                                    { icon: User, label: 'Nombre', value: quote.name },
                                    { icon: Mail, label: 'Email', value: quote.email },
                                    { icon: Phone, label: 'Teléfono', value: quote.phone },
                                    { icon: MapPin, label: 'Ciudad', value: quote.city },
                                    { icon: Globe, label: 'País', value: quote.country },
                                ].filter(f => f.value).map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex items-center justify-between px-4 py-3">
                                        <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            <Icon className="w-3 h-3" /> {label}
                                        </span>
                                        <span className="text-white text-xs font-bold">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Observaciones ── */}
                        {quote.message && (
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Observaciones</p>
                                <div className="bg-white/4 border border-white/6 rounded-2xl px-5 py-4 relative">
                                    <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-[#10B981]/30 rounded-full" />
                                    <p className="text-slate-300 text-sm leading-relaxed italic pl-3">"{quote.message}"</p>
                                </div>
                            </div>
                        )}

                        {/* ── Action buttons ── */}
                        <div className="flex gap-3 pt-1 border-t border-white/5">
                            <button
                                onClick={onDownload}
                                className="flex-1 bg-[#10B981] hover:bg-emerald-400 text-[#0A110F] font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_8px_25px_rgba(16,185,129,0.2)] text-sm"
                            >
                                <Download className="w-4 h-4" />
                                Descargar PDF
                            </button>
                            <a
                                href={`/cotizacion/${quote.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black transition-all text-sm whitespace-nowrap"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Ver cotización
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Sub-Component: Quote Card with Image Carousel ────────────────────────────
function QuoteCard({ quote, onDownload, onViewDetail }: { quote: ExtendedQuoteData, onDownload: () => void, onViewDetail: () => void }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = quote.images?.length > 0 ? quote.images : [quote.imageUrl || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=400&auto=format&fit=crop'];

    const renderStatusIcon = (statusCode: string) => {
        switch (statusCode) {
            case 'approved': return <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />;
            case 'pending': return <Clock className="w-3.5 h-3.5 text-blue-400" />;
            case 'expired': return <AlertCircle className="w-3.5 h-3.5 text-slate-500" />;
            default: return null;
        }
    };

    const getChannelIcon = (channel: string) => {
        switch (channel) {
            case 'whatsapp': return <MessageCircle className="w-3 h-3 text-emerald-400" />;
            case 'phone': return <Phone className="w-3 h-3 text-blue-400" />;
            case 'email':
            default: return <Mail className="w-3 h-3 text-slate-400" />;
        }
    };

    return (
        <div className="bg-[#15201D] border border-white/5 rounded-[32px] p-6 lg:p-8 hover:border-[#10B981]/30 hover:bg-white/1 transition-all duration-500 group flex flex-col lg:flex-row lg:items-center gap-8 relative overflow-hidden shadow-xl">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Vehicle Visual Carousel */}
            <div className="w-full lg:w-56 h-40 relative bg-[#0A110F] border border-white/5 rounded-2xl overflow-hidden shadow-inner shrink-0 group/carousel isolate">
                <img
                    src={images[currentImageIndex]}
                    alt={quote.model}
                    className="w-full h-full object-contain p-4 transform transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Carousel Controls */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-[#10B981] transition-all duration-300 backdrop-blur-md border border-white/10 z-20"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-[#10B981] transition-all duration-300 backdrop-blur-md border border-white/10 z-20"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Indicators */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 bg-black/30 px-2 py-1 rounded-full backdrop-blur-md">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                    className={`h-1 rounded-full transition-all duration-300 ${currentImageIndex === idx ? 'w-4 bg-[#10B981]' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-[#10B981] tracking-[0.2em]">{quote.id}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {quote.date}
                    </span>
                    {quote.city && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            <span className="text-[10px] font-bold text-slate-400 capitalize tracking-widest">{quote.city}</span>
                        </>
                    )}
                </div>
                
                <h3 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tighter">
                    {quote.model}
                    {quote.trimName && <span className="text-slate-500 font-bold text-lg ml-2">{quote.trimName}</span>}
                </h3>

                {quote.message && (
                    <p className="text-slate-400 text-xs mt-2 line-clamp-1 italic max-w-md">"{quote.message}"</p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Presupuesto</span>
                        <div className="flex items-center gap-1.5 text-slate-100 font-bold text-sm">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                            {quote.amount}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Estado</span>
                        <div className={`flex items-center gap-1.5 text-sm font-bold ${quote.statusCode === 'approved' ? 'text-[#10B981]' :
                            quote.statusCode === 'pending' ? 'text-blue-400' : 'text-slate-400'
                            }`}>
                            {renderStatusIcon(quote.statusCode)}
                            {quote.status}
                        </div>
                    </div>
                    <div className="hidden md:flex flex-col">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Contacto Preferido</span>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-300 capitalize">
                            {getChannelIcon(quote.preferredChannel || 'email')}
                            {quote.preferredChannel || 'Email'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center lg:flex-col justify-between lg:justify-center gap-4 lg:pl-8 lg:border-l border-white/5 z-10">
                <button
                    onClick={onDownload}
                    className="p-4 rounded-xl bg-[#0A110F] border border-white/5 text-slate-400 hover:text-[#10B981] hover:border-[#10B981]/30 transition-all group/action"
                    title="Descargar PDF"
                >
                    <Download className="w-5 h-5" />
                </button>
                <button
                    onClick={onViewDetail}
                    className="flex-1 lg:flex-none py-4 px-8 rounded-xl bg-white/5 border border-white/10 hover:bg-[#10B981] hover:text-[#0A110F] hover:border-[#10B981] text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap"
                >
                    Ver Detalle
                </button>
            </div>
        </div>
    );
}

// ─── Main Page Component ────────────────────────────────────────────────────────

export default function MisCotizacionesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'expired'>('all');
    const [quotes, setQuotes] = useState<ExtendedQuoteData[]>([]);
    const [modelsData, setModelsData] = useState<VehicleModel[]>([]);
    const [advisors, setAdvisors] = useState<{ id: number; name: string }[]>([]);
    const [sessionUser, setSessionUser] = useState<{ name?: string; email?: string; phone?: string }>({});
    const [isLoading, setIsLoading] = useState(true);

    // Modal New Quote State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Details Modal State
    const [selectedQuote, setSelectedQuote] = useState<ExtendedQuoteData | null>(null);

    const fetchQuotes = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getMyQuotesAction({ page: 1, limit: 50 });
            if (result.success && result.data?.data) {
                const apiQuotes = result.data.data;
                const mappedQuotes: ExtendedQuoteData[] = apiQuotes.map((apiQuote: ApiQuoteResponse) => {
                    const dateObj = new Date(apiQuote.createdAt);
                    
                    let statusCode = apiQuote.status;
                    let statusText = 'En Revisión';
                    let uiStatusCode = 'pending';
                    
                    switch (statusCode) {
                        case 'pending': 
                        case 'contacted': 
                        case 'responded': 
                        case 'negotiation': 
                            statusText = 'En Revisión'; uiStatusCode = 'pending'; break;
                        case 'closed_won': 
                            statusText = 'Aprobada'; uiStatusCode = 'approved'; break;
                        case 'closed_lost': 
                            statusText = 'Expirada'; uiStatusCode = 'expired'; break;
                    }

                    const modelName = apiQuote.model ? `${apiQuote.model.brand?.name || ''} ${apiQuote.model.name}`.trim() : 'Vehículo Genérico';
                    const trimImages = apiQuote.trim?.images || [];
                    const fallbackImages = apiQuote.model?.trims?.[0]?.images || [];
                    const imagesList = trimImages.length > 0 ? trimImages : fallbackImages;
                    const images = imagesList.length > 0 
                        ? imagesList.map(i => i.url) 
                        : ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=400&auto=format&fit=crop'];
                    
                    const BUDGET_RANGE_MAP: Record<number, string> = {
                        65000000:  '60M – 80M COP',
                        90000000:  '80M – 100M COP',
                        125000000: '100M – 150M COP',
                        175000000: '150M – 200M COP',
                        250000000: 'Más de 200M COP',
                    };

                    return {
                        id: apiQuote.referenceCode || `COT-${apiQuote.id}`,
                        model: modelName,
                        trimName: apiQuote.trim?.name,
                        amount: apiQuote.budgetRange
                            ? (BUDGET_RANGE_MAP[apiQuote.budgetRange] ?? `$${Number(apiQuote.budgetRange).toLocaleString('es-CO')}`)
                            : 'Sin definir',
                        date: dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
                        status: statusText,
                        statusCode: uiStatusCode,
                        statusColor: uiStatusCode === 'approved' ? 'text-[#10B981]' : uiStatusCode === 'pending' ? 'text-blue-400' : 'text-slate-400',
                        validUntil: new Date(dateObj.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
                        imageUrl: images[0],
                        images: images,
                        name: apiQuote.name,
                        email: apiQuote.email,
                        phone: apiQuote.phone,
                        city: apiQuote.city,
                        country: apiQuote.country,
                        color: apiQuote.color,
                        preferredChannel: apiQuote.preferredChannel,
                        paymentMethod: apiQuote.paymentMethod,
                        trackingCode: apiQuote.trackingCode,
                        message: apiQuote.message,
                        modelInterest: apiQuote.modelInterest,
                        segment: apiQuote.segment,
                        budgetRange: apiQuote.budgetRange,
                        rawStatus: apiQuote.status,
                        assignedTo: apiQuote.assignedTo ?? null
                    };
                });
                setQuotes(mappedQuotes);
            }
        } catch (error) {
            console.error('Error fetching quotes block:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuotes();
        Promise.all([
            modelService.getModels({ active: true, limit: 100 }),
            fetchApi('/api/users/advisors', { method: 'GET' }),
            getSession(),
        ]).then(([modelsRes, advisorsRes, session]) => {
            setModelsData(modelsRes?.data || []);
            setAdvisors(Array.isArray(advisorsRes) ? advisorsRes : []);
            if (session?.user) {
                setSessionUser({
                    name: session.user.name,
                    email: session.user.email,
                    phone: session.user.phone,
                });
            }
        }).catch(console.error);
    }, [fetchQuotes]);

    const filteredQuotes = useMemo(() => {
        return quotes.filter(quote => {
            const matchesSearch = quote.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                quote.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = statusFilter === 'all' || quote.statusCode === statusFilter;
            return matchesSearch && matchesFilter;
        });
    }, [searchQuery, statusFilter, quotes]);

    const handleQuoteSuccess = useCallback(() => {
        setTimeout(() => {
            setIsModalOpen(false);
            fetchQuotes();
        }, 1800);
    }, [fetchQuotes]);

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
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <RefreshCcw className="w-10 h-10 text-[#10B981] animate-spin" />
                    </div>
                ) : filteredQuotes.length > 0 ? (
                    filteredQuotes.map((quote) => (
                        <QuoteCard 
                            key={quote.id} 
                            quote={quote} 
                            onDownload={() => downloadQuotePDF(quote)}
                            onViewDetail={() => setSelectedQuote(quote)}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-[#15201D]/50 border border-white/5 border-dashed rounded-[40px] text-center px-10">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <RefreshCcw className="w-10 h-10 text-slate-600 animate-spin-slow" />
                        </div>
                        <h4 className="text-xl font-black text-white mb-2">Aún no has realizado cotizaciones</h4>
                        <p className="text-slate-500 max-w-xs text-sm">Prueba creando tu primera solicitud para enviarla a tu asesor comercial.</p>
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
                <QuoteDetailModal
                    quote={selectedQuote}
                    onClose={() => setSelectedQuote(null)}
                    onDownload={() => downloadQuotePDF(selectedQuote)}
                />
            )}

            {/* Modal de Nueva Cotización */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-[#0A110F]/80 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative w-full max-w-2xl max-h-[92dvh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-300 rounded-[32px]">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-5 right-5 z-20 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <QuoteForm
                            vehicles={modelsData}
                            advisors={advisors}
                            onModelChange={() => {}}
                            onSuccess={handleQuoteSuccess}
                            defaultUserData={sessionUser}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
