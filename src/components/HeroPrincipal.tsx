'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Car, Truck, Leaf, Zap, Shield, DollarSign, Handshake } from 'lucide-react';

const STATS = [
  { icon: Leaf, label: 'CERO EMISIONES', desc: 'Cuidamos el planeta' },
  { icon: Zap, label: 'TECNOLOGÍA AVANZADA', desc: 'Innovación en cada detalle' },
  { icon: Shield, label: 'SEGURIDAD', desc: 'Estándares internacionales' },
  { icon: DollarSign, label: 'AHORRO INTELIGENTE', desc: 'Menor costo, mayor rendimiento' },
  { icon: Handshake, label: 'RESPALDO TOTAL', desc: 'Acompañamiento garantizado' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const, delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' as const, delay },
  }),
};

export function HeroPrincipal() {
  return (
    <section className="relative min-h-screen w-full flex flex-col overflow-hidden">
      {/* ── Fondo ── */}
      <div className="absolute inset-0 z-0">
        {/* Desktop */}
        <Image
          src="/header_principal.webp"
          alt="Header principal Elemotor"
          fill
          priority
          className="hidden md:block object-cover object-center"
          sizes="100vw"
        />
        {/* Móvil */}
        <Image
          src="/header_principal_movil.webp"
          alt="Header principal Elemotor móvil"
          fill
          priority
          className="block md:hidden object-cover object-center"
          sizes="100vw"
        />
        {/* Overlay oscuro general */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Fade superior para la navbar */}
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
        {/* Fade inferior hacia la siguiente sección */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
      </div>

      {/* ── Contenido principal ── */}
      <div className="relative z-10 flex flex-col flex-1">

        {/* Títulos superiores centrados */}
        <div className="flex flex-col items-center justify-center pt-20 md:pt-32 pb-4 md:pb-8 px-4 text-center">
          <motion.h1
            className="text-3xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.1}
          >
            <span className="text-white">DOS SOLUCIONES,</span>
            <br />
            <span style={{ color: '#00D4AA' }}>UN MISMO PROPÓSITO</span>
          </motion.h1>

          <motion.p
            className="mt-3 md:mt-5 text-gray-300 text-sm md:text-xl max-w-2xl leading-relaxed"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.3}
          >
            Impulsamos la movilidad eléctrica para personas, empresas e instituciones.
          </motion.p>
        </div>

        {/* ── Dos mitades ── */}
        <div className="relative flex flex-col md:flex-row flex-1 md:min-h-[420px]">

          {/* Línea diagonal central — visible solo en md+ */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 z-20 pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="absolute top-0 bottom-0 w-[3px] origin-top"
              style={{
                left: '-1px',
                background: 'linear-gradient(to bottom, transparent, #00D4AA 20%, #00D4AA 80%, transparent)',
                transform: 'rotate(3deg)',
                boxShadow: '0 0 18px 4px #00D4AA55',
              }}
            />
          </div>

          {/* Mitad izquierda — Vehículos Eléctricos */}
          <motion.div
            className="flex-1 flex flex-col items-center justify-center px-6 md:px-16 py-6 md:py-10 text-center border-b border-white/10 md:border-b-0 md:border-r md:border-white/10"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={0.45}
          >
            {/* Ícono */}
            <div className="mb-3 md:mb-5 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-[#00D4AA]/60 bg-[#00D4AA]/10">
              <Car className="w-6 h-6 md:w-8 md:h-8 text-[#00D4AA]" strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight mb-1">
              <span className="text-white">VEHÍCULOS </span>
              <span style={{ color: '#00D4AA' }}>ELÉCTRICOS</span>
            </h2>

            <p className="mt-2 md:mt-4 text-gray-300 text-sm md:text-lg max-w-md leading-relaxed">
              SUV, sedanes y vehículos urbanos eléctricos con tecnología de última generación
              para una movilidad eficiente y sostenible.
            </p>

            <Link
              href="/modelos"
              className="mt-5 md:mt-8 inline-flex items-center gap-2 rounded-lg font-bold px-6 md:px-7 py-3 md:py-4 text-sm md:text-base text-slate-900 hover:brightness-110 active:scale-95 transition-all duration-200 w-full md:w-auto justify-center"
              style={{ backgroundColor: '#00D4AA' }}
            >
              VER VEHÍCULOS →
            </Link>
          </motion.div>

          {/* Mitad derecha — Soluciones Empresariales */}
          <motion.div
            className="flex-1 flex flex-col items-center justify-center px-6 md:px-16 py-6 md:py-10 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={0.6}
          >
            {/* Ícono */}
            <div className="mb-3 md:mb-5 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-[#00D4AA]/60 bg-[#00D4AA]/10">
              <Truck className="w-6 h-6 md:w-8 md:h-8 text-[#00D4AA]" strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight mb-1">
              <span className="text-white">SOLUCIONES </span>
              <span style={{ color: '#00D4AA' }}>EMPRESARIALES</span>
              <br />
              <span className="text-white text-xl md:text-3xl">Y CORPORATIVAS</span>
            </h2>

            <p className="mt-2 md:mt-4 text-gray-300 text-sm md:text-lg max-w-md leading-relaxed">
              Flotas eléctricas, vehículos de carga, taxis, buses especializados y proyectos
              a la medida de cada empresa e institución.
            </p>

            <Link
              href="/soluciones"
              className="mt-5 md:mt-8 inline-flex items-center gap-2 rounded-lg font-bold px-6 md:px-7 py-3 md:py-4 text-sm md:text-base text-slate-900 hover:brightness-110 active:scale-95 transition-all duration-200 w-full md:w-auto justify-center"
              style={{ backgroundColor: '#00D4AA' }}
            >
              CONOCER SOLUCIONES →
            </Link>
          </motion.div>
        </div>

        {/* ── Stats bar ── */}
        <motion.div
          className="relative z-10 bg-black/50 border-t border-white/10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={0.8}
        >
          <div className="max-w-7xl mx-auto px-4 py-3 md:py-5">
            {/* Mobile: grid 2x3 (5 items, último centrado) */}
            <div className="grid grid-cols-2 md:hidden gap-0 divide-y divide-white/10">
              {STATS.map(({ icon: Icon, label, desc }, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 px-3 py-3 ${i === 4 ? 'col-span-2 justify-center border-t border-white/10' : ''}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: '#00D4AA' }} strokeWidth={1.8} />
                  <div className="text-left">
                    <p className="text-white font-bold text-[10px] tracking-wider leading-tight">{label}</p>
                    <p className="text-gray-400 text-[10px] leading-tight">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop: fila horizontal */}
            <div className="hidden md:flex items-center justify-center divide-x divide-white/20">
              {STATS.map(({ icon: Icon, label, desc }, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-2 flex-1 justify-center">
                  <Icon className="w-5 h-5 flex-shrink-0" style={{ color: '#00D4AA' }} strokeWidth={1.8} />
                  <div className="text-left">
                    <p className="text-white font-bold text-xs tracking-wider leading-tight">{label}</p>
                    <p className="text-gray-400 text-xs leading-tight">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
