import Link from 'next/link';
import { ShieldCheck, ShieldX, PhoneCall, Zap, Settings, FileCheck } from 'lucide-react';

export const metadata = {
    title: 'Política de Garantías | Elemotor',
    description: 'Conoce en detalle la cobertura, períodos y condiciones de la garantía Elemotor para cada vehículo eléctrico.',
};

const EV_COMPONENTS = [
    'Batería de Tracción (Alta Tensión): contra defectos de fabricación y degradación excesiva (caída por debajo del 60% de capacidad original)',
    'Motor Eléctrico de Propulsión',
    'Inversor y Unidad de Control de Energía (MCU)',
    'Cargador de a Bordo (OBC)',
    'Sistema de Gestión Térmica de la Batería',
];

const CONDITIONS = [
    {
        title: 'Plan de Mantenimiento Preventivo Obligatorio',
        desc: 'El vehículo debe realizar todas sus revisiones periódicas programadas en talleres autorizados de Elemotor o la red aliada, conforme al kilometraje o tiempo estipulado en el manual del propietario.',
    },
    {
        title: 'Uso de Repuestos Originales',
        desc: 'Cualquier reemplazo de piezas, consumibles o intervenciones técnicas debe ejecutarse exclusivamente con componentes originales certificados por Elemotor.',
    },
    {
        title: 'Actualizaciones de Software',
        desc: 'El cliente debe permitir y programar las actualizaciones de software de gestión de la batería y del vehículo recomendadas por el fabricante y gestionadas por nuestro equipo técnico.',
    },
];

const EXCLUSIONS = [
    {
        title: 'Negligencia en el cuidado de la batería',
        desc: 'Dejar el vehículo completamente descargado (0%) por períodos prolongados, provocando daño irreversible en las celdas de litio.',
    },
    {
        title: 'Modificaciones no autorizadas',
        desc: 'Alteraciones al software de gestión del motor, modificaciones al sistema eléctrico o instalación de accesorios no homologados por Elemotor.',
    },
    {
        title: 'Siniestros y factores externos',
        desc: 'Daños causados por accidentes, colisiones, inundaciones, incendios, vandalismo o casos de fuerza mayor.',
    },
    {
        title: 'Uso indebido o sobrecarga',
        desc: 'Utilizar el vehículo para fines distintos a sus especificaciones técnicas, sobrepasar la capacidad de carga estipulada o remolques no autorizados.',
    },
    {
        title: 'Infraestructura de carga inadecuada',
        desc: 'Daños provocados por fluctuaciones severas de voltaje o el uso de cargadores que no cumplan con las normativas eléctricas y estándares de homologación del vehículo.',
    },
    {
        title: 'Desgaste natural',
        desc: 'Pastillas de freno, llantas, plumillas limpiaparabrisas, filtros de cabina y fluidos del sistema de refrigeración y frenado.',
    },
];

const STEPS = [
    {
        n: '01',
        title: 'Contacto inmediato',
        desc: 'Agenda una cita de diagnóstico prioritario en el concesionario Elemotor o centro de servicio autorizado más cercano.',
    },
    {
        n: '02',
        title: 'Presentación de documentación',
        desc: 'Presenta el historial de mantenimiento preventivo (digital o físico) que valide el cumplimiento del plan de revisiones.',
    },
    {
        n: '03',
        title: 'Evaluación técnica',
        desc: 'El personal técnico calificado realizará el diagnóstico computarizado con escáneres de la marca para determinar cobertura.',
    },
    {
        n: '04',
        title: 'Resolución sin costo',
        desc: 'Si aplica garantía, se procede a la reparación o sustitución de la pieza sin costo de mano de obra ni de repuestos para el cliente.',
    },
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
                        En Electric Motor Colombia S.A.S. asumimos un compromiso firme con la calidad de nuestros
                        productos y la total satisfacción de nuestros clientes.
                    </p>
                </div>
            </section>

            <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20 space-y-20">

                {/* 1. Cobertura — dos tarjetas principales */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-[#00D4AA]" />
                        </div>
                        <h2 className="text-2xl font-black text-white">1. Cobertura de la Garantía Limitada</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* A — Defensa a defensa */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-[#00D4AA]/30 transition-colors">
                            <p className="text-[10px] font-black tracking-[0.18em] uppercase text-[#00D4AA] mb-3">A. Vehículo Completo (Defensa a Defensa)</p>
                            <p className="text-4xl font-black text-white mb-1">3 años</p>
                            <p className="text-slate-400 text-sm mb-4">o 100.000 km (lo que ocurra primero)</p>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Cubre la reparación o sustitución, sin costo alguno para el propietario, de cualquier
                                componente original que presente defectos de fabricación o ensamblaje bajo condiciones
                                de uso normal.
                            </p>
                        </div>

                        {/* B — Sistema EV */}
                        <div className="bg-[#00D4AA]/5 border border-[#00D4AA]/20 rounded-2xl p-6 hover:border-[#00D4AA]/40 transition-colors">
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-4 h-4 text-[#00D4AA]" />
                                <p className="text-[10px] font-black tracking-[0.18em] uppercase text-[#00D4AA]">B. Sistema de Alta Tensión y Propulsión (EV)</p>
                            </div>
                            <p className="text-4xl font-black text-white mb-1">8 años</p>
                            <p className="text-slate-400 text-sm mb-4">o 200.000 km (lo que ocurra primero)</p>
                            <ul className="space-y-2">
                                {EV_COMPONENTS.map((c) => (
                                    <li key={c} className="flex items-start gap-2 text-xs text-slate-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] mt-1.5 flex-shrink-0" />
                                        {c}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 2. Condiciones */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center">
                            <FileCheck className="w-5 h-5 text-[#00D4AA]" />
                        </div>
                        <h2 className="text-2xl font-black text-white">2. Condiciones para Mantener la Validez</h2>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {CONDITIONS.map((c, i) => (
                            <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:border-[#00D4AA]/20 transition-colors">
                                <Settings className="w-5 h-5 text-[#00D4AA] mb-3" />
                                <p className="font-bold text-white text-sm mb-2">{c.title}</p>
                                <p className="text-slate-500 text-xs leading-relaxed">{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Exclusiones */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <ShieldX className="w-5 h-5 text-red-400" />
                        </div>
                        <h2 className="text-2xl font-black text-white">3. Exclusiones de la Garantía</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {EXCLUSIONS.map((item) => (
                            <div key={item.title} className="bg-red-950/10 border border-red-500/10 rounded-2xl p-5 hover:border-red-500/20 transition-colors">
                                <div className="flex items-start gap-3">
                                    <span className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-red-400 text-xs font-bold">✕</span>
                                    </span>
                                    <div>
                                        <p className="font-bold text-white text-sm mb-1">{item.title}</p>
                                        <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Procedimiento */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center">
                            <PhoneCall className="w-5 h-5 text-[#00D4AA]" />
                        </div>
                        <h2 className="text-2xl font-black text-white">4. Procedimiento para Reclamaciones</h2>
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

                {/* Nota corporativa */}
                <section className="bg-[#00D4AA]/5 border border-[#00D4AA]/15 rounded-2xl p-8">
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#00D4AA] mb-3">Nota de Respaldo Corporativo</p>
                    <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                        En Elemotor, respaldamos la operatividad de su flota o vehículo particular. Nuestra infraestructura
                        técnica y la preparación especializada de nuestro equipo humano garantizan que su transición a la
                        movilidad eléctrica cuente con el soporte de postventa más robusto y confiable del mercado.
                    </p>
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
