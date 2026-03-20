'use client';

import { Calendar, Clock, ShieldCheck, TrendingUp } from 'lucide-react';
import { MaintenanceState } from '@/types/maintenance';
import { getStatusLabel, getStatusColors, formatDateES } from '@/lib/maintenanceUtils';

interface MaintenanceStatusCardProps {
  state: MaintenanceState;
  deliveredAt: Date;
}

export function MaintenanceStatusCard({ state, deliveredAt }: MaintenanceStatusCardProps) {
  const colors = getStatusColors(state.status);
  const statusLabel = getStatusLabel(state.status);

  const nextDateStr = formatDateES(state.nextMaintenanceDate);
  const deliveredDateStr = formatDateES(deliveredAt);

  return (
    <div className={`relative overflow-hidden rounded-[32px] border ${colors.border} ${colors.bg} p-8 md:p-10`}>
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 blur-3xl bg-white -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {/* Status badge + main info */}
        <div className="col-span-1 md:col-span-2">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest mb-4 ${colors.badge}`}>
            <span className={`w-2 h-2 rounded-full ${state.status === 'on_time' ? 'bg-emerald-400' : state.status === 'upcoming' ? 'bg-amber-400' : 'bg-red-400'} animate-pulse`} />
            {statusLabel}
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
            {state.status === 'overdue'
              ? 'Mantenimiento vencido'
              : state.status === 'upcoming'
              ? '¡Tu mantenimiento se acerca!'
              : 'Tu vehículo está al día'}
          </h2>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
            Tu próximo mantenimiento está programado para{' '}
            <span className={`font-bold ${colors.text}`}>{nextDateStr}</span>
            {' '}o antes si alcanzas los{' '}
            <span className="font-bold text-white">10,000 km</span>.
          </p>
        </div>

        {/* Stats grid */}
        <div className="flex flex-col gap-3">
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Desde último mant.</span>
            </div>
            <p className="text-white font-black text-xl">
              {state.monthsSinceLast === 0 ? 'Este mes' : `${state.monthsSinceLast} mes${state.monthsSinceLast !== 1 ? 'es' : ''}`}
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Próximo servicio</span>
            </div>
            <p className={`font-black text-base ${colors.text}`}>
              {state.daysUntilNext < 0
                ? `Hace ${Math.abs(state.daysUntilNext)} días`
                : state.daysUntilNext === 0
                ? 'Hoy'
                : `En ${state.daysUntilNext} días`}
            </p>
          </div>
        </div>
      </div>

      {/* Delivery date footer */}
      <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
          Fecha de entrega: <span className="text-slate-400 font-semibold">{deliveredDateStr}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Ciclo: cada 6 meses / 10,000 km
        </span>
      </div>
    </div>
  );
}
