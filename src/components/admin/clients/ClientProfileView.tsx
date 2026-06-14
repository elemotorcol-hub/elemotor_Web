'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    CheckCircle2,
    Wrench,
    FileText,
    Car,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    Calendar,
    Download,
    Loader2,
    Zap,
    Gauge,
    Battery,
    Timer,
    Hash,
    Activity,
} from 'lucide-react';
import { userService, type AdminClient } from '@/services/user.service';
import { orderService } from '@/services/order.service';
import { quoteService } from '@/services/quote.service';
import type { Quote } from '@/types/crm';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatusHistoryEntry {
    id: number;
    previousStatus: string | null;
    status: string;
    description: string | null;
    date: string;
    updatedBy: { id: number; name: string } | null;
}

interface MaintenanceEntry {
    id: number;
    date: string;
    type: string;
    rating: number | null;
    comment: string | null;
    cost: string | null;
    createdAt: string;
    workshop: { id: number; name: string } | null;
}

interface TrimSpec {
    key: string;
    value: string;
}

interface OrderDetail {
    id: number;
    trackingCode: string | null;
    status: string;
    vin: string | null;
    notes: string | null;
    estimatedDelivery: string | null;
    createdAt: string;
    user: { id: number; name: string; email: string; phone?: string | null };
    trim: {
        id: number;
        name: string;
        specs?: TrimSpec[];
        model: { id: number; name: string; brand: { id: number; name: string } };
    };
    color: { id: number; name: string; hexCode: string };
    statusHistory: StatusHistoryEntry[];
    maintenanceRecords: MaintenanceEntry[];
    documents: { id: number; type: string; name: string; fileUrl: string; uploadedBy: string; createdAt: string }[];
}

type TimelineEntry =
    | { kind: 'status'; sortDate: string } & StatusHistoryEntry
    | { kind: 'maintenance'; sortDate: string } & MaintenanceEntry
    | { kind: 'quote'; sortDate: string } & Quote;

// ─── Config ───────────────────────────────────────────────────────────────────

const ORDER_STATUS_LABELS: Record<string, string> = {
    confirmed: 'Pedido confirmado',
    port_origin: 'Puerto de origen',
    transit: 'En tránsito',
    customs: 'En aduana',
    nationalization: 'Nacionalización',
    ready: 'Listo para entrega',
    delivered: 'Entregado',
};

const ORDER_STATUS_COLORS: Record<string, string> = {
    confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    port_origin: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    transit: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    customs: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    nationalization: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    ready: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const QUOTE_STATUS_LABELS: Record<string, string> = {
    pending: 'Pendiente',
    contacted: 'Contactado',
    responded: 'Respondido',
    negotiation: 'En negociación',
    closed_won: 'Ganado',
    closed_lost: 'Perdido',
};

const QUOTE_STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    responded: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    negotiation: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    closed_won: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    closed_lost: 'bg-red-500/10 text-red-400 border-red-500/20',
};

// ─── Spec label map ───────────────────────────────────────────────────────────

const SPEC_ICONS: Record<string, React.ReactNode> = {
    autonomia: <Battery size={13} className="text-emerald-400" />,
    range: <Battery size={13} className="text-emerald-400" />,
    potencia: <Zap size={13} className="text-yellow-400" />,
    horsepower: <Zap size={13} className="text-yellow-400" />,
    'velocidad maxima': <Gauge size={13} className="text-cyan-400" />,
    '0-100': <Timer size={13} className="text-orange-400" />,
    bateria: <Battery size={13} className="text-blue-400" />,
    torque: <Activity size={13} className="text-purple-400" />,
};

function getSpecIcon(key: string) {
    const lower = key.toLowerCase();
    for (const [k, icon] of Object.entries(SPEC_ICONS)) {
        if (lower.includes(k)) return icon;
    }
    return <Hash size={13} className="text-slate-500" />;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildTimeline(detail: OrderDetail, quotes: Quote[]): TimelineEntry[] {
    const statusEntries: TimelineEntry[] = detail.statusHistory.map((s) => ({
        kind: 'status',
        sortDate: s.date,
        ...s,
    }));
    const maintenanceEntries: TimelineEntry[] = detail.maintenanceRecords.map((m) => ({
        kind: 'maintenance',
        sortDate: m.date,
        ...m,
    }));
    const quoteEntries: TimelineEntry[] = quotes.map((q) => ({
        kind: 'quote',
        sortDate: q.createdAt,
        ...q,
    }));
    return [...statusEntries, ...maintenanceEntries, ...quoteEntries].sort(
        (a, b) => new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime(),
    );
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function memberSince(iso: string) {
    const now = new Date();
    const from = new Date(iso);
    const months =
        (now.getFullYear() - from.getFullYear()) * 12 + (now.getMonth() - from.getMonth());
    if (months < 1) return 'este mes';
    if (months < 12) return `hace ${months} mes${months !== 1 ? 'es' : ''}`;
    const years = Math.floor(months / 12);
    return `hace ${years} año${years !== 1 ? 's' : ''}`;
}

function formatCurrency(value: string | number | null | undefined) {
    if (value === null || value === undefined) return null;
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return String(value);
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(num);
}

function getInitials(name: string) {
    return name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

// ─── PDF Generator ────────────────────────────────────────────────────────────

function generateClientPDF(
    client: AdminClient,
    orderDetails: OrderDetail[],
    quotes: Quote[],
) {
    const doc = new jsPDF();
    const teal: [number, number, number] = [0, 212, 170];
    const dark: [number, number, number] = [13, 17, 23];
    const white: [number, number, number] = [255, 255, 255];
    const grey: [number, number, number] = [100, 110, 120];

    // Header
    doc.setFillColor(...dark);
    doc.rect(0, 0, 210, 38, 'F');
    doc.setTextColor(...teal);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('ELEMOTOR', 14, 18);
    doc.setTextColor(...white);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Ficha técnica de cliente', 14, 27);
    doc.setFontSize(9);
    doc.setTextColor(...grey);
    doc.text(
        `Generado el ${new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}`,
        210 - 14,
        27,
        { align: 'right' },
    );

    let y = 48;

    // Client info section
    doc.setTextColor(...dark);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Datos del cliente', 14, y);
    y += 2;
    doc.setDrawColor(...teal);
    doc.setLineWidth(0.5);
    doc.line(14, y, 196, y);
    y += 6;

    autoTable(doc, {
        startY: y,
        theme: 'plain',
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 45, textColor: [80, 90, 100] }, 1: { textColor: [20, 20, 20] } },
        body: [
            ['Nombre', client.name],
            ['Email', client.email],
            ...(client.phone ? [['Teléfono', client.phone]] : []),
            ...(client.city ? [['Ciudad', client.city]] : []),
            ...(client.cedula ? [['Cédula', client.cedula]] : []),
            ['Miembro desde', `${formatDate(client.createdAt)} (${memberSince(client.createdAt)})`],
        ],
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // Orders
    for (const [oi, order] of orderDetails.entries()) {
        if (y > 240) { doc.addPage(); y = 20; }

        doc.setTextColor(...dark);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Pedido #${oi + 1} — ${order.trim.model.brand.name} ${order.trim.model.name} · ${order.trim.name}`, 14, y);
        y += 2;
        doc.setDrawColor(...teal);
        doc.line(14, y, 196, y);
        y += 5;

        autoTable(doc, {
            startY: y,
            theme: 'plain',
            styles: { fontSize: 9, cellPadding: 2 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 45, textColor: [80, 90, 100] }, 1: { textColor: [20, 20, 20] } },
            body: [
                ['Estado', ORDER_STATUS_LABELS[order.status] ?? order.status],
                ['Color', order.color.name],
                ['Tracking', order.trackingCode ?? '—'],
                ['VIN', order.vin ?? '—'],
                ['Entrega estimada', order.estimatedDelivery ? formatDate(order.estimatedDelivery) : '—'],
            ],
        });

        y = (doc as any).lastAutoTable.finalY + 6;

        // Specs
        if (order.trim.specs && order.trim.specs.length > 0) {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...grey);
            doc.text('Especificaciones técnicas', 14, y);
            y += 2;

            autoTable(doc, {
                startY: y,
                theme: 'striped',
                styles: { fontSize: 8.5, cellPadding: 2 },
                headStyles: { fillColor: dark, textColor: white, fontStyle: 'bold' },
                head: [['Especificación', 'Valor']],
                body: order.trim.specs.map((s) => [s.key, s.value]),
            });

            y = (doc as any).lastAutoTable.finalY + 6;
        }

        // Timeline
        const tl = buildTimeline(order, []);
        if (tl.length > 0) {
            if (y > 220) { doc.addPage(); y = 20; }
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...grey);
            doc.text('Trazabilidad', 14, y);
            y += 2;

            autoTable(doc, {
                startY: y,
                theme: 'striped',
                styles: { fontSize: 8.5, cellPadding: 2 },
                headStyles: { fillColor: dark, textColor: white, fontStyle: 'bold' },
                head: [['Fecha', 'Tipo', 'Detalle', 'Responsable']],
                body: tl.map((entry) => {
                    if (entry.kind === 'status') {
                        return [
                            formatDate(entry.sortDate),
                            'Estado',
                            `${ORDER_STATUS_LABELS[entry.status] ?? entry.status}${entry.description ? ` — ${entry.description}` : ''}`,
                            entry.updatedBy?.name ?? '—',
                        ];
                    } else if (entry.kind === 'maintenance') {
                        return [
                            formatDate(entry.sortDate),
                            'Mantenimiento',
                            `${entry.type}${entry.workshop ? ` · ${entry.workshop.name}` : ''}${entry.comment ? ` — ${entry.comment}` : ''}`,
                            '—',
                        ];
                    } else {
                        return [
                            formatDate(entry.sortDate),
                            'Cotización',
                            (entry as any).referenceCode ?? '—',
                            '—',
                        ];
                    }
                }),
            });

            y = (doc as any).lastAutoTable.finalY + 10;
        }
    }

    // Quotes section
    if (quotes.length > 0) {
        if (y > 230) { doc.addPage(); y = 20; }
        doc.setTextColor(...dark);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Cotizaciones', 14, y);
        y += 2;
        doc.setDrawColor(...teal);
        doc.line(14, y, 196, y);
        y += 4;

        autoTable(doc, {
            startY: y,
            theme: 'striped',
            styles: { fontSize: 8.5, cellPadding: 2 },
            headStyles: { fillColor: dark, textColor: white, fontStyle: 'bold' },
            head: [['Ref.', 'Fecha', 'Modelo de interés', 'Estado', 'Presupuesto']],
            body: quotes.map((q) => [
                q.referenceCode,
                formatDate(q.createdAt),
                q.model?.name ?? q.modelInterest ?? '—',
                QUOTE_STATUS_LABELS[q.status] ?? q.status,
                q.budgetRange ? formatCurrency(q.budgetRange) ?? '—' : '—',
            ]),
        });
    }

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...grey);
        doc.text(`Página ${i} de ${pageCount} · Elemotor`, 105, 292, { align: 'center' });
    }

    doc.save(`Cliente-${client.id}-${client.name.replace(/\s+/g, '_')}.pdf`);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500 shrink-0">{icon}</span>
            <span className="text-slate-500 text-xs w-20 shrink-0">{label}</span>
            <span className="text-slate-200 font-medium truncate">{value}</span>
        </div>
    );
}

function StatChip({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
    return (
        <div className={`rounded-xl border px-3 py-2 flex flex-col gap-0.5 ${accent ? 'bg-[#00D4AA]/5 border-[#00D4AA]/20' : 'bg-white/[0.03] border-white/[0.07]'}`}>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{label}</span>
            <span className={`text-sm font-bold ${accent ? 'text-[#00D4AA]' : 'text-slate-200'}`}>{value}</span>
        </div>
    );
}

// ─── Timeline Item ────────────────────────────────────────────────────────────

function TimelineItem({ entry }: { entry: TimelineEntry }) {
    if (entry.kind === 'status') {
        return (
            <li className="mb-6 ml-7 last:mb-0 relative">
                <span className="absolute -left-10 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-[#0d1117] bg-cyan-500/20 border border-cyan-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                </span>
                <p className="text-[10px] text-slate-500 mb-0.5 font-mono">{formatDate(entry.sortDate)}</p>
                <p className="text-sm font-semibold text-slate-200 leading-snug">
                    {ORDER_STATUS_LABELS[entry.status] ?? entry.status}
                </p>
                {entry.description && (
                    <p className="text-xs text-slate-400 mt-0.5">{entry.description}</p>
                )}
                {entry.updatedBy && (
                    <p className="text-[11px] text-slate-600 mt-0.5">por {entry.updatedBy.name}</p>
                )}
            </li>
        );
    }

    if (entry.kind === 'maintenance') {
        return (
            <li className="mb-6 ml-7 last:mb-0 relative">
                <span className="absolute -left-10 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-[#0d1117] bg-emerald-500/20 border border-emerald-500/30">
                    <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                </span>
                <p className="text-[10px] text-slate-500 mb-0.5 font-mono">{formatDate(entry.sortDate)}</p>
                <p className="text-sm font-semibold text-slate-200 leading-snug">
                    Mantenimiento <span className="font-normal text-slate-300">· {entry.type}</span>
                </p>
                {entry.workshop && (
                    <p className="text-xs text-slate-400 mt-0.5">Taller: {entry.workshop.name}</p>
                )}
                {entry.comment && (
                    <p className="text-xs text-slate-500 mt-0.5 italic">{entry.comment}</p>
                )}
                {entry.cost && (
                    <p className="text-xs text-slate-400 mt-0.5">
                        Costo: {formatCurrency(entry.cost)}
                    </p>
                )}
            </li>
        );
    }

    // Quote
    const q = entry as { kind: 'quote'; sortDate: string } & Quote;
    const statusColor = QUOTE_STATUS_COLORS[q.status] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    return (
        <li className="mb-6 ml-7 last:mb-0 relative">
            <span className="absolute -left-10 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-[#0d1117] bg-purple-500/20 border border-purple-500/30">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
            </span>
            <p className="text-[10px] text-slate-500 mb-0.5 font-mono">{formatDate(entry.sortDate)}</p>
            <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-slate-200 leading-snug">
                    Cotización <span className="font-mono text-xs text-slate-400">#{q.referenceCode}</span>
                </p>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${statusColor}`}>
                    {QUOTE_STATUS_LABELS[q.status] ?? q.status}
                </span>
            </div>
            {(q.model?.name ?? q.modelInterest) && (
                <p className="text-xs text-slate-400 mt-0.5">
                    Modelo: {q.model?.name ?? q.modelInterest}
                    {q.trim?.name ? ` · ${q.trim.name}` : ''}
                </p>
            )}
            {q.budgetRange && (
                <p className="text-xs text-slate-500 mt-0.5">
                    Presupuesto: {formatCurrency(q.budgetRange)}
                </p>
            )}
        </li>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClientProfileView({ userId }: { userId: number }) {
    const [client, setClient] = useState<AdminClient | null>(null);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [generatingPdf, setGeneratingPdf] = useState(false);

    useEffect(() => {
        const load = async () => {
            const userData = await userService.getUserAdmin(userId);
            setClient(userData);

            const [detailsResults, quotesResult] = await Promise.all([
                userData.orders.length > 0
                    ? Promise.all(userData.orders.map((o) => orderService.getOrderDetailAdmin(o.id)))
                    : Promise.resolve([]),
                (async () => {
                    try {
                        const res = await (quoteService as any).fetchQuotes({
                            email: userData.email,
                            limit: 50,
                        }) as { data?: Quote[] };
                        return res?.data ?? [];
                    } catch {
                        return [];
                    }
                })(),
            ]);

            setOrderDetails(detailsResults);
            setQuotes(quotesResult);
        };

        load()
            .catch((e) => setError(e?.message ?? 'Error cargando perfil'))
            .finally(() => setIsLoading(false));
    }, [userId]);

    const handleExportPdf = useCallback(async () => {
        if (!client) return;
        setGeneratingPdf(true);
        try {
            generateClientPDF(client, orderDetails, quotes);
        } finally {
            setGeneratingPdf(false);
        }
    }, [client, orderDetails, quotes]);

    // ── Loading ──
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 text-slate-400 gap-3">
                <div className="w-6 h-6 border-2 border-[#00D4AA] border-t-transparent rounded-full animate-spin" />
                Cargando perfil del cliente...
            </div>
        );
    }

    // ── Error ──
    if (error || !client) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error ?? 'Cliente no encontrado'}
            </div>
        );
    }

    // ── Unified timeline across all orders + quotes ──
    const allTimeline: TimelineEntry[] = [
        ...orderDetails.flatMap((od) =>
            od.statusHistory.map<TimelineEntry>((s) => ({ kind: 'status', sortDate: s.date, ...s }))
        ),
        ...orderDetails.flatMap((od) =>
            od.maintenanceRecords.map<TimelineEntry>((m) => ({ kind: 'maintenance', sortDate: m.date, ...m }))
        ),
        ...quotes.map<TimelineEntry>((q) => ({ kind: 'quote', sortDate: q.createdAt, ...q })),
    ].sort((a, b) => new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime());

    const primaryOrder = orderDetails[0] ?? null;

    return (
        <div className="min-h-screen bg-[#0d1117]">
            <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">

                {/* ── Top bar ── */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <Link
                        href="/admin/clientes"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        <ArrowLeft size={15} /> Volver a clientes
                    </Link>

                    <button
                        onClick={handleExportPdf}
                        disabled={generatingPdf}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#00D4AA] bg-[#00D4AA]/10 hover:bg-[#00D4AA]/20 border border-[#00D4AA]/30 rounded-lg transition-colors disabled:opacity-60"
                    >
                        {generatingPdf
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Download size={14} />
                        }
                        Imprimir / Exportar PDF
                    </button>
                </div>

                {/* ── 2-column layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">

                    {/* ════ LEFT COLUMN ════ */}
                    <div className="flex flex-col gap-5">

                        {/* ── Client card ── */}
                        <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-6">
                            {/* Avatar + name */}
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D4AA]/20 to-blue-500/20 border border-[#00D4AA]/20 flex items-center justify-center shrink-0 text-[#00D4AA] font-bold text-lg select-none">
                                    {getInitials(client.name)}
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-xl font-bold text-white leading-tight truncate">{client.name}</h1>
                                    <p className="text-slate-500 text-xs mt-0.5">
                                        Cliente #{client.id} · Miembro {memberSince(client.createdAt)}
                                    </p>
                                    {client.emailVerifiedAt && (
                                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                                            <CheckCircle2 size={9} /> Email verificado
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Contact details */}
                            <div className="flex flex-col gap-2.5 border-t border-white/[0.06] pt-4">
                                <InfoRow icon={<Mail size={13} />} label="Email" value={client.email} />
                                {client.phone && (
                                    <InfoRow icon={<Phone size={13} />} label="Teléfono" value={client.phone} />
                                )}
                                {client.city && (
                                    <InfoRow icon={<MapPin size={13} />} label="Ciudad" value={client.city} />
                                )}
                                {client.cedula && (
                                    <InfoRow icon={<CreditCard size={13} />} label="Cédula" value={client.cedula} />
                                )}
                                <InfoRow
                                    icon={<Calendar size={13} />}
                                    label="Registro"
                                    value={formatDate(client.createdAt)}
                                />
                            </div>

                            {/* Stats row */}
                            <div className="mt-5 grid grid-cols-3 gap-2">
                                <StatChip label="Pedidos" value={String(client.orders.length)} accent={client.orders.length > 0} />
                                <StatChip label="Cotizaciones" value={String(quotes.length)} />
                                <StatChip label="Eventos" value={String(allTimeline.length)} />
                            </div>
                        </div>

                        {/* ── Vehicle / Order cards ── */}
                        {orderDetails.length === 0 ? (
                            <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-8 text-center text-slate-500">
                                <Car className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Sin pedidos registrados</p>
                            </div>
                        ) : (
                            orderDetails.map((order) => {
                                const statusLabel = ORDER_STATUS_LABELS[order.status] ?? order.status;
                                const statusColor = ORDER_STATUS_COLORS[order.status] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                                const specs: TrimSpec[] = order.trim?.specs ?? [];

                                return (
                                    <div key={order.id} className="bg-[#161b22] border border-white/[0.08] rounded-2xl overflow-hidden">
                                        {/* Vehicle header */}
                                        <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
                                            <div className="flex items-start justify-between gap-3 flex-wrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                                                        <Car className="w-4.5 h-4.5 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                                            {order.trim.model.brand.name}
                                                        </p>
                                                        <h2 className="text-base font-bold text-white leading-tight">
                                                            {order.trim.model.name}
                                                            <span className="text-slate-400 font-normal"> · {order.trim.name}</span>
                                                        </h2>
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColor}`}>
                                                    {statusLabel}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Vehicle details grid */}
                                        <div className="px-5 py-4 grid grid-cols-2 gap-x-4 gap-y-3">
                                            {/* Color with swatch */}
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Color</p>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                                                        style={{ backgroundColor: order.color.hexCode || '#888' }}
                                                    />
                                                    <span className="text-sm text-slate-200 font-medium">{order.color.name}</span>
                                                </div>
                                            </div>

                                            {/* Estimated delivery */}
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Entrega estimada</p>
                                                <p className="text-sm text-slate-200 font-medium">
                                                    {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : '—'}
                                                </p>
                                            </div>

                                            {/* Tracking */}
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Tracking</p>
                                                <p className="text-sm font-mono text-[#00D4AA] truncate">
                                                    {order.trackingCode ?? '—'}
                                                </p>
                                            </div>

                                            {/* VIN */}
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">VIN</p>
                                                <p className="text-sm font-mono text-slate-300 truncate">
                                                    {order.vin ?? '—'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Trim specs */}
                                        {specs.length > 0 && (
                                            <div className="px-5 pb-5 border-t border-white/[0.06] pt-4">
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-3">
                                                    Especificaciones técnicas
                                                </p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {specs.map((spec) => (
                                                        <div
                                                            key={spec.key}
                                                            className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 flex items-start gap-2"
                                                        >
                                                            <span className="mt-0.5 shrink-0">
                                                                {getSpecIcon(spec.key)}
                                                            </span>
                                                            <div className="min-w-0">
                                                                <p className="text-[10px] text-slate-500 leading-tight">{spec.key}</p>
                                                                <p className="text-xs text-slate-200 font-semibold truncate">{spec.value}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}

                        {/* ── Quotes panel ── */}
                        {quotes.length > 0 && (
                            <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl overflow-hidden">
                                <div className="px-5 py-4 border-b border-white/[0.06]">
                                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                        <FileText size={14} className="text-purple-400" />
                                        Cotizaciones ({quotes.length})
                                    </h3>
                                </div>
                                <div className="divide-y divide-white/[0.04]">
                                    {quotes.map((q) => {
                                        const sc = QUOTE_STATUS_COLORS[q.status] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                                        return (
                                            <div key={q.id} className="px-5 py-3 flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="text-sm font-semibold text-slate-200">
                                                            {q.model?.name ?? q.modelInterest ?? 'Sin modelo'}
                                                        </p>
                                                        {q.trim?.name && (
                                                            <span className="text-xs text-slate-500">· {q.trim.name}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                                        <span className="font-mono">#{q.referenceCode}</span> · {formatDate(q.createdAt)}
                                                        {q.budgetRange ? ` · ${formatCurrency(q.budgetRange)}` : ''}
                                                    </p>
                                                </div>
                                                <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${sc}`}>
                                                    {QUOTE_STATUS_LABELS[q.status] ?? q.status}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ════ RIGHT COLUMN — unified timeline ════ */}
                    <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-6">
                            <Activity size={14} className="text-[#00D4AA]" />
                            Historial cronológico unificado
                            <span className="ml-auto text-[10px] font-normal text-slate-500">
                                {allTimeline.length} eventos
                            </span>
                        </h3>

                        {allTimeline.length === 0 ? (
                            <div className="text-center py-12 text-slate-600">
                                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Sin eventos registrados</p>
                            </div>
                        ) : (
                            <ol className="relative border-l border-white/[0.07] ml-3 flex flex-col gap-0">
                                {allTimeline.map((entry, idx) => (
                                    <TimelineItem
                                        key={`${entry.kind}-${entry.id}-${idx}`}
                                        entry={entry}
                                    />
                                ))}
                            </ol>
                        )}

                        {/* Legend */}
                        <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center gap-4 flex-wrap text-[11px] text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-cyan-500/40 border border-cyan-500/50 shrink-0" />
                                Cambio de estado
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500/50 shrink-0" />
                                Mantenimiento
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-purple-500/40 border border-purple-500/50 shrink-0" />
                                Cotización
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
