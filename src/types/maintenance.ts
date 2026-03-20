// ─── Maintenance Types ──────────────────────────────────────────────────────

export type MaintenanceStatus = 'on_time' | 'upcoming' | 'overdue';

/** Un registro de mantenimiento retornado por la API */
export interface MaintenanceRecord {
  id: number;
  orderId: number;
  userId: number;
  date: string; // ISO date string
  type: string;
  rating: number | null;
  comment: string | null;
  cost: number | null;
  createdAt: string;
  workshop: {
    id: number;
    name: string;
    city: string | null;
  } | null;
}

/** Resumen de costos y conteo */
export interface MaintenanceSummary {
  totalCost: number;
  totalRecords: number;
}

/** Estado calculado del ciclo de mantenimiento */
export interface MaintenanceState {
  status: MaintenanceStatus;
  monthsSinceLast: number;
  nextMaintenanceDate: Date;
  lastMaintenanceDate: Date | null;
  daysUntilNext: number;
}

/** Respuesta del endpoint /api/orders/my-delivery */
export interface DeliveredOrder {
  orderId: number;
  status: 'delivered';
  trackingCode: string | null;
  deliveredAt: string | null; // ISO string
}
