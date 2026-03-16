'use client';

import React, { useState } from 'react';
import { ShieldCheck, ChevronRight, ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { UserProfileBanner } from '@/components/dashboard/profile/UserProfileBanner';
import { AdvisorCard } from '@/components/dashboard/profile/AdvisorCard';
import { SettingsTabs } from '@/components/dashboard/settings/SettingsTabs';

interface ProfileViewProps {
    user: any;
}

export function ProfileView({ user }: ProfileViewProps) {
    const [view, setView] = useState<'profile' | 'settings'>('profile');

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                        {view === 'profile' ? (
                            <> <span className="text-[#10B981]"></span></>
                        ) : (
                            <>Ajustes de <span className="text-[#10B981]">Cuenta</span></>
                        )}
                    </h1>
                    <p className="text-slate-400">
                        {view === 'profile'
                            ? 'Tu estatus como cliente, beneficios activos y conexión directa con tu asesor.'
                            : 'Administra tus datos personales, contraseña y preferencias del servicio.'
                        }
                    </p>
                </div>

                {view === 'settings' && (
                    <button
                        onClick={() => setView('profile')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Perfil
                    </button>
                )}
            </div>

            {view === 'profile' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                    {/* Left Col: Profile Banner */}
                    <div className="lg:col-span-2">
                        <UserProfileBanner
                            user={user}
                            onEditClick={() => setView('settings')}
                        />
                    </div>

                    {/* Right Col: Advisor */}
                    <div className="lg:col-span-1">
                        <AdvisorCard />
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    <SettingsTabs />
                </div>
            )}
        </div>
    );
}
