
import { MaintenanceHistoryItem } from '@/types/dashboard';
import { CheckCircle2, Clock, AlertCircle, Wrench } from 'lucide-react';

interface MaintenanceHistoryListProps {
    history: MaintenanceHistoryItem[];
}

export function MaintenanceHistoryList({ history }: MaintenanceHistoryListProps) {
    return (
        <div className="bg-[#15201D] border border-white/5 rounded-3xl p-8">
            <div className="flex items-center gap-6 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                    <Wrench className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white">Cronograma de Servicio</h3>
                    <p className="text-slate-500 text-sm">Registro de mantenimientos calculados según fecha de adquisición.</p>
                </div>
            </div>

            <div className="relative pl-20 md:pl-28 border-l-2 border-slate-800/60 ml-4 space-y-16">
                {history.map((item) => {
                    const isCompleted = item.status === 'completed';
                    const isOverdue = item.status === 'overdue';

                    return (
                        <div key={item.id} className={`relative ${!isCompleted && !isOverdue ? 'opacity-60' : 'opacity-100'}`}>
                            {/* Dot/Icon */}
                            <div className={`absolute -left-[45px] md:-left-[58px] top-0 w-10 md:w-11 h-10 md:h-11 rounded-full bg-[#0A110F] border-2 flex items-center justify-center shadow-lg ${
                                isCompleted ? 'border-[#10B981]' : isOverdue ? 'border-red-500' : 'border-slate-700'
                            }`}>
                                {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                                ) : isOverdue ? (
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                ) : (
                                    <Clock className="w-5 h-5 text-slate-500" />
                                )}
                            </div>

                            <div className="flex flex-col">
                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                    <h4 className={`font-bold text-lg ${isCompleted ? 'text-slate-400' : 'text-white'}`}>
                                        En el <span className={isCompleted ? 'text-slate-400' : 'text-[#10B981]'}>{item.date}</span> tienes que ir por tu mantenimiento de los {item.mileage} km
                                    </h4>
                                    {isCompleted && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-500 text-[10px] font-bold tracking-widest uppercase">
                                            Realizado
                                        </span>
                                    )}
                                </div>
                                <p className={`text-sm mb-2 leading-relaxed ${isCompleted ? 'text-slate-500' : 'text-slate-300'}`}>
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
