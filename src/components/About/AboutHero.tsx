import * as React from 'react';
import { AboutGallery } from './AboutGallery';

export function AboutHero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00B38F]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#00D4AA]/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Texto */}
                    <div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight">
                            Impulsando la <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4AA] to-emerald-400">Movilidad Eléctrica</span> <br />
                            en Colombia
                        </h1>
                        <div className="space-y-4">
                            <p className="text-lg text-slate-400 leading-relaxed font-medium">
                                La movilidad eléctrica en Colombia se consolida como un pilar estratégico para el desarrollo sostenible del país. Su impulso contribuye a la reducción de emisiones contaminantes, mejora la calidad del aire y promueve la innovación tecnológica en el sector transporte.
                            </p>
                            <p className="text-base text-slate-500 leading-relaxed">
                                El fortalecimiento de la infraestructura de carga, junto con políticas públicas e incentivos adecuados, resulta fundamental para acelerar su adopción.
                            </p>
                            <p className="text-base text-slate-500 leading-relaxed">
                                La articulación entre el Estado, el sector privado y la ciudadanía permitirá avanzar hacia un sistema de movilidad más eficiente, limpio y competitivo.
                            </p>
                        </div>
                    </div>

                    {/* Carrusel de fotos */}
                    <div className="flex items-center justify-center pb-10">
                        <AboutGallery />
                    </div>

                </div>
            </div>
        </section>
    );
}
