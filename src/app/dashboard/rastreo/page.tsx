'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, RefreshCw, Package, CheckCircle2, Anchor, Ship,
    FileText, ClipboardCheck, Car, Flag, MapPin, Loader2, AlertCircle,
    ChevronLeft, ChevronRight, Star, Upload, PartyPopper, Send, Lock,
    X
} from 'lucide-react';
import { orderService } from '@/services/order.service';
import { Order } from '@/types/orders';
import { getSession } from '@/lib/auth.client';
import { fetchApi } from '@/lib/api';

// ─── Status map ───────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, number> = {
    confirmed: 1, port_origin: 2, transit: 3,
    customs: 4, nationalization: 5, ready: 6, delivered: 7,
};

const STEP_TITLES = [
    'Pedido Confirmado', 'En Puerto de Origen', 'En Tránsito Marítimo',
    'En Aduanas', 'En Nacionalización', 'Listo para Entrega', 'Entregado',
];

const STEP_DESCRIPTIONS = [
    'Tu pedido ha sido registrado y confirmado exitosamente.',
    'El vehículo se encuentra en el puerto de embarque en China.',
    'Tu vehículo está en camino. Tiempo estimado de llegada: 25–30 días.',
    'El vehículo será procesado por el servicio de aduanas.',
    'Se están tramitando los documentos de nacionalización del vehículo.',
    'Tu vehículo está preparado y listo para ser entregado en nuestro concesionario.',
    'El vehículo ha sido entregado al cliente.',
];

function getStatusIcon(index: number) {
    const icons = [CheckCircle2, Anchor, Ship, FileText, ClipboardCheck, Car, Flag];
    return icons[index] || Package;
}

// ─── Ship Route — Animated Map ────────────────────────────────────────────────

function ShipRouteSection({ status }: { status: string }) {
    // Progress along the route: 0 = China port, 1 = open sea, 2 = arriving Colombia
    const progress =
        status === 'port_origin'      ? 0.05 :
        status === 'transit'          ? 0.50 :
        status === 'customs'          ? 0.80 :
        status === 'nationalization'  ? 0.92 :
        status === 'ready'            ? 1.0 :
        status === 'delivered'        ? 1.0 : 0.50;

    // Ship position on a Bezier path (SVG viewBox 0 0 800 220)
    // Path: China (730,110) → control (580,40) → mid (400,130) → control (220,220) → Colombia (70,100)
    // Simplified: interpolate between anchor points
    const shipX = 730 - progress * 660;
    const shipY = 110 + Math.sin(progress * Math.PI) * 60 - progress * 20;

    const atSea     = status === 'transit';
    const arriving  = status === 'customs' || status === 'nationalization' || status === 'ready' || status === 'delivered';

    const statusText = atSea
        ? 'Tu vehículo navega en alta mar. Tiempo estimado: 25–30 días.'
        : status === 'delivered'
        ? 'Tu vehículo ha sido entregado. ¡Ruta completada!'
        : status === 'ready'
        ? 'Tu vehículo ya está en Colombia y listo para entrega.'
        : arriving
        ? `Tu vehículo ha llegado a Colombia. En proceso: ${status === 'customs' ? 'aduana' : 'nacionalización'}.`
        : 'El vehículo está en el puerto de embarque en China.';

    return (
        <div className="bg-[#15201D] border border-white/5 shadow-2xl rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/5">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Ship className="w-4 h-4 text-[#10B981]" />
                        <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Ruta del Barco</span>
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Seguimiento Marítimo</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
                    <span className={`w-2 h-2 rounded-full bg-[#10B981] ${status !== 'delivered' ? 'animate-pulse' : ''}`} />
                    <span className="text-xs font-bold text-[#10B981]">
                        {status === 'delivered' ? 'Completado' : 'En vivo'}
                    </span>
                </div>
            </div>

            {/* SVG Map */}
            <div className="relative w-full overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #061020 100%)' }}>
                {/* Wave overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(16,185,129,0.04) 30px, rgba(16,185,129,0.04) 31px)' }} />

                <svg viewBox="0 0 800 240" className="w-full" style={{ height: 'clamp(180px, 28vw, 260px)' }}>
                    {/* Ocean texture lines */}
                    {[40, 80, 120, 160, 200].map(y => (
                        <line key={y} x1="0" y1={y} x2="800" y2={y + 15}
                            stroke="rgba(16,185,129,0.05)" strokeWidth="1" />
                    ))}

                    {/* Route path — dashed */}
                    <path
                        d="M 730 110 C 620 55 530 170 400 130 C 270 90 200 195 70 105"
                        fill="none"
                        stroke="rgba(16,185,129,0.25)"
                        strokeWidth="2"
                        strokeDasharray="8 6"
                    />
                    {/* Filled portion (progress) */}
                    <path
                        d="M 730 110 C 620 55 530 170 400 130 C 270 90 200 195 70 105"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                        strokeDasharray={`${progress * 820} 820`}
                        style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.7))' }}
                    />

                    {/* China dot */}
                    <circle cx="730" cy="110" r="8" fill="#10B981" opacity="0.9"
                        style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.8))' }} />
                    <text x="730" y="135" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="bold">🇨🇳</text>
                    <text x="730" y="152" textAnchor="middle" fill="#64748b" fontSize="10">China</text>

                    {/* Mid Pacific dot */}
                    <circle cx="400" cy="130" r="5" fill="rgba(16,185,129,0.4)"
                        stroke="rgba(16,185,129,0.6)" strokeWidth="1" />
                    <text x="400" y="155" textAnchor="middle" fill="#64748b" fontSize="10">Océano Pacífico</text>

                    {/* Colombia dot */}
                    <circle cx="70" cy="105" r="8" fill={arriving ? '#10B981' : 'rgba(16,185,129,0.35)'}
                        stroke="#10B981" strokeWidth="1.5" opacity={arriving ? '1' : '0.6'}
                        style={arriving ? { filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.8))' } : {}} />
                    <text x="70" y="128" textAnchor="middle" fill="#94a3b8" fontSize="13" fontWeight="bold">🇨🇴</text>
                    <text x="70" y="145" textAnchor="middle" fill="#64748b" fontSize="10">Colombia</text>

                    {/* Animated ship */}
                    <g transform={`translate(${shipX - 14}, ${shipY - 14})`}>
                        {/* Pulse ring */}
                        {atSea && (
                            <circle cx="14" cy="14" r="18" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5">
                                <animate attributeName="r" from="14" to="26" dur="1.8s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.7" to="0" dur="1.8s" repeatCount="indefinite" />
                            </circle>
                        )}
                        {/* Ship body */}
                        <rect x="2" y="8" width="24" height="12" rx="4" fill="#0f172a" stroke="#10B981" strokeWidth="1.5" />
                        {/* Mast */}
                        <rect x="11" y="2" width="2" height="8" fill="#10B981" opacity="0.8" />
                        {/* Flag */}
                        <path d="M 13 2 L 20 5 L 13 8 Z" fill="#10B981" opacity="0.9" />
                        {/* Hull */}
                        <path d="M 2 18 Q 14 24 26 18" fill="#10B981" opacity="0.3" />
                        {/* Wake trail */}
                        {[8, 14, 20].map((x, i) => (
                            <ellipse key={i} cx={26 + x} cy={16} rx={3 - i * 0.5} ry={1.5 - i * 0.3}
                                fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="0.8" />
                        ))}
                    </g>

                    {/* Distance label */}
                    <text x="400" y="100" textAnchor="middle" fill="rgba(16,185,129,0.5)" fontSize="9" fontStyle="italic">
                        ~16.000 km
                    </text>
                </svg>

                {/* Bottom info bar */}
                <div className="px-6 py-4 border-t border-white/5 bg-[#0A110F]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-sm text-slate-300 leading-relaxed">
                        <span className="text-[#10B981] font-bold">
                            {status === 'delivered' ? 'Ruta completada · '
                            : status === 'ready' ? 'En Colombia · '
                            : atSea ? 'En alta mar · '
                            : arriving ? 'Llegando a Colombia · '
                            : 'Puerto de origen · '}
                        </span>
                        {statusText}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/15">
                            <Ship className="w-3.5 h-3.5 text-[#10B981]" />
                            <span className="text-xs font-bold text-[#10B981]">
                                {Math.round(progress * 100)}% del trayecto
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Delivery Photo Section (role-aware) ──────────────────────────────────────

function DeliveryPhotoSection({ order, userRole }: { order: Order; userRole: string }) {
    const [uploading, setUploading] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>((order as any).deliveryPhotoUrl || null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const canUpload = userRole === 'admin' || userRole === 'super_admin';

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadError(null);
        try {
            const updated = await orderService.uploadDeliveryPhoto(order.id, file);
            setPhotoUrl((updated as any).deliveryPhotoUrl || URL.createObjectURL(file));
        } catch {
            setPhotoUrl(URL.createObjectURL(file));
            setUploadError('No se pudo guardar en el servidor, se muestra localmente.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-[#15201D] border border-white/5 shadow-2xl rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-1">
                <PartyPopper className="w-4 h-4 text-[#10B981]" />
                <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Entrega</h3>
            </div>
            <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Foto de Entrega</h2>

            {photoUrl ? (
                <div className="flex flex-col items-center gap-5">
                    <div className="w-full max-w-lg rounded-2xl overflow-hidden border border-[#10B981]/20 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
                        <img src={photoUrl} alt="Foto de entrega" className="w-full object-cover" />
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-extrabold text-white mb-1">¡Felicitaciones!</p>
                        <p className="text-sm text-slate-400">Tu vehículo ha sido entregado exitosamente. Gracias por confiar en Elemotor.</p>
                    </div>
                    {/* Admin can replace the photo */}
                    {canUpload && (
                        <div className="flex flex-col items-center gap-2">
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-400 border border-white/10 rounded-xl hover:text-white hover:border-white/20 transition-colors"
                            >
                                <Upload className="w-3.5 h-3.5" />
                                {uploading ? 'Subiendo...' : 'Reemplazar foto'}
                            </button>
                            {uploadError && <p className="text-xs text-amber-400">{uploadError}</p>}
                        </div>
                    )}
                </div>
            ) : canUpload ? (
                /* Admin/asesor: upload form */
                <div className="flex flex-col items-center gap-4 py-6">
                    <div className="w-20 h-20 rounded-full bg-[#10B981]/10 border-2 border-dashed border-[#10B981]/40 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-[#10B981]/60" />
                    </div>
                    <div className="text-center">
                        <p className="text-white font-semibold mb-1">Cargar foto de entrega</p>
                        <p className="text-sm text-slate-400">Sube la foto del momento de entrega al cliente</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#10B981] text-[#0A110F] font-bold rounded-xl hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Subiendo...</> : <><Upload className="w-4 h-4" /> Subir foto de entrega</>}
                    </button>
                    {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
                </div>
            ) : (
                /* Client: waiting for photo */
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-slate-800/50 border-2 border-dashed border-slate-700 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-slate-600" />
                    </div>
                    <div>
                        <p className="text-slate-300 font-semibold mb-1">Foto de entrega pendiente</p>
                        <p className="text-sm text-slate-500">Nuestro equipo subirá la foto cuando haga entrega oficial de tu vehículo.</p>
                    </div>
                </div>
            )}
        </div>
    );
}


// ─── Review Section (client only) ────────────────────────────────────────────

function ReviewSection({ order, userName }: { order: Order; userName: string }) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState('');
    const [name, setName] = useState(userName);
    const [photo, setPhoto] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('comment', comment);
            formData.append('rating', String(rating));
            formData.append('orderId', String(order.id));
            if (photo) formData.append('photo', photo);
            await fetchApi('/api/testimonials', { method: 'POST', body: formData });
            setSubmitted(true);
        } catch {
            setSubmitError('No se pudo publicar tu reseña. Inténtalo de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-[#15201D] border border-white/5 shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col items-center text-center gap-4 py-10">
                <div className="w-16 h-16 rounded-full bg-[#10B981]/15 border-2 border-[#10B981]/40 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
                </div>
                <p className="text-xl font-bold text-white">¡Reseña publicada!</p>
                <p className="text-sm text-slate-400 max-w-xs">Tu opinión aparecerá en nuestra sección de testimonios. ¡Gracias!</p>
                {submitError && <p className="text-xs text-amber-400">{submitError}</p>}
            </div>
        );
    }

    return (
        <div className="bg-[#15201D] border border-white/5 shadow-2xl rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-[#10B981]" />
                <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Tu Opinión</h3>
            </div>
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Deja tu Reseña</h2>
            <p className="text-sm text-slate-400 mb-6">Tu reseña se publicará en la sección de testimonios del sitio.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Stars */}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Calificación</label>
                    <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHovered(star)}
                                onMouseLeave={() => setHovered(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star className={`w-8 h-8 transition-colors duration-150 ${
                                    star <= (hovered || rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600 fill-transparent'
                                }`} />
                            </button>
                        ))}
                        {rating > 0 && (
                            <span className="ml-2 text-sm font-semibold text-amber-400">
                                {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][rating]}
                            </span>
                        )}
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tu nombre</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required
                        className="w-full bg-[#0A110F] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#10B981]/50 transition-colors"
                        placeholder="Tu nombre" />
                </div>

                {/* Photo */}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Foto de entrega (opcional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => setPhoto(e.target.files?.[0] ?? null)}
                        className="w-full text-sm text-slate-400 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#10B981]/10 file:text-[#10B981] hover:file:bg-[#10B981]/20 file:transition-colors cursor-pointer"
                    />
                    {photo && (
                        <img
                            src={URL.createObjectURL(photo)}
                            alt="Vista previa"
                            className="mt-2 w-16 h-16 rounded-xl object-cover border border-white/10"
                        />
                    )}
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Comentario</label>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} rows={4}
                        className="w-full bg-[#0A110F] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#10B981]/50 transition-colors resize-none"
                        placeholder="Cuéntanos tu experiencia con Elemotor y tu nuevo vehículo..." />
                </div>

                {submitError && <p className="text-xs text-red-400">{submitError}</p>}

                <button type="submit" disabled={submitting || rating === 0}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#10B981] text-[#0A110F] font-bold rounded-xl hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Publicando...</> : <><Send className="w-4 h-4" /> Publicar reseña</>}
                </button>
            </form>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RastreoPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [sessionName, setSessionName] = useState('');
    const [userRole, setUserRole] = useState('client');

    useEffect(() => {
        getSession().then((s) => {
            if (s?.user?.name) setSessionName(s.user.name);
            if ((s?.user as any)?.role) setUserRole((s?.user as any).role);
        });
    }, []);

    const fetchMyOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await orderService.fetchMyOrders({ includeDetails: true });
            const list = Array.isArray(response) ? response : response.data || [];
            setOrders(list.length > 0 ? [list[0]] : []);
        } catch (err: unknown) {
            setError((err as Error).message || 'Error al cargar tus pedidos');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchMyOrders(); }, []);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin text-[#10B981] mb-4" />
                <p className="font-medium">Cargando la información de tu vehículo...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 max-w-md mx-auto text-center px-6">
                <AlertCircle className="w-12 h-12 text-red-500/50 mb-4" />
                <h3 className="text-white font-bold text-lg mb-2">Ups, algo salió mal</h3>
                <p className="text-sm mb-6">{error}</p>
                <button onClick={fetchMyOrders} className="px-6 py-2.5 bg-[#10B981] text-[#0A110F] font-bold rounded-xl hover:bg-emerald-400 transition-colors">
                    Reintentar
                </button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 max-w-md mx-auto text-center px-6">
                <Package className="w-12 h-12 text-slate-700 mb-4" />
                <h3 className="text-white font-bold text-lg mb-2">No tienes pedidos activos</h3>
                <p className="text-sm mb-8">Aún no hemos registrado ningún pedido para tu cuenta.</p>
                <Link href="/dashboard" className="px-6 py-2.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                    Volver al Dashboard
                </Link>
            </div>
        );
    }

    const order = orders[0];
    const currentStatusIndex = STATUS_MAP[order.status] || 1;
    const progressPercent = Math.round((currentStatusIndex / 7) * 100);
    const vehicleImages = order?.trim?.images && order.trim.images.length > 0
        ? order.trim.images.map((img: { url: string; public_url?: string }) => img.public_url || img.url || '/placeholder.jpg')
        : ['/placeholder.jpg'];

    const isClient = userRole === 'client';

    return (
        <div className="min-h-full max-w-7xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm font-medium">
                    <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Dashboard
                    </Link>
                    <span className="text-slate-600">|</span>
                    <span className="text-[#10B981] flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        {order.trim?.model?.brand?.name || 'Elemotor'}
                    </span>
                </div>
                <button onClick={fetchMyOrders}
                    className="flex items-center gap-2 px-4 py-2 bg-[#15201D] border border-white/5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" /> Actualizar
                </button>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
                {/* Left card — Order status */}
                <div className="bg-[#15201D] border border-white/5 shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-slate-400" />
                        <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Rastreo de Pedido</h3>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">Estado de tu Pedido</h2>

                    <div className="mb-6">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Código de rastreo</p>
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-950/40 border border-[#10B981]/20 text-[#10B981] font-mono text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            {order.trackingCode}
                        </div>
                    </div>

                    {/* Vehicle carousel */}
                    <div className="w-full h-[220px] bg-gradient-to-b from-slate-900/50 to-slate-950 rounded-xl relative mb-8 overflow-hidden border border-white/5 group/carousel">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/40 via-[#0A110F] to-[#0A110F] z-0" />
                        <img
                            src={vehicleImages[currentImageIndex]}
                            alt={order.trim?.model?.name || 'Vehículo'}
                            className="w-full h-full object-contain p-4 drop-shadow-2xl z-10 hover:scale-105 transition-transform duration-700 relative"
                        />
                        {vehicleImages.length > 1 && (
                            <>
                                <button onClick={() => setCurrentImageIndex(p => p === 0 ? vehicleImages.length - 1 : p - 1)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-[#10B981] transition-all backdrop-blur-md border border-white/10 z-20">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button onClick={() => setCurrentImageIndex(p => p === vehicleImages.length - 1 ? 0 : p + 1)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover/carousel:opacity-100 hover:bg-[#10B981] transition-all backdrop-blur-md border border-white/10 z-20">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/30 px-2 py-1 rounded-full backdrop-blur-md">
                                    {vehicleImages.map((_: string, idx: number) => (
                                        <button key={idx} onClick={() => setCurrentImageIndex(idx)}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${currentImageIndex === idx ? 'w-4 bg-[#10B981]' : 'w-1.5 bg-white/40'}`} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-4 mb-10">
                        <div className="flex items-center justify-between pb-4 border-b border-white/5">
                            <span className="text-xs font-bold text-slate-500 tracking-wider">MODELO</span>
                            <span className="text-sm font-bold text-white">{order.trim?.model?.name || (order as any).vehicleModel || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between pb-4 border-b border-white/5">
                            <span className="text-xs font-bold text-slate-500 tracking-wider">VIN</span>
                            <span className="text-sm font-medium text-slate-400">{order.vin || 'Pendiente de asignación'}</span>
                        </div>
                    </div>

                    <div className="bg-[#0A110F] rounded-xl p-5 border border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase flex-1">Progreso General</span>
                            <span className="text-sm font-bold text-[#10B981]">{progressPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-4">
                            <div className="h-full bg-[#10B981] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{STEP_DESCRIPTIONS[currentStatusIndex - 1]}</p>
                    </div>
                </div>

                {/* Right card — Detailed timeline */}
                <div className="bg-[#15201D] border border-white/5 shadow-2xl rounded-2xl p-6 md:p-10">
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Seguimiento detallado</h2>
                    <p className="text-sm text-slate-400 mb-10">Historial completo de movimientos de tu pedido</p>

                    <div className="relative ml-2 md:ml-4 space-y-8 md:space-y-10">
                        <div className="absolute top-0 bottom-0 left-[19px] md:left-[21px] w-0.5 bg-slate-800/60 z-0" />
                        {STEP_TITLES.map((title, index) => {
                            const stepIndex = index + 1;
                            const Icon = getStatusIcon(index);
                            const isCompleted = stepIndex < currentStatusIndex;
                            const isCurrent = stepIndex === currentStatusIndex;
                            const historyEntry = order.statusHistory?.find((h) => STATUS_MAP[h.status] === stepIndex);
                            const dateStr = historyEntry ? new Date(historyEntry.date).toLocaleString('es-CO', {
                                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            }) : '';

                            if (isCompleted) return (
                                <div key={index} className="relative flex items-start gap-4 md:gap-5 z-10">
                                    <div className="shrink-0 w-10 md:w-11 h-10 md:h-11 rounded-full bg-[#0A110F] border-2 border-[#10B981] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                        <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                                    </div>
                                    <div className="flex flex-col pt-1">
                                        <h4 className="text-[#10B981] font-bold text-base mb-1">{title}</h4>
                                        <p className="text-sm text-slate-300 mb-2">{STEP_DESCRIPTIONS[index]}</p>
                                        {dateStr && <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" /> {dateStr}</span>}
                                    </div>
                                </div>
                            );

                            if (isCurrent) return (
                                <div key={index} className="relative flex items-start gap-4 md:gap-5 z-10">
                                    <div className="shrink-0 w-10 md:w-11 h-10 md:h-11 rounded-full bg-[#10B981]/10 border-2 border-teal-400 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.3)] relative">
                                        <Icon className="w-5 h-5 text-teal-400" />
                                        <div className="absolute inset-0 rounded-full border-2 border-teal-400 animate-ping opacity-20" />
                                    </div>
                                    <div className="flex flex-col pt-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-1">
                                            <h4 className="text-white font-bold text-lg">{title}</h4>
                                            <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> Estado Actual
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">{STEP_DESCRIPTIONS[index]}</p>
                                    </div>
                                </div>
                            );

                            return (
                                <div key={index} className="relative flex items-start gap-4 md:gap-5 opacity-30 z-10">
                                    <div className="shrink-0 w-10 md:w-11 h-10 md:h-11 rounded-full bg-[#0A110F] border-2 border-slate-700 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div className="flex flex-col pt-1">
                                        <h4 className="text-slate-400 font-bold text-base mb-1">{title}</h4>
                                        <p className="text-sm text-slate-400">{STEP_DESCRIPTIONS[index]}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Ship route — desde puerto de origen hasta entrega */}
            {['port_origin', 'transit', 'customs', 'nationalization', 'ready', 'delivered'].includes(order.status) && (
                <ShipRouteSection status={order.status} />
            )}

            {/* Delivered sections */}
            {order.status === 'delivered' && (
                <div className="space-y-6">
                    {/* Delivery photo — admin/asesor upload, client views */}
                    <DeliveryPhotoSection order={order} userRole={userRole} />

                    {/* Review — client only */}
                    {isClient && (
                        <ReviewSection order={order} userName={sessionName} />
                    )}
                </div>
            )}
        </div>
    );
}
