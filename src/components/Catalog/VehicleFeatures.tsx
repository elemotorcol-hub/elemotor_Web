import Image from 'next/image';
import {
    Monitor, BatteryCharging, Zap, Gauge, Shield, Wifi,
    Navigation, RefreshCw, Camera, Wind, Headphones,
    Cpu, Armchair, Thermometer, Lock, Sun, type LucideIcon,
} from 'lucide-react';

interface Feature {
    title: string;
    desc: string;
}

const IMAGE_MAP: { keywords: string[]; src: string }[] = [
    { keywords: ['pantalla', 'screen', 'display', 'touch'], src: '/MODELOS/info/pantalla.webp' },
    { keywords: ['batería', 'bateria', 'battery', 'kwh'], src: '/MODELOS/info/bateria.webp' },
    { keywords: ['carga', 'charge', 'recarga', 'charging'], src: '/MODELOS/info/cargaRapida.webp' },
];

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

function getImage(title: string): string | null {
    const lower = title.toLowerCase();
    for (const { keywords, src } of IMAGE_MAP) {
        if (keywords.some((kw) => lower.includes(kw))) return src;
    }
    return null;
}

function getIcon(title: string): LucideIcon {
    const lower = title.toLowerCase();
    for (const { keywords, Icon } of ICON_MAP) {
        if (keywords.some((kw) => lower.includes(kw))) return Icon;
    }
    return Zap;
}

export function VehicleFeatures({ features }: { features: Feature[] }) {
    if (!features || features.length === 0) return null;

    return (
        <section className="w-full pt-16 mb-20">
            <h2 className="sr-only">Características Destacadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                {features.map((feat, i) => {
                    const imgSrc = getImage(feat.title);
                    const Icon = getIcon(feat.title);
                    return (
                        <div
                            key={i}
                            className="w-full aspect-square rounded-3xl overflow-hidden relative group bg-[#0A0F1C] border border-white/5 hover:border-[#00D4AA]/30 transition-all duration-500"
                        >
                            {imgSrc ? (
                                /* Photo background */
                                <Image
                                    src={imgSrc}
                                    alt={feat.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            ) : (
                                /* Giant icon — centered, decorative */
                                <>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Icon
                                            className="w-64 h-64 text-[#00D4AA] opacity-[0.06] group-hover:opacity-[0.10] group-hover:scale-110 transition-all duration-700"
                                            strokeWidth={1}
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#00D4AA08_0%,_transparent_70%)] group-hover:bg-[radial-gradient(ellipse_at_center,_#00D4AA12_0%,_transparent_70%)] transition-all duration-500" />
                                </>
                            )}

                            {/* Bottom gradient so text is always readable */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#060B14] via-[#060B14]/40 to-transparent" />

                            {/* Text */}
                            <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20">
                                <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-3">
                                    {feat.title}
                                </h3>
                                <p className="text-sm md:text-base text-slate-400 leading-relaxed">
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
