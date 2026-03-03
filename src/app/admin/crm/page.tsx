'use client';

import React, { useState } from 'react';
import { Package, KanbanSquare } from 'lucide-react';
import LeadsKanbanBoard from '@/components/admin/crm/LeadsKanbanBoard';
import OrdersList from '@/components/admin/orders/OrdersList';

export default function CRMPage() {
    const [activeTab, setActiveTab] = useState<'pedidos' | 'kanban'>('kanban');

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
                    <span className="text-slate-500 text-xs font-bold tracking-wider uppercase">Pedidos Totales</span>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold text-white">248</span>
                        <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-md">+12%</span>
                    </div>
                </div>

                <div className="bg-[#15201D] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-28 hover:bg-[#15201D]/80 transition-colors">
                    <span className="text-slate-500 text-xs font-bold tracking-wider uppercase">En Tránsito</span>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold text-white">34</span>
                        <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-md">+3%</span>
                    </div>
                </div>

                <div className="bg-[#15201D] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-28 hover:bg-[#15201D]/80 transition-colors">
                    <span className="text-slate-500 text-xs font-bold tracking-wider uppercase">Prospectos Activos</span>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold text-white">87</span>
                        <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-md">+18%</span>
                    </div>
                </div>

                <div className="bg-[#15201D] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-28 hover:bg-[#15201D]/80 transition-colors">
                    <span className="text-slate-500 text-xs font-bold tracking-wider uppercase">Ganados Este Mes</span>
                    <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold text-white">12</span>
                        <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-md">+25%</span>
                    </div>
                </div>
            </div>

            {/* Toggle Tabs */}
            <div className="flex items-center gap-2 bg-[#15201D] border border-white/5 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('pedidos')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'pedidos' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'}`}
                >
                    <Package className="w-4 h-4" />
                    Gestión de Pedidos
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
                {activeTab === 'kanban' ? (
                    <LeadsKanbanBoard />
                ) : (
                    <OrdersList />
                )}
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
