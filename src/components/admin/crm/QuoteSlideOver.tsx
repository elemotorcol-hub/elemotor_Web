import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, X, User, Clock, FileText, DollarSign, Car } from 'lucide-react';
import { type Quote, type QuoteStatus, type Note } from '@/types/crm';
import { STATUS_CONFIG } from '@/config/crm';
import { quoteSchema, QuoteFormData } from '@/schemas/quoteSchema';
import { sanitizeObject } from '@/lib/utils/sanitizationUtils';
import { HoneyPot } from '@/components/common/HoneyPot';
import { userAdminService, AdminUser } from '@/services/user_admin.service';
import { getClientSession } from '@/actions/session';

interface QuoteSlideOverProps {
    quote: Quote;
    onClose: () => void;
    onUpdate: (data: Omit<Partial<Quote>, 'notes'> & { notes?: string }) => Promise<void>;
}

export function QuoteSlideOver({ onClose, quote, onUpdate }: QuoteSlideOverProps) {
    const [advisors, setAdvisors] = useState<AdminUser[]>([]);

    const methods = useForm<QuoteFormData>({
        resolver: zodResolver(quoteSchema),
        mode: 'onChange',
        defaultValues: {
            name: quote?.name || '',
            email: quote?.email || '',
            phone: quote?.phone || '',
            modelInterest: quote?.modelInterest || quote?.model?.name || '',
            status: quote?.status || 'pending',
            budgetRange: quote?.budgetRange ? Number(quote.budgetRange) : undefined,
            assignedToId: quote?.assignedToId || undefined,
            notes: ''
        }
    });

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = methods;

    useEffect(() => {
        const init = async () => {
            try {
                // Fetch advisors
                const [admins, superAdmins] = await Promise.all([
                    userAdminService.getUsers({ role: 'admin' }),
                    userAdminService.getUsers({ role: 'super_admin' }),
                ]);
                setAdvisors([...(admins.data || []), ...(superAdmins.data || [])]);

                // Auto-assign current user if no advisor is set
                if (!quote.assignedToId) {
                    const session = await getClientSession();
                    if (session?.user?.id) {
                        setValue('assignedToId', Number(session.user.id));
                    }
                }
            } catch (error) {
                console.error('Error loading CRM panel:', error);
            }
        };
        init();
    }, [quote.assignedToId, setValue]);

    const onSubmit = async (data: QuoteFormData) => {
        const sanitizedData = sanitizeObject(data);
        if (sanitizedData.nickname) return;

        const updateData: any = {};
        
        if (sanitizedData.name !== quote.name) updateData.name = sanitizedData.name;
        if (sanitizedData.email !== quote.email) updateData.email = sanitizedData.email;
        if (sanitizedData.phone !== quote.phone) updateData.phone = sanitizedData.phone;
        if (sanitizedData.status !== quote.status) updateData.status = sanitizedData.status;
        if (sanitizedData.assignedToId !== quote.assignedToId) updateData.assignedToId = sanitizedData.assignedToId ? Number(sanitizedData.assignedToId) : null;
        if (sanitizedData.modelInterest !== quote.modelInterest) updateData.modelInterest = sanitizedData.modelInterest;
        if (Number(sanitizedData.budgetRange) !== Number(quote.budgetRange)) updateData.budgetRange = Number(sanitizedData.budgetRange);
        if (sanitizedData.notes) updateData.notes = sanitizedData.notes;

        if (Object.keys(updateData).length > 0) {
            await onUpdate(updateData);
            if (sanitizedData.notes) {
                reset({ ...data, notes: '' });
            }
        }
        
        onClose();
    };

    const formatDate = (iso: string) =>
        iso ? new Date(iso).toLocaleString('es-CO', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        }) : '—';

    return (
        <FormProvider {...methods}>
            <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
            
            <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-lg bg-[#0A110F] border-l border-white/5 flex flex-col shadow-2xl">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                    <HoneyPot />
                    
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 border-b border-white/5 flex-shrink-0">
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.2em] text-[#10B981] mb-1">DETALLE DEL LEAD · {quote.referenceCode}</p>
                            <input 
                                {...register('name')}
                                className="text-xl font-bold bg-transparent text-white focus:outline-none border-b border-transparent focus:border-[#10B981]/50 w-full mb-2"
                                placeholder="Nombre del cliente"
                            />
                            {errors.name && <p className="text-[10px] text-red-400 mb-2">{errors.name.message}</p>}
                            
                            <div className="flex flex-col gap-2 mt-2">
                                <div className="flex items-center gap-2 group">
                                    <Mail className="w-3.5 h-3.5 text-slate-500 group-focus-within:text-[#10B981] transition-colors" />
                                    <input 
                                        {...register('email')}
                                        className="bg-transparent text-slate-400 text-sm focus:outline-none border-b border-transparent focus:border-[#10B981]/30 w-full"
                                        placeholder="Email"
                                    />
                                </div>
                                {errors.email && <p className="text-[10px] text-red-400">{errors.email.message}</p>}

                                <div className="flex items-center gap-2 group">
                                    <Phone className="w-3.5 h-3.5 text-slate-500 group-focus-within:text-[#10B981] transition-colors" />
                                    <input 
                                        {...register('phone')}
                                        className="bg-transparent text-slate-400 text-sm focus:outline-none border-b border-transparent focus:border-[#10B981]/30 w-full"
                                        placeholder="Teléfono"
                                    />
                                </div>
                                {errors.phone && <p className="text-[10px] text-red-400">{errors.phone.message}</p>}
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
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]/30 transition-all"
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
                                    {...register('budgetRange', { setValueAs: (v) => v === '' || v === null ? undefined : Number(v) })}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]/30 transition-all"
                                />
                                {errors.budgetRange && <p className="text-[10px] text-red-400">{errors.budgetRange.message}</p>}
                            </div>
                        </div>

                        {/* Advisor */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-3 h-3 text-[#10B981]" />
                                Asesor Asignado
                            </label>
                            <select 
                                {...register('assignedToId')}
                                className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#10B981]/30 transition-all appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-[#0A110F]">Sin asignar</option>
                                {advisors.map((advisor) => (
                                    <option key={advisor.id} value={advisor.id} className="bg-[#0A110F]">
                                        {advisor.name} ({advisor.role})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Notes Feed */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <FileText className="w-3 h-3 text-[#10B981]" />
                                Seguimiento Interno
                            </label>
                            
                            <div className="space-y-2">
                                <textarea
                                    {...register('notes')}
                                    placeholder="Añadir una nota de gestión..."
                                    className="w-full h-24 bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981]/30 resize-none transition-all"
                                />
                                {errors.notes && <p className="text-[10px] text-red-400">{errors.notes.message}</p>}
                            </div>

                            {quote.notes && quote.notes.length > 0 && (
                                <div className="space-y-3 pt-2">
                                    {quote.notes.map((note: Note) => (
                                        <div key={note.id} className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-2 hover:bg-white/[0.07] transition-all">
                                            <p className="text-slate-300 text-xs leading-relaxed">{note.text}</p>
                                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium pt-1 border-t border-white/5">
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
                    <div className="p-6 border-t border-white/5 bg-[#0A110F] flex flex-col gap-3 flex-shrink-0">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-[#10B981] hover:bg-[#0E9F6E] disabled:opacity-50 text-slate-900 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)] active:scale-[0.98]"
                        >
                            {isSubmitting ? 'Guardando...' : 'Aplicar Cambios'}
                        </button>
                    </div>
                </form>
            </aside>
        </FormProvider>
    );
}
