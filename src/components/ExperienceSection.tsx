'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rotate3d, Calculator, ArrowRight } from 'lucide-react';

const cards = [
    {
        href: '/showroom',
        icon: Rotate3d,
        badge: '3D INTERACTIVO',
        title: 'Showroom Virtual 3D',
        description: 'Explora cada detalle del vehículo desde tu dispositivo. Rota, acerca y descubre el interior y exterior a tu ritmo.',
        cta: 'Abrir Showroom',
        gradient: 'from-slate-800 to-[#0d1a2e]',
        glowColor: 'rgba(0,212,170,0.12)',
        accentBorder: 'border-[#00D4AA]/20',
        ctaClass: 'bg-white/10 hover:bg-[#00D4AA] hover:text-slate-900 text-white',
    },
    {
        href: '/calculadora',
        icon: Calculator,
        badge: 'HERRAMIENTA GRATUITA',
        title: 'Calculadora de Ahorro',
        description: 'Descubre cuánto ahorras al cambiar a eléctrico. Compara costos de combustible vs carga eléctrica en tu ciudad.',
        cta: 'Calcular mi Ahorro',
        gradient: 'from-[#0d2a24] to-[#061a14]',
        glowColor: 'rgba(0,212,170,0.18)',
        accentBorder: 'border-[#00D4AA]/30',
        ctaClass: 'bg-[#00D4AA] hover:bg-[#00B38F] text-slate-900',
    },
];

export function ExperienceSection() {
    return (
        <section className="py-24 bg-slate-900 border-t border-white/5 relative overflow-hidden">
            {/* Subtle dot pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(0,212,170,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

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
                        Experiencia Digital
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
                        Vive la Experiencia{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4AA] to-[#00bfa0]">
                            Elemotor
                        </span>
                    </h2>
                </motion.div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.href}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="group"
                        >
                            <div className={`relative bg-gradient-to-br ${card.gradient} border ${card.accentBorder} rounded-3xl p-8 md:p-10 h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl`}
                                style={{ boxShadow: `0 0 0 0 ${card.glowColor}` }}
                            >
                                {/* Glow blob */}
                                <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ background: `radial-gradient(ellipse at center, ${card.glowColor.replace('0.12', '0.4').replace('0.18', '0.5')} 0%, transparent 70%)` }} />

                                {/* Badge */}
                                <span className="inline-flex self-start items-center gap-2 bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full mb-6">
                                    {card.badge}
                                </span>

                                {/* Icon */}
                                <div className="w-16 h-16 rounded-2xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center mb-6 group-hover:bg-[#00D4AA]/20 transition-colors duration-300">
                                    <card.icon className="w-8 h-8 text-[#00D4AA]" strokeWidth={1.5} />
                                </div>

                                {/* Text */}
                                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3 leading-tight">
                                    {card.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed flex-1 mb-8">
                                    {card.description}
                                </p>

                                {/* CTA */}
                                <Link
                                    href={card.href}
                                    className={`inline-flex items-center gap-2 self-start font-black text-sm px-6 py-3 rounded-xl transition-all duration-300 uppercase tracking-wider ${card.ctaClass}`}
                                >
                                    {card.cta}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
