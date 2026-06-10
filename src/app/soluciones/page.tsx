import * as React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
    title: 'Soluciones Empresariales y Corporativas',
    description:
        'Flotas eléctricas, vehículos de carga, taxis verdes, buses especializados y transporte para el sector energético. Soluciones empresariales 100% eléctricas en Colombia.',
    path: '/soluciones',
    keywords: [
        'flotas eléctricas Colombia',
        'vehículos empresariales eléctricos',
        'taxi eléctrico Colombia',
        'bus eléctrico',
        'camión eléctrico logística',
    ],
});

const SUBSEGMENTS = [
    {
        icon: '🚛',
        title: 'Flotas Empresariales',
        description:
            'Optimiza los costos operativos de tu empresa con flotas 100% eléctricas. Reducción del TCO, mantenimiento mínimo y cero emisiones para cumplir con tus metas de sostenibilidad.',
        cta: 'Ver modelos de flota',
        href: '/modelos?segment=corporate',
    },
    {
        icon: '📦',
        title: 'Vehículos de Carga',
        description:
            'Camiones y furgones eléctricos para logística urbana de última milla. Mayor eficiencia en zonas de restricción vehicular y acceso a incentivos de carga limpia.',
        cta: 'Ver vehículos de carga',
        href: '/modelos?segment=corporate',
    },
    {
        icon: '🚕',
        title: 'Taxis Verdes',
        description:
            'Ingresa al programa de transporte público sostenible. Vehículos homologados para taxi con autonomía extendida, bajo costo por kilómetro y acceso a subsidios verdes.',
        cta: 'Conocer el programa',
        href: '/modelos?segment=corporate',
    },
    {
        icon: '🚌',
        title: 'Buses Especializados',
        description:
            'Soluciones de movilidad masiva eléctrica para empresas, colegios, hoteles y operadores de transporte. Buses y minibuses eléctricos con alta capacidad y confort.',
        cta: 'Ver buses y minibuses',
        href: '/modelos?segment=corporate',
    },
    {
        icon: '⚡',
        title: 'Sector Energético',
        description:
            'Vehículos robustos y especializados para empresas del sector energético, petrolero y minero. Equipados para operar en condiciones exigentes con la fiabilidad que tu operación requiere.',
        cta: 'Solicitar propuesta',
        href: 'https://wa.me/573117762260?text=Hola%2C%20me%20interesa%20una%20cotizaci%C3%B3n%20para%20soluci%C3%B3n%20empresarial%20en%20el%20sector%20energ%C3%A9tico',
    },
];

export default function SolucionesPage() {
    return (
        <main className="min-h-screen bg-[#050B09] overflow-x-hidden">
            <header>
                <Navbar />
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#00D4AA]/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <p className="text-[#00D4AA] text-xs font-black uppercase tracking-[0.3em] mb-4">
                        Elemotor Business
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none mb-6">
                        Soluciones{' '}
                        <span className="text-[#00D4AA]">Empresariales</span>
                        <br />
                        y Corporativas
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
                        Transformamos la movilidad de tu empresa con tecnología eléctrica de vanguardia.
                        Flotas inteligentes, cero emisiones y reducción real de costos operativos para
                        empresas líderes en Colombia.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://wa.me/573117762260?text=Hola%2C%20me%20interesa%20una%20cotizaci%C3%B3n%20para%20soluci%C3%B3n%20empresarial"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-[#00D4AA] hover:bg-[#00BFAA] text-[#050B09] font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(0,212,170,0.25)] hover:shadow-[0_0_40px_rgba(0,212,170,0.4)]"
                        >
                            Solicitar Cotizacion Empresarial
                        </a>
                        <Link
                            href="/modelos?segment=corporate"
                            className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:border-[#00D4AA]/50 text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition-all"
                        >
                            Ver Catalogo Corporativo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="border-y border-white/5 bg-white/[0.02] py-10 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '70%', label: 'Reduccion en costo de combustible' },
                            { value: '0', label: 'Emisiones de CO₂' },
                            { value: '40%', label: 'Menos mantenimiento' },
                            { value: '24/7', label: 'Soporte posventa dedicado' },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <p className="text-3xl md:text-4xl font-black text-[#00D4AA] mb-1">{stat.value}</p>
                                <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subsegment Cards */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-14">
                        <p className="text-[#00D4AA] text-xs font-black uppercase tracking-[0.3em] mb-3">
                            Nuestras Soluciones
                        </p>
                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                            Un vehiculo para cada necesidad empresarial
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SUBSEGMENTS.map((seg) => (
                            <a
                                key={seg.title}
                                href={seg.href}
                                target={seg.href.startsWith('http') ? '_blank' : undefined}
                                rel={seg.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="group bg-[#0A1410] border border-white/5 hover:border-[#00D4AA]/30 rounded-2xl p-8 flex flex-col gap-4 transition-all duration-300 hover:bg-[#0D1A15]"
                            >
                                <span className="text-4xl">{seg.icon}</span>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                                    {seg.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed flex-1">
                                    {seg.description}
                                </p>
                                <span className="text-[#00D4AA] text-xs font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform inline-block">
                                    {seg.cta} →
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-gradient-to-br from-[#0A1A14] to-[#050B09] border border-[#00D4AA]/20 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#00D4AA]/3 rounded-3xl" />
                        <div className="relative z-10">
                            <p className="text-[#00D4AA] text-xs font-black uppercase tracking-[0.3em] mb-4">
                                Hablemos de tu proyecto
                            </p>
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
                                Tu flota electrica
                                <br />
                                empieza aqui
                            </h2>
                            <p className="text-slate-400 text-base max-w-xl mx-auto mb-10 leading-relaxed">
                                Nuestro equipo de expertos en movilidad empresarial te asesora sin compromiso.
                                Estructuramos la solucion exacta para el tamano y necesidades de tu operacion.
                            </p>
                            <a
                                href="https://wa.me/573117762260?text=Hola%2C%20me%20interesa%20una%20cotizaci%C3%B3n%20para%20soluci%C3%B3n%20empresarial"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-[#00D4AA] hover:bg-[#00BFAA] text-[#050B09] font-black text-sm uppercase tracking-widest px-10 py-5 rounded-xl transition-all shadow-[0_0_40px_rgba(0,212,170,0.3)] hover:shadow-[0_0_60px_rgba(0,212,170,0.5)]"
                            >
                                Solicitar Cotizacion Empresarial
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
