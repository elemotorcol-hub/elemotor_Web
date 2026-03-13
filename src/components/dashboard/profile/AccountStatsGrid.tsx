import { FileText, Car } from 'lucide-react';

export function AccountStatsGrid() {
    const stats = [
        {
            label: 'Cotizaciones',
            value: '4',
            icon: FileText,
            trend: '+1 reciente',
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
        },
        {
            label: 'Vehículos Adquiridos',
            value: '1',
            icon: Car,
            trend: 'Deepal S07',
            color: 'text-[#10B981]',
            bg: 'bg-[#10B981]/10'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 h-full">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <div key={i} className="bg-[#15201D] border border-white/5 rounded-[24px] p-6 lg:p-8 flex flex-col justify-between group hover:border-white/10 transition-colors shadow-lg">
                        <div className="flex items-start justify-between mb-8">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                        
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">
                                {stat.label}
                            </span>
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-black text-white tracking-tight">{stat.value}</span>
                                <span className="text-xs font-semibold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{stat.trend}</span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}
