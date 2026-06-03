'use client';

import { useEffect } from 'react';
import { X, CalendarClock } from 'lucide-react';
import { AppointmentForm } from '@/components/talleres/AppointmentForm';

interface ScheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleAppointmentModal({ isOpen, onClose }: ScheduleAppointmentModalProps) {
  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0A110F]/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#0f1e18] border border-white/5 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
              <CalendarClock className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] text-emerald-500/80 uppercase mb-0.5">
                Servicio Técnico
              </p>
              <h2 className="text-xl font-light text-white">
                Agenda tu{' '}
                <span className="font-black">mantenimiento</span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <div className="overflow-y-auto p-6">
          <AppointmentForm onSuccess={() => setTimeout(onClose, 3000)} />
        </div>
      </div>
    </div>
  );
}
