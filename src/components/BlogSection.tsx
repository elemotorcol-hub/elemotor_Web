'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';

const posts = [
    {
        category: 'Tendencias',
        categoryColor: 'bg-[#00D4AA]/10 text-[#00D4AA] border-[#00D4AA]/20',
        gradient: 'from-slate-700 via-slate-800 to-[#0d1829]',
        title: 'El Futuro de la Movilidad Eléctrica en Colombia',
        excerpt: 'Colombia acelera su transición energética. Analizamos el crecimiento del mercado EV, incentivos tributarios y las marcas que lideran la transformación.',
        readTime: '5 min',
        date: 'Mayo 2025',
    },
    {
        category: 'Guías',
        categoryColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        gradient: 'from-[#1a1040] via-slate-800 to-slate-700',
        title: 'Guía Completa: Tipos de Carga para Vehículos Eléctricos',
        excerpt: 'Nivel 1, Nivel 2, DC Fast Charge: qué significan, qué conector necesitas y dónde encontrar estaciones en las principales ciudades colombianas.',
        readTime: '7 min',
        date: 'Abril 2025',
    },
    {
        category: 'Tips',
        categoryColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        gradient: 'from-[#1a1008] via-slate-800 to-slate-700',
        title: '¿Por Qué Elegir un Eléctrico? Beneficios Reales',
        excerpt: 'Más allá del ahorro en combustible: menor mantenimiento, cero emisiones, experiencia de conducción superior y valorización patrimonial a largo plazo.',
        readTime: '4 min',
        date: 'Marzo 2025',
    },
];

export function BlogSection() {
    return (
        <section className="py-24 bg-slate-900 border-t border-white/5 relative overflow-hidden">
            {/* Subtle glow bottom-right */}
            <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-[0.06]"
                style={{ background: 'radial-gradient(ellipse at center, #00D4AA 0%, transparent 70%)' }} />

            <div className="container mx-auto px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-6"
                >
                    <div>
                        <span className="text-[#00D4AA] font-bold tracking-widest uppercase text-sm mb-3 block">
                            Blog y Recursos
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
                            Últimas Noticias
                        </h2>
                    </div>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 border border-white/10 hover:border-[#00D4AA]/40 text-white hover:text-[#00D4AA] text-sm font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all duration-300 flex-shrink-0"
                    >
                        Ver Todos los Artículos
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.map((post, index) => (
                        <motion.article
                            key={post.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="group"
                        >
                            <div className="bg-[#131f1c] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full hover:border-white/10 transition-colors duration-300">

                                {/* Image placeholder */}
                                <div className={`relative aspect-[16/9] bg-gradient-to-br ${post.gradient} overflow-hidden`}>
                                    {/* Decorative lines */}
                                    <div className="absolute inset-0 opacity-20"
                                        style={{ backgroundImage: 'linear-gradient(45deg, rgba(0,212,170,0.1) 1px, transparent 1px), linear-gradient(-45deg, rgba(0,212,170,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                                    {/* Glow center */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 rounded-full blur-2xl opacity-30"
                                            style={{ background: '#00D4AA' }} />
                                    </div>
                                    {/* Category badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className={`inline-block border text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm ${post.categoryColor}`}>
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-white font-black text-lg leading-tight mb-3 group-hover:text-[#00D4AA] transition-colors duration-300">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-5">
                                        {post.excerpt}
                                    </p>

                                    {/* Footer row */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{post.readTime} lectura</span>
                                            <span className="mx-1 text-white/10">·</span>
                                            <span>{post.date}</span>
                                        </div>
                                        <Link
                                            href="/blog"
                                            className="text-[#00D4AA] text-xs font-bold uppercase tracking-wider hover:gap-2 flex items-center gap-1 transition-all duration-300"
                                        >
                                            Leer más
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Mobile CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex justify-center mt-10 md:hidden"
                >
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 border border-white/10 hover:border-[#00D4AA]/40 text-white hover:text-[#00D4AA] text-sm font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all duration-300"
                    >
                        Ver Todos los Artículos
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}
