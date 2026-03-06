'use client';
import React, { useState } from 'react';
import InventoryTable from '@/components/admin/InventoryTable';
import BrandsTable from '@/components/admin/BrandsTable';

export default function InventoryClient() {
    const [activeTab, setActiveTab] = useState<'models' | 'brands'>('models');

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-8 w-full">
            <div className="flex flex-col gap-1.5 border-b border-slate-800 pb-5">
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Inventario de Vehículos</h1>
                <p className="text-slate-400">Gestiona los modelos, versiones, especificaciones y marcas de tu catálogo.</p>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => setActiveTab('models')}
                    className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'models' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                >
                    Modelos EV
                </button>
                <button
                    onClick={() => setActiveTab('brands')}
                    className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-colors ${activeTab === 'brands' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                >
                    Marcas
                </button>
            </div>

            <div className="w-full">
                {activeTab === 'models' ? <InventoryTable /> : <BrandsTable />}
            </div>
        </div>
    );
}
