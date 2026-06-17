'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { TrendingUp, TrendingDown, CalendarDays } from 'lucide-react';

export interface AdvisorStat {
    id: number;
    name: string;
    email: string;
    assignedCount: number;
    closedWon: number;
    closedLost: number;
    thisMonth: number;
    lastActivityAt?: string;
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('');
}

const AVATAR_COLORS = [
    'bg-[#00D4AA]/20 text-[#00D4AA]',
    'bg-blue-500/20 text-blue-400',
    'bg-purple-500/20 text-purple-400',
    'bg-amber-500/20 text-amber-400',
    'bg-rose-500/20 text-rose-400',
    'bg-sky-500/20 text-sky-400',
];

export default function DashboardAdvisors({ advisors }: { advisors?: AdvisorStat[] }) {
    const router = useRouter();
    const list = advisors ?? [];

    return (
        <div className="bg-[#15201D] border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-white">Rendimiento de Asesores</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA]">
                        {list.length} asesor{list.length !== 1 ? 'es' : ''}
                    </span>
                </div>
                <button
                    onClick={() => router.push('/admin/crm')}
                    className="text-sm text-[#00D4AA] hover:text-[#00b891] transition-colors font-medium"
                >
                    Ver CRM
                </button>
            </div>

            {/* Header de columnas */}
            {list.length > 0 && (
                <div className="hidden md:grid grid-cols-[1fr_auto] gap-4 px-5 py-2 border-b border-white/5">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Asesor</span>
                    <div className="flex items-center gap-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        <span className="w-14 text-center">Total</span>
                        <span className="w-14 text-center text-emerald-600">Ganadas</span>
                        <span className="w-14 text-center text-red-600/70">Perdidas</span>
                        <span className="w-14 text-center text-blue-600">Mes</span>
                    </div>
                </div>
            )}

            {list.length === 0 ? (
                <div className="px-5 py-8 text-center text-slate-500 italic text-sm">
                    No hay asesores con cotizaciones asignadas.
                </div>
            ) : (
                <div className="divide-y divide-white/5">
                    {list.map((advisor, idx) => {
                        const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                        const winRate = advisor.assignedCount > 0
                            ? Math.round((advisor.closedWon / advisor.assignedCount) * 100)
                            : 0;
                        return (
                            <div
                                key={advisor.id}
                                className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
                            >
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 border border-white/10 ${colorClass}`}>
                                    {getInitials(advisor.name)}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-white truncate">{advisor.name}</p>
                                        {winRate > 0 && (
                                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full shrink-0">
                                                {winRate}% efectividad
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">
                                        {advisor.lastActivityAt
                                            ? `Última actividad ${formatDistanceToNow(new Date(advisor.lastActivityAt), { addSuffix: true, locale: es })}`
                                            : 'Sin actividad reciente'}
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-3 shrink-0">
                                    {/* Total */}
                                    <div className="text-center w-14">
                                        <p className="text-base font-bold text-white">{advisor.assignedCount}</p>
                                        <p className="text-[9px] text-slate-500 uppercase">Total</p>
                                    </div>
                                    {/* Won */}
                                    <div className="text-center w-14">
                                        <p className="text-base font-bold text-emerald-400 flex items-center justify-center gap-0.5">
                                            <TrendingUp className="w-3.5 h-3.5" />{advisor.closedWon}
                                        </p>
                                        <p className="text-[9px] text-slate-500 uppercase">Ganadas</p>
                                    </div>
                                    {/* Lost */}
                                    <div className="text-center w-14">
                                        <p className="text-base font-bold text-red-400 flex items-center justify-center gap-0.5">
                                            <TrendingDown className="w-3.5 h-3.5" />{advisor.closedLost}
                                        </p>
                                        <p className="text-[9px] text-slate-500 uppercase">Perdidas</p>
                                    </div>
                                    {/* This Month */}
                                    <div className="text-center w-14">
                                        <p className="text-base font-bold text-blue-400 flex items-center justify-center gap-0.5">
                                            <CalendarDays className="w-3.5 h-3.5" />{advisor.thisMonth}
                                        </p>
                                        <p className="text-[9px] text-slate-500 uppercase">Este mes</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
