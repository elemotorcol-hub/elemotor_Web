'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    CheckCircle2,
    Wrench,
    Printer,
    Car,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    Calendar,
    User,
} from 'lucide-react';
import { userService, type AdminClient } from '@/services/user.service';
import { orderService } from '@/services/order.service';

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

interface OrderDetail {
    id: number;
    trackingCode: string | null;
    status: string;
    vin: string | null;
    notes: string | null;
    estimatedDelivery: string | null;
    createdAt: string;
    user: { id: number; name: string; email: string; phone?: string | null };
    trim: { id: number; name: string; model: { id: number; name: string; brand: { id: number; name: string } } };
    color: { id: number; name: string; hexCode: string };
    statusHistory: StatusHistoryEntry[];
    maintenanceRecords: MaintenanceEntry[];
    documents: { id: number; type: string; name: string; fileUrl: string; uploadedBy: string; createdAt: string }[];
}

type TimelineEntry =
    | { kind: 'status'; sortDate: string } & StatusHistoryEntry
    | { kind: 'maintenance'; sortDate: string } & MaintenanceEntry;

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildTimeline(detail: OrderDetail): TimelineEntry[] {
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
    return [...statusEntries, ...maintenanceEntries].sort(
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

function formatCurrency(value: string | null) {
    if (!value) return null;
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(num);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ClientProfileView({ userId }: { userId: number }) {
    const [client, setClient] = useState<AdminClient | null>(null);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const userData = await userService.getUserAdmin(userId);
            setClient(userData);
            if (userData.orders.length > 0) {
                const details = await Promise.all(
                    userData.orders.map((o) => orderService.getOrderDetailAdmin(o.id)),
                );
                setOrderDetails(details);
            }
        };
        load().catch((e) => setError(e?.message ?? 'Error cargando perfil')).finally(() => setIsLoading(false));
    }, [userId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 text-slate-400 gap-3">
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                Cargando perfil...
            </div>
        );
    }

    if (error || !client) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error ?? 'Cliente no encontrado'}
            </div>
        );
    }

    const timeline = orderDetails.flatMap(buildTimeline);

    return (
        <>
            {/* Print isolation styles */}
            <style>{`
                @media print {
                    body { visibility: hidden; }
                    #printable-history { visibility: visible; position: absolute; top: 0; left: 0; width: 100%; padding: 2rem; background: #fff; color: #000; }
                    #printable-history * { visibility: visible; color: #000 !important; background: transparent !important; border-color: #ccc !important; }
                }
            `}</style>

            <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-12 w-full">

                {/* Nav */}
                <Link
                    href="/admin/clientes"
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors w-fit"
                >
                    <ArrowLeft size={16} /> Volver a clientes
                </Link>

                {/* Client card */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/20 flex items-center justify-center shrink-0">
                        <User className="w-7 h-7 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-slate-100 leading-tight">{client.name}</h1>
                        <p className="text-slate-500 text-sm mt-0.5">Cliente #{client.id} · Miembro desde {formatDate(client.createdAt)}</p>
                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
                            <span className="flex items-center gap-1.5"><Mail size={13} className="text-slate-500" />{client.email}</span>
                            {client.phone && <span className="flex items-center gap-1.5"><Phone size={13} className="text-slate-500" />{client.phone}</span>}
                            {client.city && <span className="flex items-center gap-1.5"><MapPin size={13} className="text-slate-500" />{client.city}</span>}
                            {client.cedula && <span className="flex items-center gap-1.5"><CreditCard size={13} className="text-slate-500" />{client.cedula}</span>}
                        </div>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="shrink-0 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                    >
                        <Printer size={15} /> Descargar historial
                    </button>
                </div>

                {/* Orders */}
                {orderDetails.length === 0 ? (
                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-10 text-center text-slate-500">
                        <Car className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        Este cliente no tiene pedidos registrados.
                    </div>
                ) : (
                    orderDetails.map((order) => {
                        const statusLabel = ORDER_STATUS_LABELS[order.status] ?? order.status;
                        const statusColor = ORDER_STATUS_COLORS[order.status] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                        const timeline = buildTimeline(order);

                        return (
                            <div key={order.id} className="flex flex-col gap-5">
                                {/* Vehicle card */}
                                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                                                <Car className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                                                    {order.trim.model.brand.name}
                                                </p>
                                                <h2 className="text-lg font-bold text-slate-100 leading-tight">
                                                    {order.trim.model.name} · <span className="text-slate-300 font-medium">{order.trim.name}</span>
                                                </h2>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
                                            {statusLabel}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-slate-500 text-xs mb-0.5">Color</p>
                                            <p className="text-slate-200 font-medium">{order.color.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-xs mb-0.5">Tracking</p>
                                            <p className="text-slate-200 font-mono text-xs">{order.trackingCode ?? '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-xs mb-0.5">VIN</p>
                                            <p className="text-slate-200 font-mono text-xs">{order.vin ?? '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-xs mb-0.5">Entrega estimada</p>
                                            <p className="text-slate-200 text-xs">
                                                {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                {timeline.length > 0 && (
                                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                                        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5 flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-500" /> Trazabilidad cronológica
                                        </h3>
                                        <ol className="relative border-l border-slate-800 ml-3 flex flex-col gap-0">
                                            {timeline.map((entry, idx) => (
                                                <li key={`${entry.kind}-${entry.id}-${idx}`} className="mb-6 ml-6 last:mb-0">
                                                    <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-slate-950 ${entry.kind === 'status' ? 'bg-cyan-500/20' : 'bg-emerald-500/20'}`}>
                                                        {entry.kind === 'status'
                                                            ? <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                                                            : <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                                                        }
                                                    </span>
                                                    <div className="pt-0.5">
                                                        <p className="text-xs text-slate-500 mb-0.5">{formatDate(entry.sortDate)}</p>
                                                        {entry.kind === 'status' ? (
                                                            <>
                                                                <p className="text-sm font-semibold text-slate-200">
                                                                    {ORDER_STATUS_LABELS[entry.status] ?? entry.status}
                                                                </p>
                                                                {entry.description && (
                                                                    <p className="text-xs text-slate-400 mt-0.5">{entry.description}</p>
                                                                )}
                                                                {entry.updatedBy && (
                                                                    <p className="text-xs text-slate-600 mt-0.5">por {entry.updatedBy.name}</p>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="text-sm font-semibold text-slate-200">
                                                                    Mantenimiento · <span className="font-normal text-slate-300">{entry.type}</span>
                                                                </p>
                                                                {entry.workshop && (
                                                                    <p className="text-xs text-slate-400 mt-0.5">Taller: {entry.workshop.name}</p>
                                                                )}
                                                                {entry.comment && (
                                                                    <p className="text-xs text-slate-500 mt-0.5 italic">{entry.comment}</p>
                                                                )}
                                                                {entry.cost && (
                                                                    <p className="text-xs text-slate-400 mt-0.5">Costo: {formatCurrency(entry.cost)}</p>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* ─── Printable history ─────────────────────────────────────────────── */}
            <div id="printable-history" className="hidden print:block">
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Historial de cliente — Elemotor
                </h1>
                <p style={{ marginBottom: '0.25rem' }}><strong>Nombre:</strong> {client.name}</p>
                <p style={{ marginBottom: '0.25rem' }}><strong>Email:</strong> {client.email}</p>
                {client.phone && <p style={{ marginBottom: '0.25rem' }}><strong>Teléfono:</strong> {client.phone}</p>}
                {client.city && <p style={{ marginBottom: '0.25rem' }}><strong>Ciudad:</strong> {client.city}</p>}
                {client.cedula && <p style={{ marginBottom: '0.25rem' }}><strong>Cédula:</strong> {client.cedula}</p>}
                <p style={{ marginBottom: '1.5rem' }}><strong>Miembro desde:</strong> {formatDate(client.createdAt)}</p>

                {orderDetails.map((order, oi) => {
                    const tl = buildTimeline(order);
                    return (
                        <div key={order.id} style={{ marginBottom: '2rem', paddingTop: '1rem', borderTop: '1px solid #ccc' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                Pedido #{oi + 1}: {order.trim.model.brand.name} {order.trim.model.name} · {order.trim.name}
                            </h2>
                            <p><strong>Estado:</strong> {ORDER_STATUS_LABELS[order.status] ?? order.status}</p>
                            <p><strong>Color:</strong> {order.color.name}</p>
                            {order.trackingCode && <p><strong>Tracking:</strong> {order.trackingCode}</p>}
                            {order.vin && <p><strong>VIN:</strong> {order.vin}</p>}
                            {order.estimatedDelivery && <p><strong>Entrega estimada:</strong> {formatDate(order.estimatedDelivery)}</p>}

                            {tl.length > 0 && (
                                <>
                                    <h3 style={{ fontWeight: 'bold', marginTop: '1rem', marginBottom: '0.5rem' }}>Trazabilidad</h3>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>Fecha</th>
                                                <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>Tipo</th>
                                                <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>Detalle</th>
                                                <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>Responsable</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tl.map((entry, idx) => (
                                                <tr key={idx}>
                                                    <td style={{ padding: '4px 0', verticalAlign: 'top' }}>{formatDate(entry.sortDate)}</td>
                                                    <td style={{ padding: '4px 8px', verticalAlign: 'top' }}>
                                                        {entry.kind === 'status' ? 'Estado' : 'Mantenimiento'}
                                                    </td>
                                                    <td style={{ padding: '4px 8px', verticalAlign: 'top' }}>
                                                        {entry.kind === 'status'
                                                            ? `${ORDER_STATUS_LABELS[entry.status] ?? entry.status}${entry.description ? ` — ${entry.description}` : ''}`
                                                            : `${entry.type}${entry.workshop ? ` (${entry.workshop.name})` : ''}${entry.comment ? ` — ${entry.comment}` : ''}`
                                                        }
                                                    </td>
                                                    <td style={{ padding: '4px 0', verticalAlign: 'top' }}>
                                                        {entry.kind === 'status' ? (entry.updatedBy?.name ?? '—') : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    );
                })}

                <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#666' }}>
                    Generado el {new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })} · Elemotor
                </p>
            </div>
        </>
    );
}
