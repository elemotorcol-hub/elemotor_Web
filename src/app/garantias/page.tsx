import Link from 'next/link';
import { ShieldCheck, ShieldX, ListChecks, ArrowRightLeft, PhoneCall } from 'lucide-react';

export const metadata = {
    title: 'Política de Garantías | Elemotor',
    description: 'Conoce en detalle la cobertura, períodos y condiciones de la garantía Elemotor para cada vehículo eléctrico.',
};

const COVERAGE = [
    { component: 'Motor eléctrico', period: '5 años', condition: 'Uso normal, sin modificaciones' },
    { component: 'Batería de tracción', period: '8 años / 160.000 km', condition: 'Lo que ocurra primero' },
    { component: 'Sistema eléctrico', period: '3 años', condition: 'Componentes originales intactos' },
    { component: 'Carrocería estructural', period: '2 años', condition: 'Sin daños por impacto' },
];

const NOT_COVERED = [
    'Desgaste normal (llantas, frenos, pastillas)',
    'Daños ocasionados por accidente o colisión',
    'Modificaciones no autorizadas por Elemotor',
    'Daños por mal uso, negligencia o fuerza mayor',
    'Daños cosméticos (rayones, abolladuras menores)',
    'Consumibles (líquidos, filtros de cabina)',
];

const STEPS = [
    { n: '01', title: 'Contáctanos', desc: 'Llama a nuestra línea de posventa o escríbenos por WhatsApp con tu número de chasis y descripción del problema.' },
    { n: '02', title: 'Diagnóstico', desc: 'Te asignamos un taller autorizado para revisión técnica sin costo inicial.' },
    { n: '03', title: 'Aprobación', desc: 'Nuestro equipo técnico evalúa el caso y determina si aplica garantía en un máximo de 5 días hábiles.' },
    { n: '04', title: 'Resolución', desc: 'Reparación o reemplazo del componente cubierto sin costo para el propietario.' },
];

export default function GarantiasPage() {
    return (
        <div className="bg-[#060B14] min-h-screen text-white">

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#060B14] via-[#0a1f18] to-[#060B14] pt-32 pb-20 border-b border-[#00D4AA]/10">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 border border-[#00D4AA]/40 text-[#00D4AA] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
                        Respaldo oficial
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
                        Política de<br />
                        <span className="text-[#00D4AA]">Garantías</span>
                    </h1>
                    <p className="text-slate-400 text-xl max-w-2xl mx-auto">
                        Tu inversión está protegida. Conoce exactamente qué cubre, por cuánto tiempo y cómo activar tu garantía.
                    </p>
                </div>
            </section>

            <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20 space-y-16">

                {/* a) ¿Qué cubre? */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-[#00D4AA]" />
                        </div>
                        <h2 className="text-2xl font-black text-white">¿Qué cubre la garantía?</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {COVERAGE.map((item) => (
                            <div key={item.component} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-[#00D4AA]/20 transition-colors">
                                <p className="font-bold text-white text-sm mb-1">{item.component}</p>
                                <p className="text-[#00D4AA] font-black text-xl mb-2">{item.period}</p>
                                <p className="text-slate-500 text-xs">{item.condition}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* b) Tabla períodos */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center">
                            <ListChecks className="w-5 h-5 text-[#00D4AA]" />
                        </div>
                        <h2 className="text-2xl font-black text-white">Períodos de garantía</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Componente</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Período</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold tracking-wider text-slate-500 uppercase">Condición</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {COVERAGE.map((row) => (
                                    <tr key={row.component} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-4 px-4 text-white font-medium">{row.component}</td>
                                        <td className="py-4 px-4 text-[#00D4AA] font-bold">{row.period}</td>
                                        <td className="py-4 px-4 text-slate-400">{row.condition}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* c) ¿Qué NO cubre? */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <ShieldX className="w-5 h-5 text-red-400" />
                        </div>
                        <h2 className="text-2xl font-black text-white">¿Qué NO cubre?</h2>
                    </div>
                    <div className="bg-red-950/20 border border-red-500/10 rounded-2xl p-6">
                        <ul className="space-y-3">
                            {NOT_COVERED.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-sm">
                                    <span className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-red-400 text-xs font-bold">✕</span>
                                    </span>
                                    <span className="text-slate-300">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* d) ¿Cómo hacer válida? */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center">
                            <PhoneCall className="w-5 h-5 text-[#00D4AA]" />
                        </div>
                        <h2 className="text-2xl font-black text-white">¿Cómo hacer válida tu garantía?</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {STEPS.map((step) => (
                            <div key={step.n} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-[#00D4AA]/20 transition-colors">
                                <p className="text-[#00D4AA] font-black text-3xl mb-3 font-mono">{step.n}</p>
                                <p className="font-bold text-white text-sm mb-2">{step.title}</p>
                                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* e) Comparativa fábrica vs Elemotor */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center">
                            <ArrowRightLeft className="w-5 h-5 text-[#00D4AA]" />
                        </div>
                        <h2 className="text-2xl font-black text-white">Garantía de fábrica vs Garantía Elemotor</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-4">
                            <p className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-4">Garantía de Fábrica</p>
                            {[
                                'Emitida directamente por el fabricante del vehículo',
                                'Cubre defectos de fabricación y ensamblaje',
                                'Requiere mantenimiento en talleres autorizados por la marca',
                                'Cobertura según términos del fabricante (varía por marca)',
                                'Transferible al nuevo propietario en algunos casos',
                            ].map((t) => (
                                <div key={t} className="flex items-start gap-2.5 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 flex-shrink-0" />
                                    <span className="text-slate-400">{t}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-[#00D4AA]/5 border border-[#00D4AA]/20 rounded-2xl p-6 space-y-4">
                            <p className="text-xs font-bold tracking-widest uppercase text-[#00D4AA] mb-4">Garantía Elemotor</p>
                            {[
                                'Emitida y respaldada directamente por Elemotor Colombia',
                                'Complementa y puede extender la garantía de fábrica',
                                'Red propia de talleres autorizados a nivel nacional',
                                'Atención prioritaria y tiempos de respuesta garantizados',
                                'Siempre transferible: protege al vehículo, no al propietario',
                            ].map((t) => (
                                <div key={t} className="flex items-start gap-2.5 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] mt-1.5 flex-shrink-0" />
                                    <span className="text-slate-300">{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA final */}
                <section className="text-center py-12 border-t border-white/5">
                    <p className="text-slate-400 mb-6 text-lg">¿Necesitas revisar tu vehículo o activar una garantía?</p>
                    <Link
                        href="/talleres"
                        className="inline-block bg-[#00D4AA] hover:bg-[#00bfa0] text-[#060B14] font-bold px-10 py-4 rounded-xl transition-colors text-sm uppercase tracking-widest"
                    >
                        Agendar revisión en taller
                    </Link>
                </section>

            </div>
        </div>
    );
}
