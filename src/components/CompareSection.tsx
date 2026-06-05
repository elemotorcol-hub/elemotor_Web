'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Gauge, BatteryCharging, BadgeDollarSign } from 'lucide-react';

const features = [
    {
        icon: SlidersHorizontal,
        title: 'Especificaciones lado a lado',
        description: 'Potencia, autonomía, batería y más en una sola vista.',
    },
    {
        icon: Gauge,
        title: 'Autonomía y carga',
        description: 'Compara rangos CLTC/WLTP y velocidades de carga.',
    },
    {
        icon: BadgeDollarSign,
        title: 'Precio y financiamiento',
        description: 'Evalúa el costo total y opciones de pago disponibles.',
    },
];

export function CompareSection() {
    return (
        <section className="py-24 bg-[#0A110F] border-t border-white/5 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-3xl pointer-events-none opacity-10"
                style={{ background: 'radial-gradient(ellipse at center, #00D4AA 0%, transparent 70%)' }} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto">

                    {/* Top badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center mb-6"
                    >
                        <span className="inline-flex items-center gap-2 bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-[#00D4AA] text-xs font-black tracking-widest uppercase px-4 py-2 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
                            NUEVO
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-center mb-14"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight uppercase mb-4">
                            Compara y Elige<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4AA] to-[#00bfa0]">
                                Tu Eléctrico Ideal
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
                            Analiza cada modelo frente a frente y toma la mejor decisión con información clara y completa.
                        </p>
                    </motion.div>

                    {/* Visual icon + features */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                        {/* Left: decorative comparison visual */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="flex items-center justify-center"
                        >
                            <div className="relative w-full max-w-sm">
                                <div className="absolute inset-0 bg-[#00D4AA]/5 rounded-3xl blur-xl" />
                                <div className="relative bg-slate-800 border border-white/10 rounded-3xl p-8 flex flex-col gap-5">
                                    {/* Mock comparison row */}
                                    {[
                                        { label: 'Autonomía', a: '520 km', b: '480 km' },
                                        { label: '0–100 km/h', a: '4.8 s', b: '6.2 s' },
                                        { label: 'Batería', a: '82 kWh', b: '71 kWh' },
                                        { label: 'Potencia', a: '350 hp', b: '268 hp' },
                                    ].map((row, i) => (
                                        <div key={row.label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                                            <span className="text-right text-white font-bold text-sm">{row.a}</span>
                                            <span className="text-center text-[10px] text-gray-500 uppercase tracking-widest bg-slate-700 rounded-md px-2 py-1 min-w-[70px]">{row.label}</span>
                                            <span className="text-left text-[#00D4AA] font-bold text-sm">{row.b}</span>
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-center pt-2">
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                                            <span className="w-3 h-3 rounded-full bg-white/30 inline-block" />
                                            Modelo A
                                            <span className="mx-2 text-white/10">|</span>
                                            <span className="w-3 h-3 rounded-full bg-[#00D4AA] inline-block" />
                                            Modelo B
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: features + CTA */}
                        <div className="flex flex-col gap-6">
                            {features.map((feat, index) => (
                                <motion.div
                                    key={feat.title}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                                    className="flex items-start gap-4 bg-slate-800/50 border border-white/5 rounded-2xl p-5 hover:border-[#00D4AA]/20 transition-colors"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center flex-shrink-0">
                                        <feat.icon className="w-5 h-5 text-[#00D4AA]" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm uppercase tracking-tight mb-1">{feat.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{feat.description}</p>
                                    </div>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                            >
                                <Link
                                    href="/comparar"
                                    className="inline-block bg-[#00D4AA] hover:bg-[#00B38F] text-slate-900 font-black text-sm px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,212,170,0.25)] hover:shadow-[0_0_30px_rgba(0,212,170,0.45)] hover:-translate-y-0.5 uppercase tracking-wider"
                                >
                                    Comparar Modelos Ahora
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
