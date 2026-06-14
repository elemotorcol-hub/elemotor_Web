'use client';

import { useState, FormEvent } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { supportTicketsService, TicketCategory } from '@/services/support-tickets.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { value: TicketCategory; label: string }[] = [
  { value: 'general', label: 'Consulta general' },
  { value: 'technical', label: 'Problema técnico' },
  { value: 'billing', label: 'Facturación' },
  { value: 'delivery', label: 'Entrega / Pedido' },
];

export function SupportTicketModal({ isOpen, onClose }: Props) {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('general');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (message.trim().length < 20) {
      setError('El mensaje debe tener al menos 20 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await supportTicketsService.create({ subject: subject.trim(), message: message.trim(), category });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Ocurrió un error al crear el ticket. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state on close
    setSubject('');
    setCategory('general');
    setMessage('');
    setLoading(false);
    setSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0A110F] border border-white/10 rounded-2xl shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-bold text-base">Contactar Soporte</h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {success ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-400" />
              <p className="text-white font-semibold text-sm">
                ¡Ticket creado! Nuestro equipo te contactará pronto.
              </p>
              <button
                onClick={handleClose}
                className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-xs font-semibold">Asunto</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Describe brevemente tu problema"
                  className="bg-[#15201D] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-600/50 transition-colors"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-xs font-semibold">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TicketCategory)}
                  className="bg-[#15201D] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-600/50 transition-colors appearance-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value} className="bg-[#0A110F]">
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-xs font-semibold">
                  Mensaje <span className="text-slate-500 font-normal">(mín. 20 caracteres)</span>
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Cuéntanos más sobre tu problema..."
                  rows={4}
                  className="bg-[#15201D] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-600/50 transition-colors resize-none"
                />
                <span className={`text-[10px] text-right ${message.length < 20 && message.length > 0 ? 'text-red-400' : 'text-slate-600'}`}>
                  {message.length} / 20 mín.
                </span>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar ticket'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
