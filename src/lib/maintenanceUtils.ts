import { MaintenanceRecord, MaintenanceState, MaintenanceStatus } from '@/types/maintenance';
import { addMonths, differenceInDays, differenceInMonths } from 'date-fns';

/** Número de meses entre mantenimientos */
export const MAINTENANCE_INTERVAL_MONTHS = 6;
/** Días antes del próximo mantenimiento para mostrar "Próximo" */
const UPCOMING_THRESHOLD_DAYS = 30;

/**
 * computeMaintenanceState — Calcula el estado del ciclo de mantenimiento.
 *
 * @param deliveredAt - Fecha de entrega del vehículo (base del ciclo inicial)
 * @param lastRecord - Último registro de mantenimiento del usuario (si existe)
 * @returns MaintenanceState con: status, daysUntilNext, monthsSinceLast, next/lastDate
 */
export function computeMaintenanceState(
  deliveredAt: Date,
  lastRecord: MaintenanceRecord | null,
): MaintenanceState {
  const today = new Date();

  // La base es la fecha del último mantenimiento registrado, o la entrega si no hay ninguno
  const baseDate: Date = lastRecord ? new Date(lastRecord.date) : deliveredAt;
  const nextMaintenanceDate = addMonths(baseDate, MAINTENANCE_INTERVAL_MONTHS);
  const daysUntilNext = differenceInDays(nextMaintenanceDate, today);
  const monthsSinceLast = differenceInMonths(today, baseDate);

  let status: MaintenanceStatus;
  if (daysUntilNext < 0) {
    status = 'overdue';
  } else if (daysUntilNext <= UPCOMING_THRESHOLD_DAYS) {
    status = 'upcoming';
  } else {
    status = 'on_time';
  }

  return {
    status,
    monthsSinceLast,
    nextMaintenanceDate,
    lastMaintenanceDate: lastRecord ? new Date(lastRecord.date) : null,
    daysUntilNext,
  };
}

export function getStatusLabel(status: MaintenanceStatus): string {
  switch (status) {
    case 'on_time':
      return 'A tiempo';
    case 'upcoming':
      return 'Próximo';
    case 'overdue':
      return 'Atrasado';
  }
}

export function getStatusColors(status: MaintenanceStatus): {
  bg: string;
  border: string;
  text: string;
  badge: string;
} {
  switch (status) {
    case 'on_time':
      return {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        badge: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
      };
    case 'upcoming':
      return {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        badge: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
      };
    case 'overdue':
      return {
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        text: 'text-red-400',
        badge: 'bg-red-500/20 border-red-500/30 text-red-300',
      };
  }
}

/** Formatea una fecha como "15 de marzo de 2026" en español */
export function formatDateES(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
