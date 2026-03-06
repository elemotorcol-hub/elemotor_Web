import * as React from 'react';

export function CatalogHeader() {
    return (
        <section className="pt-32 pb-12 px-6 bg-slate-900 border-b border-white/5 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00B38F]/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto relative z-10 text-center flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight">
                    Nuestros Modelos
                </h1>
                {/* Línea Verde debajo del título */}
                <div className="w-16 md:w-20 h-1.5 bg-[#00D4AA] mb-8" />
                <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
                    Experimenta la absoluta vanguardia técnica con nuestra selección
                    cuidadosa de vehículos premium.
                </p>
            </div>
        </section>
    );
}
