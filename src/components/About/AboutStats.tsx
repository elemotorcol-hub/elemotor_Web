import * as React from 'react';
import { AnimatedCounter } from './AnimatedCounter';

interface StatInfo {
    label: string;
    value: number;
    suffix: string;
}

const stats: StatInfo[] = [
    { label: 'VEHÍCULOS IMPORTADOS', value: 150, suffix: '+' },
    { label: 'CLIENTES SATISFECHOS', value: 120, suffix: '+' },
    { label: 'MODELOS DIFERENTES', value: 15, suffix: '+' },
];

export function AboutStats() {
    return (
        <section className="py-24 bg-slate-900 px-6">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
                    <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 text-center sm:text-left">
                        <div className="text-7xl md:text-9xl font-black text-[#00D4AA] leading-none">10+</div>
                        <h2 className="text-2xl md:text-5xl font-black text-white leading-tight">
                            Años de Experiencia en <br className="hidden sm:block" />
                            <span className="text-slate-500 uppercase text-base sm:text-2xl md:text-3xl tracking-widest block sm:inline mt-2 sm:mt-0">Electromovilidad</span>
                        </h2>
                    </div>

                    <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
                        <p>
                            Desde nuestra fundación en Bucaramanga, EleMotor ha sido pionero en la identificación y selección de los vehículos eléctricos más sofisticados del mundo. No solo vendemos autos; diseñamos experiencias de movilidad que respetan el entorno sin sacrificar la potencia.
                        </p>
                        <p>
                            Nuestra misión es eliminar las barreras de importación premium, ofreciendo a nuestros clientes en Santander un acceso directo a las marcas líderes globales con toda la garantía, trámite y servicio técnico especializado.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-slate-800/50 border border-white/5 rounded-3xl p-6 md:p-10 text-center group hover:border-[#00D4AA]/20 transition-colors"
                        >
                            <div className="text-4xl md:text-5xl font-black text-white mb-4">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-[10px] md:text-xs font-bold text-[#00D4AA] tracking-[0.2em] uppercase">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
