'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRecentQuotes() {
  const router = useRouter();
  
  const recentQuotes = [
    { id: 'COT-0142', customer: 'Carlos Ramírez', vehicle: 'Elementor S', advisor: 'Juan Pérez', date: 'Hace 2h', status: 'pending' },
    { id: 'COT-0141', customer: 'María Gómez', vehicle: 'Elementor X', advisor: 'Ana López', date: 'Hace 5h', status: 'approved' },
    { id: 'COT-0140', customer: 'Andrés Mejía', vehicle: 'Elementor S', advisor: 'Juan Pérez', date: 'Ayer', status: 'rejected' },
    { id: 'COT-0139', customer: 'Diana Castro', vehicle: 'Modelo Y', advisor: 'Pedro Ruiz', date: 'Ayer', status: 'pending' },
    { id: 'COT-0138', customer: 'Luis Torres', vehicle: 'Elementor X', advisor: 'Ana López', date: 'Hace 2 días', status: 'approved' },
    { id: 'COT-0137', customer: 'Sofía Reyes', vehicle: 'Modelo 3', advisor: 'Juan Pérez', date: 'Hace 2 días', status: 'pending' },
    { id: 'COT-0136', customer: 'Jorge Gil', vehicle: 'Elementor S', advisor: 'Pedro Ruiz', date: 'Hace 3 días', status: 'approved' },
    { id: 'COT-0135', customer: 'Camila Cero', vehicle: 'Elementor X', advisor: 'Ana López', date: 'Hace 3 días', status: 'rejected' },
    { id: 'COT-0134', customer: 'Diego Vargas', vehicle: 'Modelo Y', advisor: 'Juan Pérez', date: 'Hace 4 días', status: 'pending' },
    { id: 'COT-0133', customer: 'Laura Cruz', vehicle: 'Elementor S', advisor: 'Pedro Ruiz', date: 'Hace 4 días', status: 'approved' },
  ];

  const getStatusStyle = (status: string) => {
    switch(status) {
        case 'approved': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        case 'rejected': return 'bg-red-500/10 text-red-400 border border-red-500/20';
        case 'pending': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
        case 'approved': return 'Aprobada';
        case 'rejected': return 'Rechazada';
        case 'pending': return 'Pendiente';
        default: return 'Desconocido';
    }
  };

  return (
    <div className="bg-[#15201D] border border-white/5 rounded-2xl overflow-hidden mt-6">
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Últimas Cotizaciones</h2>
        <button onClick={() => router.push('/admin/crm')} className="text-sm text-[#10B981] hover:text-[#059669] transition-colors font-medium">Ver todas</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cliente</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vehículo</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Asesor</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Fecha</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {recentQuotes.map((quote) => (
                    <tr 
                        key={quote.id} 
                        onClick={() => router.push(`/admin/crm?quote=${quote.id}`)}
                        className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    >
                        <td className="px-5 py-4 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{quote.id}</td>
                        <td className="px-5 py-4 text-sm text-slate-300">{quote.customer}</td>
                        <td className="px-5 py-4 text-sm text-slate-300">{quote.vehicle}</td>
                        <td className="px-5 py-4 text-sm text-slate-400">{quote.advisor}</td>
                        <td className="px-5 py-4 text-sm text-slate-400">{quote.date}</td>
                        <td className="px-5 py-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusStyle(quote.status)}`}>
                                {getStatusText(quote.status)}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
