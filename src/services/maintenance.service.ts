import { fetchApi } from '@/lib/api';
import { MaintenanceRecord, MaintenanceSummary } from '@/types/maintenance';

export interface CreateMaintenancePayload {
  orderId: number;
  date: string; // YYYY-MM-DD
  type: string;
  workshopId?: number;
  rating?: number;
  comment?: string;
  cost?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const maintenanceService = {
  /**
   * [Cliente] Registrar un mantenimiento como realizado.
   * POST /api/maintenance
   */
  async createRecord(payload: CreateMaintenancePayload): Promise<MaintenanceRecord> {
    return fetchApi<MaintenanceRecord>('/api/maintenance', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * [Cliente] Listar historial de mantenimientos para un pedido.
   * GET /api/maintenance?orderId=X
   */
  async fetchRecords(
    orderId: number,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResponse<MaintenanceRecord>> {
    return fetchApi<PaginatedResponse<MaintenanceRecord>>(
      `/api/maintenance?orderId=${orderId}&page=${page}&limit=${limit}`,
    );
  },

  /**
   * [Cliente] Obtener resumen de costos.
   * GET /api/maintenance/summary?orderId=X
   */
  async fetchSummary(orderId: number): Promise<MaintenanceSummary> {
    return fetchApi<MaintenanceSummary>(`/api/maintenance/summary?orderId=${orderId}`);
  },
};
