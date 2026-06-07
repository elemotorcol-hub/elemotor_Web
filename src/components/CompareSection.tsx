'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Gauge, BadgeDollarSign, Leaf, Zap, ShieldCheck, PiggyBank, Handshake, Scale } from 'lucide-react';

const features = [
    {
        icon: SlidersHorizontal,
        title: 'Especificaciones\nlado a lado',
        description: 'Potencia, autonomía, batería y más en una sola vista.',
    },
    {
        icon: Gauge,
        title: 'Autonomía\ny carga',
        description: 'Compara rangos CLTC/WLTP y velocidades de carga.',
    },
    {
        icon: BadgeDollarSign,
        title: 'Precio y\nfinanciamiento',
        description: 'Evalúa el costo total y opciones de pago disponibles.',
    },
];

const bottomIcons = [
    { icon: Leaf,        label: 'Cero emisiones',      sub: 'Cuidamos el planeta' },
    { icon: Zap,         label: 'Tecnología avanzada', sub: 'Innovación en cada detalle' },
    { icon: ShieldCheck, label: 'Seguridad',            sub: 'Estándares internacionales' },
    { icon: PiggyBank,   label: 'Ahorro inteligente',  sub: 'Menor costo, mayor rendimiento' },
    { icon: Handshake,   label: 'Respaldo total',       sub: 'Acompañamiento garantizado' },
];

const compareRows = [
    { label: 'Autonomía',  icon: '🔋', a: '520 km',  b: '480 km' },
    { label: '0–100 KM/H', icon: '⏱',  a: '4.8 s',   b: '6.2 s' },
    { label: 'Batería',    icon: '⚡',  a: '82 kWh',  b: '71 kWh' },
    { label: 'Potencia',   icon: '💪',  a: '350 hp',  b: '268 hp' },
];

export function CompareSection() {
    return (
        <section className="relative overflow-hidden border-t border-white/5">
            {/* Background image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/Compara_elige.webp')" }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" />

            <div className="relative z-10 px-6 md:px-12 lg:px-16 py-20 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-start">

                    {/* ── LEFT COLUMN ── */}
                    <div className="flex flex-col gap-8">

                        {/* Badge */}
                        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                            <span className="inline-flex items-center gap-2 border border-[#00D4AA]/50 text-[#00D4AA] text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
                                NUEVO
                            </span>
                        </motion.div>

                        {/* Heading */}
                        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight uppercase">
                                <span className="text-white">COMPARA Y ELIGE</span><br />
                                <span className="text-[#00D4AA]">TU ELÉCTRICO IDEAL</span>
                            </h2>
                            <p className="text-gray-400 text-base mt-5 max-w-md leading-relaxed">
                                Compara cada modelo frente a frente y toma la mejor decisión con información clara y completa.
                            </p>
                        </motion.div>

                        {/* Comparison card */}
                        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-md"
                        >
                            {/* Header */}
                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-5 pb-4 border-b border-white/10">
                                <div className="text-center">
                                    <p className="text-[9px] font-bold tracking-[0.2em] text-gray-500 mb-2">MODELO A</p>
                                    <div className="w-16 h-8 mx-auto bg-white/10 rounded-md flex items-center justify-center">
                                        <span className="text-[8px] text-gray-400">🚗</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-black text-xs">VS</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] font-bold tracking-[0.2em] text-gray-500 mb-2">MODELO B</p>
                                    <div className="w-16 h-8 mx-auto bg-[#00D4AA]/10 rounded-md flex items-center justify-center">
                                        <span className="text-[8px] text-gray-400">🚙</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rows */}
                            <div className="flex flex-col gap-3">
                                {compareRows.map((row) => (
                                    <div key={row.label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                                        <span className="text-right text-white font-bold text-sm">{row.a}</span>
                                        <div className="flex flex-col items-center gap-0.5 min-w-[90px]">
                                            <span className="text-[8px] text-gray-500 uppercase tracking-widest">{row.label}</span>
                                        </div>
                                        <span className="text-left text-[#00D4AA] font-bold text-sm">{row.b}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-center gap-6 mt-5 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                    <span className="w-2.5 h-2.5 rounded-full bg-white/40" />MODELO A
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#00D4AA]" />MODELO B
                                </div>
                            </div>
                        </motion.div>

                        {/* CTA */}
                        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }}>
                            <Link href="/comparar"
                                className="inline-flex items-center gap-3 bg-[#00D4AA] hover:bg-[#00B38F] text-slate-900 font-black text-sm px-10 py-4 rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(0,212,170,0.3)] hover:shadow-[0_0_40px_rgba(0,212,170,0.5)] hover:-translate-y-0.5 uppercase tracking-wider"
                            >
                                <Scale className="w-5 h-5" />
                                Comparar Modelos Ahora
                            </Link>
                        </motion.div>

                        {/* Bottom icons */}
                        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.45 }}
                            className="flex flex-wrap gap-x-6 gap-y-4 pt-2"
                        >
                            {bottomIcons.map(({ icon: Icon, label, sub }) => (
                                <div key={label} className="flex items-center gap-2">
                                    <Icon className="w-4 h-4 text-[#00D4AA] flex-shrink-0" />
                                    <div>
                                        <p className="text-white text-[10px] font-bold uppercase tracking-wide leading-none">{label}</p>
                                        <p className="text-gray-500 text-[9px] mt-0.5">{sub}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ── RIGHT COLUMN — feature cards ── */}
                    <div className="flex flex-col gap-3 lg:w-72 xl:w-80">
                        {features.map((feat, index) => (
                            <motion.div
                                key={feat.title}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                                className="flex items-start gap-4 bg-black/60 backdrop-blur-md border border-[#00D4AA]/20 rounded-xl p-5 hover:border-[#00D4AA]/50 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/30 flex items-center justify-center flex-shrink-0">
                                    <feat.icon className="w-5 h-5 text-[#00D4AA]" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-sm uppercase tracking-tight leading-tight mb-1">
                                        {feat.title.split('\n').map((line, i) => (
                                            <React.Fragment key={i}>{line}{i < feat.title.split('\n').length - 1 && <br />}</React.Fragment>
                                        ))}
                                    </h3>
                                    <p className="text-gray-400 text-xs leading-relaxed">{feat.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
