'use client';

import { useState, useEffect } from 'react';
import { Search, X, ChevronDown, TrendingUp, Zap, BarChart2, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import {
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
import { quoteService } from '@/services/quote.service';

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
    const [initialLoading, setInitialLoading] = useState(true);
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
    } = useQuoteFilters([]);

    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

    useEffect(() => {
        const loadQuotes = async () => {
            try {
                const data = await quoteService.fetchQuotes();
                if (Array.isArray(data)) {
                    setQuotes(data);
                } else if (data?.data && Array.isArray(data.data)) {
                    setQuotes(data.data);
                }
            } catch (error) {
                console.error('Error loading quotes:', error);
            } finally {
                setInitialLoading(false);
            }
        };
        loadQuotes();
    }, [setQuotes]);

    /* ── Mutations ── */
    const handleUpdateQuote = async (id: number, data: Omit<Partial<Quote>, 'notes'> & { notes?: string }) => {
        try {
            const updated = await quoteService.updateQuote(id, data);
            
            // Si el backend devuelve un objeto con 'data', lo extraemos
            const result = (updated as any).data || updated;
            
            setQuotes(prev => prev.map(q => q.id === id ? { ...q, ...result } : q));
            if (selectedQuote?.id === id) {
                setSelectedQuote(prev => prev ? { ...prev, ...result } : null);
            }
        } catch (error) {
            console.error('Error updating quote:', error);
        }
    };

    const handleStatusChange = async (id: number, status: QuoteStatus) => {
        await handleUpdateQuote(id, { status });
    };

    const handleAdvisorChange = async (id: number, advisorId: number) => {
        // For advisor change, we need to fetch the updated quote to get the advisor's name
        // This is a specific case where the backend might not return the full assignedTo object
        try {
            await quoteService.updateQuote(id, { assignedToId: advisorId });
            const updated = await quoteService.fetchOne(id); // Fetch full updated quote
            setQuotes((prev) => prev.map((q) => q.id === id ? updated : q));
            if (selectedQuote?.id === id) setSelectedQuote(updated);
        } catch (error) {
            console.error('Error updating advisor:', error);
        }
    };

    const handleAddNote = async (id: number, text: string) => {
        await handleUpdateQuote(id, { notes: text });
    };

    const formatShortDate = (iso: string) =>
        iso ? new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-h-[400px] flex flex-col">
                <div className="overflow-x-auto flex-1">
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
                            {initialLoading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3 text-slate-500">
                                            <Loader2 className="w-8 h-8 animate-spin" />
                                            <span>Cargando cotizaciones...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredQuotes.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-slate-600 text-sm">
                                        No se encontraron cotizaciones con los filtros actuales.
                                    </td>
                                </tr>
                            ) : filteredQuotes.map((q) => (
                                <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-slate-200">{q.name}</p>
                                        <p className="text-slate-500 text-xs mt-0.5">{q.email}</p>
                                    </td>
                                    <td className="px-5 py-4 text-slate-300">{q.modelInterest || '—'}</td>
                                    <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">{formatShortDate(q.createdAt)}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-300 flex-shrink-0 uppercase">
                                                {(q.assignedTo?.name || 'S').charAt(0)}
                                            </div>
                                            <span className="text-slate-300 text-sm truncate max-w-[120px]">
                                                {q.assignedTo?.name || 'Sin Asignar'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-slate-400 text-xs bg-slate-800 border border-slate-700 px-2 py-1 rounded-md">
                                            {SOURCE_LABELS[q.source || 'web'] || q.source || 'Web'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <QuoteStatusBadge status={q.status} />
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedQuote(q)}
                                            className="group flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors ml-auto"
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
                    onUpdate={(data) => handleUpdateQuote(selectedQuote.id, data)}
                />
            )}
        </div>
    );
}
