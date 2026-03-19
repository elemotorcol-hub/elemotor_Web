'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Calendar, MapPin, Wrench, Clock, CheckCircle2, ChevronDown, AlertCircle } from 'lucide-react';
import { WORKSHOPS_DATA } from '@/mocks/talleresData';
import { Button } from '@/components/Button';
import { maintenanceSchema, MaintenanceFormData } from '@/schemas/maintenanceSchema';
import { sanitizeObject } from '@/lib/utils/sanitizationUtils';
import { HoneyPot } from '@/components/common/HoneyPot';

interface ScheduleMaintenanceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ScheduleMaintenanceModal({ isOpen, onClose }: ScheduleMaintenanceModalProps) {
    const [step, setStep] = useState<'form' | 'success'>('form');
    
    const methods = useForm<MaintenanceFormData>({
        resolver: zodResolver(maintenanceSchema),
        mode: 'onChange',
        defaultValues: {
            workshopId: '',
            date: '',
            time: '',
            serviceType: 'Mantenimiento General',
            phone: '',
            email: '',
            notes: ''
        }
    });

    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = methods;

    const today = new Date().toISOString().split('T')[0];

    if (!isOpen) return null;

    const onSubmit = async (data: MaintenanceFormData) => {
        // Level 2 Security: Sanitization
        const sanitizedData = sanitizeObject(data);
        
        // Level 3 Governance: Check HoneyPot (Zod does this via schema, but we double check)
        if (sanitizedData.nickname) {
            console.error('Bot submission blocked');
            return;
        }

        console.log('Final Prepared Data (Safe):', sanitizedData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStep('success');
    };

    const handleReset = () => {
        setStep('form');
        reset();
        onClose();
    };

    const serviceTypes = [
        'Mantenimiento General',
        'Diagnóstico Eléctrico',
        'Revisión de Batería',
        'Frenos y Suspensión',
        'Actualización de Software'
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#0A110F]/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={handleReset}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-xl bg-[#15201D] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Agendar <span className="text-[#10B981]">Cita</span></h2>
                        <p className="text-slate-400 text-sm mt-1">Programa tu próximo servicio especializado.</p>
                    </div>
                    <button 
                        onClick={handleReset}
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    {step === 'form' ? (
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Level 3 Detection */}
                                <HoneyPot />

                                {/* Workshop Selection */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-[#10B981]" />
                                        Seleccionar Taller <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <select
                                            {...register('workshopId')}
                                            className={`w-full bg-[#0A110F] border rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none transition-all appearance-none cursor-pointer group-hover:border-white/10 ${errors.workshopId ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#10B981]/50'}`}
                                        >
                                            <option value="" disabled>Elige un centro de servicio</option>
                                            {WORKSHOPS_DATA.map(workshop => (
                                                <option key={workshop.id} value={workshop.id}>
                                                    {workshop.name} - {workshop.city}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    </div>
                                    {errors.workshopId && <p className="text-[10px] font-bold text-red-400 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.workshopId.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Date */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-[#10B981]" />
                                            Fecha <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            min={today}
                                            {...register('date')}
                                            className={`w-full bg-[#0A110F] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all [color-scheme:dark] ${errors.date ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#10B981]/50'}`}
                                        />
                                        {errors.date && <p className="text-[10px] font-bold text-red-400 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.date.message}</p>}
                                    </div>

                                    {/* Time */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-[#10B981]" />
                                            Hora <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            {...register('time')}
                                            className={`w-full bg-[#0A110F] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all appearance-none cursor-pointer ${errors.time ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#10B981]/50'}`}
                                        >
                                            <option value="" disabled>Selecciona hora</option>
                                            <option value="08:00 AM">08:00 AM</option>
                                            <option value="10:00 AM">10:00 AM</option>
                                            <option value="12:00 PM">12:00 PM</option>
                                            <option value="02:00 PM">02:00 PM</option>
                                            <option value="04:00 PM">04:00 PM</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Teléfono <span className="text-red-500">*</span></label>
                                        <input
                                            type="tel"
                                            placeholder="+57..."
                                            {...register('phone')}
                                            onKeyDown={(e) => {
                                                // Permitir números, retroceso, tab, flechas y el signo +
                                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', '+', 'Delete'];
                                                if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className={`w-full bg-[#0A110F] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all ${errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#10B981]/50'}`}
                                        />
                                        {errors.phone && <p className="text-[10px] font-bold text-red-400 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.phone.message}</p>}
                                    </div>
                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Email <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            placeholder="tu@email.com"
                                            {...register('email')}
                                            className={`w-full bg-[#0A110F] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-[#10B981]/50'}`}
                                        />
                                        {errors.email && <p className="text-[10px] font-bold text-red-400 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.email.message}</p>}
                                    </div>
                                </div>

                            {/* Service Type */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Wrench className="w-3 h-3 text-[#10B981]" />
                                    Tipo de Servicio
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {serviceTypes.map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => methods.setValue('serviceType', type, { shouldValidate: true })}
                                            className={`px-3 py-2 rounded-lg text-[11px] font-bold border transition-all ${
                                                watch('serviceType') === type 
                                                    ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981]' 
                                                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description / Notes */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Descripción del problema</label>
                                    <span className={`text-[10px] font-bold ${(watch('notes') || '').length >= 450 ? 'text-orange-500' : 'text-slate-500'}`}>
                                        {(watch('notes') || '').length}/500
                                    </span>
                                </div>
                                <textarea
                                    maxLength={500}
                                    placeholder="Describe brevemente el motivo de tu visita..."
                                    {...register('notes')}
                                    className="w-full h-24 bg-[#0A110F] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10B981]/50 transition-all resize-none"
                                />
                                {errors.notes && <p className="text-[10px] font-bold text-red-400 mt-1">{errors.notes.message}</p>}
                            </div>

                            {/* Footer CTAs */}
                            <div className="pt-4 flex flex-col gap-3">
                                <Button 
                                    type="submit" 
                                    isLoading={isSubmitting}
                                    className="w-full bg-[#10B981] hover:bg-[#0E9F6E] text-slate-900 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all"
                                >
                                    Confirmar Cita
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                    ) : (
                        <div className="text-center py-10 animate-in fade-in zoom-in-95 duration-500">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#10B981]/10 border-2 border-[#10B981]/20 mb-6">
                                <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2">¡Cita Agendada!</h3>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
                                Tu solicitud ha sido procesada. Recibirás un correo de confirmación con los detalles de tu cita en breve.
                            </p>
                            <Button onClick={handleReset} variant="ghost" className="px-10 border-white/10 hover:bg-white/5 text-white font-bold rounded-xl py-3 text-xs uppercase tracking-widest">
                                Entendido
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
