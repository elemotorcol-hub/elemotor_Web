'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, MapPin, Wrench, Star, DollarSign, CheckCircle2, ChevronDown, AlertCircle } from 'lucide-react';
import { workshopService, WorkshopResponse } from '@/services/workshop.service';
import { Button } from '@/components/Button';

// ─── Schema ───────────────────────────────────────────────────────────────────

const markDoneSchema = z.object({
  date: z.string().min(1, 'La fecha es obligatoria'),
  type: z.string().min(1, 'El tipo de mantenimiento es obligatorio'),
  workshopId: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  cost: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().positive().optional(),
  ),
  comment: z.string().max(500).optional(),
});

type MarkDoneFormData = z.infer<typeof markDoneSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

interface MarkMaintenanceDoneModalProps {
  isOpen: boolean;
  orderId: number;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (data: {
    orderId: number;
    date: string;
    type: string;
    workshopId?: number;
    rating?: number;
    comment?: string;
    cost?: number;
  }) => Promise<void>;
}

const SERVICE_TYPES = [
  'Preventivo',
  'Revisión General',
  'Frenos y Suspensión',
  'Batería',
  'Actualización de Software',
  'Diagnóstico Eléctrico',
  'Otro',
];

const today = new Date().toISOString().split('T')[0];

export function MarkMaintenanceDoneModal({
  isOpen,
  orderId,
  isSaving,
  onClose,
  onSubmit,
}: MarkMaintenanceDoneModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [workshops, setWorkshops] = useState<WorkshopResponse[]>([]);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(markDoneSchema),
    defaultValues: { date: today, type: 'Preventivo' },
  });

  const selectedRating = watch('rating') ?? 0;
  const selectedType = watch('type');

  // Load workshops on mount
  useEffect(() => {
    if (!isOpen) return;
    workshopService
      .fetchWorkshops('?limit=100')
      .then((res) => setWorkshops(res.data))
      .catch(() => setWorkshops([]));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep('form');
    reset();
    onClose();
  };

  const submitHandler = async (data: MarkDoneFormData) => {
    await onSubmit({
      orderId,
      date: data.date,
      type: data.type,
      workshopId: data.workshopId ? Number(data.workshopId) : undefined,
      rating: data.rating,
      comment: data.comment || undefined,
      cost: data.cost,
    });
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0A110F]/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-[#15201D] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Registrar <span className="text-[#10B981]">Mantenimiento</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">Marca este servicio como realizado.</p>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1">
          {step === 'form' ? (
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
              {/* Date */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-[#10B981]" />
                  Fecha de realización <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  max={today}
                  {...register('date')}
                  className={`w-full bg-[#0A110F] border rounded-xl px-4 py-3 text-white text-sm focus:outline-none transition-all scheme-dark ${errors.date ? 'border-red-500/50' : 'border-white/5 focus:border-[#10B981]/50'}`}
                />
                {errors.date && (
                  <p className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                    <AlertCircle size={10} /> {errors.date.message}
                  </p>
                )}
              </div>

              {/* Service Type */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Wrench className="w-3 h-3 text-[#10B981]" />
                  Tipo de mantenimiento <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SERVICE_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setValue('type', type, { shouldValidate: true })}
                      className={`px-3 py-2 rounded-lg text-[11px] font-bold border transition-all ${
                        selectedType === type
                          ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981]'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Workshop */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-[#10B981]" />
                  Taller (opcional)
                </label>
                <div className="relative">
                  <select
                    {...register('workshopId')}
                    className="w-full bg-[#0A110F] border border-white/5 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#10B981]/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Sin especificar</option>
                    {workshops.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}{w.city ? ` — ${w.city}` : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  Calificación del servicio (opcional)
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() =>
                        setValue('rating', selectedRating === star ? undefined : star, {
                          shouldValidate: true,
                        })
                      }
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= (hoverRating || selectedRating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  {selectedRating > 0 && (
                    <span className="text-slate-500 text-xs ml-2">{selectedRating}/5</span>
                  )}
                </div>
              </div>

              {/* Cost */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <DollarSign className="w-3 h-3 text-[#10B981]" />
                  Costo del servicio — COP (opcional)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  placeholder="Ej: 250000"
                  {...register('cost')}
                  className="w-full bg-[#0A110F] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10B981]/50 transition-all"
                />
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                    Comentario (opcional)
                  </label>
                  <span className={`text-[10px] font-bold ${(watch('comment') || '').length >= 450 ? 'text-orange-500' : 'text-slate-500'}`}>
                    {(watch('comment') || '').length}/500
                  </span>
                </div>
                <textarea
                  maxLength={500}
                  placeholder="¿Qué se hizo en este servicio?"
                  {...register('comment')}
                  className="w-full h-20 bg-[#0A110F] border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#10B981]/50 transition-all resize-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  isLoading={isSaving}
                  className="w-full bg-[#10B981] hover:bg-[#0E9F6E] text-slate-900 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all"
                >
                  Guardar Mantenimiento
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-10 animate-in fade-in zoom-in-95 duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#10B981]/10 border-2 border-[#10B981]/20 mb-6">
                <CheckCircle2 className="w-10 h-10 text-[#10B981]" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">¡Registrado!</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
                El mantenimiento ha sido guardado. Tu historial se actualizará automáticamente.
              </p>
              <Button
                onClick={handleClose}
                variant="ghost"
                className="px-10 border-white/10 hover:bg-white/5 text-white font-bold rounded-xl py-3 text-xs uppercase tracking-widest"
              >
                Entendido
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
