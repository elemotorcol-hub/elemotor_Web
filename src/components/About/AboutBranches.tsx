import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowUpRight, Clock } from 'lucide-react';

const branches = [
    {
        city: 'Ecuador',
        country: 'Ecuador',
        description: 'Sede internacional de EleMotor. Importación y distribución de vehículos eléctricos para el mercado ecuatoriano.',
        image: '/nosotros/sedes/ecuador.webp',
        href: 'https://elemotor.com.ec',
        external: true,
        label: 'Visitar sede Ecuador',
        hours: [
            { days: 'Lunes a Viernes', time: '8:00 AM – 4:00 PM' },
            { days: 'Sábados', time: 'Bajo cita previa' },
        ],
    },
    {
        city: 'Barrancabermeja',
        country: 'Colombia',
        description: 'Nuestra sede en el corazón del Magdalena Medio. Atención y entrega de vehículos eléctricos en la región.',
        image: '/nosotros/sedes/barranca.webp',
        href: 'https://maps.google.com/?q=Carrera+29+%2348-31,Barrancabermeja,Santander,Colombia',
        external: true,
        label: 'Ver en Maps',
        hours: [
            { days: 'Lunes a Viernes', time: '8:00 AM – 5:00 PM' },
            { days: 'Sábados', time: '9:00 AM – 1:00 PM' },
        ],
    },
    {
        city: 'Bucaramanga',
        country: 'Colombia',
        description: 'Sede principal en Santander. Showroom, posventa y asesoría especializada en movilidad eléctrica.',
        image: '/nosotros/galeria-2.webp',
        href: null,
        external: false,
        label: null,
        hours: [
            { days: 'Lunes a Viernes', time: '8:00 AM – 5:00 PM' },
            { days: 'Sábados', time: '9:00 AM – 1:00 PM' },
        ],
    },
];

export function AboutBranches() {
    return (
        <section className="py-24 bg-slate-900 px-6">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[#00D4AA] text-[11px] font-black tracking-widest uppercase mb-3">Presencia Regional</p>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase">
                        Nuestras Sedes
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {branches.map((branch) => {
                        const CardContent = (
                            <div className="relative h-[480px] rounded-[2rem] overflow-hidden group cursor-pointer">
                                {/* Foto de fondo */}
                                <Image
                                    src={branch.image}
                                    alt={`Sede ${branch.city}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />

                                {/* Overlay degradado */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#060B14] via-[#060B14]/60 to-transparent" />

                                {/* Badge país */}
                                <div className="absolute top-6 left-6">
                                    <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                                        <MapPin className="w-3 h-3 text-[#00D4AA]" />
                                        {branch.country}
                                    </span>
                                </div>

                                {/* Flecha si tiene link */}
                                {branch.href && (
                                    <div className="absolute top-6 right-6">
                                        <div className="w-9 h-9 rounded-full bg-[#00D4AA] flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <ArrowUpRight className="w-4 h-4 text-[#060B14]" />
                                        </div>
                                    </div>
                                )}

                                {/* Contenido inferior */}
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <h3 className="text-3xl md:text-4xl font-black text-white uppercase mb-3">
                                        {branch.city}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                        {branch.description}
                                    </p>

                                    {/* Horarios */}
                                    {branch.hours && (
                                        <div className="border-t border-white/10 pt-4 mt-2">
                                            <div className="flex items-center gap-1.5 mb-3">
                                                <Clock className="w-3.5 h-3.5 text-[#00D4AA]" />
                                                <span className="text-[10px] font-black text-[#00D4AA] tracking-widest uppercase">Horario de atención</span>
                                            </div>
                                            <div className="space-y-1.5">
                                                {branch.hours.map((h) => (
                                                    <div key={h.days} className="flex items-center justify-between">
                                                        <span className="text-slate-400 text-xs font-semibold">{h.days}</span>
                                                        <span className="text-white text-xs font-black">{h.time}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {branch.label && (
                                        <span className="inline-block mt-4 text-[#00D4AA] text-[11px] font-black tracking-widest uppercase">
                                            {branch.label} →
                                        </span>
                                    )}
                                </div>
                            </div>
                        );

                        return branch.href ? (
                            <Link
                                key={branch.city}
                                href={branch.href}
                                target={branch.external ? '_blank' : undefined}
                                rel={branch.external ? 'noopener noreferrer' : undefined}
                            >
                                {CardContent}
                            </Link>
                        ) : (
                            <div key={branch.city}>
                                {CardContent}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
