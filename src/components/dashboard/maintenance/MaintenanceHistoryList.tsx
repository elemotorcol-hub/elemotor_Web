'use client';

import { CheckCircle2, Wrench, AlertCircle, Clock, Star } from 'lucide-react';
import { MaintenanceRecord } from '@/types/maintenance';

interface MaintenanceHistoryListProps {
  records: MaintenanceRecord[];
  totalCost: number;
}

function StarRating({ rating }: { rating: number | null }) {
  if (rating === null) return null;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
        />
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateStr));
}

export function MaintenanceHistoryList({ records, totalCost }: MaintenanceHistoryListProps) {
  return (
    <div className="bg-[#15201D] border border-white/5 rounded-3xl p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Historial de Mantenimientos</h3>
            <p className="text-slate-500 text-sm">
              {records.length === 0
                ? 'Aún no has registrado mantenimientos'
                : `${records.length} registro${records.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        {totalCost > 0 && (
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total gastado</span>
            <span className="text-xl font-black text-white">
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(totalCost)}
            </span>
          </div>
        )}
      </div>

      {/* Empty state */}
      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0A110F] border border-white/5 flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400 font-semibold mb-1">Aún no has registrado mantenimientos</p>
          <p className="text-slate-600 text-sm">
            Cuando realices tu primer servicio, aparecerá aquí.
          </p>
        </div>
      ) : (
        /* Timeline */
        <div className="relative pl-10 border-l-2 border-slate-800/60 ml-3 space-y-10">
          {records.map((record) => (
            <div key={record.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[2.85rem] top-0 w-10 h-10 rounded-full bg-[#0A110F] border-2 border-[#10B981] flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
              </div>

              {/* Card */}
              <div className="bg-[#0A110F]/60 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="text-white font-bold text-base">{record.type}</h4>
                    <p className="text-slate-500 text-xs mt-0.5">{formatDate(record.date)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StarRating rating={record.rating} />
                    {record.cost != null && record.cost > 0 && (
                      <span className="text-[#10B981] font-bold text-sm">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(record.cost)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-xs">
                  {record.workshop && (
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/5">
                      📍 {record.workshop.name}{record.workshop.city ? `, ${record.workshop.city}` : ''}
                    </span>
                  )}
                </div>

                {record.comment && (
                  <p className="mt-3 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-3">
                    {record.comment}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* End marker */}
          <div className="relative">
            <div className="absolute -left-[2.85rem] top-0 w-10 h-10 rounded-full bg-[#0A110F] border-2 border-slate-700 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-slate-600 text-sm pt-2 pl-2">Inicio del historial</p>
          </div>
        </div>
      )}
    </div>
  );
}
