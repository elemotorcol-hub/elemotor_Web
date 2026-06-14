'use client';

import React, { useEffect, useState } from 'react';
import {
    X, Save, Car, Loader2, Download, User, Mail, Phone,
    MapPin, Hash, Zap, Clock, CheckCircle2, Circle, AlertCircle,
    Package, Truck, Shield, Flag, Star, FileText, Calendar,
    ChevronRight, ExternalLink, FolderOpen, Upload, Eye, Trash2
} from 'lucide-react';
import { Order, OrderStatus, OrderStatusHistory } from '@/types/orders';
import { orderService } from '@/services/order.service';
import { documentService, DocumentType, Document as OrderDocument } from '@/services/document.service';

interface OrderSlideOverProps {
    onClose: () => void;
    mode: 'add' | 'edit';
    initialData?: Order | null;
    onSave: (data: Partial<Order>) => void;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_PIPELINE: OrderStatus[] = [
    'confirmed',
    'port_origin',
    'transit',
    'customs',
    'nationalization',
    'ready',
    'delivered',
];

const STATUS_CONFIG: Record<OrderStatus, {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    dotColor: string;
    icon: React.ReactNode;
}> = {
    confirmed: {
        label: 'Pedido Confirmado',
        color: 'text-slate-300',
        bgColor: 'bg-slate-500/15',
        borderColor: 'border-slate-500/30',
        dotColor: 'bg-slate-400',
        icon: <CheckCircle2 size={14} />,
    },
    port_origin: {
        label: 'En Puerto de Origen',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/15',
        borderColor: 'border-blue-500/30',
        dotColor: 'bg-blue-400',
        icon: <Flag size={14} />,
    },
    transit: {
        label: 'En Tránsito',
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/15',
        borderColor: 'border-cyan-500/30',
        dotColor: 'bg-cyan-400',
        icon: <Truck size={14} />,
    },
    customs: {
        label: 'En Aduanas',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/15',
        borderColor: 'border-yellow-500/30',
        dotColor: 'bg-yellow-400',
        icon: <Shield size={14} />,
    },
    nationalization: {
        label: 'Nacionalización',
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/15',
        borderColor: 'border-purple-500/30',
        dotColor: 'bg-purple-400',
        icon: <Star size={14} />,
    },
    ready: {
        label: 'Listo para Entrega',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/15',
        borderColor: 'border-emerald-500/30',
        dotColor: 'bg-emerald-400',
        icon: <Package size={14} />,
    },
    delivered: {
        label: 'Entregado',
        color: 'text-green-400',
        bgColor: 'bg-green-500/15',
        borderColor: 'border-green-500/30',
        dotColor: 'bg-green-400',
        icon: <CheckCircle2 size={14} />,
    },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso?: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-CO', {
        year: 'numeric', month: 'short', day: 'numeric',
    });
}

function formatDateTime(iso?: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('es-CO', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

function formatCurrency(amount?: number): string {
    if (!amount) return '—';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <h3 className="flex items-center gap-2 text-[11px] font-black tracking-widest text-[#00D4AA] uppercase mb-4">
            {icon}
            {title}
        </h3>
    );
}

function InfoRow({ label, value, mono = false }: { label: string; value?: React.ReactNode; mono?: boolean }) {
    return (
        <div className="flex justify-between items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
            <span className="text-xs text-slate-500 flex-shrink-0">{label}</span>
            <span className={`text-xs font-semibold text-slate-200 text-right ${mono ? 'font-mono' : ''}`}>
                {value ?? <span className="text-slate-600">—</span>}
            </span>
        </div>
    );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function OrderTimeline({ order, detailData }: { order: Order; detailData: any }) {
    const currentIndex = STATUS_PIPELINE.indexOf(order.status);
    // Prefer statusHistory from detailData (richer), fallback to order.statusHistory
    const history: OrderStatusHistory[] = detailData?.statusHistory ?? order.statusHistory ?? [];

    return (
        <div className="relative">
            {STATUS_PIPELINE.map((step, index) => {
                const cfg = STATUS_CONFIG[step];
                const isCompleted = index <= currentIndex;
                const isCurrent = index === currentIndex;
                const isLast = index === STATUS_PIPELINE.length - 1;
                const histEntry = history.find(h => h.status === step);

                return (
                    <div key={step} className="flex gap-3 relative">
                        {/* Vertical line */}
                        {!isLast && (
                            <div
                                className={`absolute left-[14px] top-7 bottom-[-16px] w-[2px] ${
                                    index < currentIndex ? 'bg-[#10B981]/60' : 'bg-white/[0.06]'
                                }`}
                            />
                        )}

                        {/* Dot */}
                        <div className="flex-shrink-0 mt-0.5">
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                    isCurrent
                                        ? `${cfg.bgColor} border-2 ${cfg.borderColor} ${cfg.color}`
                                        : isCompleted
                                        ? 'bg-[#10B981]/20 border-2 border-[#10B981]/50 text-[#10B981]'
                                        : 'bg-white/[0.04] border-2 border-white/[0.08] text-slate-600'
                                }`}
                            >
                                {isCompleted ? <CheckCircle2 size={13} strokeWidth={2.5} /> : <Circle size={13} strokeWidth={1.5} />}
                            </div>
                        </div>

                        {/* Content */}
                        <div className={`flex-1 pb-5 ${isLast ? 'pb-0' : ''}`}>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span
                                    className={`text-[13px] font-bold leading-tight ${
                                        isCurrent ? cfg.color : isCompleted ? 'text-white' : 'text-slate-600'
                                    }`}
                                >
                                    {cfg.label}
                                </span>
                                {isCurrent && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bgColor} ${cfg.color} border ${cfg.borderColor}`}>
                                        ACTUAL
                                    </span>
                                )}
                            </div>

                            {histEntry?.date && (
                                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                    <Clock size={10} />
                                    {formatDateTime(histEntry.date)}
                                </p>
                            )}

                            {!histEntry && isCurrent && order.updatedAt && (
                                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                    <Clock size={10} />
                                    {formatDateTime(order.updatedAt)}
                                </p>
                            )}

                            {histEntry?.description && (
                                <p className="text-[12px] text-slate-400 mt-1 leading-snug bg-white/[0.03] rounded-lg px-2 py-1.5 border border-white/[0.05]">
                                    {histEntry.description}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Related Quotes ───────────────────────────────────────────────────────────

const QUOTE_STATUS_LABELS: Record<string, { label: string; cls: string }> = {
    pending:      { label: 'Pendiente',    cls: 'text-slate-400 bg-slate-400/10 border-slate-400/20' },
    contacted:    { label: 'Contactado',   cls: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
    responded:    { label: 'Respondida',   cls: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' },
    negotiation:  { label: 'Negociación',  cls: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
    closed_won:   { label: 'Ganada',       cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
    closed_lost:  { label: 'Perdida',      cls: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

function RelatedQuotes({ quotes }: { quotes: any[] }) {
    if (!quotes || quotes.length === 0) {
        return (
            <p className="text-xs text-slate-600 text-center py-4">
                No hay cotizaciones relacionadas
            </p>
        );
    }

    return (
        <div className="space-y-2">
            {quotes.map((q: any) => {
                const s = QUOTE_STATUS_LABELS[q.status] ?? { label: q.status, cls: 'text-slate-400 bg-slate-400/10 border-slate-400/20' };
                return (
                    <div key={q.id} className="flex items-center justify-between gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5">
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-mono font-bold text-[#00D4AA] truncate">
                                {q.referenceCode ?? `#${q.id}`}
                            </span>
                            <span className="text-[11px] text-slate-500 truncate">
                                {q.model?.name ?? q.modelInterest ?? 'Sin modelo'}{q.trim?.name ? ` — ${q.trim.name}` : ''}
                            </span>
                            {q.budgetRange && (
                                <span className="text-[11px] text-slate-400">{formatCurrency(q.budgetRange)}</span>
                            )}
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.cls}`}>
                                {s.label}
                            </span>
                            <span className="text-[10px] text-slate-600">{formatDate(q.createdAt)}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── PDF Generator ────────────────────────────────────────────────────────────

async function downloadOrderPDF(order: Order, detailData: any) {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const history: OrderStatusHistory[] = detailData?.statusHistory ?? order.statusHistory ?? [];
    const clientName = order.user?.name || order.clientName || 'Sin nombre';
    const vehicle = [
        order.trim?.model?.brand?.name,
        order.trim?.model?.name,
        order.trim?.name,
    ].filter(Boolean).join(' ') || order.vehicleModel || 'Sin vehículo';

    let y = 20;
    const left = 20;
    const pageW = 210;

    // Header bar
    doc.setFillColor(0, 212, 170);
    doc.rect(0, 0, pageW, 12, 'F');
    doc.setFontSize(8);
    doc.setTextColor(10, 17, 15);
    doc.setFont('helvetica', 'bold');
    doc.text('ELEMOTOR — Historial de Pedido', left, 8);
    doc.text(new Date().toLocaleDateString('es-CO'), pageW - left, 8, { align: 'right' });

    y = 24;

    // Title
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(13, 17, 23);
    doc.rect(0, 12, pageW, 285, 'F');
    doc.text('Historial del Pedido', left, y);
    y += 7;

    doc.setFontSize(10);
    doc.setTextColor(0, 212, 170);
    doc.setFont('helvetica', 'normal');
    doc.text(order.trackingCode || '—', left, y);
    y += 10;

    // Cliente / Vehículo
    doc.setFontSize(9);
    doc.setTextColor(150, 160, 180);
    doc.text(`Cliente: `, left, y);
    doc.setTextColor(220, 230, 240);
    doc.text(clientName, left + 18, y);
    y += 6;

    doc.setTextColor(150, 160, 180);
    doc.text(`Vehículo: `, left, y);
    doc.setTextColor(220, 230, 240);
    doc.text(vehicle, left + 20, y);
    y += 6;

    if (order.color?.name) {
        doc.setTextColor(150, 160, 180);
        doc.text(`Color: `, left, y);
        doc.setTextColor(220, 230, 240);
        doc.text(order.color.name, left + 13, y);
        y += 6;
    }

    if (order.vin) {
        doc.setTextColor(150, 160, 180);
        doc.text(`VIN: `, left, y);
        doc.setTextColor(220, 230, 240);
        doc.text(order.vin, left + 10, y);
        y += 6;
    }

    doc.setTextColor(150, 160, 180);
    doc.text(`Fecha de creación: `, left, y);
    doc.setTextColor(220, 230, 240);
    doc.text(formatDate(order.createdAt), left + 40, y);
    y += 6;

    if (order.estimatedDelivery) {
        doc.setTextColor(150, 160, 180);
        doc.text(`Entrega estimada: `, left, y);
        doc.setTextColor(220, 230, 240);
        doc.text(formatDate(order.estimatedDelivery), left + 38, y);
        y += 6;
    }

    y += 6;

    // Separator
    doc.setDrawColor(40, 60, 50);
    doc.setLineWidth(0.3);
    doc.line(left, y, pageW - left, y);
    y += 8;

    // Timeline section header
    doc.setFontSize(10);
    doc.setTextColor(0, 212, 170);
    doc.setFont('helvetica', 'bold');
    doc.text('HISTORIAL DE ESTADOS', left, y);
    y += 8;

    const currentIndex = STATUS_PIPELINE.indexOf(order.status);

    STATUS_PIPELINE.forEach((step, index) => {
        const cfg = STATUS_CONFIG[step];
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const histEntry = history.find(h => h.status === step);

        // Bullet
        doc.setFillColor(isCompleted ? 16 : 40, isCompleted ? 185 : 50, isCompleted ? 129 : 40);
        doc.circle(left + 2, y - 1, 2, 'F');

        doc.setFontSize(9);
        doc.setFont('helvetica', isCurrent ? 'bold' : 'normal');
        doc.setTextColor(isCompleted ? 220 : 100, isCompleted ? 230 : 110, isCompleted ? 240 : 120);
        doc.text(cfg.label + (isCurrent ? ' (ACTUAL)' : ''), left + 7, y);

        if (histEntry?.date) {
            doc.setFontSize(8);
            doc.setTextColor(120, 130, 145);
            doc.setFont('helvetica', 'normal');
            doc.text(formatDateTime(histEntry.date), left + 7, y + 4);
            y += 4;
        }

        if (histEntry?.description) {
            doc.setFontSize(8);
            doc.setTextColor(160, 170, 185);
            const lines = doc.splitTextToSize(histEntry.description, pageW - left * 2 - 10) as string[];
            lines.forEach((line: string) => {
                y += 4;
                doc.text(line, left + 7, y);
            });
        }

        y += 8;

        if (y > 270) {
            doc.addPage();
            doc.setFillColor(13, 17, 23);
            doc.rect(0, 0, pageW, 297, 'F');
            y = 20;
        }
    });

    if (order.notes) {
        y += 4;
        doc.setDrawColor(40, 60, 50);
        doc.line(left, y, pageW - left, y);
        y += 8;

        doc.setFontSize(10);
        doc.setTextColor(0, 212, 170);
        doc.setFont('helvetica', 'bold');
        doc.text('NOTAS INTERNAS', left, y);
        y += 6;

        doc.setFontSize(9);
        doc.setTextColor(180, 190, 205);
        doc.setFont('helvetica', 'normal');
        const noteLines = doc.splitTextToSize(order.notes, pageW - left * 2) as string[];
        noteLines.forEach((line: string) => {
            doc.text(line, left, y);
            y += 5;
        });
    }

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(60, 80, 70);
    doc.text(`Generado por ELEMOTOR Admin — ${new Date().toLocaleString('es-CO')}`, left, 290);

    doc.save(`pedido-${order.trackingCode || order.id}-historial.pdf`);
}

// ─── ADD MODE form ────────────────────────────────────────────────────────────

function AddOrderForm({ onClose, onSave }: { onClose: () => void; onSave: (data: Partial<Order>) => void }) {
    const [users, setUsers] = useState<any[]>([]);
    const [trims, setTrims] = useState<any[]>([]);
    const [colors, setColors] = useState<any[]>([]);
    const [loadingCats, setLoadingCats] = useState(true);

    const [userId, setUserId] = useState<number | ''>('');
    const [trimId, setTrimId] = useState<number | ''>('');
    const [colorId, setColorId] = useState<number | ''>('');
    const [estimatedDelivery, setEstimatedDelivery] = useState('');
    const [vin, setVin] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const [usersRes, trimsRes] = await Promise.all([
                    orderService.fetchUsers(),
                    orderService.fetchTrims(),
                ]);
                setUsers(usersRes.data || []);
                setTrims(trimsRes.data || []);
            } catch {
                setError('No se pudieron cargar los catálogos');
            } finally {
                setLoadingCats(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (!userId) return;
        const selectedUser = users.find((u: any) => u.id === Number(userId));
        if (!selectedUser?.email) return;
        orderService.fetchWonQuoteByEmail(selectedUser.email).then(quote => {
            if (quote?.trim?.id) setTrimId(quote.trim.id);
        }).catch(() => {});
    }, [userId, users]);

    useEffect(() => {
        if (!trimId) { setColors([]); setColorId(''); return; }
        orderService.fetchColorsByTrim(Number(trimId)).then(async data => {
            if (Array.isArray(data) && data.length > 0) {
                setColors(data);
            } else {
                const all = await orderService.fetchAllColors();
                setColors(all);
            }
        }).catch(() => setColors([]));
        setColorId('');
    }, [trimId]);

    const inputCls = 'w-full bg-[#0A110F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#00D4AA] transition-colors';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!trimId || !colorId) { setError('Versión y color son obligatorios.'); return; }
        setSubmitting(true);
        try {
            const payload: Record<string, any> = { trimId: Number(trimId), colorId: Number(colorId) };
            if (userId) payload.userId = Number(userId);
            if (vin.trim()) payload.vin = vin.trim();
            if (notes.trim()) payload.notes = notes.trim();
            if (estimatedDelivery) payload.estimatedDelivery = estimatedDelivery;
            await orderService.createOrder(payload as any);
            onSave({});
        } catch (err: any) {
            setError(err.message || 'Error al crear pedido');
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="fixed inset-y-0 right-0 z-50 w-full md:w-[480px] bg-[#0A110F] shadow-2xl border-l border-slate-800/60 flex flex-col">
            <div className="flex-shrink-0 px-8 py-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                    <h2 className="text-[20px] font-bold text-white tracking-tight">Nuevo Pedido</h2>
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-[#0A110F] px-4 py-2 rounded-lg font-bold text-[13px] transition-all"
                >
                    {submitting ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    Crear
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
                )}

                {loadingCats ? (
                    <div className="flex items-center justify-center py-16 text-slate-500">
                        <Loader2 className="animate-spin w-6 h-6 mr-2" /> Cargando catálogos...
                    </div>
                ) : (
                    <>
                        <div className="bg-[#15201D] border border-white/5 rounded-2xl p-6 space-y-4">
                            <h3 className="text-[11px] font-black tracking-widest text-[#00D4AA] uppercase flex items-center gap-2">
                                <Car size={13} /> Asignación del Pedido
                            </h3>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2">Cliente</label>
                                <select value={userId} onChange={e => setUserId(Number(e.target.value))} className={inputCls}>
                                    <option value="">Selecciona un cliente</option>
                                    {users.map((u: any) => (
                                        <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2">Versión del Vehículo *</label>
                                <select value={trimId} onChange={e => setTrimId(Number(e.target.value))} required className={inputCls}>
                                    <option value="">Selecciona una versión</option>
                                    {trims.map((t: any) => (
                                        <option key={t.id} value={t.id}>{t.model?.brand?.name} {t.model?.name} — {t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2">Color *</label>
                                <select value={colorId} onChange={e => setColorId(Number(e.target.value))} required disabled={!trimId} className={`${inputCls} disabled:opacity-40`}>
                                    <option value="">{trimId ? 'Selecciona un color' : 'Primero elige una versión'}</option>
                                    {colors.map((c: any) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="bg-[#15201D] border border-white/5 rounded-2xl p-6 space-y-4">
                            <h3 className="text-[11px] font-black tracking-widest text-[#00D4AA] uppercase">Detalles Adicionales</h3>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2">VIN (Chasis)</label>
                                <input type="text" value={vin} onChange={e => setVin(e.target.value)} placeholder="17 caracteres — dejar vacío si no aplica" maxLength={17} className={`${inputCls} font-mono`} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2">Fecha Estimada de Entrega</label>
                                <input type="date" value={estimatedDelivery} onChange={e => setEstimatedDelivery(e.target.value)} className={inputCls} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2">Notas Internas</label>
                                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Observaciones internas sobre el pedido..." className={`${inputCls} resize-none`} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </form>
    );
}

// ─── Admin Documents Section ──────────────────────────────────────────────────

const DOC_TYPE_LABELS: Record<string, string> = {
    invoice: 'Factura', soat: 'SOAT', import_cert: 'Cert. importación',
    property_card: 'Tarjeta de propiedad', manual: 'Manual', other: 'Otro',
};

function AdminDocumentsSection({ orderId }: { orderId: number }) {
    const [docs, setDocs] = React.useState<OrderDocument[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [uploading, setUploading] = React.useState(false);
    const [uploadError, setUploadError] = React.useState<string | null>(null);
    const [showForm, setShowForm] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [docName, setDocName] = React.useState('');
    const [docType, setDocType] = React.useState<DocumentType>(DocumentType.OTHER);
    const [deletingId, setDeletingId] = React.useState<number | null>(null);
    const fileRef = React.useRef<HTMLInputElement>(null);

    const load = async () => {
        setLoading(true);
        try {
            const data = await documentService.fetchOrderDocuments(orderId);
            setDocs(Array.isArray(data) ? data : []);
        } catch { setDocs([]); } finally { setLoading(false); }
    };

    React.useEffect(() => { load(); }, [orderId]);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setSelectedFile(f);
        setDocName(f.name.replace(/\.[^/.]+$/, ''));
        setShowForm(true);
    };

    const handleUpload = async () => {
        if (!selectedFile || !docName.trim()) return;
        setUploading(true);
        setUploadError(null);
        try {
            const doc = await documentService.uploadDocument({ file: selectedFile, orderId, type: docType, name: docName.trim() });
            setDocs(prev => [...prev, doc]);
            setShowForm(false);
            setSelectedFile(null);
            setDocName('');
            setDocType(DocumentType.OTHER);
            if (fileRef.current) fileRef.current.value = '';
        } catch { setUploadError('No se pudo subir el archivo.'); } finally { setUploading(false); }
    };

    const handleDownload = async (doc: OrderDocument) => {
        try { const { downloadUrl } = await documentService.getDocumentUrls(doc.id); window.open(downloadUrl, '_blank'); }
        catch { window.open(doc.fileUrl, '_blank'); }
    };

    const handleDelete = async (doc: OrderDocument) => {
        if (!confirm(`¿Eliminar "${doc.name}"? Esta acción no se puede deshacer.`)) return;
        setDeletingId(doc.id);
        try {
            await documentService.deleteDocument(doc.id);
            setDocs(prev => prev.filter(d => d.id !== doc.id));
        } catch {
            alert('No se pudo eliminar el documento.');
        } finally {
            setDeletingId(null);
        }
    };

    const inputCls = 'bg-[#0d1117] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#00D4AA] transition-colors';

    return (
        <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
                <SectionHeader icon={<FolderOpen size={11} />} title="Documentos del Pedido" />
                <button
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 bg-[#10B981] hover:bg-emerald-400 text-[#0A110F] rounded-lg transition-colors"
                >
                    <Upload size={11} /> Subir
                </button>
            </div>

            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={handleFile} />

            {showForm && selectedFile && (
                <div className="mb-3 p-3 rounded-lg bg-[#0d1117] border border-[#10B981]/20 space-y-2">
                    <p className="text-[11px] text-slate-500 truncate">Archivo: <span className="text-slate-300">{selectedFile.name}</span></p>
                    <div className="flex gap-2">
                        <input value={docName} onChange={e => setDocName(e.target.value)} placeholder="Nombre" className={`${inputCls} flex-1`} />
                        <select value={docType} onChange={e => setDocType(e.target.value as DocumentType)} className={inputCls}>
                            {Object.values(DocumentType).map(t => <option key={t} value={t}>{DOC_TYPE_LABELS[t] ?? t}</option>)}
                        </select>
                    </div>
                    {uploadError && <p className="text-[11px] text-red-400">{uploadError}</p>}
                    <div className="flex gap-2">
                        <button onClick={handleUpload} disabled={uploading || !docName.trim()} className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 bg-[#10B981] hover:bg-emerald-400 disabled:opacity-40 text-[#0A110F] rounded-lg transition-colors">
                            {uploading ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />} {uploading ? 'Subiendo...' : 'Confirmar'}
                        </button>
                        <button onClick={() => { setShowForm(false); setSelectedFile(null); if (fileRef.current) fileRef.current.value = ''; }} className="text-[12px] text-slate-400 hover:text-white px-3 py-1.5 border border-white/10 rounded-lg transition-colors">
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-4"><Loader2 size={16} className="animate-spin text-slate-500" /></div>
            ) : docs.length === 0 ? (
                <p className="text-[12px] text-slate-600 text-center py-4">No hay documentos aún. Sube la factura, SOAT, etc.</p>
            ) : (
                <div className="space-y-1.5">
                    {docs.map(doc => (
                        <div key={doc.id} className="flex items-center gap-2 p-2 rounded-lg bg-[#0d1117] border border-white/[0.05] group hover:border-white/10 transition-colors">
                            <FileText size={13} className="text-slate-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] text-slate-200 font-medium truncate">{doc.name}</p>
                                <span className="text-[10px] text-slate-500">{DOC_TYPE_LABELS[doc.type] ?? doc.type} · {doc.uploadedBy === 'admin' ? 'Asesor' : 'Cliente'}</span>
                            </div>
                            <button onClick={() => handleDownload(doc)} title="Descargar" className="p-1.5 rounded text-slate-500 hover:text-white hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100">
                                <Download size={12} />
                            </button>
                            <button
                                onClick={() => handleDelete(doc)}
                                disabled={deletingId === doc.id}
                                title="Eliminar"
                                className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-40"
                            >
                                {deletingId === doc.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── EDIT MODE — full centered modal ─────────────────────────────────────────

function EditOrderDetail({ order, onClose, onSave }: { order: Order; onClose: () => void; onSave: (data: Partial<Order>) => void }) {
    const [detailData, setDetailData] = useState<any>(null);
    const [loadingDetail, setLoadingDetail] = useState(true);
    const [relatedQuotes, setRelatedQuotes] = useState<any[]>([]);
    const [vin, setVin] = useState(order.vin ?? '');
    const [notes, setNotes] = useState(order.notes ?? '');
    const [estimatedDelivery, setEstimatedDelivery] = useState(
        order.estimatedDelivery ? order.estimatedDelivery.slice(0, 10) : ''
    );
    const [submitting, setSubmitting] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const [linkEmail, setLinkEmail] = useState('');
    const [linking, setLinking] = useState(false);
    const [linkMsg, setLinkMsg] = useState<{ ok: boolean; text: string } | null>(null);
    const [linkedUserId, setLinkedUserId] = useState<number | null>((order as any).userId ?? null);

    useEffect(() => {
        (async () => {
            try {
                const detail = await orderService.getOrderDetailAdmin(order.id);
                setDetailData(detail);
                setVin(detail?.vin ?? order.vin ?? '');
                setNotes(detail?.notes ?? order.notes ?? '');
                setEstimatedDelivery(detail?.estimatedDelivery ? detail.estimatedDelivery.slice(0, 10) : order.estimatedDelivery ? order.estimatedDelivery.slice(0, 10) : '');
            } catch {
                setDetailData(null);
            } finally {
                setLoadingDetail(false);
            }
        })();
    }, [order.id]);

    useEffect(() => {
        const email = order.user?.email;
        if (!email) return;
        orderService.fetchWonQuoteByEmail(email)
            .then(q => { if (q) setRelatedQuotes([q]); })
            .catch(() => {});
    }, [order.user?.email]);

    const handleSave = async () => {
        setError(null);
        setSubmitting(true);
        try {
            await orderService.updateOrderDetails(order.id, {
                vin: vin.trim() || undefined,
                notes: notes.trim() || undefined,
                estimatedDelivery: estimatedDelivery || undefined,
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2500);
            onSave({});
        } catch (err: any) {
            setError(err.message || 'Error al guardar');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDownloadPdf = async () => {
        setGeneratingPdf(true);
        try { await downloadOrderPDF(detailData ?? order, detailData); }
        finally { setGeneratingPdf(false); }
    };

    const effectiveOrder = detailData ?? order;
    const clientName   = effectiveOrder.user?.name  || effectiveOrder.clientName || 'Sin nombre';
    const clientEmail  = effectiveOrder.user?.email;
    const clientPhone  = effectiveOrder.user?.phone;
    const brandName    = effectiveOrder.trim?.model?.brand?.name;
    const modelName    = effectiveOrder.trim?.model?.name;
    const trimName     = effectiveOrder.trim?.name;
    const colorName    = effectiveOrder.color?.name  || effectiveOrder.colorName;
    const colorHex     = effectiveOrder.color?.hexCode;
    const vehicleImage = effectiveOrder.trim?.images?.[0]?.public_url || effectiveOrder.trim?.images?.[0]?.url;
    const specs: any[] = effectiveOrder.trim?.specs ?? effectiveOrder.specs ?? [];
    const currentCfg   = STATUS_CONFIG[effectiveOrder.status as OrderStatus] ?? STATUS_CONFIG['confirmed'];

    const trimFallbackSpecs = (() => {
        const t = effectiveOrder.trim;
        if (!t) return [];
        return [
            { label: 'Autonomía',   value: t.range ?? t.autonomy },
            { label: 'Potencia',    value: t.power },
            { label: '0-100 km/h', value: t.acceleration },
            { label: 'Carga máx.', value: t.maxCharging },
            { label: 'Batería',    value: t.battery },
            { label: 'Tracción',   value: t.drivetrain },
            { label: 'Asientos',   value: t.seats },
        ].filter(r => r.value != null);
    })();

    const displaySpecs = specs.length > 0 ? specs : trimFallbackSpecs;

    const inputCls = 'w-full bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#00D4AA] transition-colors';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-6xl bg-[#0d1117] border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col max-h-[95dvh] overflow-hidden animate-in zoom-in-95 duration-300">

                {/* ── Top accent ── */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-[#00D4AA] to-transparent shrink-0" />

                {/* ── Header ── */}
                <div className="shrink-0 bg-[#111820] border-b border-white/[0.06] px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-white leading-tight truncate">
                                {brandName} {modelName}
                                {trimName && <span className="text-slate-400 font-normal text-base"> — {trimName}</span>}
                            </h2>
                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                <span className="font-mono text-xs text-[#00D4AA] bg-[#00D4AA]/10 border border-[#00D4AA]/20 px-2.5 py-0.5 rounded-full">
                                    {effectiveOrder.trackingCode}
                                </span>
                                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${currentCfg.bgColor} ${currentCfg.color} ${currentCfg.borderColor}`}>
                                    {currentCfg.icon} {currentCfg.label}
                                </span>
                                {effectiveOrder.totalPrice && (
                                    <span className="text-xs text-slate-400 font-semibold">{formatCurrency(effectiveOrder.totalPrice)}</span>
                                )}
                            </div>
                            {/* Client strip */}
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                                <span className="flex items-center gap-1.5 text-[12px] text-slate-300">
                                    <User size={11} className="text-slate-500" /> {clientName}
                                </span>
                                {clientEmail && (
                                    <span className="flex items-center gap-1.5 text-[12px] text-slate-400">
                                        <Mail size={11} className="text-slate-500" /> {clientEmail}
                                    </span>
                                )}
                                {clientPhone && (
                                    <span className="flex items-center gap-1.5 text-[12px] text-slate-400">
                                        <Phone size={11} className="text-slate-500" /> {clientPhone}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={handleDownloadPdf}
                                disabled={generatingPdf}
                                className="flex items-center gap-1.5 bg-white/[0.05] hover:bg-[#00D4AA]/10 hover:text-[#00D4AA] border border-white/[0.08] hover:border-[#00D4AA]/30 text-slate-400 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                            >
                                {generatingPdf ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                                PDF
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Body: two columns ── */}
                {loadingDetail ? (
                    <div className="flex items-center justify-center py-20 text-slate-500">
                        <Loader2 className="animate-spin w-5 h-5 mr-2" /> Cargando detalles...
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">

                        {/* ── LEFT column ── */}
                        <div className="w-full lg:w-[340px] shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.05] overflow-y-auto custom-scrollbar">

                            {/* Vehicle image */}
                            {vehicleImage && (
                                <div className="relative h-44 bg-[#0a0f0d] border-b border-white/[0.05]">
                                    <img
                                        src={vehicleImage}
                                        alt={`${brandName} ${modelName}`}
                                        className="w-full h-full object-contain p-4"
                                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                </div>
                            )}

                            <div className="p-5 space-y-5">
                                {/* Vehicle identity */}
                                <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-4">
                                    <SectionHeader icon={<Car size={11} />} title="Vehículo" />
                                    <InfoRow label="Marca"    value={brandName} />
                                    <InfoRow label="Modelo"   value={modelName} />
                                    <InfoRow label="Versión"  value={trimName} />
                                    <InfoRow label="Color" value={
                                        <span className="flex items-center gap-2">
                                            {colorHex && <span className="w-3 h-3 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: colorHex }} />}
                                            {colorName}
                                        </span>
                                    } />
                                    {effectiveOrder.vin && <InfoRow label="VIN" value={effectiveOrder.vin} mono />}
                                    {effectiveOrder.totalPrice && (
                                        <InfoRow label="Precio" value={<span className="text-[#00D4AA] font-bold">{formatCurrency(effectiveOrder.totalPrice)}</span>} />
                                    )}
                                </div>

                                {/* Specs */}
                                {displaySpecs.length > 0 && (
                                    <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-4">
                                        <SectionHeader icon={<Zap size={11} />} title="Especificaciones" />
                                        {displaySpecs.map((s: any, i: number) => (
                                            <InfoRow
                                                key={i}
                                                label={s.key ?? s.label ?? s.name ?? `Spec ${i + 1}`}
                                                value={s.value ?? s.val ?? String(s.value ?? '—')}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Client */}
                                <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-4">
                                    <SectionHeader icon={<User size={11} />} title="Cliente" />
                                    <InfoRow label="Nombre" value={clientName} />
                                    {clientEmail && <InfoRow label="Email"    value={clientEmail} />}
                                    {clientPhone && <InfoRow label="Teléfono" value={clientPhone} />}
                                    {(effectiveOrder.user?.address || effectiveOrder.user?.city) && (
                                        <InfoRow label="Ciudad" value={[effectiveOrder.user?.address, effectiveOrder.user?.city].filter(Boolean).join(', ')} />
                                    )}
                                    <InfoRow label="ID" value={String(linkedUserId ?? '—')} mono />
                                    {!linkedUserId && (
                                        <div className="mt-3 pt-3 border-t border-white/[0.05]">
                                            <p className="text-[10px] text-amber-400 font-semibold mb-2">Sin cuenta vinculada</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="email"
                                                    value={linkEmail}
                                                    onChange={e => { setLinkEmail(e.target.value); setLinkMsg(null); }}
                                                    placeholder="email@cliente.com"
                                                    className="flex-1 bg-[#0d1117] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#10B981]/50 transition-colors"
                                                />
                                                <button
                                                    disabled={linking || !linkEmail.trim()}
                                                    onClick={async () => {
                                                        setLinking(true);
                                                        setLinkMsg(null);
                                                        try {
                                                            const res = await orderService.linkUser(effectiveOrder.id, linkEmail.trim());
                                                            setLinkedUserId(res.userId);
                                                            setLinkMsg({ ok: true, text: res.message });
                                                            setLinkEmail('');
                                                        } catch (e: any) {
                                                            setLinkMsg({ ok: false, text: e.message || 'Error al vincular' });
                                                        } finally {
                                                            setLinking(false);
                                                        }
                                                    }}
                                                    className="px-3 py-1.5 bg-[#10B981] hover:bg-emerald-400 disabled:opacity-40 text-[#0A110F] font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
                                                >
                                                    {linking ? '...' : 'Vincular'}
                                                </button>
                                            </div>
                                            {linkMsg && (
                                                <p className={`text-[10px] mt-1.5 ${linkMsg.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {linkMsg.text}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Related quotes */}
                                <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-4">
                                    <SectionHeader icon={<Hash size={11} />} title="Cotizaciones Relacionadas" />
                                    <RelatedQuotes quotes={relatedQuotes} />
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT column ── */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">

                            {/* Key dates */}
                            <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-4">
                                <SectionHeader icon={<Calendar size={11} />} title="Fechas Clave" />
                                <InfoRow label="Fecha de pedido"       value={formatDate(effectiveOrder.createdAt)} />
                                <InfoRow label="Última actualización"  value={formatDate(effectiveOrder.updatedAt)} />
                                {effectiveOrder.estimatedDelivery && (
                                    <InfoRow label="Entrega estimada" value={
                                        <span className="text-[#00D4AA] font-bold">{formatDate(effectiveOrder.estimatedDelivery)}</span>
                                    } />
                                )}
                            </div>

                            {/* Timeline */}
                            <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-4">
                                <SectionHeader icon={<Clock size={11} />} title="Timeline de Trazabilidad" />
                                <OrderTimeline order={effectiveOrder} detailData={detailData} />
                            </div>

                            {/* Notes display */}
                            {effectiveOrder.notes && (
                                <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-4">
                                    <SectionHeader icon={<FileText size={11} />} title="Notas Internas" />
                                    <p className="text-[13px] text-slate-400 leading-relaxed">{effectiveOrder.notes}</p>
                                </div>
                            )}

                            {/* Edit fields */}
                            <div className="bg-[#161b22] border border-white/[0.06] rounded-xl p-4 space-y-4">
                                <SectionHeader icon={<Save size={11} />} title="Editar Detalles" />

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 text-sm text-red-400 flex items-center gap-2">
                                        <AlertCircle size={14} /> {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">VIN / Chasis</label>
                                        <input
                                            type="text"
                                            value={vin}
                                            onChange={e => setVin(e.target.value)}
                                            maxLength={17}
                                            placeholder="Opcional — 17 caracteres"
                                            className={`${inputCls} font-mono`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Entrega Estimada</label>
                                        <input
                                            type="date"
                                            value={estimatedDelivery}
                                            onChange={e => setEstimatedDelivery(e.target.value)}
                                            className={inputCls}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest">Notas Internas</label>
                                    <textarea
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                        rows={3}
                                        placeholder="Observaciones internas sobre el pedido..."
                                        className={`${inputCls} resize-none`}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={submitting}
                                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[14px] transition-all ${
                                        saveSuccess
                                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                                            : 'bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-[#0A110F] shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                                    }`}
                                >
                                    {submitting ? <Loader2 size={16} className="animate-spin" /> : saveSuccess ? <CheckCircle2 size={16} /> : <Save size={16} />}
                                    {submitting ? 'Guardando...' : saveSuccess ? '¡Guardado!' : 'Guardar Cambios'}
                                </button>
                            </div>

                            {/* Documentos del pedido */}
                            <AdminDocumentsSection orderId={Number(order.id)} />

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function OrderSlideOver({ onClose, mode, initialData, onSave }: OrderSlideOverProps) {
    if (mode === 'edit' && initialData) {
        // Edit uses its own centered modal with built-in backdrop
        return <EditOrderDetail order={initialData} onClose={onClose} onSave={onSave} />;
    }

    // Add mode keeps the slide-over style
    return (
        <>
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40" onClick={onClose} />
            {mode === 'add' && <AddOrderForm onClose={onClose} onSave={onSave} />}
        </>
    );
}
