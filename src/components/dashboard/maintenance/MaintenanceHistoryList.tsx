'use client';

import { CheckCircle2, Wrench, AlertCircle, Clock, Star, MapPin, Navigation, Download } from 'lucide-react';
import { MaintenanceRecord } from '@/types/maintenance';

interface MaintenanceHistoryListProps {
  records: MaintenanceRecord[];
  totalCost: number;
  userName?: string;
  userEmail?: string;
  onFocusWorkshop?: (workshopId: number) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function formatDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateStr));
}

/**
 * Extracts km from a comment stored in the format: "km: XXXXX | {comment}"
 * Returns { km, comment } where km may be null if not present.
 */
function parseKmFromComment(raw: string | null): { km: string | null; comment: string | null } {
  if (!raw) return { km: null, comment: null };
  const match = raw.match(/^km:\s*(\d+)\s*\|\s*([\s\S]*)$/);
  if (match) {
    return {
      km: match[1],
      comment: match[2].trim() || null,
    };
  }
  // Check format without a trailing comment
  const matchKmOnly = raw.match(/^km:\s*(\d+)$/);
  if (matchKmOnly) {
    return { km: matchKmOnly[1], comment: null };
  }
  return { km: null, comment: raw };
}

// ─── PDF Export ───────────────────────────────────────────────────────────────

async function exportMaintenancePDF(
  records: MaintenanceRecord[],
  totalCost: number,
  userName?: string,
  userEmail?: string,
) {
  // Dynamic imports to avoid SSR issues
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const PAGE_W = 210;
  const MARGIN = 16;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  const GREEN = [16, 185, 129] as [number, number, number];
  const DARK = [21, 32, 29] as [number, number, number];
  const SLATE = [100, 116, 139] as [number, number, number];

  // ── Header bar ──────────────────────────────────────────────────────────────
  doc.setFillColor(...DARK);
  doc.rect(0, 0, PAGE_W, 36, 'F');

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GREEN);
  doc.text('ELEMOTOR', MARGIN, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 210, 220);
  doc.text('Historial de Mantenimientos', MARGIN, 24);

  // Generation date — right aligned
  const genDate = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date());
  doc.setFontSize(8);
  doc.setTextColor(...SLATE);
  doc.text(`Generado: ${genDate}`, PAGE_W - MARGIN, 14, { align: 'right' });

  // ── Client info block ────────────────────────────────────────────────────────
  let curY = 46;

  if (userName || userEmail) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 40, 50);
    doc.text('Cliente', MARGIN, curY);
    curY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50, 60, 70);
    if (userName) {
      doc.text(userName, MARGIN, curY);
      curY += 5;
    }
    if (userEmail) {
      doc.text(userEmail, MARGIN, curY);
      curY += 5;
    }
    curY += 4;
  }

  // ── Summary strip ────────────────────────────────────────────────────────────
  doc.setFillColor(240, 249, 245);
  doc.roundedRect(MARGIN, curY, CONTENT_W, 18, 3, 3, 'F');

  const totalCostFormatted = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(totalCost);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...GREEN);
  doc.text(`${records.length} registro${records.length !== 1 ? 's' : ''}`, MARGIN + 6, curY + 7);

  if (totalCost > 0) {
    doc.setTextColor(...SLATE);
    doc.setFont('helvetica', 'normal');
    doc.text('Total invertido:', MARGIN + 6, curY + 13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GREEN);
    doc.text(totalCostFormatted, MARGIN + 40, curY + 13);
  }

  curY += 26;

  // ── Table ────────────────────────────────────────────────────────────────────
  if (records.length === 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...SLATE);
    doc.text('No hay registros de mantenimiento.', MARGIN, curY + 10);
  } else {
    const tableRows = records.map((record) => {
      const { km, comment } = parseKmFromComment(record.comment);
      const costStr = record.cost != null && record.cost > 0
        ? new Intl.NumberFormat('es-CO', {
            style: 'currency', currency: 'COP', maximumFractionDigits: 0,
          }).format(record.cost)
        : '—';
      const workshopStr = record.workshop
        ? `${record.workshop.name}${record.workshop.city ? `, ${record.workshop.city}` : ''}`
        : '—';

      return [
        formatDateShort(record.date),
        record.type,
        workshopStr,
        costStr,
        km ? `${km} km` : '—',
        comment ?? '—',
      ];
    });

    autoTable(doc, {
      startY: curY,
      head: [['Fecha', 'Tipo', 'Taller', 'Costo', 'Km', 'Comentario']],
      body: tableRows,
      margin: { left: MARGIN, right: MARGIN },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        textColor: [30, 40, 50],
        lineColor: [230, 235, 240],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: DARK,
        textColor: GREEN,
        fontStyle: 'bold',
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 30 },
        2: { cellWidth: 38 },
        3: { cellWidth: 26 },
        4: { cellWidth: 18 },
        5: { cellWidth: 'auto' },
      },
    });
  }

  // ── Footer ───────────────────────────────────────────────────────────────────
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...SLATE);
    doc.text(
      `Página ${i} de ${pageCount}  ·  Elemotor — Historial de Mantenimientos`,
      PAGE_W / 2,
      295,
      { align: 'center' },
    );
  }

  doc.save(`historial_mantenimiento_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MaintenanceHistoryList({
  records,
  totalCost,
  userName,
  userEmail,
  onFocusWorkshop,
}: MaintenanceHistoryListProps) {
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

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Export PDF button */}
          {records.length > 0 && (
            <button
              onClick={() => exportMaintenancePDF(records, totalCost, userName, userEmail)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10B981]/10 hover:bg-[#10B981]/20 border border-[#10B981]/20 hover:border-[#10B981]/40 text-[#10B981] text-xs font-bold uppercase tracking-widest transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar historial
            </button>
          )}

          {totalCost > 0 && (
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total gastado</span>
              <span className="text-xl font-black text-white">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(totalCost)}
              </span>
            </div>
          )}
        </div>
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
          {records.map((record) => {
            const { km, comment: parsedComment } = parseKmFromComment(record.comment);

            return (
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

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {record.workshop && (
                      <>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/5">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          {record.workshop.name}{record.workshop.city ? `, ${record.workshop.city}` : ''}
                        </span>
                        {record.workshop.latitude && record.workshop.longitude && onFocusWorkshop && (
                          <button
                            onClick={() => onFocusWorkshop(record.workshop!.id)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/20 transition-colors"
                          >
                            <Navigation className="w-3 h-3" />
                            Ver en mapa
                          </button>
                        )}
                      </>
                    )}
                    {km && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/5">
                        {km} km
                      </span>
                    )}
                  </div>

                  {parsedComment && (
                    <p className="mt-3 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-3">
                      {parsedComment}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

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
