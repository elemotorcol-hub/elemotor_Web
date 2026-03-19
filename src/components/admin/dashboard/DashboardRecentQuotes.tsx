'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DashboardRecentQuotes({ quotes: rawQuotes }: { quotes?: any[] }) {
  const router = useRouter();
  
  const recentQuotes = rawQuotes || [];

  const getStatusStyle = (status: string) => {
    switch(status) {
        case 'closed_won': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        case 'closed_lost': return 'bg-red-500/10 text-red-400 border border-red-500/20';
        case 'pending': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        case 'contacted': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
        case 'closed_won': return 'Aprobada (Venta)';
        case 'closed_lost': return 'Perdida';
        case 'pending': return 'Pendiente';
        case 'contacted': return 'Contactado';
        case 'responded': return 'Respondido';
        case 'negotiation': return 'Negociación';
        default: return status;
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
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Referencia</th>
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
                        <td className="px-5 py-4 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{quote.referenceCode || quote.id}</td>
                        <td className="px-5 py-4 text-sm text-slate-300">{quote.name}</td>
                        <td className="px-5 py-4 text-sm text-slate-300">{quote.model?.name || 'N/A'}</td>
                        <td className="px-5 py-4 text-sm text-slate-400">{quote.assignedTo?.name || 'Sin asignar'}</td>
                        <td className="px-5 py-4 text-sm text-slate-400">
                            {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true, locale: es })}
                        </td>
                        <td className="px-5 py-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusStyle(quote.status)}`}>
                                {getStatusText(quote.status)}
                            </span>
                        </td>
                    </tr>
                ))}
                {recentQuotes.length === 0 && (
                    <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-slate-500 italic">No hay cotizaciones recientes.</td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
