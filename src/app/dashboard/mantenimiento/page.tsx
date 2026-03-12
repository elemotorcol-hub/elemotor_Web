'use client';

import { useMemo } from 'react';
import { Activity, Calendar, ShieldCheck } from 'lucide-react';
import { MOCK_VEHICLE_DATA } from '@/mocks/clientPortalData';
import { calculateMaintenanceHistory, getNextMaintenance } from '@/lib/maintenanceUtils';
import { MaintenanceHistoryList } from '@/components/dashboard/maintenance/MaintenanceHistoryList';

export default function MantenimientoPage() {
    // Generate data based on mock vehicle purchase date
    const history = useMemo(() => 
        calculateMaintenanceHistory(MOCK_VEHICLE_DATA.purchaseDate), 
    [MOCK_VEHICLE_DATA.purchaseDate]);

    const nextService = useMemo(() => getNextMaintenance(history), [history]);

    return (
        <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Mantenimiento <span className="text-[#10B981]">EV</span></h1>
                    <p className="text-slate-400 text-sm md:text-base">
                        Seguimiento dinámico basado en tu fecha de adquisición: <span className="text-white font-semibold">{MOCK_VEHICLE_DATA.purchaseDate}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2 text-sm font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        Garantía Activa
                    </div>
                </div>
            </div>

            {/* Next Milestone Hero */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[32px] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest mb-4 inline-block">Próximo Servicio</span>
                        <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">{nextService.title}</h2>
                        <p className="text-emerald-50/80 text-sm md:text-base max-w-xl mb-6">
                            {nextService.description}
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 bg-[#0A110F]/30 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 uppercase font-bold text-xs tracking-wider">
                                <Calendar className="w-4 h-4" />
                                {nextService.date}
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block relative">
                        <div className="w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center relative">
                            <Activity className="w-12 h-12 text-white/50" />
                            <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin duration-[3s]"></div>
                        </div>
                    </div>
                </div>

                {/* Aesthetic background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.05] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400 opacity-[0.1] rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            </div>

            {/* History List */}
            <MaintenanceHistoryList history={history} />
            
        </div>
    );
}
