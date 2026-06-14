'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Imágenes de entregas ──────────────────────────────────────────────────────
const TOTAL_IMAGES = 29;
const IMAGES: string[] = Array.from(
    { length: TOTAL_IMAGES },
    (_, i) => `/fotos carrusel entregas/${i + 1}.jpeg`
);

// Cuántas imágenes mostrar a la vez según breakpoint
const VISIBLE_DESKTOP = 3;

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Índice circular seguro */
function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}

// ─── Componente principal ──────────────────────────────────────────────────────

export function DeliveryCarousel() {
    const [current, setCurrent] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);
    const [visibleCount, setVisibleCount] = React.useState(VISIBLE_DESKTOP);
    const [isDragging, setIsDragging] = React.useState(false);
    const dragStartX = React.useRef<number | null>(null);
    const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
    const trackRef = React.useRef<HTMLDivElement>(null);

    // Detectar breakpoint
    React.useEffect(() => {
        function update() {
            if (window.innerWidth < 640) {
                setVisibleCount(1);
            } else if (window.innerWidth < 1024) {
                setVisibleCount(2);
            } else {
                setVisibleCount(VISIBLE_DESKTOP);
            }
        }
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    // Autoplay
    React.useEffect(() => {
        if (isHovered) return;
        intervalRef.current = setInterval(() => {
            setCurrent((prev) => mod(prev + 1, TOTAL_IMAGES));
        }, 3000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isHovered]);

    const prev = () => setCurrent((p) => mod(p - 1, TOTAL_IMAGES));
    const next = () => setCurrent((p) => mod(p + 1, TOTAL_IMAGES));

    // Swipe / drag handlers
    const handlePointerDown = (e: React.PointerEvent) => {
        dragStartX.current = e.clientX;
        setIsDragging(false);
    };
    const handlePointerMove = (e: React.PointerEvent) => {
        if (dragStartX.current === null) return;
        if (Math.abs(e.clientX - dragStartX.current) > 8) setIsDragging(true);
    };
    const handlePointerUp = (e: React.PointerEvent) => {
        if (dragStartX.current === null) return;
        const delta = e.clientX - dragStartX.current;
        if (Math.abs(delta) > 40) {
            delta < 0 ? next() : prev();
        }
        dragStartX.current = null;
        // pequeño delay para evitar que el click se dispare tras un drag
        setTimeout(() => setIsDragging(false), 50);
    };

    // Índices de las imágenes a mostrar (ventana deslizante circular)
    const visibleIndices = Array.from(
        { length: visibleCount },
        (_, i) => mod(current + i, TOTAL_IMAGES)
    );

    // Dots: mostramos hasta 7 puntos (con compresión si hay más)
    const MAX_DOTS = 7;
    const dotStep = TOTAL_IMAGES <= MAX_DOTS ? 1 : Math.ceil(TOTAL_IMAGES / MAX_DOTS);
    const dots = Array.from(
        { length: Math.ceil(TOTAL_IMAGES / dotStep) },
        (_, i) => i * dotStep
    );

    return (
        <section
            className="py-24 bg-[#060D0B] border-t border-white/5 relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Glow de fondo */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-[0.06]"
                style={{ background: '#00D4AA' }}
            />
            <div
                className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none opacity-[0.04]"
                style={{ background: '#10B981' }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <span className="inline-flex items-center gap-2 border border-[#00D4AA]/40 text-[#00D4AA] text-[10px] font-black tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
                        Entregas
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-none">
                        CADA ENTREGA,{' '}
                        <span className="text-[#00D4AA]">UN MOMENTO ÚNICO</span>
                    </h2>
                    <p className="text-slate-400 text-base mt-4 max-w-xl leading-relaxed">
                        Momentos reales de colombianos que ya disfrutan su vehículo eléctrico Elemotor.
                    </p>
                </motion.div>

                {/* ── Carrusel ── */}
                <div className="relative">

                    {/* Fade lateral izquierdo */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-[#060D0B] to-transparent" />
                    {/* Fade lateral derecho */}
                    <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-[#060D0B] to-transparent" />

                    {/* Track */}
                    <div
                        ref={trackRef}
                        className="overflow-hidden select-none cursor-grab active:cursor-grabbing"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                    >
                        <div
                            className="flex gap-4 transition-none"
                            style={{
                                /* Animamos via transform de cada slide individual */
                            }}
                        >
                            {visibleIndices.map((imgIdx, slotIdx) => (
                                <motion.div
                                    key={`${current}-${slotIdx}`}
                                    initial={{ opacity: 0, scale: 0.96, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.96, x: -20 }}
                                    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="flex-1 min-w-0"
                                >
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 hover:border-[#00D4AA]/30 transition-colors duration-300 group">
                                        <Image
                                            src={IMAGES[imgIdx]}
                                            alt={`Entrega Elemotor ${imgIdx + 1}`}
                                            fill
                                            unoptimized
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            sizes={
                                                visibleCount === 1
                                                    ? '100vw'
                                                    : visibleCount === 2
                                                    ? '50vw'
                                                    : '33vw'
                                            }
                                            draggable={false}
                                        />
                                        {/* Overlay sutil en hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#060D0B]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Número de imagen — badge discreto */}
                                        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1 text-[9px] text-white/50 font-bold tracking-wider">
                                            {imgIdx + 1} / {TOTAL_IMAGES}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* ── Flechas ── */}
                    <button
                        onClick={prev}
                        aria-label="Imagen anterior"
                        className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/10 bg-[#060D0B]/80 backdrop-blur-sm text-white flex items-center justify-center hover:bg-[#00D4AA] hover:text-slate-900 hover:border-[#00D4AA] transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Siguiente imagen"
                        className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/10 bg-[#060D0B]/80 backdrop-blur-sm text-white flex items-center justify-center hover:bg-[#00D4AA] hover:text-slate-900 hover:border-[#00D4AA] transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* ── Dots ── */}
                <div className="flex items-center justify-center gap-2 mt-8">
                    {dots.map((dotIdx) => {
                        const isActive =
                            current >= dotIdx &&
                            current < dotIdx + dotStep;
                        return (
                            <button
                                key={dotIdx}
                                aria-label={`Ir a imagen ${dotIdx + 1}`}
                                onClick={() => setCurrent(dotIdx)}
                                className={`rounded-full transition-all duration-300 ${
                                    isActive
                                        ? 'w-6 h-2 bg-[#00D4AA]'
                                        : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                                }`}
                            />
                        );
                    })}
                </div>

                {/* ── Strip contador ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-10 flex items-center justify-center gap-3 text-slate-500 text-sm"
                >
                    <span className="w-8 h-px bg-white/10" />
                    <span>
                        <span className="text-[#00D4AA] font-black">{current + 1}</span>
                        {' '}de{' '}
                        <span className="font-semibold text-white/40">{TOTAL_IMAGES}</span>
                        {' '}entregas
                    </span>
                    <span className="w-8 h-px bg-white/10" />
                </motion.div>

            </div>
        </section>
    );
}
