'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, CheckCircle2, Clock } from 'lucide-react';

export interface MaintenanceStats {
    total: number;
    managed: number;
    pending: number;
}

interface StatRowProps {
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    barColor: string;
    label: string;
    value: number;
    total: number;
}

function StatRow({ icon: Icon, iconColor, iconBg, barColor, label, value, total }: StatRowProps) {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${iconBg} border border-white/5 flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-300">{label}</span>
                    <span className="text-sm font-bold text-white">{value}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5">
                    <div
                        className={`h-1.5 rounded-full transition-all duration-700 ${barColor}`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>
            <span className="text-xs text-slate-500 w-10 text-right flex-shrink-0">{pct}%</span>
        </div>
    );
}

export default function DashboardMaintenance({ stats }: { stats?: MaintenanceStats }) {
    const router = useRouter();
    const s = stats ?? { total: 0, managed: 0, pending: 0 };

    return (
        <div className="bg-[#15201D] border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-white">Mantenimiento</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Citas de servicio y taller</p>
                </div>
                <button
                    onClick={() => router.push('/admin/workshop')}
                    className="text-sm text-[#00D4AA] hover:text-[#00b891] transition-colors font-medium"
                >
                    Ver taller
                </button>
            </div>

            {/* Total hero */}
            <div className="flex items-center gap-4 bg-white/[0.03] rounded-xl p-4 border border-white/5">
                <div className="p-3 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20">
                    <CalendarDays className="w-6 h-6 text-[#00D4AA]" />
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total de Citas</p>
                    <p className="text-3xl font-bold text-white leading-none mt-0.5">{s.total}</p>
                </div>
            </div>

            {/* Breakdown */}
            <div className="flex flex-col gap-4">
                <StatRow
                    icon={CheckCircle2}
                    iconColor="text-emerald-400"
                    iconBg="bg-emerald-500/10"
                    barColor="bg-emerald-500"
                    label="Gestionadas"
                    value={s.managed}
                    total={s.total}
                />
                <StatRow
                    icon={Clock}
                    iconColor="text-amber-400"
                    iconBg="bg-amber-500/10"
                    barColor="bg-amber-500"
                    label="Pendientes"
                    value={s.pending}
                    total={s.total}
                />
            </div>
        </div>
    );
}
