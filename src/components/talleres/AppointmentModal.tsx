'use client';

import { useState, useEffect } from 'react';
import { X, CalendarCheck } from 'lucide-react';
import { AppointmentForm } from './AppointmentForm';

export function AppointmentModal() {
    const [open, setOpen] = useState(false);

    // Bloquear scroll del body cuando la modal está abierta
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    // Cerrar con Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    return (
        <>
            {/* Botón flotante */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-8 left-8 z-40 flex items-center gap-2.5 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_8px_32px_rgba(16,185,129,0.4)] hover:shadow-[0_8px_40px_rgba(16,185,129,0.6)] transition-all active:scale-[0.97]"
            >
                <CalendarCheck className="w-5 h-5" />
                Agendar Cita
            </button>

            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
                >
                    {/* Modal */}
                    <div className="relative w-full max-w-lg max-h-[90vh] bg-[#0f1e18] border border-white/5 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-white/5 shrink-0">
                            <div>
                                <p className="text-[10px] font-bold tracking-[0.25em] text-emerald-500/80 uppercase mb-1">
                                    Servicio Técnico
                                </p>
                                <h2 className="text-xl font-light text-white">
                                    Agenda tu{' '}
                                    <span className="font-black">mantenimiento</span>
                                </h2>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form (scrollable) */}
                        <div className="overflow-y-auto p-6">
                            <AppointmentForm onSuccess={() => setTimeout(() => setOpen(false), 3000)} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
