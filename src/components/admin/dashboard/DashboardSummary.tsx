import React from 'react';
import { Users, FileText, CheckCircle2, Car, UserCheck, UserRound, Headset } from 'lucide-react';
import { DashboardMetrics } from '@/services/dashboard.service';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
}

function MetricCard({ title, value, subtitle, icon: Icon, iconColor, iconBg }: MetricCardProps) {
    return (
        <div className="bg-[#15201D] border border-white/5 rounded-2xl p-5 hover:bg-[#15201D]/80 transition-colors relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-slate-400 text-xs font-bold tracking-wider uppercase mb-1">{title}</h3>
                    <div className="text-3xl font-bold text-white">
                        {value === '—' || value === undefined ? <span className="text-slate-600 text-2xl">—</span> : value}
                    </div>
                </div>
                <div className={`p-3 rounded-xl ${iconBg} border border-white/5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
            </div>
            <p className="text-xs text-slate-500">{subtitle}</p>
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${iconBg} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full pointer-events-none`} />
        </div>
    );
}

export default function DashboardSummary({ metrics }: { metrics?: DashboardMetrics }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <MetricCard
                title="Usuarios Registrados"
                value={metrics?.totalUsers ?? '—'}
                subtitle="Total de cuentas en el sistema"
                icon={UserRound}
                iconColor="text-slate-300"
                iconBg="bg-slate-500/10"
            />
            <MetricCard
                title="Clientes con Vehículo"
                value={metrics?.totalClients ?? '—'}
                subtitle="Clientes"
                icon={UserCheck}
                iconColor="text-[#10B981]"
                iconBg="bg-[#10B981]/10"
            />
            <MetricCard
                title="Asesores"
                value={metrics?.totalAsesores ?? '—'}
                subtitle="Asesores del equipo"
                icon={Headset}
                iconColor="text-[#00D4AA]"
                iconBg="bg-[#00D4AA]/10"
            />
            <MetricCard
                title="Pedidos Activos"
                value={metrics?.activeOrders ?? 0}
                subtitle="Pedidos en proceso (sin entregar)"
                icon={CheckCircle2}
                iconColor="text-amber-500"
                iconBg="bg-amber-500/10"
            />
            <MetricCard
                title="Leads Hoy"
                value={metrics?.leadsToday ?? 0}
                subtitle="Cotizaciones recibidas hoy"
                icon={Users}
                iconColor="text-blue-400"
                iconBg="bg-blue-500/10"
            />
            <MetricCard
                title="Leads esta Semana"
                value={metrics?.leadsWeekly ?? 0}
                subtitle="Cotizaciones en la semana"
                icon={FileText}
                iconColor="text-purple-400"
                iconBg="bg-purple-500/10"
            />
            <MetricCard
                title="Vehículos en Stock"
                value={metrics?.vehiclesInStock ?? 0}
                subtitle="Unidades disponibles"
                icon={Car}
                iconColor="text-sky-400"
                iconBg="bg-sky-500/10"
            />
        </div>
    );
}
