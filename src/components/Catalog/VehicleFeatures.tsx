interface Feature {
    title: string;
    desc: string;
}

export function VehicleFeatures({ features }: { features: Feature[] }) {
    if (!features || features.length === 0) return null;

    return (
        <section className="w-full mb-20 overflow-hidden">
            <h2 className="sr-only">Características Destacadas</h2>
            {/* Contenedor con scroll nativo (Snap) optimizado para evitar JS extra (TBT bajo) */}
            <div
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                role="region"
                aria-label="Galería de características principales"
            >
                {features.map((feat, i) => (
                    <div
                        key={i}
                        className="snap-center shrink-0 w-[85vw] md:w-[400px] lg:w-[320px] xl:w-[350px] aspect-square rounded-3xl overflow-hidden relative group bg-[#0A0F1C] border border-white/5"
                    >
                        {/* Como las imágenes reales de features aún no están en el repo para todo auto,
                            usamos un gradiente con el verde corporativo de manera estructurada */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00D4AA]/10 to-slate-900/80 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />

                        {/* Placeholder listo para la imagen real para un rating lighthouse 100 de CLS */}
                        {/* 
                         <Image 
                            src={feat.image} 
                            alt={`Imagen descriptiva detallada de: ${feat.title}`} 
                            fill 
                            className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                            sizes="(max-width: 768px) 85vw, 400px"
                         /> 
                        */}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 z-10" />

                        <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20">
                            <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-3">
                                {feat.title}
                            </h3>
                            <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
                                {feat.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
