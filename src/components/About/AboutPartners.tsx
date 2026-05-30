import * as React from 'react';

const brands = [
    'BYD',
    'Deepal',
    'Changan',
    'GAC Motor',
    'Lynk & Co',
    'Xpeng',
    'Toyota',
    'RADAR',
];

export function AboutPartners() {
    return (
        <section className="py-24 bg-slate-900/50 px-6">
            <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase">
                        Marcas que distribuimos
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Trabajamos con las terminales portuarias y proveedores más importantes del sector
                        para garantizar el mejor precio y estado del vehículo.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {brands.map((brand) => (
                        <div
                            key={brand}
                            className="bg-gradient-to-br from-[#0d1f1a] to-[#0a1510] border border-white/[0.08] rounded-2xl p-8 min-h-[120px] flex flex-col justify-center hover:border-[#00D4AA]/40 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,212,170,0.12)] transition-all duration-300"
                        >
                            <span className="text-2xl md:text-3xl font-black tracking-tighter text-white leading-none">
                                {brand}
                            </span>
                            <div className="w-8 h-0.5 bg-[#00D4AA] mt-3" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
