import * as React from 'react';

const partners = [
    { name: 'PARTNER A', id: 'a' },
    { name: 'PARTNER B', id: 'b' },
    { name: 'PARTNER C', id: 'c' },
    { name: 'PARTNER D', id: 'd' },
];

export function AboutPartners() {
    return (
        <section className="py-24 bg-slate-900/50 px-6">
            <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase">
                        Importación Directa, Sin Intermediarios
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Trabajamos con las terminales portuarias y proveedores más importantes del sector
                        para garantizar el mejor precio y estado del vehículo.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {partners.map((partner) => (
                        <div
                            key={partner.id}
                            className="bg-slate-800/20 border border-white/5 rounded-2xl p-4 md:p-8 h-24 md:h-32 flex items-center justify-center group hover:border-white/10 transition-colors"
                        >
                            <div className="text-slate-500 font-black tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs uppercase group-hover:text-slate-300 transition-colors text-center">
                                {partner.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
