import React from 'react';
import { Users, FileText, CheckCircle2, Car } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    trend: string;
    trendUp: boolean;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
}

function MetricCard({ title, value, trend, trendUp, icon: Icon, iconColor, iconBg }: MetricCardProps) {
    return (
        <div className="bg-[#15201D] border border-white/5 rounded-2xl p-5 hover:bg-[#15201D]/80 transition-colors relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-slate-400 text-xs font-bold tracking-wider uppercase mb-1">{title}</h3>
                    <div className="text-3xl font-bold text-white">{value}</div>
                </div>
                <div className={`p-3 rounded-xl ${iconBg} border border-white/5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {trend}
                </span>
                <span className="text-xs text-slate-500">vs. período anterior</span>
            </div>
            
            {/* Background Accent Glow */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${iconBg} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full pointer-events-none`}></div>
        </div>
    );
}

export default function DashboardSummary() {
    // Simulated data according to /api/dashboard/summary criteria
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
                title="Leads Hoy" 
                value="24" 
                trend="+12%" 
                trendUp={true} 
                icon={Users} 
                iconColor="text-[#10B981]" 
                iconBg="bg-[#10B981]/10" 
            />
            <MetricCard 
                title="Leads Semana" 
                value="156" 
                trend="+8.5%" 
                trendUp={true} 
                icon={FileText} 
                iconColor="text-blue-500" 
                iconBg="bg-blue-500/10" 
            />
            <MetricCard 
                title="Pedidos Activos" 
                value="42" 
                trend="-2.1%" 
                trendUp={false} 
                icon={CheckCircle2} 
                iconColor="text-amber-500" 
                iconBg="bg-amber-500/10" 
            />
            <MetricCard 
                title="Vehículos en Stock" 
                value="89" 
                trend="+5.4%" 
                trendUp={true} 
                icon={Car} 
                iconColor="text-purple-500" 
                iconBg="bg-purple-500/10" 
            />
        </div>
    );
}
