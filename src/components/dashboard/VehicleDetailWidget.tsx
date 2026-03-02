import Image from 'next/image';
import { DashboardData } from '@/mocks/dashboardData';

interface Props {
    vehicle: DashboardData['vehicle'];
}

export function VehicleDetailWidget({ vehicle }: Props) {
    return (
        <div className="bg-[#15201D] border border-white/5 rounded-[32px] p-8 h-full flex flex-col">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Detalles del Vehículo</h3>

            <div className="flex items-center gap-6 mb-8">
                {/* Dynamically rendering the image passed via props, ignoring the hardcoded blue car rule */}
                <div className="w-28 h-20 relative bg-[#0A110F] rounded-xl overflow-hidden shadow-inner border border-white/5 flex-shrink-0">
                    <Image
                        src={vehicle.imageUrl}
                        alt={`Tu ${vehicle.name}`}
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <h4 className="text-xl font-bold text-white mb-1 leading-tight">{vehicle.name}</h4>
                    <span className="text-sm font-medium text-slate-400">Color: {vehicle.color}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="bg-[#0A110F] border border-white/5 rounded-2xl p-4 text-center">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block mb-1">Potencia</span>
                    <span className="text-lg font-black text-white">{vehicle.horsepower}</span>
                </div>
                <div className="bg-[#0A110F] border border-white/5 rounded-2xl p-4 text-center">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block mb-1">Autonomía</span>
                    <span className="text-lg font-black text-[#10B981]">{vehicle.range}</span>
                </div>
            </div>
        </div>
    );
}
