import * as React from 'react';

export function AboutHero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] mb-8 tracking-tight">
                        Liderando la <br />
                        Transición <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Eléctrica</span> <br />
                        en Colombia
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl font-medium">
                        Importamos el futuro de la movilidad sostenible a Bucaramanga con exclusividad,
                        respaldo total y la tecnología más avanzada del mercado global.
                    </p>
                </div>
            </div>
        </section>
    );
}
