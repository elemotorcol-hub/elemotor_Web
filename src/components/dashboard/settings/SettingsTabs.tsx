'use client';

import * as React from 'react';
import { UserCircle, Shield } from 'lucide-react';
import { ProfileForm } from './ProfileForm';
import { SecurityForm } from './SecurityForm';

export function SettingsTabs() {
    const [activeTab, setActiveTab] = React.useState<'profile' | 'security'>('profile');

    return (
        <div className="bg-[#15201D] border border-white/5 rounded-[32px] overflow-hidden shadow-xl">
            {/* Tab Navigation */}
            <div className="flex border-b border-white/5 px-6 pt-6 gap-8">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-4 text-sm font-bold tracking-wide flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === 'profile'
                            ? 'border-[#10B981] text-[#10B981]'
                            : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                    <UserCircle className="w-4 h-4" />
                    Mi Perfil
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-4 text-sm font-bold tracking-wide flex items-center gap-2 border-b-2 transition-all ${
                        activeTab === 'security'
                            ? 'border-[#10B981] text-[#10B981]'
                            : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                    <Shield className="w-4 h-4" />
                    Seguridad
                </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-10">
                {activeTab === 'profile' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-2">Información Personal</h3>
                            <p className="text-sm text-slate-400">Actualiza tus datos de contacto para mantener tu perfil al día con tu asesor.</p>
                        </div>
                        <ProfileForm />
                    </div>
                )}
                {activeTab === 'security' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-2">Seguridad de la Cuenta</h3>
                            <p className="text-sm text-slate-400">Administra tu contraseña y configuraciones de acceso al dashboard.</p>
                        </div>
                        <SecurityForm />
                    </div>
                )}
            </div>
        </div>
    );
}
