import { Eye } from 'lucide-react';

interface Props {
    status: string;
    title: string;
    description: string;
    progressPercentage: number;
    estimatedDate: string;
}

export function TrackingHeroCard({
    status,
    title,
    description,
    progressPercentage,
    estimatedDate
}: Props) {
    return (
        <div className="bg-[#15201D] border border-white/5 rounded-[32px] p-8 md:p-12 relative overflow-hidden shadow-2xl">
            {/* Background Map Graphic (Simulated) */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: 'radial-gradient(circle at top right, #10B981, transparent 40%)',
                }}
            />

            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1 max-w-2xl">
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                        <span className="text-[#10B981] text-xs font-bold uppercase tracking-wider">{status}</span>
                    </div>

                    {/* Typography */}
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
                        {title}
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-10 max-w-xl font-medium">
                        {description}
                    </p>

                    {/* Progress Bar Area */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold text-white uppercase tracking-widest block">Progreso del envío</span>
                            <span className="text-sm font-black text-[#10B981]">{progressPercentage}%</span>
                        </div>

                        {/* The Bar */}
                        <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                            <div
                                className="h-full bg-[#10B981] rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>

                        <p className="text-right text-[11px] font-bold text-slate-500">
                            Entrega estimada: <span className="text-slate-300">{estimatedDate}</span>
                        </p>
                    </div>
                </div>

                {/* Right Action Button */}
                <div className="flex-shrink-0 mt-4 md:mt-0">
                    <button className="bg-[#10B981] hover:bg-[#0EA5E9] text-[#0A110F] flex items-center gap-2 px-8 py-4 rounded-full font-black text-sm transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.4)]">
                        <Eye className="w-5 h-5" strokeWidth={2.5} />
                        Ver Estado
                    </button>
                </div>
            </div>
        </div>
    );
}
