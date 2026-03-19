'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, X, User, Clock, FileText, DollarSign, Car } from 'lucide-react';
import { type Quote, type QuoteStatus, type Note } from '@/types/crm';
import { STATUS_CONFIG, ADVISORS } from '@/config/crm';
import { quoteSchema, QuoteFormData } from '@/schemas/quoteSchema';
import { sanitizeObject } from '@/lib/utils/sanitizationUtils';
import { HoneyPot } from '@/components/common/HoneyPot';

interface QuoteSlideOverProps {
    isOpen: boolean;
    quote: Quote;
    onClose: () => void;
    onUpdateStatus: (id: string, status: QuoteStatus) => void;
    onAddNote: (id: string, text: string) => void;
}

export function QuoteSlideOver({ isOpen, onClose, quote, onUpdateStatus, onAddNote }: QuoteSlideOverProps) {
    const methods = useForm<QuoteFormData>({
        resolver: zodResolver(quoteSchema),
        mode: 'onChange',
        defaultValues: {
            clientName: quote?.clientName || '',
            modelInterest: quote?.modelInterest || '',
            status: quote?.status || 'nuevo',
            totalAmount: typeof quote?.budget === 'string' 
                ? parseFloat(quote.budget.replace(/[^0-9.-]+/g, "")) || 0 
                : 0,
            advisor: quote?.advisor || 'María García',
            notes: ''
        }
    });

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = methods;

    if (!isOpen || !quote) return null;

    const onSubmit = async (data: QuoteFormData) => {
        // Level 2 Security: Sanitization
        const sanitizedData = sanitizeObject(data);
        
        if (sanitizedData.nickname) return; // Level 3 Bot trap

        if (onUpdateStatus && sanitizedData.status !== quote.status) {
            onUpdateStatus(quote.id, sanitizedData.status as QuoteStatus);
        }

        if (sanitizedData.notes && onAddNote) {
            onAddNote(quote.id, sanitizedData.notes);
            reset({ ...data, notes: '' });
        }
        
        // Simulate save for the rest
        await new Promise(resolve => setTimeout(resolve, 800));
        onClose();
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString('es-CO', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    return (
        <FormProvider {...methods}>
            <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
            
            <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-lg bg-[#0A110F] border-l border-white/5 flex flex-col shadow-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                    <HoneyPot />
                    
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 border-b border-white/5 flex-shrink-0">
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.2em] text-[#10B981] mb-1">DETALLE DEL LEAD · {quote.id}</p>
                            <h2 className="text-xl font-bold text-white">{quote.clientName}</h2>
                            <div className="flex flex-col gap-1 mt-2">
                                <span className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Mail className="w-3.5 h-3.5" />{quote.clientEmail}
                                </span>
                                <span className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Phone className="w-3.5 h-3.5" />{quote.clientPhone}
                                </span>
                            </div>
                        </div>
                        <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {/* Status */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-3 h-3 text-[#10B981]" />
                                Cambiar Estado
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {(Object.keys(STATUS_CONFIG) as QuoteStatus[]).map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setValue('status', s, { shouldValidate: true })}
                                        className={`px-3 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${
                                            watch('status') === s
                                                ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981]'
                                                : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'
                                        }`}
                                    >
                                        {STATUS_CONFIG[s].label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Financials & Model */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Car className="w-3 h-3 text-[#10B981]" />
                                    Modelo
                                </label>
                                <input 
                                    {...register('modelInterest')}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]/30"
                                />
                                {errors.modelInterest && <p className="text-[10px] text-red-400">{errors.modelInterest.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <DollarSign className="w-3 h-3 text-[#10B981]" />
                                    Presupuesto
                                </label>
                                <input 
                                    type="number"
                                    {...register('totalAmount', { valueAsNumber: true })}
                                    onKeyDown={(e) => {
                                        if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                                    }}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]/30"
                                />
                                {errors.totalAmount && <p className="text-[10px] text-red-400">{errors.totalAmount.message}</p>}
                            </div>
                        </div>

                        {/* Advisor */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-3 h-3 text-[#10B981]" />
                                Asesor Asignado
                            </label>
                            <select 
                                {...register('advisor')}
                                className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]/30"
                            >
                                {ADVISORS.map(a => <option key={a} value={a} className="bg-[#0A110F]">{a}</option>)}
                            </select>
                            {errors.advisor && <p className="text-[10px] text-red-400">{errors.advisor.message}</p>}
                        </div>

                        {/* Notes Feed */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Seguimiento Interno</label>
                            
                            <div className="space-y-2">
                                <textarea
                                    {...register('notes')}
                                    placeholder="Añadir una nota de gestión..."
                                    className="w-full h-24 bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981]/30 resize-none transition-all"
                                />
                                {errors.notes && <p className="text-[10px] text-red-400">{errors.notes.message}</p>}
                            </div>

                            {quote.notes.length > 0 && (
                                <div className="space-y-3 pt-2">
                                    {quote.notes.map((note: Note) => (
                                        <div key={note.id} className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-2">
                                            <p className="text-slate-300 text-xs leading-relaxed">{note.text}</p>
                                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                                                <span className="flex items-center gap-1"><User className="w-2.5 h-2.5" />{note.author}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{formatDate(note.createdAt)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/5 bg-[#0A110F] flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-[#10B981] hover:bg-[#0E9F6E] disabled:opacity-50 text-slate-900 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_20_rgba(16,185,129,0.2)]"
                        >
                            {isSubmitting ? 'Guardando...' : 'Aplicar Cambios'}
                        </button>
                    </div>
                </form>
            </aside>
        </FormProvider>
    );
}
