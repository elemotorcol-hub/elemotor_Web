'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wrench, Navigation, BatteryCharging, ArrowRight } from 'lucide-react';

const services = [
    {
        icon: Wrench,
        title: 'Talleres Certificados',
        description: 'Red de talleres especializados en vehículos eléctricos con técnicos certificados y equipos de diagnóstico de última generación.',
        href: '/talleres',
        cta: 'Ver talleres',
    },
    {
        icon: Navigation,
        title: 'Rastrear Vehículo',
        description: 'Consulta en tiempo real el estado de importación de tu vehículo. Sigue cada etapa del proceso desde el origen hasta tu ciudad.',
        href: '/rastreo',
        cta: 'Rastrear mi pedido',
    },
    {
        icon: BatteryCharging,
        title: '¿Cómo Cargo Mi Auto?',
        description: 'Guía completa de estaciones de carga públicas y domésticas, tipos de conectores AC/DC y tiempos estimados de carga.',
        href: '/como-cargo',
        cta: 'Ver guía de carga',
    },
];

export function ServicesSection() {
    return (
        <section className="py-24 bg-slate-900 border-t border-white/5 relative overflow-hidden">
            {/* Top fade from previous section */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#0A110F] to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <span className="text-[#00D4AA] font-bold tracking-widest uppercase text-sm mb-3 block">
                        Soporte Integral
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-4">
                        Nuestros Servicios
                    </h2>
                    <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
                        Acompañamos tu experiencia eléctrica mucho más allá de la compra.
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
                                <div className="relative bg-[#131f1c] border border-white/5 rounded-2xl p-7 h-full flex flex-col transition-all duration-300 hover:border-[#00D4AA]/30 hover:shadow-[0_0_30px_rgba(0,212,170,0.08)]">

                                    {/* Glow on hover */}
                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                        style={{ boxShadow: 'inset 0 0 40px rgba(0,212,170,0.04)' }} />

                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-2xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center mb-6 group-hover:bg-[#00D4AA]/20 group-hover:border-[#00D4AA]/40 transition-all duration-300">
                                        <service.icon className="w-7 h-7 text-[#00D4AA]" strokeWidth={1.5} />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-3">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-6">
                                        {service.description}
                                    </p>

                                    {/* Link row */}
                                    <div className="flex items-center gap-2 text-[#00D4AA] text-sm font-bold uppercase tracking-wider group-hover:gap-3 transition-all duration-300">
                                        {service.cta}
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
