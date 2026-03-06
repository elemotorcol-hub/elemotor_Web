import Image from 'next/image';
import { VehicleInfo } from '@/mocks/vehiclesData';
import { Check, Zap, Gauge } from 'lucide-react';

interface Props {
    vehicle: VehicleInfo | undefined;
}

export function VehicleSummary({ vehicle }: Props) {
    if (!vehicle) return null;

    return (
        <div className="bg-[#131f1c] rounded-2xl border border-white/10 p-6 shadow-xl h-full flex flex-col relative z-10">
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-6 bg-slate-800">
                <Image
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    unoptimized={true}
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#131f1c] to-transparent pointer-events-none" />
            </div>

            <div className="flex justify-between items-end mb-4">
                <div>
                    {vehicle.badge && (
                        <span className="bg-[#00D4AA]/10 text-[#00D4AA] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md mb-2 inline-block shadow-[0_0_10px_rgba(0,212,170,0.2)]">
                            {vehicle.badge}
                        </span>
                    )}
                    <h3 className="text-3xl font-black text-white tracking-tight uppercase">{vehicle.name}</h3>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-gray-500 uppercase font-black block mb-0.5 tracking-wider">Desde</span>
                    <span className="text-2xl font-black text-[#00D4AA] drop-shadow-md">{vehicle.price}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#0c1412] border border-white/5 rounded-xl p-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-[#00D4AA]" />
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Autonomía</span>
                    </div>
                    <span className="text-lg font-bold text-white">{vehicle.range}</span>
                </div>
                <div className="bg-[#0c1412] border border-white/5 rounded-xl p-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                        <Gauge className="w-4 h-4 text-[#00D4AA]" />
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">0-100 km/h</span>
                    </div>
                    <span className="text-lg font-bold text-white">{vehicle.acceleration}</span>
                </div>
            </div>

            <div className="flex-1 border-t border-white/5 pt-6">
                <h4 className="text-[11px] text-gray-400 uppercase font-bold tracking-widest mb-4">Puntos Destacados</h4>
                <ul className="space-y-3">
                    {vehicle.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <div className="mt-0.5 w-4 h-4 rounded-full border border-[#00D4AA]/30 flex items-center justify-center flex-shrink-0 bg-[#00D4AA]/5">
                                <Check className="w-2.5 h-2.5 text-[#00D4AA]" strokeWidth={3} />
                            </div>
                            <span className="text-sm text-gray-300 font-medium">{highlight}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
