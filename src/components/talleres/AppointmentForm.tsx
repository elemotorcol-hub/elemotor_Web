'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { createAppointment } from '@/services/appointments.service';
import { workshopService } from '@/services/workshop.service';
import { orderService } from '@/services/order.service';
import { getSession } from '@/lib/auth.client';
import type { WorkshopResponse } from '@/services/workshop.service';

const SERVICE_TYPES = [
    'Mantenimiento preventivo',
    'Revisión general',
    'Frenos y suspensión',
    'Batería y sistema eléctrico',
    'Actualización de software',
    'Diagnóstico eléctrico',
    'Otro',
];

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all';
const labelCls = 'block text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase mb-1.5';

interface FormState {
    name: string;
    email: string;
    phone: string;
    vehicleDescription: string;
    workshopId: string;
    preferredDate: string;
    preferredTime: string;
    notes: string;
}

const EMPTY: FormState = {
    name: '',
    email: '',
    phone: '',
    vehicleDescription: '',
    workshopId: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
};

export function AppointmentForm({ onSuccess, initialWorkshopId }: { onSuccess?: () => void; initialWorkshopId?: number } = {}) {
    const [form, setForm] = useState<FormState>({ ...EMPTY, workshopId: initialWorkshopId ? String(initialWorkshopId) : '' });
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [workshops, setWorkshops] = useState<WorkshopResponse[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pre-fill from session + user vehicle
    useEffect(() => {
        getSession().then(async (session) => {
            if (!session?.user) return;
            setForm((prev) => ({
                ...prev,
                name: session.user.name || '',
                email: session.user.email || '',
            }));
            // Try to get user's registered vehicle
            try {
                const vehicle = await orderService.fetchMyVehicle();
                if (vehicle?.trim?.model) {
                    const brand = vehicle.trim.model.brand?.name ?? '';
                    const model = vehicle.trim.model.name ?? '';
                    const trim = vehicle.trim.name ?? '';
                    setForm((prev) => ({
                        ...prev,
                        vehicleDescription: `${brand} ${model} ${trim}`.trim(),
                    }));
                }
            } catch {
                // No vehicle registered — leave field empty
            }
        });

        workshopService
            .fetchWorkshops('?limit=100')
            .then((res) => setWorkshops(res.data))
            .catch(() => {});
    }, []);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setForm((prev) => ({ ...prev, [name]: value }));
        },
        [],
    );

    const toggleService = useCallback((service: string) => {
        setSelectedServices((prev) =>
            prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
        );
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (selectedServices.length === 0) {
                setError('Selecciona al menos un tipo de servicio.');
                return;
            }
            setError(null);
            setSubmitting(true);
            const vehicleNote = form.vehicleDescription.trim()
                ? `Vehículo: ${form.vehicleDescription.trim()}. `
                : '';
            const userNotes = form.notes.trim();
            try {
                await createAppointment({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    workshopId: form.workshopId ? Number(form.workshopId) : undefined,
                    preferredDate: form.preferredDate,
                    preferredTime: form.preferredTime || undefined,
                    serviceType: selectedServices.join(', '),
                    notes: `${vehicleNote}${userNotes}` || undefined,
                });
                setSuccess(true);
                setForm(EMPTY);
                setSelectedServices([]);
                onSuccess?.();
            } catch (err: any) {
                setError(err?.message ?? 'Ocurrió un error. Intenta nuevamente.');
            } finally {
                setSubmitting(false);
            }
        },
        [form, selectedServices],
    );

    const today = new Date().toISOString().split('T')[0];

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">¡Solicitud enviada!</h3>
                <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                    Recibimos tu solicitud. Nuestro equipo se pondrá en contacto contigo pronto para confirmar la cita.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-8 px-6 py-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold transition-all"
                >
                    Agendar otra cita
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre + Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>Nombre completo <span className="text-emerald-400">*</span></label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Juan Pérez" className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>Teléfono <span className="text-emerald-400">*</span></label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="3001234567" className={inputCls} />
                </div>
            </div>

            {/* Email */}
            <div>
                <label className={labelCls}>Correo electrónico <span className="text-emerald-400">*</span></label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="correo@ejemplo.com" className={inputCls} />
            </div>

            {/* Vehículo */}
            <div>
                <label className={labelCls}>
                    Vehículo <span className="text-slate-600 normal-case font-normal tracking-normal text-[10px]">(opcional)</span>
                </label>
                <input
                    type="text"
                    name="vehicleDescription"
                    value={form.vehicleDescription}
                    onChange={handleChange}
                    placeholder="Ej: BYD Atto 3, Aion UT..."
                    className={inputCls}
                />
            </div>

            {/* Tipo de servicio — multi-selección */}
            <div>
                <label className={labelCls}>
                    Tipo de servicio <span className="text-emerald-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                    {SERVICE_TYPES.map((s) => {
                        const active = selectedServices.includes(s);
                        return (
                            <button
                                key={s}
                                type="button"
                                onClick={() => toggleService(s)}
                                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                                    active
                                        ? 'bg-emerald-500 border-emerald-500 text-black'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-emerald-500/40 hover:text-white'
                                }`}
                            >
                                {s}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Taller */}
            <div>
                <label className={labelCls}>
                    Taller preferido <span className="text-slate-600 normal-case font-normal tracking-normal text-[10px]">(opcional)</span>
                </label>
                <select
                    name="workshopId"
                    value={form.workshopId}
                    onChange={handleChange}
                    className="w-full bg-[#0d1a16] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all appearance-none"
                >
                    <option value="">Cualquier taller disponible</option>
                    {workshops.map((w) => (
                        <option key={w.id} value={w.id} className="bg-[#0d1a16]">
                            {w.name}{w.city ? ` — ${w.city}` : ''}
                        </option>
                    ))}
                </select>
            </div>

            {/* Fecha + Hora */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelCls}>Fecha preferida <span className="text-emerald-400">*</span></label>
                    <input type="date" name="preferredDate" value={form.preferredDate} onChange={handleChange} required min={today} className={`${inputCls} [color-scheme:dark]`} />
                </div>
                <div>
                    <label className={labelCls}>
                        Hora preferida <span className="text-slate-600 normal-case font-normal tracking-normal text-[10px]">(opcional)</span>
                    </label>
                    <input type="time" name="preferredTime" value={form.preferredTime} onChange={handleChange} className={`${inputCls} [color-scheme:dark]`} />
                </div>
            </div>

            {/* Notas */}
            <div>
                <label className={labelCls}>
                    Notas adicionales <span className="text-slate-600 normal-case font-normal tracking-normal text-[10px]">(opcional)</span>
                </label>
                <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    maxLength={1000}
                    placeholder="Cuéntanos sobre el problema o el servicio que necesitas..."
                    className={`${inputCls} resize-none`}
                />
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2"
            >
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Enviando...</> : 'Agendar cita'}
            </button>
        </form>
    );
}
