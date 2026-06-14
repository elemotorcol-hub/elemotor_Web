'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Headset,
  MessageSquare,
  Send,
  RefreshCw,
  Plus,
  Loader2,
  X,
} from 'lucide-react';
import {
  supportTicketsService,
  SupportTicketDetail,
  TicketStatus,
  TicketCategory,
} from '@/services/support-tickets.service';
import { SupportTicketModal } from '@/components/dashboard/SupportTicketModal';

// ─── Helpers ────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Abierto',
  in_progress: 'En progreso',
  resolved: 'Resuelto',
  closed: 'Cerrado',
};

const STATUS_CLASSES: Record<TicketStatus, string> = {
  open: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  in_progress: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  resolved: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  closed: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',
};

const CATEGORY_LABELS: Record<TicketCategory, string> = {
  general: 'General',
  technical: 'Técnico',
  billing: 'Facturación',
  delivery: 'Entrega',
};

function formatDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SoportePage() {
  const [tickets, setTickets] = useState<SupportTicketDetail[]>([]);
  const [selected, setSelected] = useState<SupportTicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Fetch list ──
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const raw = await supportTicketsService.getMine() as any;
      const list: SupportTicketDetail[] = Array.isArray(raw) ? raw : raw?.data ?? [];
      setTickets(list);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ── Scroll to bottom on new messages ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages]);

  // ── Select ticket ──
  const handleSelect = async (ticket: SupportTicketDetail) => {
    setSelected(ticket);
    setMobileView('detail');
    setLoadingDetail(true);
    try {
      const detail = await supportTicketsService.getOne(ticket.id);
      setSelected(detail);
    } catch {
      // keep the partial data already set
    } finally {
      setLoadingDetail(false);
    }
  };

  // ── Send reply ──
  const handleSendReply = async () => {
    if (!selected || !reply.trim()) return;
    setSending(true);
    try {
      await supportTicketsService.addMessage(selected.id, reply.trim());
      setReply('');
      const detail = await supportTicketsService.getOne(selected.id);
      setSelected(detail);
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendReply();
    }
  };

  // ── After creating a ticket, refresh list ──
  const handleModalClose = () => {
    setTicketModalOpen(false);
    fetchTickets();
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  const renderTicketCard = (ticket: SupportTicketDetail) => {
    const isActive = selected?.id === ticket.id;
    return (
      <button
        key={ticket.id}
        onClick={() => handleSelect(ticket)}
        className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all mb-2 ${
          isActive
            ? 'border-[#10B981]/40 bg-[#10B981]/5'
            : 'border-white/5 bg-[#0A110F] hover:border-white/10 hover:bg-white/[0.02]'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <p className="font-bold text-sm text-white truncate flex-1">{ticket.subject}</p>
          <span
            className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CLASSES[ticket.status]}`}
          >
            {STATUS_LABELS[ticket.status]}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
            {CATEGORY_LABELS[ticket.category]}
          </span>
          <span className="text-[11px] text-slate-600">{formatDate(ticket.createdAt)}</span>
        </div>
      </button>
    );
  };

  const renderEmptyList = () => (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-[#15201D] border border-white/5 flex items-center justify-center">
        <Headset className="w-7 h-7 text-slate-500" />
      </div>
      <div>
        <p className="text-white font-semibold text-sm mb-1">Sin tickets de soporte</p>
        <p className="text-slate-500 text-xs">Crea un ticket y te ayudaremos pronto.</p>
      </div>
      <button
        onClick={() => setTicketModalOpen(true)}
        className="flex items-center gap-2 bg-[#10B981] hover:bg-emerald-400 text-[#060D0B] font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
      >
        <Plus className="w-4 h-4" />
        Crear primer ticket
      </button>
    </div>
  );

  const renderEmptyDetail = () => (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
      <MessageSquare className="w-10 h-10 text-slate-700" />
      <p className="text-slate-500 text-sm">Selecciona un ticket para ver la conversación</p>
    </div>
  );

  const renderMessages = () => {
    if (!selected) return null;

    if (loadingDetail) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
        </div>
      );
    }

    const messages = selected.messages ?? [];

    if (messages.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-slate-500 text-sm">
          Sin mensajes aún.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4 p-4">
        {messages.map((msg) => {
          const isAdmin =
            msg.sender.role === 'admin' || msg.sender.role === 'super_admin';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAdmin ? 'justify-start' : 'justify-end'}`}
            >
              {isAdmin && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 flex items-center justify-center text-[11px] font-bold text-emerald-400">
                  {initials(msg.sender.name)}
                </div>
              )}
              <div className={`max-w-[72%] ${isAdmin ? '' : 'items-end'} flex flex-col gap-1`}>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      {msg.sender.name}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-600">{formatTime(msg.createdAt)}</span>
                  {!isAdmin && (
                    <span className="text-[11px] text-slate-400 font-semibold">Tú</span>
                  )}
                </div>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isAdmin
                      ? 'bg-[#15201D] text-slate-200 rounded-tl-sm'
                      : 'bg-[#10B981]/10 border border-[#10B981]/20 text-slate-100 rounded-tr-sm'
                  }`}
                >
                  {msg.body}
                </div>
              </div>
              {!isAdmin && (
                <div className="shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[11px] font-bold text-slate-300">
                  {selected.user ? initials(selected.user.name) : 'Tú'}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // LAYOUT
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile: back button when viewing detail */}
          {mobileView === 'detail' && (
            <button
              onClick={() => setMobileView('list')}
              className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Volver"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <Headset className="w-5 h-5 text-emerald-400 hidden lg:block" />
          <h1 className="text-white font-bold text-lg">Mis Tickets de Soporte</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Actualizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setTicketModalOpen(true)}
            className="flex items-center gap-2 bg-[#10B981] hover:bg-emerald-400 text-[#060D0B] font-bold text-sm px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo Ticket</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        </div>
      </div>

      {/* ── Master-Detail Body ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── Left column: ticket list ── */}
        <div
          className={`
            shrink-0 w-full lg:w-[280px] lg:border-r border-white/5 flex flex-col overflow-hidden
            ${mobileView === 'detail' ? 'hidden lg:flex' : 'flex'}
          `}
        >
          <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
              </div>
            ) : tickets.length === 0 ? (
              renderEmptyList()
            ) : (
              tickets.map((t) => renderTicketCard(t))
            )}
          </div>
        </div>

        {/* ── Right column: conversation ── */}
        <div
          className={`
            flex-1 min-w-0 flex flex-col overflow-hidden
            ${mobileView === 'list' ? 'hidden lg:flex' : 'flex'}
          `}
        >
          {!selected ? (
            renderEmptyDetail()
          ) : (
            <>
              {/* Conversation header */}
              <div className="shrink-0 px-5 py-4 border-b border-white/5 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{selected.subject}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CLASSES[selected.status]}`}
                    >
                      {STATUS_LABELS[selected.status]}
                    </span>
                    <span className="text-[10px] text-slate-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                      {CATEGORY_LABELS[selected.category]}
                    </span>
                    <span className="text-[10px] text-slate-600">
                      Abierto {formatDate(selected.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {renderMessages()}
              </div>

              {/* Reply box */}
              {selected.status !== 'closed' && selected.status !== 'resolved' ? (
                <div className="shrink-0 p-4 border-t border-white/5">
                  <div className="flex gap-3 items-end">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Escribe tu respuesta... (Ctrl+Enter para enviar)"
                      rows={3}
                      className="flex-1 bg-[#15201D] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-600/50 transition-colors resize-none no-scrollbar"
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={sending || !reply.trim()}
                      className="shrink-0 p-3 bg-[#10B981] hover:bg-emerald-400 disabled:bg-emerald-900/40 disabled:cursor-not-allowed text-[#060D0B] disabled:text-slate-600 rounded-xl transition-colors"
                      aria-label="Responder"
                    >
                      {sending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-700 mt-1.5 pl-1">Ctrl+Enter para enviar</p>
                </div>
              ) : (
                <div className="shrink-0 px-4 py-3 border-t border-white/5">
                  <p className="text-center text-xs text-slate-600">
                    Este ticket está {STATUS_LABELS[selected.status].toLowerCase()} y no acepta más respuestas.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── New Ticket Modal ── */}
      <SupportTicketModal isOpen={ticketModalOpen} onClose={handleModalClose} />
    </div>
  );
}
