'use client';

import Image from 'next/image';
import { DashboardData } from '@/mocks/dashboardData';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

interface Props {
    vehicle: DashboardData['vehicle'];
}

export function VehicleDetailWidget({ vehicle }: Props) {
    const router = useRouter();

    return (
        <button 
            onClick={() => router.push('/dashboard/vehiculo')}
            className="bg-[#15201D] border border-white/5 rounded-[32px] p-8 h-full w-full flex flex-col group hover:border-[#10B981]/30 hover:bg-white/[0.02] transition-all duration-500 text-left relative overflow-hidden shadow-xl"
        >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Tu Vehículo</h3>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-[#10B981] group-hover:bg-[#10B981]/10 transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>

            <div className="flex items-center gap-6 mb-10">
                <div className="w-24 h-16 relative bg-[#0A110F] rounded-2xl overflow-hidden shadow-inner border border-white/5 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                    <Image
                        src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=200&auto=format&fit=crop'}
                        alt={`Tu ${vehicle.name}`}
                        fill
                        className="object-contain p-2"
                        unoptimized
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-[#10B981] px-1.5 py-0.5 bg-emerald-500/10 rounded uppercase">
                            {vehicle.year}
                        </span>
                        <h4 className="text-xl font-black text-white leading-tight tracking-tighter">{vehicle.name}</h4>
                    </div>
                    <p className="text-xs font-medium text-slate-500">Color: <span className="text-slate-300">{vehicle.color}</span></p>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                    <span className="font-bold text-slate-500 uppercase tracking-widest">VIN</span>
                    <span className="font-mono text-slate-400">{vehicle.vin}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                    <span className="font-bold text-slate-500 uppercase tracking-widest">Garantía</span>
                    <div className="flex items-center gap-1 text-emerald-400 font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        Activa
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="bg-[#0A110F] border border-white/5 rounded-2xl p-4 text-center group-hover:border-[#10B981]/20 transition-colors">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block mb-1">Potencia</span>
                    <span className="text-lg font-black text-white">{vehicle.horsepower}</span>
                </div>
                <div className="bg-[#0A110F] border border-white/5 rounded-2xl p-4 text-center group-hover:border-[#10B981]/20 transition-colors">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block mb-1">Autonomía</span>
                    <span className="text-lg font-black text-[#10B981]">{vehicle.range}</span>
                </div>
            </div>
        </button>
    );
}
