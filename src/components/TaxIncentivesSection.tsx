'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
    TrendingDown,
    ShoppingCart,
    BarChart3,
    Car,
    Shield,
    Wrench,
    ChevronRight,
    Landmark,
} from 'lucide-react';

// ─── Datos ────────────────────────────────────────────────────────────────────

const INCENTIVES = [
    {
        icon: TrendingDown,
        tag: 'Impuesto de Renta',
        highlight: '50%',
        highlightLabel: 'de deducción',
        title: 'Deducción de Renta',
        description:
            'Deduce hasta el 50% del valor total de tu inversión en los 15 años siguientes al periodo gravable en que entró en operación el proyecto. Aplica para personas naturales y jurídicas con certificado UPME aprobado por la DIAN.',
        color: '#00D4AA',
        bg: 'from-[#00D4AA]/10 to-transparent',
    },
    {
        icon: ShoppingCart,
        tag: 'IVA',
        highlight: '0%',
        highlightLabel: 'de IVA',
        title: 'Exclusión de IVA',
        description:
            'Los equipos, maquinaria y servicios nacionales o importados destinados a proyectos de energías no convencionales están excluidos del IVA, tanto en preinversión como en inversión.',
        color: '#3B82F6',
        bg: 'from-[#3B82F6]/10 to-transparent',
    },
    {
        icon: BarChart3,
        tag: 'Personas Jurídicas',
        highlight: 'Rápida',
        highlightLabel: 'depreciación',
        title: 'Depreciación Acelerada',
        description:
            'Las empresas pueden depreciar el activo más rápido contablemente, recuperando la inversión en menor tiempo y mejorando el flujo de caja de forma significativa.',
        color: '#A855F7',
        bg: 'from-[#A855F7]/10 to-transparent',
    },
    {
        icon: Car,
        tag: 'Impuesto Vehicular',
        highlight: 'Máx 1%',
        highlightLabel: 'del valor comercial',
        title: 'Rodamiento Mínimo',
        description:
            'El impuesto vehicular anual para eléctricos está limitado por ley al 1% del valor comercial. En Bogotá hay descuentos adicionales de hasta el 60% durante los primeros años tras la matrícula.',
        color: '#F59E0B',
        bg: 'from-[#F59E0B]/10 to-transparent',
    },
    {
        icon: Shield,
        tag: 'SOAT',
        highlight: '10%',
        highlightLabel: 'de descuento',
        title: 'Descuento en SOAT',
        description:
            'Obtienes un 10% de descuento automático en la prima del Seguro Obligatorio de Accidentes de Tránsito (SOAT), beneficio directo que protege tu economía en trámites obligatorios.',
        color: '#10B981',
        bg: 'from-[#10B981]/10 to-transparent',
    },
    {
        icon: Wrench,
        tag: 'Tecnomecánica',
        highlight: '30%',
        highlightLabel: 'de descuento',
        title: 'Revisión Técnico‑Mecánica',
        description:
            'Disfruta de un 30% de descuento en la revisión técnico‑mecánica. La ley reconoce que tu vehículo eléctrico no emite gases contaminantes, simplificando y abaratando este trámite.',
        color: '#EF4444',
        bg: 'from-[#EF4444]/10 to-transparent',
    },
];

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function IncentiveCard({ item, index }: { item: typeof INCENTIVES[0]; index: number }) {
    const Icon = item.icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: index * 0.07 }}
            className="group relative rounded-2xl border border-white/5 hover:border-white/15 bg-[#0a110f] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col"
        >
            {/* Gradient top accent */}
            <div
                className={`absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                style={{ background: item.color }}
            />

            {/* Background glow */}
            <div
                className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                style={{ background: item.color + '20' }}
            />

            <div className="relative z-10 p-6 flex flex-col gap-4 flex-1">
                {/* Top row: icon + tag */}
                <div className="flex items-start justify-between gap-3">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border"
                        style={{
                            background: item.color + '15',
                            borderColor: item.color + '30',
                        }}
                    >
                        <Icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <span
                        className="text-[9px] font-black tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border flex-shrink-0"
                        style={{
                            color: item.color,
                            borderColor: item.color + '40',
                            background: item.color + '10',
                        }}
                    >
                        {item.tag}
                    </span>
                </div>

                {/* Highlight number */}
                <div>
                    <div className="flex items-end gap-2 leading-none mb-1">
                        <span
                            className="text-4xl font-black tracking-tight"
                            style={{ color: item.color }}
                        >
                            {item.highlight}
                        </span>
                        <span className="text-slate-400 text-sm font-semibold pb-1">
                            {item.highlightLabel}
                        </span>
                    </div>
                    <h3 className="text-white font-black text-lg tracking-tight">{item.title}</h3>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed flex-1">{item.description}</p>
            </div>
        </motion.div>
    );
}

// ─── Sección principal ────────────────────────────────────────────────────────

export function TaxIncentivesSection() {
    return (
        <section className="py-24 relative overflow-hidden border-t border-white/5"
            style={{ background: 'linear-gradient(180deg, #060D0B 0%, #050a08 60%, #060D0B 100%)' }}
        >
            {/* Grid decorativo de fondo */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0,212,170,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Glow central */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] blur-[120px] pointer-events-none opacity-[0.06]"
                style={{ background: 'radial-gradient(ellipse, #00D4AA 0%, transparent 70%)' }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid lg:grid-cols-[1fr_auto] gap-10 items-end mb-16"
                >
                    <div>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 mb-6">
                            <div className="flex items-center gap-2 border border-[#00D4AA]/40 text-[#00D4AA] text-[10px] font-black tracking-[0.25em] uppercase px-4 py-1.5 rounded-full">
                                <Landmark className="w-3 h-3" />
                                Ley 1715 de 2014
                            </div>
                            <div className="flex items-center gap-1.5 bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] text-[9px] font-black tracking-wider uppercase px-3 py-1.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
                                Vigente
                            </div>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-none mb-5">
                            EL ESTADO TE AYUDA{' '}
                            <br className="hidden md:block" />
                            <span className="text-[#00D4AA]">A HACER EL CAMBIO</span>
                        </h2>

                        <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
                            Colombia tiene uno de los marcos de incentivos más completos de Latinoamérica para vehículos eléctricos.
                            La Ley 1715 te permite ahorrar significativamente en impuestos, IVA, rodamiento, SOAT y revisión técnica.
                        </p>
                    </div>

                    {/* CTA lateral */}
                    <div className="hidden lg:flex flex-col gap-4 items-end">
                        <div className="text-right">
                            <p className="text-white/40 text-[10px] tracking-wider uppercase mb-1">Ahorro estimado</p>
                            <p className="text-[#00D4AA] text-4xl font-black leading-none">+$30M</p>
                            <p className="text-slate-500 text-xs mt-1">en beneficios tributarios</p>
                        </div>
                        <a
                            href="https://wa.me/573117762260?text=Hola%2C%20quiero%20conocer%20los%20incentivos%20tributarios%20de%20la%20Ley%201715%20para%20veh%C3%ADculos%20el%C3%A9ctricos"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#00D4AA] hover:bg-[#00B38F] text-slate-900 font-black text-xs px-5 py-3 rounded-xl transition-all duration-300 uppercase tracking-wider shadow-[0_0_20px_rgba(0,212,170,0.25)] hover:shadow-[0_0_30px_rgba(0,212,170,0.4)]"
                        >
                            Contactar un asesor
                            <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </motion.div>

                {/* Grid de incentivos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {INCENTIVES.map((item, i) => (
                        <IncentiveCard key={item.title} item={item} index={i} />
                    ))}
                </div>

                {/* Banner inferior */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="relative rounded-2xl overflow-hidden border border-[#00D4AA]/20 p-8 md:p-10"
                    style={{ background: 'linear-gradient(135deg, #0d1f1a 0%, #071510 100%)' }}
                >
                    {/* Corner glow */}
                    <div
                        className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
                        style={{ background: '#00D4AA' }}
                    />
                    <div
                        className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
                        style={{ background: '#00D4AA' }}
                    />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#00D4AA]/15 border border-[#00D4AA]/30 flex items-center justify-center flex-shrink-0">
                                <Landmark className="w-6 h-6 text-[#00D4AA]" />
                            </div>
                            <div>
                                <p className="text-white font-black text-lg leading-tight mb-1">
                                    ¿Eres empresa o persona natural?
                                </p>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                                    Nuestro equipo te acompaña en el proceso de solicitud de los certificados UPME
                                    y te ayuda a maximizar todos los beneficios de la Ley 1715. Sin costos adicionales.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 flex-shrink-0">
                            <a
                                href="/contacto"
                                className="inline-flex items-center gap-2 bg-[#00D4AA] hover:bg-[#00B38F] text-slate-900 font-black text-sm px-6 py-3.5 rounded-xl transition-all duration-300 uppercase tracking-wider shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:shadow-[0_0_30px_rgba(0,212,170,0.5)] whitespace-nowrap"
                            >
                                Hablar con un asesor
                                <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
