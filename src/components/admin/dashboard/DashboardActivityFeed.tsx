import React from 'react';
import { Package, Truck, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

export default function DashboardActivityFeed() {
    const activities = [
        { id: 1, type: 'status_change', message: 'Pedido #PED-0152 transitando a Bodega Central', date: 'Hace 45 min', icon: Truck, iconColor: 'text-blue-400', iconBg: 'bg-blue-500/10 border-blue-500/20' },
        { id: 2, type: 'delivery', message: 'Pedido #PED-0149 entregado al cliente', date: 'Hace 2 horas', icon: CheckCircle2, iconColor: 'text-[#10B981]', iconBg: 'bg-[#10B981]/10 border-[#10B981]/20' },
        { id: 3, type: 'new_order', message: 'Nuevo pedido #PED-0155 generado (Elementor S)', date: 'Hace 5 horas', icon: Package, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/10 border-amber-500/20' },
        { id: 4, type: 'assignment', message: 'Asesor Carlos R. asignado a Cotización #COT-0142', date: 'Ayer', icon: UserCheck, iconColor: 'text-purple-400', iconBg: 'bg-purple-500/10 border-purple-500/20' },
        { id: 5, type: 'alert', message: 'Retraso reportado en envío internacional #ENV-99', date: 'Hace 2 días', icon: AlertCircle, iconColor: 'text-red-400', iconBg: 'bg-red-500/10 border-red-500/20' },
    ];

    return (
        <div className="bg-[#15201D] border border-white/5 rounded-2xl p-6 h-full">
            <h2 className="text-lg font-bold text-white mb-6">Actividad Reciente</h2>
            <div className="relative border-l border-white/10 ml-3 space-y-8">
                {activities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                        <div key={activity.id} className="relative pl-8">
                            {/* Timeline Dot */}
                            <div className={`absolute -left-[18px] p-2 rounded-full border bg-[#15201D] ${activity.iconBg}`}>
                                <Icon className={`w-4 h-4 ${activity.iconColor}`} />
                            </div>
                            
                            {/* Content */}
                            <div className="flex flex-col gap-0.5">
                                <p className="text-sm font-medium text-slate-200 leading-snug">{activity.message}</p>
                                <span className="text-xs text-slate-500 font-medium">{activity.date}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
