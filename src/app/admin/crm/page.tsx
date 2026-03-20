'use client';

import React, { useState, useEffect } from 'react';
import { KanbanSquare, ClipboardList, Loader2 } from 'lucide-react';
import LeadsKanbanBoard from '@/components/admin/crm/LeadsKanbanBoard';
import QuotesTable from '@/components/admin/crm/QuotesTable';
import { quoteService, QuoteStats } from '@/services/quote.service';

export default function CRMPage() {
    const [activeTab, setActiveTab] = useState<'kanban' | 'cotizaciones'>('cotizaciones');
    const [stats, setStats] = useState<any>(null); // Simplified for now since structure might vary
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await quoteService.fetchStats();
                if (data) setStats(data);
            } catch (error) {
                console.error('Error loading CRM stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, []);

    const findStatusCount = (status: string) => {
        if (!stats?.byStatus) return 0;
        return stats.byStatus.find((s: any) => s.status === status)?.count || 0;
    };

    return (
        <div className="flex flex-col gap-8 max-w-[1400px] w-full pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    CRM y Logística
                </h1>
                <p className="text-slate-400 text-sm mt-1">Elemotor Administración</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#15201D] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-28 hover:bg-[#15201D]/80 transition-colors">
                    <span className="text-slate-500 text-xs font-bold tracking-wider uppercase">Cotizaciones Totales</span>
                    <div className="flex items-end justify-between">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-700" /> : <span className="text-3xl font-bold text-white">{stats?.total || 0}</span>}
                    </div>
                </div>

                <div className="bg-[#15201D] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-28 hover:bg-[#15201D]/80 transition-colors">
                    <span className="text-slate-500 text-xs font-bold tracking-wider uppercase">Entradas Hoy</span>
                    <div className="flex items-end justify-between">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-700" /> : <span className="text-3xl font-bold text-white">{stats?.totalToday || 0}</span>}
                        {!isLoading && <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-md">Hoy</span>}
                    </div>
                </div>

                <div className="bg-[#15201D] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-28 hover:bg-[#15201D]/80 transition-colors">
                    <span className="text-slate-500 text-xs font-bold tracking-wider uppercase">En Negociación</span>
                    <div className="flex items-end justify-between">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-700" /> : <span className="text-3xl font-bold text-white">{findStatusCount('negotiation')}</span>}
                    </div>
                </div>

                <div className="bg-[#15201D] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-28 hover:bg-[#15201D]/80 transition-colors">
                    <span className="text-slate-500 text-xs font-bold tracking-wider uppercase">Cierres Exitosos</span>
                    <div className="flex items-end justify-between">
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-700" /> : <span className="text-3xl font-bold text-white">{findStatusCount('closed_won')}</span>}
                    </div>
                </div>
            </div>

            {/* Toggle Tabs */}
            <div className="flex items-center gap-2 bg-[#15201D] border border-white/5 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('cotizaciones')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'cotizaciones' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'}`}
                >
                    <ClipboardList className="w-4 h-4" />
                    Gestión de Cotizaciones
                </button>
                <button
                    onClick={() => setActiveTab('kanban')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'kanban' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'}`}
                >
                    <KanbanSquare className="w-4 h-4" />
                    Kanban de Prospectos
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 mt-2">
                {activeTab === 'cotizaciones' && <QuotesTable />}
                {activeTab === 'kanban' && <LeadsKanbanBoard />}
            </div>

            <style jsx global>{`
                .custom-scrollbar-horizontal::-webkit-scrollbar {
                    height: 8px;
                }
                .custom-scrollbar-horizontal::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 8px;
                }
                .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                }
                .custom-scrollbar-horizontal::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.15);
                }
            `}</style>

        </div>
    );
}
