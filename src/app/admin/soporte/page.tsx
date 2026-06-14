'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Headset, RefreshCw, X, ChevronDown, MessageSquare,
    Clock, CheckCircle2, AlertCircle, Circle, Send,
    Loader2, User, Mail, Phone, Calendar,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type TicketCategory = 'technical' | 'billing' | 'delivery' | 'general';

interface TicketMessage {
    id: number;
    body: string;
    createdAt: string;
    sender: { id: number; name: string; role: string };
}

interface SupportTicket {
    id: number;
    subject: string;
    category: TicketCategory;
    status: TicketStatus;
    createdAt: string;
    updatedAt: string;
    user: { id: number; name: string; email: string; phone?: string };
    messages?: TicketMessage[];
    _count?: { messages: number };
}

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<TicketStatus, { label: string; badge: string; icon: React.ReactNode }> = {
    open:        { label: 'Abierto',      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',   icon: <Circle size={11} className="fill-amber-400 text-amber-400" /> },
    in_progress: { label: 'En proceso',   badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',      icon: <Loader2 size={11} className="animate-spin" /> },
    resolved:    { label: 'Resuelto',     badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: <CheckCircle2 size={11} /> },
    closed:      { label: 'Cerrado',      badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',   icon: <X size={11} /> },
};

const CATEGORY_LABEL: Record<TicketCategory, string> = {
    technical: 'Problema técnico',
    billing:   'Facturación',
    delivery:  'Entrega / Pedido',
    general:   'Consulta general',
};

const ALL_STATUSES = Object.entries(STATUS_CFG) as [TicketStatus, (typeof STATUS_CFG)[TicketStatus]][];

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TicketStatus }) {
    const cfg = STATUS_CFG[status];
    return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border', cfg.badge)}>
            {cfg.icon} {cfg.label}
        </span>
    );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function TicketDetailPanel({
    ticket,
    onClose,
    onStatusChange,
    onRefresh,
}: {
    ticket: SupportTicket;
    onClose: () => void;
    onStatusChange: (id: number, status: TicketStatus) => Promise<void>;
    onRefresh: (id: number) => Promise<SupportTicket>;
}) {
    const [messages, setMessages] = useState<TicketMessage[]>(ticket.messages ?? []);
    const [loadingMessages, setLoadingMessages] = useState(!ticket.messages);
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);
    const [changingStatus, setChangingStatus] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<TicketStatus>(ticket.status);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    // Load messages on mount
    useEffect(() => {
        setLoadingMessages(true);
        fetchApi(`/api/support-tickets/${ticket.id}`, { method: 'GET' })
            .then((data: any) => setMessages(data.messages ?? []))
            .catch(() => {})
            .finally(() => setLoadingMessages(false));
    }, [ticket.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendReply = async () => {
        if (!reply.trim()) return;
        setSending(true);
        try {
            await fetchApi(`/api/support-tickets/${ticket.id}/messages`, {
                method: 'POST',
                body: JSON.stringify({ body: reply.trim() }),
            });
            setReply('');
            // Refresh messages
            const updated = await onRefresh(ticket.id);
            setMessages(updated.messages ?? []);
        } catch {
            // silent
        } finally {
            setSending(false);
        }
    };

    const handleStatusChange = async (newStatus: TicketStatus) => {
        setChangingStatus(true);
        try {
            await onStatusChange(ticket.id, newStatus);
            setCurrentStatus(newStatus);
        } finally {
            setChangingStatus(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
            <div className="fixed right-0 top-0 h-full w-full max-w-[520px] z-40 bg-[#0d1117] border-l border-white/10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#161b22] shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs text-slate-500 font-mono">#{ticket.id}</span>
                            <StatusBadge status={currentStatus} />
                        </div>
                        <h2 className="text-sm font-bold text-white line-clamp-1">{ticket.subject}</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Client info */}
                <div className="px-6 py-4 border-b border-white/5 bg-[#161b22]/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0">
                            {ticket.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{ticket.user.name}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                                <a href={`mailto:${ticket.user.email}`} className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1">
                                    <Mail size={10} /> {ticket.user.email}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {fmtDate(ticket.createdAt)}</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">{CATEGORY_LABEL[ticket.category]}</span>
                    </div>
                </div>

                {/* Status change */}
                <div className="px-6 py-3 border-b border-white/5 bg-[#0d1117] shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 shrink-0">Cambiar estado:</span>
                        <div className="relative flex-1">
                            <select
                                value={currentStatus}
                                disabled={changingStatus}
                                onChange={e => handleStatusChange(e.target.value as TicketStatus)}
                                className="w-full bg-[#161b22] border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-300 focus:outline-none appearance-none cursor-pointer disabled:opacity-50"
                            >
                                {ALL_STATUSES.map(([v, { label }]) => (
                                    <option key={v} value={v}>{label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                        </div>
                        {changingStatus && <Loader2 size={14} className="animate-spin text-slate-500 shrink-0" />}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {loadingMessages ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 size={20} className="animate-spin text-slate-500" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-slate-600 gap-2">
                            <MessageSquare size={28} strokeWidth={1} />
                            <p className="text-sm">Sin mensajes aún</p>
                        </div>
                    ) : (
                        messages.map(msg => {
                            const isAdmin = msg.sender.role !== 'client';
                            return (
                                <div key={msg.id} className={cn('flex flex-col gap-1', isAdmin ? 'items-end' : 'items-start')}>
                                    <div className={cn(
                                        'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                                        isAdmin
                                            ? 'bg-emerald-600/20 border border-emerald-600/20 text-emerald-100 rounded-tr-sm'
                                            : 'bg-[#161b22] border border-white/5 text-slate-200 rounded-tl-sm'
                                    )}>
                                        {msg.body}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-600 px-1">
                                        <span className="font-medium">{isAdmin ? 'Equipo Elemotor' : msg.sender.name}</span>
                                        <span>·</span>
                                        <span>{fmtDate(msg.createdAt)}</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Reply box */}
                {currentStatus !== 'closed' && (
                    <div className="px-6 py-4 border-t border-white/5 bg-[#161b22] shrink-0">
                        <div className="flex gap-3">
                            <textarea
                                value={reply}
                                onChange={e => setReply(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSendReply(); }}
                                placeholder="Escribir respuesta... (Ctrl+Enter para enviar)"
                                rows={3}
                                className="flex-1 bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none transition-colors"
                            />
                            <button
                                onClick={handleSendReply}
                                disabled={!reply.trim() || sending}
                                className="self-end p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Enviar respuesta"
                            >
                                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-600 mt-2">El cliente recibirá una notificación con tu respuesta.</p>
                    </div>
                )}
            </div>
        </>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SoportePage() {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('open');
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

    const fetchTickets = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = filterStatus ? `?status=${filterStatus}&limit=50` : '?limit=50';
            const data: any = await fetchApi(`/api/support-tickets${params}`, { method: 'GET' });
            setTickets(data?.data ?? data ?? []);
        } catch (e: any) {
            setError(e?.message ?? 'Error cargando tickets');
        } finally {
            setIsLoading(false);
        }
    }, [filterStatus]);

    useEffect(() => { fetchTickets(); }, [fetchTickets]);

    const handleStatusChange = async (id: number, status: TicketStatus) => {
        await fetchApi(`/api/support-tickets/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
        if (selectedTicket?.id === id) setSelectedTicket(prev => prev ? { ...prev, status } : prev);
    };

    const refreshTicket = async (id: number): Promise<SupportTicket> => {
        const data: any = await fetchApi(`/api/support-tickets/${id}`, { method: 'GET' });
        setTickets(prev => prev.map(t => t.id === id ? data : t));
        return data;
    };

    // KPIs
    const kpis = {
        open:        tickets.filter(t => t.status === 'open').length,
        in_progress: tickets.filter(t => t.status === 'in_progress').length,
        resolved:    tickets.filter(t => t.status === 'resolved').length,
        total:       tickets.length,
    };

    return (
        <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-8 w-full">
            {/* Header */}
            <div className="flex flex-col gap-1.5 border-b border-slate-800 pb-5">
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Tickets de Soporte</h1>
                <p className="text-slate-400">Solicitudes de soporte enviadas por los clientes.</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Abiertos',    count: kpis.open,        color: 'bg-amber-500/10 text-amber-400',   icon: <AlertCircle size={18} /> },
                    { label: 'En proceso',  count: kpis.in_progress, color: 'bg-blue-500/10 text-blue-400',     icon: <Clock size={18} /> },
                    { label: 'Resueltos',   count: kpis.resolved,    color: 'bg-emerald-500/10 text-emerald-400', icon: <CheckCircle2 size={18} /> },
                    { label: 'Total vista', count: kpis.total,       color: 'bg-slate-700/50 text-slate-300',   icon: <Headset size={18} /> },
                ].map(k => (
                    <div key={k.label} className="bg-[#161b22] border border-white/10 rounded-xl p-4 flex items-center gap-4">
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', k.color)}>{k.icon}</div>
                        <div>
                            <p className="text-2xl font-bold text-slate-100 leading-none">{k.count}</p>
                            <p className="text-xs text-slate-400 mt-1">{k.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="bg-[#161b22] border border-white/10 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-300 focus:outline-none appearance-none cursor-pointer hover:border-white/20 transition-colors"
                    >
                        <option value="">Todos los estados</option>
                        {ALL_STATUSES.map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                </div>
                <button
                    onClick={fetchTickets}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
                >
                    <RefreshCw size={13} /> Actualizar
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl flex items-center justify-between">
                    <p className="text-sm">{error}</p>
                    <button onClick={() => setError(null)}><X size={16} /></button>
                </div>
            )}

            {/* Tickets list */}
            <div className="bg-[#161b22] border border-white/10 rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="flex flex-col items-center gap-3 text-slate-500">
                            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm">Cargando tickets...</p>
                        </div>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-600 gap-2">
                        <Headset size={32} strokeWidth={1} />
                        <p className="text-sm">No hay tickets con este filtro.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {tickets.map(ticket => {
                            const isSelected = selectedTicket?.id === ticket.id;
                            return (
                                <div
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(isSelected ? null : ticket)}
                                    className={cn(
                                        'flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors',
                                        isSelected ? 'bg-emerald-500/5 border-l-2 border-l-emerald-500' : 'hover:bg-white/[0.02]'
                                    )}
                                >
                                    {/* Avatar */}
                                    <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0 mt-0.5">
                                        {ticket.user.name.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-white truncate">{ticket.subject}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{ticket.user.name} · {ticket.user.email}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                                                <StatusBadge status={ticket.status} />
                                                <span className="text-[10px] text-slate-600">{fmtDate(ticket.createdAt)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-500">
                                                {CATEGORY_LABEL[ticket.category]}
                                            </span>
                                            {(ticket._count?.messages ?? 0) > 0 && (
                                                <span className="flex items-center gap-1 text-[11px] text-slate-500">
                                                    <MessageSquare size={10} /> {ticket._count?.messages} mensaje{(ticket._count?.messages ?? 0) !== 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!isLoading && tickets.length > 0 && (
                    <div className="px-5 py-3 border-t border-white/5">
                        <p className="text-xs text-slate-600">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''} · Haz click para ver y responder</p>
                    </div>
                )}
            </div>

            {/* Detail panel */}
            {selectedTicket && (
                <TicketDetailPanel
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    onStatusChange={handleStatusChange}
                    onRefresh={refreshTicket}
                />
            )}
        </div>
    );
}
