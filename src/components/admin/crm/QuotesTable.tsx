'use client';

import { useState } from 'react';
import { Search, X, ChevronDown, TrendingUp, Zap, BarChart2, ExternalLink, Calendar } from 'lucide-react';
import {
    MOCK_QUOTES,
    ADVISORS,
    SOURCE_LABELS,
} from '@/config/crm';
import {
    type Quote,
    type QuoteStatus,
    type LeadSource,
    type DateRange,
    type Note
} from '@/types/crm';

// New Modular Components
import { QuoteStatusBadge } from './QuoteStatusBadge';
import { QuoteKpiCard } from './QuoteKpiCard';
import { QuoteSlideOver } from './QuoteSlideOver';
import { useQuoteFilters } from '@/hooks/useQuoteFilters';

/* ─────────────────────────────────────────────────────
   Sub-components (Internal only for this file)
───────────────────────────────────────────────────── */

const SelectWrapper = ({ value, onChange, children, placeholder }: {
    value: string;
    onChange: (v: string) => void;
    children: React.ReactNode;
    placeholder: string;
}) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 pr-8 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors w-full"
        >
            <option value="">{placeholder}</option>
            {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
    </div>
);

/* ─────────────────────────────────────────────────────
   Main component: QuotesTable
───────────────────────────────────────────────────── */
export default function QuotesTable() {
    const {
        quotes,
        setQuotes,
        filteredQuotes,
        search,
        setSearch,
        filterStatus,
        setFilterStatus,
        filterAdvisor,
        setFilterAdvisor,
        filterSource,
        setFilterSource,
        filterDate,
        setFilterDate,
        clearFilters,
        stats
    } = useQuoteFilters(MOCK_QUOTES);

    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

    /* ── Mutations ── */
    const handleStatusChange = (id: string, status: QuoteStatus) => {
        setQuotes((prev) => prev.map((q) => q.id === id ? { ...q, status } : q));
        setSelectedQuote((prev) => prev?.id === id ? { ...prev, status } : prev);
    };

    const handleAdvisorChange = (id: string, advisor: string) => {
        setQuotes((prev) => prev.map((q) => q.id === id ? { ...q, advisor } : q));
        setSelectedQuote((prev) => prev?.id === id ? { ...prev, advisor } : prev);
    };

    const handleAddNote = (id: string, text: string) => {
        const newNote: Note = {
            id: `N-${Date.now()}`,
            text,
            author: 'Admin',
            createdAt: new Date().toISOString(),
        };
        setQuotes((prev) => prev.map((q) => q.id === id ? { ...q, notes: [newNote, ...q.notes] } : q));
        setSelectedQuote((prev) => prev?.id === id ? { ...prev, notes: [newNote, ...prev.notes] } : prev);
    };

    const formatShortDate = (iso: string) =>
        new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <div className="space-y-6">

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <QuoteKpiCard
                    icon={<Calendar className="w-4 h-4" />}
                    label="Total Hoy"
                    value={String(stats.todayCount)}
                    sub="+2 respecto a ayer"
                />
                <QuoteKpiCard
                    icon={<TrendingUp className="w-4 h-4" />}
                    label="Por Estado"
                    value={`${stats.topStatus.pct}%`}
                    sub={stats.topStatus.label}
                />
                <QuoteKpiCard
                    icon={<Zap className="w-4 h-4" />}
                    label="Mejor Fuente"
                    value={stats.topSource}
                    sub="canal con más leads"
                />
                <QuoteKpiCard
                    icon={<BarChart2 className="w-4 h-4" />}
                    label="Tasa de Conversión"
                    value={`${stats.conversionRate}%`}
                    sub="leads ganados / total"
                    accentClass="text-emerald-400"
                />
            </div>

            {/* ── Toolbar de Filtros ── */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap gap-3 items-end">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input
                        type="search"
                        placeholder="Buscar por nombre o email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                </div>

                {/* Estado */}
                <SelectWrapper value={filterStatus} onChange={(v) => setFilterStatus(v as QuoteStatus | '')} placeholder="Estado">
                    <option value="nuevo">Nuevo</option>
                    <option value="contactado">Contactado</option>
                    <option value="negociacion">En Negociación</option>
                    <option value="ganado">Ganado</option>
                    <option value="perdido">Perdido</option>
                </SelectWrapper>

                {/* Asesor */}
                <SelectWrapper value={filterAdvisor} onChange={setFilterAdvisor} placeholder="Asesor">
                    {ADVISORS.map((a) => <option key={a} value={a}>{a}</option>)}
                </SelectWrapper>

                {/* Fuente */}
                <SelectWrapper value={filterSource} onChange={(v) => setFilterSource(v as LeadSource | '')} placeholder="Fuente">
                    <option value="organico">Orgánico</option>
                    <option value="ads">Ads</option>
                    <option value="referido">Referido</option>
                </SelectWrapper>

                {/* Rango fecha */}
                <SelectWrapper value={filterDate} onChange={(v) => setFilterDate(v as DateRange | '')} placeholder="Fecha">
                    <option value="hoy">Hoy</option>
                    <option value="semana">Esta Semana</option>
                    <option value="mes">Este Mes</option>
                </SelectWrapper>

                {/* Clear */}
                {(search || filterStatus || filterAdvisor || filterSource || filterDate) && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-xl transition-all"
                    >
                        <X className="w-3.5 h-3.5" /> Limpiar
                    </button>
                )}
            </div>

            {/* ── Tabla ── */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/40">
                                <th className="text-left px-5 py-3.5 text-xs font-bold tracking-wider text-slate-500 uppercase">Cliente</th>
                                <th className="text-left px-5 py-3.5 text-xs font-bold tracking-wider text-slate-500 uppercase">Modelo</th>
                                <th className="text-left px-5 py-3.5 text-xs font-bold tracking-wider text-slate-500 uppercase">Fecha</th>
                                <th className="text-left px-5 py-3.5 text-xs font-bold tracking-wider text-slate-500 uppercase">Asesor</th>
                                <th className="text-left px-5 py-3.5 text-xs font-bold tracking-wider text-slate-500 uppercase">Fuente</th>
                                <th className="text-left px-5 py-3.5 text-xs font-bold tracking-wider text-slate-500 uppercase">Estado</th>
                                <th className="px-5 py-3.5" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredQuotes.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-slate-600 text-sm">
                                        No se encontraron cotizaciones con los filtros actuales.
                                    </td>
                                </tr>
                            ) : filteredQuotes.map((q) => (
                                <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-slate-200">{q.clientName}</p>
                                        <p className="text-slate-500 text-xs mt-0.5">{q.clientEmail}</p>
                                    </td>
                                    <td className="px-5 py-4 text-slate-300">{q.modelInterest}</td>
                                    <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">{formatShortDate(q.date)}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-300 flex-shrink-0">
                                                {q.advisor.charAt(0)}
                                            </div>
                                            <span className="text-slate-300 text-sm">{q.advisor}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-slate-400 text-xs bg-slate-800 border border-slate-700 px-2 py-1 rounded-md">
                                            {SOURCE_LABELS[q.source]}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <QuoteStatusBadge status={q.status} />
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedQuote(q)}
                                            className="group flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
                                        >
                                            Ver Detalle
                                            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer count */}
                <div className="px-5 py-3 border-t border-slate-800 text-xs text-slate-600">
                    Mostrando {filteredQuotes.length} de {quotes.length} cotizaciones
                </div>
            </div>

            {/* ── Slide-over ── */}
            {selectedQuote && (
                <QuoteSlideOver
                    quote={selectedQuote}
                    onClose={() => setSelectedQuote(null)}
                    onStatusChange={handleStatusChange}
                    onAdvisorChange={handleAdvisorChange}
                    onAddNote={handleAddNote}
                />
            )}
        </div>
    );
}
