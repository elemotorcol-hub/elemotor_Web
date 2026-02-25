'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, HeadphonesIcon } from 'lucide-react';

const propositions = [
    {
        title: 'IMPORTACIÓN DIRECTA',
        description: 'Gestión integral desde el origen hasta la puerta de tu casa, sin intermediarios innecesarios.',
        icon: Truck,
    },
    {
        title: 'GARANTÍA TOTAL',
        description: 'Respaldo técnico especializado y cobertura completa en todos nuestros vehículos importados.',
        icon: ShieldCheck,
    },
    {
        title: 'ASESORÍA CONCIERGE',
        description: 'Consultoría personalizada para elegir el vehículo que mejor se adapte a tu estilo de vida.',
        icon: HeadphonesIcon,
    },
];

export function ValueProps() {
    return (
        <section id="beneficios" className="py-24 bg-slate-900 border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {propositions.map((prop, index) => (
                        <motion.div
                            key={prop.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-white/5 relative group">
                                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <prop.icon className="w-10 h-10 text-cyan-400 relative z-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 tracking-tight uppercase">
                                {prop.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed max-w-xs">
                                {prop.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
