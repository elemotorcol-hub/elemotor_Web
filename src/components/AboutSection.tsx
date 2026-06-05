'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BadgeCheck, Globe, ShieldCheck, Sparkles, Award, HeartHandshake } from 'lucide-react';

const stats = [
    { value: '500+', label: 'Vehículos Importados' },
    { value: '5+', label: 'Años de Experiencia' },
    { value: '2', label: 'Países' },
    { value: '100%', label: 'Garantizados' },
];

const values = [
    { icon: Award, title: 'Calidad Premium', description: 'Vehículos certificados directamente desde fabricantes líderes en China.' },
    { icon: ShieldCheck, title: 'Confianza Total', description: 'Garantía directa y documentación completa en cada unidad importada.' },
    { icon: Sparkles, title: 'Innovación', description: 'Tecnología de punta en movilidad eléctrica accesible para Colombia.' },
    { icon: HeartHandshake, title: 'Servicio Cercano', description: 'Asesoría personalizada antes, durante y después de tu compra.' },
];

export function AboutSection() {
    return (
        <section className="py-24 bg-[#0A110F] border-t border-white/5 relative overflow-hidden">
            {/* Radial glow */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-[0.07]"
                style={{ background: 'radial-gradient(ellipse at center, #00D4AA 0%, transparent 70%)' }} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center max-w-6xl mx-auto">

                    {/* Left column — text */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-flex items-center gap-2 border border-[#00D4AA]/40 text-[#00D4AA] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                            <Globe className="w-3.5 h-3.5" />
                            Colombia &amp; Ecuador
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight uppercase mb-5">
                            Pioneros en<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4AA] to-[#00bfa0]">
                                Movilidad Eléctrica
                            </span><br />
                            en Colombia
                        </h2>

                        <p className="text-gray-400 leading-relaxed text-base mb-8 max-w-lg">
                            Somos una importadora directa de vehículos eléctricos premium desde China, con presencia en
                            Bucaramanga y Quito, Ecuador. Ofrecemos una selección cuidada de modelos con garantía real,
                            soporte técnico especializado y el mejor servicio posventa del mercado latinoamericano.
                        </p>

                        {/* Stats row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-10">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                    className="flex flex-col"
                                >
                                    <span className="text-3xl font-black text-[#00D4AA] leading-none mb-1">
                                        {stat.value}
                                    </span>
                                    <span className="text-xs text-gray-500 uppercase tracking-widest leading-tight">
                                        {stat.label}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        <Link
                            href="/nosotros"
                            className="inline-flex items-center gap-2 bg-[#00D4AA] hover:bg-[#00B38F] text-slate-900 font-black text-sm px-8 py-4 rounded-xl transition-all duration-300 uppercase tracking-wider shadow-[0_0_20px_rgba(0,212,170,0.2)] hover:shadow-[0_0_30px_rgba(0,212,170,0.4)] hover:-translate-y-0.5"
                        >
                            <BadgeCheck className="w-4 h-4" />
                            Conocer Más
                        </Link>
                    </motion.div>

                    {/* Right column — values grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="grid grid-cols-2 gap-5"
                    >
                        {values.map((val, index) => (
                            <motion.div
                                key={val.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                className="bg-slate-800/60 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:border-[#00D4AA]/20 transition-colors duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center flex-shrink-0">
                                    <val.icon className="w-6 h-6 text-[#00D4AA]" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-sm uppercase tracking-tight mb-2">
                                        {val.title}
                                    </h3>
                                    <p className="text-gray-500 text-xs leading-relaxed">
                                        {val.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
