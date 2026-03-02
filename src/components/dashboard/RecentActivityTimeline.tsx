import { Car, FileCheck, Send, Circle } from 'lucide-react';
import { DashboardData } from '@/mocks/dashboardData';

interface Props {
    activities: DashboardData['recentActivities'];
}

type ActivityType = DashboardData['recentActivities'][number]['type'];

export function RecentActivityTimeline({ activities }: Props) {
    const getIcon = (type: ActivityType) => {
        switch (type) {
            case 'transit': return <Car className="w-4 h-4 text-[#10B981]" />;
            case 'document': return <FileCheck className="w-4 h-4 text-slate-300" />;
            case 'quote': return <Send className="w-4 h-4 text-slate-300" />;
            default: return <Circle className="w-4 h-4 text-slate-500" />;
        }
    };

    return (
        <div className="bg-[#15201D] border border-white/5 rounded-[32px] p-8 h-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white tracking-tight">Actividad Reciente</h3>
                <button className="text-[#10B981] font-bold text-sm hover:text-white transition-colors">
                    Ver todo
                </button>
            </div>

            <div className="relative pl-3 space-y-8 before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-white/5 before:to-transparent">
                {activities.map((activity, index) => (
                    <div key={activity.id} className="relative flex items-start gap-6 group">
                        {/* Icon/Bullet */}
                        <div className="relative z-10 w-10 h-10 flex items-center justify-center bg-[#0A110F] border border-white/10 rounded-full flex-shrink-0 group-hover:border-[#10B981]/50 transition-colors">
                            {getIcon(activity.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
                                {activity.date}
                            </span>
                            <h4 className="text-base font-bold text-white mb-2">{activity.title}</h4>
                            <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-sm">
                                {activity.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
