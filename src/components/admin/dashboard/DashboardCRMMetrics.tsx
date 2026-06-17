import React from 'react';
import { MessageSquare, UserCheck, UserX, Activity, Trophy, XCircle } from 'lucide-react';

interface CRMMetricsData {
    total: number;
    active: number;
    assigned: number;
    unassigned: number;
    closedWon: number;
    closedLost: number;
    inProcess: number;
    contacted: number;
}

interface CRMCardProps {
    title: string;
    value: number;
    subtitle?: string;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    accent: string;
    total?: number;
}

function CRMCard({ title, value, subtitle, icon: Icon, iconColor, iconBg, accent, total }: CRMCardProps) {
    const pct = total && total > 0 ? Math.round((value / total) * 100) : (value > 0 ? 100 : 0);
    return (
        <div className="bg-[#15201D] border border-white/5 rounded-2xl p-5 hover:bg-[#15201D]/80 transition-colors relative overflow-hidden group">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-slate-400 text-xs font-bold tracking-wider uppercase">{title}</h3>
                <div className={`p-2.5 rounded-xl ${iconBg} border border-white/5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
            </div>
            <div className="text-3xl font-bold text-white">{value}</div>
            {subtitle && <p className="text-[10px] text-slate-500 mt-0.5">{subtitle}</p>}
            <div className="mt-3 h-1 w-full rounded-full bg-white/5">
                <div
                    className={`h-1 rounded-full ${accent} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <div className={`absolute -bottom-10 -right-10 w-28 h-28 ${iconBg} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full pointer-events-none`} />
        </div>
    );
}

export default function DashboardCRMMetrics({ data }: { data?: CRMMetricsData }) {
    const m = data ?? { total: 0, active: 0, assigned: 0, unassigned: 0, closedWon: 0, closedLost: 0, inProcess: 0, contacted: 0 };

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-white">CRM &amp; Cotizaciones</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20">
                    {m.total} total
                </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <CRMCard
                    title="Total"
                    value={m.total}
                    subtitle="Todas las cotizaciones"
                    icon={MessageSquare}
                    iconColor="text-[#00D4AA]"
                    iconBg="bg-[#00D4AA]/10"
                    accent="bg-[#00D4AA]"
                />
                <CRMCard
                    title="En progreso"
                    value={m.active}
                    subtitle="Pendientes de cierre"
                    icon={Activity}
                    iconColor="text-amber-400"
                    iconBg="bg-amber-500/10"
                    accent="bg-amber-400"
                    total={m.total}
                />
                <CRMCard
                    title="Asignadas"
                    value={m.assigned}
                    subtitle="Con asesor asignado"
                    icon={UserCheck}
                    iconColor="text-blue-400"
                    iconBg="bg-blue-500/10"
                    accent="bg-blue-400"
                    total={m.active}
                />
                <CRMCard
                    title="Sin asesor"
                    value={m.unassigned}
                    subtitle="Requieren asignación"
                    icon={UserX}
                    iconColor="text-orange-400"
                    iconBg="bg-orange-500/10"
                    accent="bg-orange-400"
                    total={m.active}
                />
                <CRMCard
                    title="Cerradas ganadas"
                    value={m.closedWon}
                    subtitle="Ventas exitosas"
                    icon={Trophy}
                    iconColor="text-emerald-400"
                    iconBg="bg-emerald-500/10"
                    accent="bg-emerald-400"
                    total={m.total}
                />
                <CRMCard
                    title="Cerradas perdidas"
                    value={m.closedLost}
                    subtitle="No concretadas"
                    icon={XCircle}
                    iconColor="text-red-400"
                    iconBg="bg-red-500/10"
                    accent="bg-red-400"
                    total={m.total}
                />
            </div>
        </div>
    );
}
