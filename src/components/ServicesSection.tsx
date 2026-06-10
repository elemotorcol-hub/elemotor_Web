'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wrench, Navigation, BatteryCharging, ArrowRight, ShieldCheck, Headphones, Settings, Zap } from 'lucide-react';

const services = [
    {
        icon: Wrench,
        badge: 'TALLERES\nCERTIFICADOS',
        description: 'Red de talleres especializados en vehículos eléctricos con técnicos certificados y equipos de diagnóstico de última generación.',
        href: '/talleres',
        cta: 'VER TALLERES',
        image: '/talleres_certificados.webp',
    },
    {
        icon: Navigation,
        badge: 'RASTREAR\nVEHÍCULO',
        description: 'Consulta en tiempo real el estado de importación de tu vehículo. Sigue cada etapa del proceso desde el origen hasta tu ciudad.',
        href: '/rastreo',
        cta: 'RASTREAR MI PEDIDO',
        image: '/rastrear_vehiculo.webp',
    },
    {
        icon: BatteryCharging,
        badge: '¿CÓMO CARGO\nMI AUTO?',
        description: 'Guía completa de estaciones de carga públicas y domésticas, tipos de conectores AC/DC y tiempos estimados de carga.',
        href: '/como-cargo',
        cta: 'VER GUÍA DE CARGA',
        image: '/como_cargo.webp',
    },
];

const trustItems = [
    { icon: ShieldCheck, title: 'Asesoría experta',         sub: 'Te guiamos en cada paso de tu experiencia eléctrica.' },
    { icon: Headphones,  title: 'Atención personalizada',   sub: 'Nuestro equipo está listo para ayudarte siempre.' },
    { icon: Settings,    title: 'Soluciones a tu medida',   sub: 'Servicios diseñados para cada necesidad.' },
    { icon: Zap,         title: 'Compromiso sostenible',    sub: 'Impulsamos la movilidad eléctrica del futuro.' },
];

export function ServicesSection() {
    return (
        <section className="relative py-24 border-t border-white/5 overflow-hidden bg-[#070E0C]">

            {/* Section background image */}
            <Image
                src="/nuestros_servicios.webp"
                alt=""
                fill
                className="object-cover object-center opacity-55"
                sizes="100vw"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[#070E0C]/60 pointer-events-none" />
            {/* Top/bottom fades */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#070E0C] to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#070E0C] to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <span className="text-[#00D4AA] font-bold tracking-[0.25em] uppercase text-sm mb-4 block">
                        SOPORTE INTEGRAL
                    </span>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-none mb-5">
                        <span className="text-white">NUESTROS </span>
                        <span className="text-[#00D4AA]">SERVICIOS</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                        Acompañamos tu experiencia eléctrica mucho más allá de la compra.
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto mb-10">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.href}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="group"
                        >
                            <Link href={service.href} className="block h-full">
                                {/* Card — image fills entire background */}
                                <div className="relative rounded-2xl border border-white/10 overflow-hidden flex flex-col min-h-[420px] transition-all duration-300 hover:border-[#00D4AA]/40">

                                    {/* Full-card background image */}
                                    <Image
                                        src={service.image}
                                        alt=""
                                        fill
                                        className="object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    {/* Gradient: transparent top → dark bottom for text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/90" />

                                    {/* Content on top */}
                                    <div className="relative z-10 flex flex-col flex-1 justify-end p-7">
                                        {/* Icon */}
                                        <div className="w-14 h-14 rounded-2xl bg-[#00D4AA]/20 border border-[#00D4AA]/40 flex items-center justify-center mb-5 group-hover:bg-[#00D4AA]/30 transition-colors">
                                            <service.icon className="w-7 h-7 text-[#00D4AA]" strokeWidth={1.5} />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight mb-2">
                                            {service.badge.split('\n').map((line, i, arr) => (
                                                <React.Fragment key={i}>{line}{i < arr.length - 1 && <br />}</React.Fragment>
                                            ))}
                                        </h3>
                                        {/* Green accent line */}
                                        <div className="w-8 h-0.5 bg-[#00D4AA] mb-4" />

                                        {/* Description */}
                                        <p className="text-gray-300 text-sm leading-relaxed mb-6">
                                            {service.description}
                                        </p>

                                        {/* CTA */}
                                        <div className="flex items-center gap-2 text-[#00D4AA] text-sm font-black uppercase tracking-wider group-hover:gap-3 transition-all duration-300">
                                            {service.cta}
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Trust bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden max-w-6xl mx-auto"
                >
                    {trustItems.map(({ icon: Icon, title, sub }) => (
                        <div key={title} className="flex items-start gap-4 bg-[#070E0C]/80 hover:bg-[#0d1a16] transition-colors px-6 py-6">
                            <div className="w-10 h-10 rounded-full border border-[#00D4AA]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Icon className="w-4 h-4 text-[#00D4AA]" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm leading-tight mb-1">{title}</p>
                                <p className="text-gray-500 text-xs leading-relaxed">{sub}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}
