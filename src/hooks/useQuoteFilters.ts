import { useState, useMemo } from 'react';
import {
    type Quote,
    type QuoteStatus,
    type LeadSource,
    type DateRange
} from '@/types/crm';
import { STATUS_CONFIG, SOURCE_LABELS } from '@/config/crm';

export function useQuoteFilters(initialQuotes: Quote[]) {
    const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<QuoteStatus | ''>('');
    const [filterAdvisor, setFilterAdvisor] = useState('');
    const [filterSource, setFilterSource] = useState<LeadSource | ''>('');
    const [filterDate, setFilterDate] = useState<DateRange | ''>('');

    const today = useMemo(() => new Date().toDateString(), []);

    /* ── Derived KPIs ── */
    const stats = useMemo(() => {
        const todayCount = quotes.filter((q) => new Date(q.date).toDateString() === today).length;

        // Top Status
        const statusCounts: Partial<Record<QuoteStatus, number>> = {};
        quotes.forEach((q) => { statusCounts[q.status] = (statusCounts[q.status] ?? 0) + 1; });
        const [topStatusKey, topStatusCount] = Object.entries(statusCounts).sort(([, a], [, b]) => (b as number) - (a as number))[0] ?? ['', 0];
        const statusPct = quotes.length ? Math.round(((topStatusCount as number) / quotes.length) * 100) : 0;

        // Top Source
        const sourceCounts: Partial<Record<LeadSource, number>> = {};
        quotes.forEach((q) => { sourceCounts[q.source] = (sourceCounts[q.source] ?? 0) + 1; });
        const [topSourceKey] = Object.entries(sourceCounts).sort(([, a], [, b]) => (b as number) - (a as number))[0] ?? [''];

        // Conversion Rate
        const wonCount = quotes.filter((q) => q.status === 'ganado').length;
        const conversionRate = quotes.length ? ((wonCount / quotes.length) * 100).toFixed(1) : '0.0';

        return {
            todayCount,
            topStatus: { label: STATUS_CONFIG[topStatusKey as QuoteStatus]?.label ?? '—', pct: statusPct },
            topSource: SOURCE_LABELS[topSourceKey as LeadSource] ?? '—',
            conversionRate
        };
    }, [quotes, today]);

    /* ── Filtered quotes ── */
    const filteredQuotes = useMemo(() => {
        const now = new Date();
        return quotes.filter((q) => {
            const qDate = new Date(q.date);

            if (search && !q.clientName.toLowerCase().includes(search.toLowerCase()) &&
                !q.clientEmail.toLowerCase().includes(search.toLowerCase())) return false;

            if (filterStatus && q.status !== filterStatus) return false;
            if (filterAdvisor && q.advisor !== filterAdvisor) return false;
            if (filterSource && q.source !== filterSource) return false;

            if (filterDate === 'hoy' && qDate.toDateString() !== today) return false;
            if (filterDate === 'semana') {
                const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
                if (qDate < weekAgo) return false;
            }
            if (filterDate === 'mes') {
                const monthAgo = new Date(now); monthAgo.setMonth(now.getMonth() - 1);
                if (qDate < monthAgo) return false;
            }
            return true;
        });
    }, [quotes, search, filterStatus, filterAdvisor, filterSource, filterDate, today]);

    const clearFilters = () => {
        setSearch('');
        setFilterStatus('');
        setFilterAdvisor('');
        setFilterSource('');
        setFilterDate('');
    };

    return {
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
    };
}
