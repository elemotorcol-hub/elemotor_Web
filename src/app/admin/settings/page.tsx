'use client';

import React, { useState } from 'react';
import { Users, Settings as SettingsIcon, Calculator } from 'lucide-react';
import UsersTable from '@/components/admin/settings/UsersTable';
import SystemVariables from '@/components/admin/settings/SystemVariables';
import GeneralSettings from '@/components/admin/settings/GeneralSettings';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'general' | 'usuarios' | 'variables'>('general');

    return (
        <div className="flex flex-col gap-8 max-w-6xl w-full pb-10 mx-auto pt-4 transition-all duration-300">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    Configuración del Sistema
                </h1>
                <p className="text-slate-400 text-sm mt-1">Gestión de accesos, roles y variables globales</p>
            </div>

            {/* Toggle Tabs */}
            <div className="flex items-center gap-2 bg-[#15201D] border border-white/5 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'general' ? 'bg-white/10 text-[#10B981] shadow-sm' : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'}`}
                >
                    <SettingsIcon className="w-4 h-4" />
                    General
                </button>
                <button
                    onClick={() => setActiveTab('usuarios')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'usuarios' ? 'bg-white/10 text-[#10B981] shadow-sm' : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'}`}
                >
                    <Users className="w-4 h-4" />
                    Gestión de Usuarios
                </button>
                <button
                    onClick={() => setActiveTab('variables')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'variables' ? 'bg-white/10 text-[#10B981] shadow-sm' : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'}`}
                >
                    <Calculator className="w-4 h-4" />
                    Variables y Calculadora
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 mt-2">
                {activeTab === 'general' && <GeneralSettings />}
                {activeTab === 'usuarios' && <UsersTable />}
                {activeTab === 'variables' && <SystemVariables />}
            </div>
        </div>
    );
}
