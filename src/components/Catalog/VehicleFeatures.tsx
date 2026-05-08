import {
    Monitor, BatteryCharging, Zap, Gauge, Shield, Wifi,
    Navigation, RefreshCw, Camera, Wind, Headphones,
    Cpu, Armchair, Thermometer, Lock, Sun, type LucideIcon,
} from 'lucide-react';

interface Feature {
    title: string;
    desc: string;
}

const ICON_MAP: { keywords: string[]; Icon: LucideIcon }[] = [
    { keywords: ['pantalla', 'screen', 'display', 'touch'], Icon: Monitor },
    { keywords: ['batería', 'bateria', 'battery', 'kwh'], Icon: BatteryCharging },
    { keywords: ['carga', 'charge', 'recarga', 'charging'], Icon: Zap },
    { keywords: ['velocidad', 'speed', 'km/h', '0-100', 'aceleración'], Icon: Gauge },
    { keywords: ['seguridad', 'safety', 'airbag', 'adas', 'asistencia'], Icon: Shield },
    { keywords: ['conectividad', 'wifi', 'bluetooth', '4g', '5g', 'internet'], Icon: Wifi },
    { keywords: ['autonomía', 'autonomia', 'rango', 'range', 'km'], Icon: Navigation },
    { keywords: ['ota', 'actualización', 'software', 'sistema'], Icon: RefreshCw },
    { keywords: ['cámara', 'camara', 'camera', '360', 'visión'], Icon: Camera },
    { keywords: ['climatización', 'clima', 'aire', 'ventilación', 'temperatura'], Icon: Wind },
    { keywords: ['sonido', 'audio', 'parlantes', 'música', 'altavoces'], Icon: Headphones },
    { keywords: ['motor', 'potencia', 'hp', 'kw', 'torque'], Icon: Cpu },
    { keywords: ['asientos', 'interior', 'confort', 'tapizado', 'cuero'], Icon: Armchair },
    { keywords: ['térmico', 'calefacción', 'calor', 'heating'], Icon: Thermometer },
    { keywords: ['bloqueo', 'acceso', 'llave', 'keyless', 'entrada'], Icon: Lock },
    { keywords: ['techo', 'panorámico', 'sunroof', 'cristal', 'vidrio'], Icon: Sun },
];

function getIcon(title: string): LucideIcon {
    const lower = title.toLowerCase();
    for (const { keywords, Icon } of ICON_MAP) {
        if (keywords.some((kw) => lower.includes(kw))) return Icon;
    }
    return Zap; // fallback
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
                {features.map((feat, i) => {
                    const Icon = getIcon(feat.title);
                    return (
                        <div
                            key={i}
                            className="w-full aspect-square rounded-3xl overflow-hidden relative group bg-[#0A0F1C] border border-white/5 hover:border-[#00D4AA]/20 transition-colors duration-500"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00D4AA]/10 to-slate-900/80 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 z-10" />

                            {/* Icon top-left */}
                            <div className="absolute top-6 left-6 z-20">
                                <div className="w-12 h-12 rounded-2xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center group-hover:bg-[#00D4AA]/20 transition-colors duration-300">
                                    <Icon className="w-6 h-6 text-[#00D4AA]" />
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20">
                                <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-3">
                                    {feat.title}
                                </h3>
                                <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
                                    {feat.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
