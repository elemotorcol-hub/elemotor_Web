import React from 'react';
import { MessageSquare, UserCheck, Loader2, Phone } from 'lucide-react';

interface CRMMetricsData {
    totalActive: number;
    assigned: number;
    inProcess: number;
    contacted: number;
}

interface CRMCardProps {
    title: string;
    value: number;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    accent: string;
}

function CRMCard({ title, value, icon: Icon, iconColor, iconBg, accent }: CRMCardProps) {
    return (
        <div className="bg-[#15201D] border border-white/5 rounded-2xl p-5 hover:bg-[#15201D]/80 transition-colors relative overflow-hidden group">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-slate-400 text-xs font-bold tracking-wider uppercase">{title}</h3>
                <div className={`p-2.5 rounded-xl ${iconBg} border border-white/5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
            </div>
            <div className="text-3xl font-bold text-white">{value}</div>
            <div className={`mt-3 h-1 w-full rounded-full bg-white/5`}>
                <div
                    className={`h-1 rounded-full ${accent} transition-all duration-700`}
                    style={{ width: value > 0 ? '100%' : '0%' }}
                />
            </div>
            <div className={`absolute -bottom-10 -right-10 w-28 h-28 ${iconBg} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full pointer-events-none`} />
        </div>
    );
}

export default function DashboardCRMMetrics({ data }: { data?: CRMMetricsData }) {
    const metrics = data ?? { totalActive: 0, assigned: 0, inProcess: 0, contacted: 0 };

    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-white">CRM &amp; Cotizaciones</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20">
                    Activas
                </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <CRMCard
                    title="Total Activas"
                    value={metrics.totalActive}
                    icon={MessageSquare}
                    iconColor="text-[#00D4AA]"
                    iconBg="bg-[#00D4AA]/10"
                    accent="bg-[#00D4AA]"
                />
                <CRMCard
                    title="Asignadas"
                    value={metrics.assigned}
                    icon={UserCheck}
                    iconColor="text-blue-400"
                    iconBg="bg-blue-500/10"
                    accent="bg-blue-400"
                />
                <CRMCard
                    title="En Proceso"
                    value={metrics.inProcess}
                    icon={Loader2}
                    iconColor="text-amber-400"
                    iconBg="bg-amber-500/10"
                    accent="bg-amber-400"
                />
                <CRMCard
                    title="Contactadas"
                    value={metrics.contacted}
                    icon={Phone}
                    iconColor="text-purple-400"
                    iconBg="bg-purple-500/10"
                    accent="bg-purple-400"
                />
            </div>
        </div>
    );
}
