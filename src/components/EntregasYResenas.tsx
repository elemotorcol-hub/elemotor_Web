'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { orderService } from '@/services/order.service';

// ─── Tipos públicos ────────────────────────────────────────────────────────────

export interface ClientTestimonial {
    id: number;
    name: string;
    comment: string;
    rating: number;
    photoUrl?: string;
    createdAt: string;
}

interface GoogleReview {
    author_name: string;
    rating: number;
    text: string;
    time: number;
    relative_time_description: string;
    profile_photo_url: string;
}

interface Props {
    googleReviews?: GoogleReview[];
    clientTestimonials?: ClientTestimonial[];
}

// ─── Tipo unificado de reseña ──────────────────────────────────────────────────

type ReviewItem =
    | { source: 'google'; data: GoogleReview }
    | { source: 'client'; data: ClientTestimonial };

// ─── Imágenes de entregas ──────────────────────────────────────────────────────

const EXCLUDED_IMAGES = new Set([15, 21, 23]);
const IMAGES: string[] = Array.from({ length: 29 }, (_, i) => i + 1)
    .filter((n) => !EXCLUDED_IMAGES.has(n))
    .map((n) => `/fotos carrusel entregas/${n}.webp`);
const TOTAL_IMAGES = IMAGES.length;

// ─── Datos de respaldo ─────────────────────────────────────────────────────────

const FALLBACK_REVIEWS: GoogleReview[] = [
    {
        author_name: 'Carlos Mendoza',
        rating: 5,
        text: 'El proceso fue increíble de principio a fin. En menos de una semana ya tenía mi vehículo en casa. El equipo de Elemotor resolvió todas mis dudas y la entrega fue una experiencia que nunca olvidaré.',
        time: Date.now() / 1000,
        relative_time_description: 'hace 1 mes',
        profile_photo_url: '',
    },
    {
        author_name: 'Laura Gómez',
        rating: 5,
        text: 'Llevo 6 meses con mi eléctrico y ahorro el 70% en combustible. El servicio posventa de Elemotor es excepcional.',
        time: Date.now() / 1000,
        relative_time_description: 'hace 2 meses',
        profile_photo_url: '',
    },
    {
        author_name: 'Andrés Torres',
        rating: 5,
        text: 'Necesitaba una camioneta que soportara mi trabajo diario y superó todas las expectativas. Elemotor me asesoró perfectamente.',
        time: Date.now() / 1000,
        relative_time_description: 'hace 3 meses',
        profile_photo_url: '',
    },
    {
        author_name: 'Patricia Ruiz',
        rating: 5,
        text: 'La atención de Elemotor fue personalizada desde el primer contacto. El financiamiento fue sencillo y la entrega impecable.',
        time: Date.now() / 1000,
        relative_time_description: 'hace 4 meses',
        profile_photo_url: '',
    },
    {
        author_name: 'Juan Pablo Silva',
        rating: 5,
        text: 'Elemotor hizo que la transición al eléctrico fuera muy fácil. Excelente asesoría, y el vehículo ha sido perfecto.',
        time: Date.now() / 1000,
        relative_time_description: 'hace 5 meses',
        profile_photo_url: '',
    },
];

// ─── Stats ─────────────────────────────────────────────────────────────────────

const STATS = [
    { value: '+500', label: 'Clientes satisfechos' },
    { value: '+12',  label: 'Ciudades con entregas' },
    { value: '4.9',  label: 'Calificación en Google' },
    { value: '100%', label: 'Recomendarían Elemotor' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}

function StarRating({ count }: { count: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < count ? 'text-[#00D4AA] fill-[#00D4AA]' : 'text-white/20'}`}
                />
            ))}
        </div>
    );
}

function getInitials(name: string): string {
    return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

// ─── Logo SVG de Google ────────────────────────────────────────────────────────

function GoogleLogo({ className = 'w-3.5 h-3.5' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
    );
}

// ─── Review Card ───────────────────────────────────────────────────────────────

function ReviewCard({ item }: { item: ReviewItem }) {
    const [photoErr, setPhotoErr] = React.useState(false);

    if (item.source === 'google') {
        const r = item.data;
        return (
            <div className="flex-shrink-0 w-[300px] bg-[#0d1f1a] border border-white/5 hover:border-[#00D4AA]/30 transition-colors duration-300 rounded-2xl p-5 flex flex-col gap-3 h-full">
                <div className="flex items-center justify-between">
                    <StarRating count={r.rating} />
                    <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-full px-2.5 py-1">
                        <GoogleLogo />
                        <span className="text-white/60 text-[9px] font-bold tracking-wider">GOOGLE</span>
                    </div>
                </div>

                <p className="text-white/75 text-sm leading-relaxed line-clamp-4 flex-1">
                    {r.text}
                </p>

                <div className="border-t border-white/5 pt-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex-shrink-0 relative">
                        {r.profile_photo_url && !photoErr ? (
                            <Image
                                src={r.profile_photo_url}
                                alt={r.author_name}
                                fill
                                className="object-cover"
                                sizes="36px"
                                onError={() => setPhotoErr(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[#00D4AA] text-xs font-black">
                                    {getInitials(r.author_name)}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-white font-bold text-sm leading-none truncate">{r.author_name}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{r.relative_time_description}</p>
                    </div>
                </div>
            </div>
        );
    }

    // source === 'client'
    const t = item.data;
    const dateStr = new Date(t.createdAt).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
    });

    return (
        <div className="flex-shrink-0 w-[300px] bg-[#0d1f1a] border border-white/5 hover:border-[#00D4AA]/30 transition-colors duration-300 rounded-2xl p-5 flex flex-col gap-3 h-full">
            <div className="flex items-center justify-between">
                <StarRating count={t.rating} />
                <span className="text-[9px] font-black tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 rounded-full px-2 py-0.5">
                    CLIENTE
                </span>
            </div>

            <p className="text-white/75 text-sm leading-relaxed line-clamp-4 flex-1">
                {t.comment}
            </p>

            <div className="border-t border-white/5 pt-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex-shrink-0 relative">
                    {t.photoUrl ? (
                        <Image
                            src={t.photoUrl}
                            alt={t.name}
                            fill
                            className="object-cover"
                            sizes="36px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[#00D4AA] text-xs font-black">
                                {getInitials(t.name)}
                            </span>
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="text-white font-bold text-sm leading-none truncate">{t.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{dateStr}</p>
                </div>
            </div>
        </div>
    );
}

// ─── Componente principal ──────────────────────────────────────────────────────

export function EntregasYResenas({ googleReviews = [], clientTestimonials = [] }: Props) {

    // ── Fotos dinámicas de la API ──────────────────────────────────────────────
    const [dynamicPhotos, setDynamicPhotos] = React.useState<string[]>([]);
    React.useEffect(() => {
        orderService.fetchDeliveryPhotos()
            .then((photos) => setDynamicPhotos(photos.map((p) => p.deliveryPhotoUrl)))
            .catch(() => {});
    }, []);

    // Combinar: fotos dinámicas primero, luego estáticas
    const allPhotos = React.useMemo(() => [...dynamicPhotos, ...IMAGES], [dynamicPhotos]);
    const totalPhotos = allPhotos.length;

    // ── Estado carrusel fotos ──────────────────────────────────────────────────
    const [photoCurrent, setPhotoCurrent] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);
    const [visibleCount, setVisibleCount] = React.useState(3);
    const [isDragging, setIsDragging] = React.useState(false);
    const dragStartX = React.useRef<number | null>(null);
    const photoIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Estado slider reseñas ──────────────────────────────────────────────────
    const [reviewCurrent, setReviewCurrent] = React.useState(0);
    const [reviewVisible, setReviewVisible] = React.useState(3);
    const reviewDragStartX = React.useRef<number | null>(null);
    const [isReviewDragging, setIsReviewDragging] = React.useState(false);

    // ── Breakpoint detector ────────────────────────────────────────────────────
    React.useEffect(() => {
        function update() {
            if (window.innerWidth < 640) {
                setVisibleCount(1);
                setReviewVisible(1);
            } else if (window.innerWidth < 1024) {
                setVisibleCount(2);
                setReviewVisible(2);
            } else {
                setVisibleCount(3);
                setReviewVisible(3);
            }
        }
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    // ── Autoplay fotos (pausa on hover) ───────────────────────────────────────
    React.useEffect(() => {
        if (isHovered) return;
        photoIntervalRef.current = setInterval(() => {
            setPhotoCurrent((prev) => mod(prev + 1, totalPhotos));
        }, 3000);
        return () => {
            if (photoIntervalRef.current) clearInterval(photoIntervalRef.current);
        };
    }, [isHovered, totalPhotos]);

    // ── Handlers carrusel fotos ────────────────────────────────────────────────
    const photoPrev = () => setPhotoCurrent((p) => mod(p - 1, totalPhotos));
    const photoNext = () => setPhotoCurrent((p) => mod(p + 1, totalPhotos));

    const handlePhotoDragDown = (e: React.PointerEvent) => {
        dragStartX.current = e.clientX;
        setIsDragging(false);
    };
    const handlePhotoDragMove = (e: React.PointerEvent) => {
        if (dragStartX.current === null) return;
        if (Math.abs(e.clientX - dragStartX.current) > 8) setIsDragging(true);
    };
    const handlePhotoDragUp = (e: React.PointerEvent) => {
        if (dragStartX.current === null) return;
        const delta = e.clientX - dragStartX.current;
        if (Math.abs(delta) > 40) delta < 0 ? photoNext() : photoPrev();
        dragStartX.current = null;
        setTimeout(() => setIsDragging(false), 50);
    };

    // ── Construir array unificado de reseñas ───────────────────────────────────
    const safeGoogle = Array.isArray(googleReviews) ? googleReviews : [];
    const safeClient = Array.isArray(clientTestimonials) ? clientTestimonials : [];
    const googleData = safeGoogle.length > 0 ? safeGoogle : FALLBACK_REVIEWS;
    const allReviews: ReviewItem[] = [
        ...googleData.map((r): ReviewItem => ({ source: 'google', data: r })),
        ...safeClient.map((t): ReviewItem => ({ source: 'client', data: t })),
    ];
    const totalReviews = allReviews.length;

    // ── Handlers slider reseñas ────────────────────────────────────────────────
    const reviewPrev = () => setReviewCurrent((p) => mod(p - 1, totalReviews));
    const reviewNext = () => setReviewCurrent((p) => mod(p + 1, totalReviews));

    const handleReviewDragDown = (e: React.PointerEvent) => {
        reviewDragStartX.current = e.clientX;
        setIsReviewDragging(false);
    };
    const handleReviewDragMove = (e: React.PointerEvent) => {
        if (reviewDragStartX.current === null) return;
        if (Math.abs(e.clientX - reviewDragStartX.current) > 8) setIsReviewDragging(true);
    };
    const handleReviewDragUp = (e: React.PointerEvent) => {
        if (reviewDragStartX.current === null) return;
        const delta = e.clientX - reviewDragStartX.current;
        if (Math.abs(delta) > 40) delta < 0 ? reviewNext() : reviewPrev();
        reviewDragStartX.current = null;
        setTimeout(() => setIsReviewDragging(false), 50);
    };

    // ── Índices visibles fotos ─────────────────────────────────────────────────
    const visiblePhotoIndices = Array.from(
        { length: visibleCount },
        (_, i) => mod(photoCurrent + i, totalPhotos)
    );

    // ── Índices visibles reseñas ───────────────────────────────────────────────
    const visibleReviewIndices = Array.from(
        { length: Math.min(reviewVisible, totalReviews) },
        (_, i) => mod(reviewCurrent + i, totalReviews)
    );

    // ── Dots fotos ─────────────────────────────────────────────────────────────
    const MAX_DOTS = 7;
    const dotStep = totalPhotos <= MAX_DOTS ? 1 : Math.ceil(totalPhotos / MAX_DOTS);
    const photoDots = Array.from(
        { length: Math.ceil(totalPhotos / dotStep) },
        (_, i) => i * dotStep
    );

    return (
        <section
            className="py-24 bg-[#060D0B] border-t border-white/5 relative overflow-hidden"
        >
            {/* Glows de fondo */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-[0.06]"
                style={{ background: '#00D4AA' }}
            />
            <div
                className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-[0.04]"
                style={{ background: '#10B981' }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* ── Header ────────────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <span className="inline-flex items-center gap-2 border border-[#00D4AA]/40 text-[#00D4AA] text-[10px] font-black tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
                        Reseñas
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-none">
                        ELLOS YA ELIGIERON{' '}
                        <span className="text-[#00D4AA]">SU ELÉCTRICO</span>
                    </h2>
                    <p className="text-slate-400 text-base mt-4 max-w-xl leading-relaxed">
                        Momentos reales y reseñas de colombianos que ya disfrutan su vehículo eléctrico Elemotor.
                    </p>
                </motion.div>

                {/* ══════════════════════════════════════════════════════════════ */}
                {/* PARTE 1 — CARRUSEL DE FOTOS                                   */}
                {/* ══════════════════════════════════════════════════════════════ */}

                <div
                    className="relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Fades laterales */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-[#060D0B] to-transparent" />
                    <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-[#060D0B] to-transparent" />

                    {/* Track */}
                    <div
                        className="overflow-hidden select-none cursor-grab active:cursor-grabbing"
                        onPointerDown={handlePhotoDragDown}
                        onPointerMove={handlePhotoDragMove}
                        onPointerUp={handlePhotoDragUp}
                        onPointerLeave={handlePhotoDragUp}
                    >
                        <div className="flex gap-4">
                            {visiblePhotoIndices.map((imgIdx, slotIdx) => (
                                <motion.div
                                    key={`${photoCurrent}-${slotIdx}`}
                                    initial={{ opacity: 0, scale: 0.96, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.96, x: -20 }}
                                    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="flex-1 min-w-0"
                                >
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 hover:border-[#00D4AA]/30 transition-colors duration-300 group">
                                        <Image
                                            src={allPhotos[imgIdx]}
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
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#060D0B]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1 text-[9px] text-white/50 font-bold tracking-wider">
                                            {imgIdx + 1} / {totalPhotos}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Flechas fotos */}
                    <button
                        onClick={photoPrev}
                        aria-label="Imagen anterior"
                        className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/10 bg-[#060D0B]/80 backdrop-blur-sm text-white flex items-center justify-center hover:bg-[#00D4AA] hover:text-slate-900 hover:border-[#00D4AA] transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={photoNext}
                        aria-label="Siguiente imagen"
                        className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-white/10 bg-[#060D0B]/80 backdrop-blur-sm text-white flex items-center justify-center hover:bg-[#00D4AA] hover:text-slate-900 hover:border-[#00D4AA] transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Dots fotos */}
                <div className="flex items-center justify-center gap-2 mt-8">
                    {photoDots.map((dotIdx) => {
                        const isActive = photoCurrent >= dotIdx && photoCurrent < dotIdx + dotStep;
                        return (
                            <button
                                key={dotIdx}
                                aria-label={`Ir a imagen ${dotIdx + 1}`}
                                onClick={() => setPhotoCurrent(dotIdx)}
                                className={`rounded-full transition-all duration-300 ${
                                    isActive
                                        ? 'w-6 h-2 bg-[#00D4AA]'
                                        : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                                }`}
                            />
                        );
                    })}
                </div>

                {/* Contador fotos */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-6 flex items-center justify-center gap-3 text-slate-500 text-sm"
                >
                    <span className="w-8 h-px bg-white/10" />
                    <span>
                        <span className="text-[#00D4AA] font-black">{photoCurrent + 1}</span>
                        {' '}de{' '}
                        <span className="font-semibold text-white/40">{totalPhotos}</span>
                        {' '}fotos
                    </span>
                    <span className="w-8 h-px bg-white/10" />
                </motion.div>

                {/* ══════════════════════════════════════════════════════════════ */}
                {/* PARTE 2 — SLIDER DE RESEÑAS                                   */}
                {/* ══════════════════════════════════════════════════════════════ */}

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-16"
                >
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                        <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
                            Lo que dicen nuestros{' '}
                            <span className="text-[#00D4AA]">clientes</span>
                        </h3>

                        {/* Flechas reseñas — en la misma línea del título */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={reviewPrev}
                                aria-label="Reseña anterior"
                                className="w-10 h-10 rounded-full border border-white/10 bg-[#0d1f1a] text-white flex items-center justify-center hover:bg-[#00D4AA] hover:text-slate-900 hover:border-[#00D4AA] transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={reviewNext}
                                aria-label="Siguiente reseña"
                                className="w-10 h-10 rounded-full border border-white/10 bg-[#0d1f1a] text-white flex items-center justify-center hover:bg-[#00D4AA] hover:text-slate-900 hover:border-[#00D4AA] transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Track reseñas */}
                    <div
                        className="overflow-hidden select-none cursor-grab active:cursor-grabbing"
                        onPointerDown={handleReviewDragDown}
                        onPointerMove={handleReviewDragMove}
                        onPointerUp={handleReviewDragUp}
                        onPointerLeave={handleReviewDragUp}
                    >
                        <div className="flex gap-4">
                            {visibleReviewIndices.map((reviewIdx, slotIdx) => (
                                <motion.div
                                    key={`${reviewCurrent}-${slotIdx}`}
                                    initial={{ opacity: 0, scale: 0.96, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.96, x: -20 }}
                                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="flex-1 min-w-0"
                                >
                                    <ReviewCard item={allReviews[reviewIdx]} />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Indicador de posición reseñas */}
                    <div className="mt-6 flex items-center justify-center gap-3 text-slate-500 text-sm">
                        <span className="w-8 h-px bg-white/10" />
                        <span>
                            <span className="text-[#00D4AA] font-black">{reviewCurrent + 1}</span>
                            {' '}de{' '}
                            <span className="font-semibold text-white/40">{totalReviews}</span>
                            {' '}reseñas
                        </span>
                        <span className="w-8 h-px bg-white/10" />
                    </div>
                </motion.div>

                {/* ══════════════════════════════════════════════════════════════ */}
                {/* STATS BAR                                                      */}
                {/* ══════════════════════════════════════════════════════════════ */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden mt-14"
                >
                    {STATS.map(({ value, label }) => (
                        <div key={label} className="bg-[#060D0B] hover:bg-[#0a1510] transition-colors px-6 py-6 text-center">
                            <p className="text-[#00D4AA] text-3xl font-black leading-none mb-1">{value}</p>
                            <p className="text-slate-500 text-xs leading-tight">{label}</p>
                        </div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}
