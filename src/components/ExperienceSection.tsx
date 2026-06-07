'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rotate3d, Calculator, ArrowRight, ShieldCheck, Clock, Leaf, Headphones } from 'lucide-react';

const cards = [
    {
        href: '/showroom',
        icon: Rotate3d,
        badge: '3D INTERACTIVO',
        badgeExtra: '360°',
        title: 'SHOWROOM\nVIRTUAL 3D',
        description: 'Explora cada detalle del vehículo desde tu dispositivo. Rota, acerca y descubre el interior y exterior a tu ritmo.',
        cta: 'ABRIR SHOWROOM',
        bg: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 60%, #091812 100%)',
        glowColor: '#00D4AA',
    },
    {
        href: '/calculadora',
        icon: Calculator,
        badge: 'HERRAMIENTA GRATUITA',
        badgeExtra: null,
        title: 'CALCULADORA\nDE AHORRO',
        description: 'Descubre cuánto ahorras al cambiar a eléctrico. Compara costos de combustible vs carga eléctrica en tu ciudad.',
        cta: 'CALCULAR MI AHORRO',
        bg: 'linear-gradient(135deg, #061812 0%, #0a2518 60%, #061812 100%)',
        glowColor: '#00D4AA',
    },
];

const trustItems = [
    { icon: ShieldCheck, title: 'Información confiable',   sub: 'Datos claros y verificados para tu tranquilidad.' },
    { icon: Clock,       title: 'Decisiones inteligentes', sub: 'Compara y elige con información real.' },
    { icon: Leaf,        title: 'Movilidad sostenible',    sub: 'Ahorra y contribuye con el planeta.' },
    { icon: Headphones,  title: 'Acompañamiento experto',  sub: 'Nuestro equipo está listo para asesorarte.' },
];

export function ExperienceSection() {
    return (
        <section className="py-20 bg-[#060D0B] border-t border-white/5 relative overflow-hidden">
            {/* Dot grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(0,212,170,1) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
            {/* Top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] blur-3xl pointer-events-none opacity-10"
                style={{ background: 'radial-gradient(ellipse, #00D4AA 0%, transparent 70%)' }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <span className="inline-flex items-center gap-2 border border-[#00D4AA]/40 text-[#00D4AA] text-[10px] font-black tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-6">
                        EXPERIENCIA DIGITAL
                    </span>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-none">
                        VIVE LA EXPERIENCIA{' '}
                        <span className="text-[#00D4AA]">ELEMOTOR</span>
                    </h2>
                    <p className="text-gray-400 text-lg mt-5 max-w-xl mx-auto leading-relaxed">
                        Herramientas digitales que te ayudan a explorar, comparar y tomar la mejor decisión para tu movilidad eléctrica.
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.href}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="group"
                        >
                            <div className="relative rounded-2xl border border-white/10 overflow-hidden h-full flex flex-col p-8 md:p-10 transition-all duration-300 hover:border-[#00D4AA]/40"
                                style={{ background: card.bg }}
                            >
                                {/* Corner glow */}
                                <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                                    style={{ background: card.glowColor }} />

                                {/* Top row: badge + 360 */}
                                <div className="flex items-center justify-between mb-8">
                                    <span className="inline-flex items-center gap-1.5 border border-[#00D4AA]/40 text-[#00D4AA] text-[9px] font-black tracking-[0.18em] uppercase px-3 py-1.5 rounded-full">
                                        {card.badge}
                                    </span>
                                    {card.badgeExtra && (
                                        <span className="text-white/30 text-sm font-bold tracking-widest">{card.badgeExtra}</span>
                                    )}
                                </div>

                                {/* Icon */}
                                <div className="w-14 h-14 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/25 flex items-center justify-center mb-6 group-hover:bg-[#00D4AA]/20 transition-colors">
                                    <card.icon className="w-7 h-7 text-[#00D4AA]" strokeWidth={1.5} />
                                </div>

                                {/* Title */}
                                <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none mb-4">
                                    {card.title.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>{line}{i < card.title.split('\n').length - 1 && <br />}</React.Fragment>
                                    ))}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-400 leading-relaxed flex-1 mb-8 text-sm md:text-base">
                                    {card.description}
                                </p>

                                {/* CTA */}
                                <Link href={card.href}
                                    className="inline-flex items-center gap-3 self-start bg-[#00D4AA] hover:bg-[#00B38F] text-slate-900 font-black text-sm px-7 py-3.5 rounded-xl transition-all duration-300 uppercase tracking-wider shadow-[0_0_20px_rgba(0,212,170,0.2)] hover:shadow-[0_0_30px_rgba(0,212,170,0.4)]"
                                >
                                    {card.cta}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust bar */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden"
                >
                    {trustItems.map(({ icon: Icon, title, sub }, i) => (
                        <div key={title} className="flex items-start gap-4 bg-[#060D0B] hover:bg-[#0a1510] transition-colors px-6 py-6">
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
