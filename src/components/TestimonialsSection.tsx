'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import type { GoogleReview } from '@/services/google-reviews.service';

// ─── Tipo para reseñas de clientes de la DB ───────────────────────────────────
export interface ClientTestimonial {
    id: number;
    name: string;
    comment: string;
    rating: number;
    photoUrl?: string;
    createdAt: string;
}

// ─── Fotos de entrega (opcionales, se mapean por posición al review de Google) ─
// Agrega las imágenes reales en /public/testimonios/ con estos nombres.
// Si el archivo no existe, la tarjeta muestra solo la reseña de Google sin foto.
const DELIVERY_PHOTOS = [
    '/testimonios/entrega-1.webp',
    '/testimonios/entrega-2.webp',
    '/testimonios/entrega-3.webp',
    '/testimonios/entrega-4.webp',
    '/testimonios/entrega-5.webp',
];

// ─── Datos de respaldo si Google API falla o no está configurada ──────────────
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

const STATS = [
    { value: '+500', label: 'Clientes satisfechos' },
    { value: '+12',  label: 'Ciudades con entregas' },
    { value: '4.9',  label: 'Calificación en Google' },
    { value: '100%', label: 'Recomendarían Elemotor' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function Initials({ name }: { name: string }) {
    return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

// ─── Tarjeta featured (primera, grande) ──────────────────────────────────────

function FeaturedCard({ review, deliveryPhoto, index }: {
    review: GoogleReview;
    deliveryPhoto?: string;
    index: number;
}) {
    const [photoErr, setPhotoErr] = React.useState(false);
    const [deliveryErr, setDeliveryErr] = React.useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-[#00D4AA]/30 transition-colors duration-300 flex flex-col"
        >
            {/* Foto de entrega */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[#0d1f1a] flex-shrink-0">
                {deliveryPhoto && !deliveryErr ? (
                    <Image
                        src={deliveryPhoto}
                        alt={`Entrega – ${review.author_name}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        onError={() => setDeliveryErr(true)}
                    />
                ) : (
                    /* Placeholder decorativo cuando no hay foto de entrega */
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: 'radial-gradient(circle, rgba(0,212,170,1) 1px, transparent 1px)',
                                backgroundSize: '28px 28px',
                            }}
                        />
                        <div className="relative z-10 w-20 h-20 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center">
                            <span className="text-[#00D4AA] text-2xl font-black">
                                <Initials name={review.author_name} />
                            </span>
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060D0B]/80 via-transparent to-transparent" />

                {/* Badge Google */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-white/70 text-[9px] font-bold tracking-wider">GOOGLE</span>
                </div>
            </div>

            {/* Contenido */}
            <div className="bg-[#0d1f1a] p-6 flex flex-col gap-4 flex-1">
                <StarRating count={review.rating} />

                <div className="relative">
                    <Quote className="w-8 h-8 text-[#00D4AA]/15 absolute -top-1 -left-1" />
                    <p className="text-white/80 text-sm leading-relaxed pl-4">
                        {review.text}
                    </p>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-white/5 mt-auto">
                    {/* Avatar: foto de Google o inicial */}
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex-shrink-0 relative">
                        {review.profile_photo_url && !photoErr ? (
                            <Image
                                src={review.profile_photo_url}
                                alt={review.author_name}
                                fill
                                className="object-cover"
                                sizes="36px"
                                onError={() => setPhotoErr(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[#00D4AA] text-xs font-black">
                                    <Initials name={review.author_name} />
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm leading-none truncate">{review.author_name}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{review.relative_time_description}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Tarjeta compacta ──────────────────────────────────────────────────────────

function CompactCard({ review, deliveryPhoto, index }: {
    review: GoogleReview;
    deliveryPhoto?: string;
    index: number;
}) {
    const [photoErr, setPhotoErr] = React.useState(false);
    const [deliveryErr, setDeliveryErr] = React.useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
            className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-[#00D4AA]/30 transition-colors duration-300 flex"
        >
            {/* Foto de entrega lateral */}
            <div className="relative w-28 flex-shrink-0 overflow-hidden bg-[#0d1f1a]">
                {deliveryPhoto && !deliveryErr ? (
                    <Image
                        src={deliveryPhoto}
                        alt={`Entrega – ${review.author_name}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="112px"
                        onError={() => setDeliveryErr(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0d1f1a]">
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: 'radial-gradient(circle, rgba(0,212,170,1) 1px, transparent 1px)',
                                backgroundSize: '20px 20px',
                            }}
                        />
                        <span className="relative text-[#00D4AA]/40 text-2xl font-black">
                            <Initials name={review.author_name} />
                        </span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d1f1a]/60" />
            </div>

            {/* Contenido */}
            <div className="bg-[#0d1f1a] p-4 flex flex-col justify-between flex-1">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <StarRating count={review.rating} />
                        {/* Badge Google mini */}
                        <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                    </div>
                    <p className="text-white/70 text-xs leading-relaxed line-clamp-3">{review.text}</p>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex-shrink-0 relative">
                        {review.profile_photo_url && !photoErr ? (
                            <Image
                                src={review.profile_photo_url}
                                alt={review.author_name}
                                fill
                                className="object-cover"
                                sizes="24px"
                                onError={() => setPhotoErr(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-[#00D4AA] text-[8px] font-black">
                                    <Initials name={review.author_name} />
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-white font-bold text-xs leading-none truncate">{review.author_name}</p>
                        <p className="text-slate-500 text-[9px] mt-0.5">{review.relative_time_description}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Tarjeta de cliente DB ────────────────────────────────────────────────────

function ClientCard({ testimonial, index }: { testimonial: ClientTestimonial; index: number }) {
    const dateStr = new Date(testimonial.createdAt).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-[#00D4AA]/30 transition-colors duration-300 flex"
        >
            {/* Foto o iniciales lateral */}
            <div className="relative w-28 flex-shrink-0 overflow-hidden bg-[#0d1f1a]">
                {testimonial.photoUrl ? (
                    <Image
                        src={testimonial.photoUrl}
                        alt={testimonial.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="112px"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0d1f1a]">
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: 'radial-gradient(circle, rgba(0,212,170,1) 1px, transparent 1px)',
                                backgroundSize: '20px 20px',
                            }}
                        />
                        <span className="relative text-[#00D4AA]/40 text-2xl font-black">
                            {testimonial.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d1f1a]/60" />
            </div>

            {/* Contenido */}
            <div className="bg-[#0d1f1a] p-4 flex flex-col justify-between flex-1">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <StarRating count={testimonial.rating} />
                        {/* Badge CLIENTE */}
                        <span className="text-[9px] font-black tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 rounded-full px-2 py-0.5">
                            CLIENTE
                        </span>
                    </div>
                    <p className="text-white/70 text-xs leading-relaxed line-clamp-3">{testimonial.comment}</p>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex-shrink-0 flex items-center justify-center">
                        <span className="text-[#00D4AA] text-[8px] font-black">
                            {testimonial.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-white font-bold text-xs leading-none truncate">{testimonial.name}</p>
                        <p className="text-slate-500 text-[9px] mt-0.5">{dateStr}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface TestimonialsSectionProps {
    reviews?: GoogleReview[];
    clientTestimonials?: ClientTestimonial[];
}

export function TestimonialsSection({ reviews, clientTestimonials }: TestimonialsSectionProps) {
    // Si no hay reseñas de Google, usa las de respaldo
    const data = (reviews && reviews.length > 0) ? reviews : FALLBACK_REVIEWS;
    const featured = data[0];
    const compact  = data.slice(1, 5);

    return (
        <section className="py-24 bg-[#060D0B] border-t border-white/5 relative overflow-hidden">
            {/* Glow de fondo */}
            <div
                className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-[0.04]"
                style={{ background: '#00D4AA' }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-14"
                >
                    <span className="inline-flex items-center gap-2 border border-[#00D4AA]/40 text-[#00D4AA] text-[10px] font-black tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
                        Clientes felices
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-none">
                        ELLOS YA ELIGIERON{' '}
                        <span className="text-[#00D4AA]">SU ELÉCTRICO</span>
                    </h2>
                    <p className="text-slate-400 text-base mt-4 max-w-xl leading-relaxed">
                        Reseñas reales de Google de colombianos que hicieron el cambio a la movilidad eléctrica con Elemotor.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                    <FeaturedCard review={featured} deliveryPhoto={DELIVERY_PHOTOS[0]} index={0} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5">
                        {compact.map((r, i) => (
                            <CompactCard key={i} review={r} deliveryPhoto={DELIVERY_PHOTOS[i + 1]} index={i} />
                        ))}
                    </div>
                </div>

                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden mt-2"
                >
                    {STATS.map(({ value, label }) => (
                        <div key={label} className="bg-[#060D0B] hover:bg-[#0a1510] transition-colors px-6 py-6 text-center">
                            <p className="text-[#00D4AA] text-3xl font-black leading-none mb-1">{value}</p>
                            <p className="text-slate-500 text-xs leading-tight">{label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Reseñas de clientes DB */}
                {clientTestimonials && clientTestimonials.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mt-14"
                    >
                        <h3 className="text-xl font-black text-white tracking-tight uppercase mb-6">
                            Reseñas de nuestros <span className="text-[#00D4AA]">clientes</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {clientTestimonials.slice(0, 6).map((t, i) => (
                                <ClientCard key={t.id} testimonial={t} index={i} />
                            ))}
                        </div>
                    </motion.div>
                )}

            </div>
        </section>
    );
}
