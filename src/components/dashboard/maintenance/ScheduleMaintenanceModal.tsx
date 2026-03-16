'use client';

import React, { useState } from 'react';
import { X, Calendar, MapPin, Wrench, Clock, CheckCircle2, ChevronDown } from 'lucide-react';
import { WORKSHOPS_DATA } from '@/mocks/talleresData';
import { Button } from '@/components/Button';

interface ScheduleMaintenanceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ScheduleMaintenanceModal({ isOpen, onClose }: ScheduleMaintenanceModalProps) {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [formData, setFormData] = useState({
        workshopId: '',
        date: '',
        time: '',
        serviceType: 'Mantenimiento General',
        phone: '',
        email: '',
        notes: ''
    });

    const today = new Date().toISOString().split('T')[0];

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setStep('success');
    };

    const handleReset = () => {
        setStep('form');
        setFormData({
            workshopId: '',
            date: '',
            time: '',
            serviceType: 'Mantenimiento General',
            phone: '',
            email: '',
            notes: ''
        });
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
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Workshop Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="w-3 h-3 text-[#10B981]" />
                                    Seleccionar Taller
                                </label>
                                <div className="relative group">
                                    <select
                                        required
                                        value={formData.workshopId}
                                        onChange={(e) => setFormData({ ...formData, workshopId: e.target.value })}
                                        className="w-full bg-[#0A110F] border border-white/5 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#10B981]/50 transition-all appearance-none cursor-pointer group-hover:border-white/10"
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
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Date */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-[#10B981]" />
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        min={today}
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full bg-[#0A110F] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10B981]/50 transition-all [color-scheme:dark]"
                                    />
                                </div>

                                {/* Time */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-[#10B981]" />
                                        Hora
                                    </label>
                                    <select
                                        required
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full bg-[#0A110F] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10B981]/50 transition-all appearance-none cursor-pointer"
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
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Teléfono de Contacto</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+57..."
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-[#0A110F] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10B981]/50 transition-all"
                                    />
                                </div>
                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Email</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="tu@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-[#0A110F] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10B981]/50 transition-all"
                                    />
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
                                            onClick={() => setFormData({ ...formData, serviceType: type })}
                                            className={`px-3 py-2 rounded-lg text-[11px] font-bold border transition-all ${
                                                formData.serviceType === type 
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
                                    <span className={`text-[10px] font-bold ${formData.notes.length >= 450 ? 'text-orange-500' : 'text-slate-500'}`}>
                                        {formData.notes.length}/500
                                    </span>
                                </div>
                                <textarea
                                    maxLength={500}
                                    placeholder="Describe brevemente el motivo de tu visita..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full h-24 bg-[#0A110F] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10B981]/50 transition-all resize-none"
                                />
                            </div>

                            {/* Footer CTAs */}
                            <div className="pt-4 flex flex-col gap-3">
                                <Button type="submit" className="w-full bg-[#10B981] hover:bg-[#0E9F6E] text-slate-900 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all">
                                    Confirmar Cita
                                </Button>
                            </div>
                        </form>
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
