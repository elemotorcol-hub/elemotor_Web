import React from 'react';
import { Package, Truck, CheckCircle2, UserCheck, AlertCircle, FilePlus } from 'lucide-react';
import { ActivityItem } from '@/services/dashboard.service';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DashboardActivityFeed({ activities }: { activities?: ActivityItem[] }) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'order_status': return Truck;
            case 'new_quote': return FilePlus;
            case 'delivery': return CheckCircle2;
            case 'new_order': return Package;
            case 'assignment': return UserCheck;
            default: return AlertCircle;
        }
    };

    const getColors = (type: string) => {
        switch (type) {
            case 'order_status': return { iconColor: 'text-blue-400', iconBg: 'bg-blue-500/10 border-blue-500/20' };
            case 'new_quote': return { iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10 border-emerald-500/20' };
            default: return { iconColor: 'text-amber-400', iconBg: 'bg-amber-500/10 border-amber-500/20' };
        }
    };

    const displayActivities = activities || [];

    return (
        <div className="bg-[#15201D] border border-white/5 rounded-2xl p-6 h-full">
            <h2 className="text-lg font-bold text-white mb-6">Actividad Reciente</h2>
            <div className="relative border-l border-white/10 ml-3 space-y-8">
                {displayActivities.map((activity) => {
                    const Icon = getIcon(activity.type);
                    const { iconColor, iconBg } = getColors(activity.type);
                    
                    return (
                        <div key={activity.id} className="relative pl-8">
                            {/* Timeline Dot */}
                            <div className={`absolute -left-[18px] p-2 rounded-full border bg-[#15201D] ${iconBg}`}>
                                <Icon className={`w-4 h-4 ${iconColor}`} />
                            </div>
                            
                            {/* Content */}
                            <div className="flex flex-col gap-0.5">
                                <p className="text-sm font-medium text-slate-200 leading-snug">{activity.message}</p>
                                <span className="text-xs text-slate-500 font-medium">
                                    {formatDistanceToNow(new Date(activity.date), { addSuffix: true, locale: es })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                {displayActivities.length === 0 && (
                    <p className="text-sm text-slate-500 italic">No hay actividad reciente.</p>
                )}
            </div>
        </div>
    );
}
