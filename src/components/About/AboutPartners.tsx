import * as React from 'react';
import Image from 'next/image';

const brands = [
    { name: 'BYD',       src: '/marcas/byd-seeklogo.png' },
    { name: 'Deepal',    src: '/marcas/deepal-global-changan-seeklogo.png' },
    { name: 'Changan',   src: '/marcas/changan-icon-seeklogo.png' },
    { name: 'GAC Motor', src: '/marcas/gac-motor-seeklogo.png' },
    { name: 'Lynk & Co', src: '/marcas/lynk-co-seeklogo.png' },
    { name: 'Xpeng',     src: '/marcas/xpeng-motors-seeklogo.png' },
    { name: 'Toyota',    src: '/marcas/toyota-svgrepo-com.svg' },
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

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                    {brands.map((brand) => (
                        <div
                            key={brand.name}
                            className="bg-white rounded-2xl p-6 h-28 flex flex-col items-center justify-center gap-3 group shadow-md hover:shadow-[0_4px_24px_rgba(0,212,170,0.18)] hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="relative w-full h-12 flex items-center justify-center">
                                <Image
                                    src={brand.src}
                                    alt={`Logo ${brand.name}`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">
                                {brand.name}
                            </span>
                        </div>
                    ))}
                    {/* RADAR — tarjeta de solo texto */}
                    <div className="bg-white rounded-2xl p-6 h-28 flex flex-col items-center justify-center gap-3 group shadow-md hover:shadow-[0_4px_24px_rgba(0,212,170,0.18)] hover:-translate-y-1 transition-all duration-300">
                        <span className="text-slate-800 text-2xl font-black tracking-widest uppercase">
                            RADAR
                        </span>
                        <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">
                            Radar
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
