import { Vehicle } from '@/data/models';
import { Zap, Battery, Expand, Cpu } from 'lucide-react';

export function VehicleSpecs({ vehicle }: { vehicle: Vehicle }) {
    // Las specs reales se cruzan con el modelo del auto base
    const specs = [
        {
            icon: Zap,
            title: 'PERFORMANCE',
            value: `0-100 en ${vehicle.acceleration}s`,
            subText: `${vehicle.power} HP Potencia`
        },
        {
            icon: Battery,
            title: 'BATERÍA',
            value: `${vehicle.range} km`,
            subText: `${vehicle.battery} kWh NMC`
        },
        {
            icon: Expand,
            title: 'DIMENSIONES',
            value: 'L: 4.75m',
            subText: 'Ancho: 1.93m'
        },
        {
            icon: Cpu,
            title: 'TECNOLOGÍA',
            value: 'ADAS L2',
            subText: 'Pantalla 15.6"'
        }
    ];

    return (
        <section className="w-full">
            <h2 className="text-2xl font-bold text-white mb-8 text-center md:text-left">Especificaciones Técnicas</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                {specs.map((spec, index) => {
                    const Icon = spec.icon;
                    return (
                        <div key={index} className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center transition-colors hover:border-[#00D4AA]/30">
                            <Icon className="w-6 h-6 text-[#00D4AA] mb-4 stroke-[1.5]" aria-hidden="true" />
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">
                                {spec.title}
                            </span>
                            <span className="text-lg md:text-xl md:text-2xl font-black text-white leading-tight mb-1">
                                {spec.value}
                            </span>
                            <span className="text-[10px] text-[#00D4AA] font-bold tracking-widest">
                                {spec.subText}
                            </span>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
