interface Feature {
    title: string;
    desc: string;
}

export function VehicleFeatures({ features }: { features: Feature[] }) {
    if (!features || features.length === 0) return null;

    return (
        <section className="w-full mb-20">
            <h2 className="sr-only">Características Destacadas</h2>
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8"
                role="region"
                aria-label="Galería de características principales"
            >
                {features.map((feat, i) => (
                    <div
                        key={i}
                        className="w-full aspect-square rounded-3xl overflow-hidden relative group bg-[#0A0F1C] border border-white/5"
                    >
                        {/* Como las imágenes reales de features aún no están en el repo para todo auto,
                            usamos un gradiente con el verde corporativo de manera estructurada */}
                        <div className="absolute inset-0 bg-linear-to-br from-[#00D4AA]/10 to-slate-900/80 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />

                        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 z-10" />

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
