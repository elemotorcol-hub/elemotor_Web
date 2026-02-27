import * as React from 'react';
import { Headset, Search, Ship, FileCheck, Truck } from 'lucide-react';

const steps = [
    {
        icon: <Headset className="w-8 h-8" />,
        title: 'ASESORÍA',
        description: 'Entendemos tus necesidades y presupuesto.',
    },
    {
        icon: <Search className="w-8 h-8" />,
        title: 'SELECCIÓN',
        description: 'Ubicamos el vehículo ideal en fábricas.',
    },
    {
        icon: <Ship className="w-8 h-8" />,
        title: 'IMPORTACIÓN',
        description: 'Logística internacional asegurada.',
    },
    {
        icon: <FileCheck className="w-8 h-8" />,
        title: 'NACIONALIZACIÓN',
        description: 'Trámites de aduana y aranceles.',
    },
    {
        icon: <Truck className="w-8 h-8" />,
        title: 'ENTREGA',
        description: 'Listo en nuestras vitrinas.',
    },
];

export function AboutProcess() {
    return (
        <section className="py-24 bg-slate-950 px-6">
            <div className="container mx-auto">
                <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-20 uppercase tracking-widest">
                    ¿CÓMO IMPORTAMOS TU VEHÍCULO?
                </h2>

                <div className="relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[40px] left-0 w-full h-0.5 bg-white/5 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-[#00D4AA] mb-8 transition-transform group-hover:scale-110 group-hover:bg-[#00D4AA] group-hover:text-slate-900">
                                    {step.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">
                                    {step.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-[200px]">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
