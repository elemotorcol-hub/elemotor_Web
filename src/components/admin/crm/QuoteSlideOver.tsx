import React, { useState } from 'react';
import { Mail, Phone, X, Tag, BarChart2, MessageSquare, User, Clock } from 'lucide-react';
import { type Quote, type QuoteStatus, type Note } from '@/types/crm';
import { STATUS_CONFIG, ADVISORS } from '@/config/crm';

interface QuoteSlideOverProps {
    quote: Quote;
    onClose: () => void;
    onStatusChange: (id: string, status: QuoteStatus) => void;
    onAdvisorChange: (id: string, advisor: string) => void;
    onAddNote: (id: string, text: string) => void;
}

export function QuoteSlideOver({ quote, onClose, onStatusChange, onAdvisorChange, onAddNote }: QuoteSlideOverProps) {
    const [noteText, setNoteText] = useState('');

    const handleSaveNote = () => {
        if (!noteText.trim()) return;
        onAddNote(quote.id, noteText.trim());
        setNoteText('');
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString('es-CO', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-lg bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl">

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-800 flex-shrink-0">
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-emerald-500/80 mb-1">DETALLE DEL LEAD · {quote.id}</p>
                        <h2 className="text-xl font-bold text-white">{quote.clientName}</h2>
                        <div className="flex flex-col gap-1 mt-2">
                            <a href={`mailto:${quote.clientEmail}`} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
                                <Mail className="w-3.5 h-3.5 flex-shrink-0" />{quote.clientEmail}
                            </a>
                            <a href={`tel:${quote.clientPhone}`} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
                                <Phone className="w-3.5 h-3.5 flex-shrink-0" />{quote.clientPhone}
                            </a>
                        </div>
                    </div>
                    <button onClick={onClose} className="ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* ── Estado ── */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Cambiar Estado</label>
                        <select
                            value={quote.status}
                            onChange={(e) => onStatusChange(quote.id, e.target.value as QuoteStatus)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        >
                            {(Object.keys(STATUS_CONFIG) as QuoteStatus[]).map((s) => (
                                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                            ))}
                        </select>
                    </div>

                    {/* ── Asesor ── */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Asesor Asignado</label>
                        <select
                            value={quote.advisor}
                            onChange={(e) => onAdvisorChange(quote.id, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        >
                            {ADVISORS.map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>

                    {/* ── Detalle de la solicitud ── */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Detalle de la Solicitud</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                <p className="text-slate-500 text-xs mb-1 flex items-center gap-1.5"><Tag className="w-3 h-3" /> Modelo</p>
                                <p className="text-white font-semibold text-sm">{quote.modelInterest}</p>
                            </div>
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                <p className="text-slate-500 text-xs mb-1 flex items-center gap-1.5"><BarChart2 className="w-3 h-3" /> Presupuesto</p>
                                <p className="text-emerald-400 font-semibold text-sm">{quote.budget}</p>
                            </div>
                        </div>
                    </div>

                    {/* ── UTMs ── */}
                    <div className="space-y-3">
                        <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Trazabilidad de Marketing</p>
                        <div className="grid grid-cols-3 gap-2">
                            {(['source', 'medium', 'campaign'] as const).map((key) => (
                                <div key={key} className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                                    <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">utm_{key}</p>
                                    <p className="text-white text-xs font-medium truncate">{quote.utm?.[key] || '—'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Notas ── */}
                    <div className="space-y-4">
                        <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Notas Internas</p>

                        <div className="space-y-2">
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Redactar nueva nota..."
                                rows={3}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none transition-colors"
                            />
                            <button
                                onClick={handleSaveNote}
                                disabled={!noteText.trim()}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs rounded-lg transition-all"
                            >
                                <MessageSquare className="w-3.5 h-3.5" />
                                Guardar Nota
                            </button>
                        </div>

                        {quote.notes.length > 0 ? (
                            <div className="relative space-y-4 pl-5 border-l border-slate-800">
                                {quote.notes.map((note: Note) => (
                                    <div key={note.id} className="relative">
                                        <span className="absolute -left-[1.35rem] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-700 border-2 border-slate-950" />
                                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                                            <p className="text-slate-300 text-sm leading-relaxed">{note.text}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                    <User className="w-3 h-3" />
                                                    <span>{note.author}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{formatDate(note.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-600 text-sm text-center py-4">Sin notas aún.</p>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
