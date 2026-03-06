'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, ArrowRight, MessageCircle, Phone, Mail } from 'lucide-react';
import { VehicleInfo } from '@/mocks/vehiclesData';

import { submitQuoteAction } from '../../actions/quote'; // Server action para enviar leads

const quoteSchema = z.object({
    fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z.string().email('Ingresa un correo válido').min(1, 'Requerido'),
    phone: z.string().regex(/^\d{10,}$/, 'Debe contener solo números (mínimo 10 dígitos)'),
    city: z.string().min(1, 'Selecciona una ciudad'),
    model_id: z.string().min(1, 'Selecciona un modelo'),
    budget_range: z.string().min(1, 'Selecciona un presupuesto'),
    preferred_channel: z.enum(['whatsapp', 'call', 'email']),
    message: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

const inputClasses = "w-full bg-[#121c19] border border-white/5 rounded-xl px-4 py-3.5 text-[14px] text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition-all";
const labelClasses = "text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block";

interface Props {
    vehicles: VehicleInfo[];
    onModelChange: (modelId: string) => void;
}

export function QuoteForm({ vehicles, onModelChange }: Props) {
    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<QuoteFormValues>({
        resolver: zodResolver(quoteSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            city: '',
            model_id: vehicles[0]?.id || '',
            budget_range: '',
            preferred_channel: 'whatsapp',
            message: '',
        }
    });

    const selectedModelId = watch('model_id');
    const preferredChannel = watch('preferred_channel');

    useEffect(() => {
        onModelChange(selectedModelId);
    }, [selectedModelId, onModelChange]);

    const onSubmit = async (data: QuoteFormValues) => {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined) formData.append(key, value as string);
            });

            const result = await submitQuoteAction(formData);

            if (result.success) {
                alert('¡Cotización enviada con éxito! Un asesor te contactará.');
                // Aquí se podría usar un router.push('/thank-you') o limpiar form
            } else {
                alert(result.error || 'Ocurrió un error al enviar tu cotización.');
            }
        } catch (error) {
            console.error(error);
            alert('Error inesperado de red.');
        }
    };

    return (
        <div className="bg-[#131f1c] rounded-2xl border border-white/10 p-8 shadow-[0_0_40px_-15px_rgba(16,185,129,0.15)] relative z-10 h-full flex flex-col">
            <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Solicita Tu Cotización</h2>
                <p className="text-slate-400 text-sm">Un asesor te contactará en menos de 2 horas</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 flex-1">
                {/* File 1: Nombre y Correo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClasses}>Nombre Completo</label>
                        <input {...register('fullName')} type="text" placeholder="Ej: Juan Pérez" className={inputClasses} />
                        {errors.fullName && <p className="text-xs text-red-500 mt-1 font-medium">{errors.fullName.message}</p>}
                    </div>
                    <div>
                        <label className={labelClasses}>Correo Electrónico</label>
                        <input {...register('email')} type="email" placeholder="ejemplo@correo.com" className={inputClasses} />
                        {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>}
                    </div>
                </div>

                {/* File 2: Teléfono y Ciudad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClasses}>Teléfono</label>
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-slate-400 text-[14px] font-medium">+57</span>
                            <input {...register('phone')} type="tel" placeholder="300 000 0000" className={`${inputClasses} pl-12`} />
                        </div>
                        {errors.phone && <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label className={labelClasses}>Ciudad</label>
                        <div className="relative">
                            <select {...register('city')} className={`${inputClasses} appearance-none cursor-pointer`}>
                                <option value="" disabled>Selecciona una ciudad</option>
                                <option value="Bogota">Bogotá</option>
                                <option value="Medellin">Medellin</option>
                                <option value="Cali">Cali</option>
                                <option value="Barranquilla">Barranquilla</option>
                            </select>
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                        {errors.city && <p className="text-xs text-red-500 mt-1 font-medium">{errors.city.message}</p>}
                    </div>
                </div>

                {/* File 3: Modelo y Presupuesto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClasses}>Modelo de interés</label>
                        <div className="relative">
                            <select {...register('model_id')} className={`${inputClasses} appearance-none cursor-pointer`}>
                                <option value="" disabled>Selecciona un modelo</option>
                                {vehicles.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                        {errors.model_id && <p className="text-xs text-red-500 mt-1 font-medium">{errors.model_id.message}</p>}
                    </div>
                    <div>
                        <label className={labelClasses}>Presupuesto aproximado</label>
                        <div className="relative">
                            <select {...register('budget_range')} className={`${inputClasses} appearance-none cursor-pointer`}>
                                <option value="" disabled>Selecciona tu presupuesto</option>
                                <option value="100-150">100M - 150M COP</option>
                                <option value="150-200">150M - 200M COP</option>
                                <option value="200-250">200M - 250M COP</option>
                                <option value="250+">Más de 250M COP</option>
                            </select>
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                        {errors.budget_range && <p className="text-xs text-red-500 mt-1 font-medium">{errors.budget_range.message}</p>}
                    </div>
                </div>

                {/* Preferencia de contacto */}
                <div>
                    <label className={labelClasses}>Preferencia de contacto</label>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => setValue('preferred_channel', 'whatsapp')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-[13px] font-bold transition-all ${preferredChannel === 'whatsapp' ? 'bg-[#00D4AA] border-[#00D4AA] text-[#0A0F1C]' : 'bg-[#121c19] border-white/10 text-slate-300 hover:border-white/20'}`}
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">WhatsApp</span>
                            <span className="sm:hidden">WApp</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setValue('preferred_channel', 'call')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-[13px] font-bold transition-all ${preferredChannel === 'call' ? 'bg-[#00D4AA] border-[#00D4AA] text-[#0A0F1C]' : 'bg-[#121c19] border-white/10 text-slate-300 hover:border-white/20'}`}
                        >
                            <Phone className="w-4 h-4" />
                            Llamada
                        </button>
                        <button
                            type="button"
                            onClick={() => setValue('preferred_channel', 'email')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-[13px] font-bold transition-all ${preferredChannel === 'email' ? 'bg-[#00D4AA] border-[#00D4AA] text-[#0A0F1C]' : 'bg-[#121c19] border-white/10 text-slate-300 hover:border-white/20'}`}
                        >
                            <Mail className="w-4 h-4" />
                            Email
                        </button>
                    </div>
                </div>

                {/* Mensaje */}
                <div>
                    <label className={labelClasses}>Mensaje adicional (Opcional)</label>
                    <textarea
                        {...register('message')}
                        placeholder="¿Tienes alguna duda específica?"
                        rows={3}
                        className={`${inputClasses} resize-none`}
                    />
                </div>

                {/* Espaciador flexible para empujar botón abajo si hay espacio */}
                <div className="flex-1"></div>

                {/* Botón enviar */}
                <div className="mt-2 text-center">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#00D4AA] hover:bg-[#00B38F] text-[#0A0F1C] font-black text-[15px] py-4 rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(0,212,170,0.2)] hover:shadow-[0_6px_20px_rgba(0,212,170,0.3)] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar Cotización'}
                        {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                    </button>
                    <div className="flex items-center justify-center gap-1.5 mt-4">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Tus datos están protegidos</span>
                    </div>
                </div>
            </form>
        </div>
    );
}
