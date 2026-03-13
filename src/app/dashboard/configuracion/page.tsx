import { Metadata } from 'next';
import { SettingsTabs } from '@/components/dashboard/settings/SettingsTabs';
import { Settings as SettingsIcon } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Configuración - Dashboard Elemotor',
    description: 'Ajustes y preferencias de tu cuenta Elemotor',
};

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto pb-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20">
                        <SettingsIcon className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        Configuración
                    </h1>
                </div>
                <p className="text-slate-400 pl-[52px]">
                    Administra tus datos personales, contraseña y preferencias del servicio.
                </p>
            </div>

            {/* Main Tabs Container */}
            <SettingsTabs />
        </div>
    );
}
