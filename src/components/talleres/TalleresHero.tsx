'use client';

import { motion } from 'framer-motion';
import { Wrench, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const STATS = [
    { value: '40+', label: 'Talleres Aliados' },
    { value: '25+', label: 'Estaciones de Carga' },
    { value: '100%', label: 'Cobertura Nacional' },
];

const anim = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: 'easeOut' as const, delay },
});

export function TalleresHero() {
    return (
        <section className="relative bg-[#0a1612] overflow-hidden pt-24 pb-16">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00D4AA]/5 via-transparent to-transparent pointer-events-none" />

            {/* Decorative background Wrench icon */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none select-none">
                <Wrench className="w-[320px] h-[320px] text-[#00D4AA]" strokeWidth={1} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <motion.nav
                    className="flex items-center gap-1.5 text-xs text-slate-500 mb-6"
                    {...anim(0)}
                >
                    <Link href="/" className="hover:text-[#00D4AA] transition-colors">
                        Inicio
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-400">Talleres</span>
                </motion.nav>

                {/* Badge */}
                <motion.div {...anim(0.1)} className="mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/25 text-[#00D4AA] text-xs font-bold uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
                        Red Certificada
                    </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                    {...anim(0.2)}
                    className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-3"
                >
                    Talleres &amp;{' '}
                    <span className="text-[#00D4AA]">Servicio Técnico</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    {...anim(0.3)}
                    className="text-slate-400 text-base sm:text-lg max-w-2xl mb-10"
                >
                    Red de talleres especializados en vehículos eléctricos con técnicos certificados
                </motion.p>

                {/* Stats row */}
                <motion.div
                    {...anim(0.4)}
                    className="flex flex-col sm:flex-row gap-6 sm:gap-10"
                >
                    {STATS.map(({ value, label }) => (
                        <div key={label} className="flex flex-col gap-0.5">
                            <span className="text-3xl sm:text-4xl font-black text-[#00D4AA] tracking-tight leading-none">
                                {value}
                            </span>
                            <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                                {label}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
