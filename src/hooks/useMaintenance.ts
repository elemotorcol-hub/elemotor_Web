'use client';

import { useState, useEffect, useCallback } from 'react';
import { orderService } from '@/services/order.service';
import { maintenanceService, CreateMaintenancePayload } from '@/services/maintenance.service';
import { DeliveredOrder, MaintenanceRecord, MaintenanceSummary, MaintenanceState } from '@/types/maintenance';
import { computeMaintenanceState } from '@/lib/maintenanceUtils';

interface UseMaintenanceReturn {
  isLoading: boolean;
  isDelivered: boolean;
  deliveredOrder: DeliveredOrder | null;
  records: MaintenanceRecord[];
  summary: MaintenanceSummary;
  maintenanceState: MaintenanceState | null;
  isSaving: boolean;
  createRecord: (payload: CreateMaintenancePayload) => Promise<void>;
  refresh: () => void;
}

/**
 * useMaintenance — Hook centralizado para el módulo de mantenimiento.
 *
 * Gestiona:
 * - Validación del estado del vehículo (delivered)
 * - Carga del historial y resumen de costos
 * - Estado calculado del ciclo de mantenimiento
 * - Mutación para registrar nuevos mantenimientos
 */
export function useMaintenance(): UseMaintenanceReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deliveredOrder, setDeliveredOrder] = useState<DeliveredOrder | null>(null);
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [summary, setSummary] = useState<MaintenanceSummary>({ totalCost: 0, totalRecords: 0 });
  const [refreshTick, setRefreshTick] = useState(0);

  const refresh = useCallback(() => setRefreshTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const delivered = await orderService.fetchMyDeliveredOrder();
        if (cancelled) return;

        if (!delivered?.deliveredAt) {
          setDeliveredOrder(null);
          return;
        }

        setDeliveredOrder(delivered as DeliveredOrder);

        const [recordsRes, summaryRes] = await Promise.all([
          maintenanceService.fetchRecords(delivered.orderId),
          maintenanceService.fetchSummary(delivered.orderId),
        ]);

        if (cancelled) return;
        setRecords(recordsRes.data);
        setSummary(summaryRes);
      } catch (err) {
        console.error('[useMaintenance] Error loading data:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [refreshTick]);

  const createRecord = useCallback(
    async (payload: CreateMaintenancePayload) => {
      setIsSaving(true);
      try {
        await maintenanceService.createRecord(payload);
        refresh();
      } finally {
        setIsSaving(false);
      }
    },
    [refresh],
  );

  const isDelivered = !!deliveredOrder?.deliveredAt;

  const maintenanceState: MaintenanceState | null = isDelivered
    ? computeMaintenanceState(
        new Date(deliveredOrder!.deliveredAt!),
        records.length > 0 ? records[0] : null, // records are ordered by date desc
      )
    : null;

  return {
    isLoading,
    isDelivered,
    deliveredOrder,
    records,
    summary,
    maintenanceState,
    isSaving,
    createRecord,
    refresh,
  };
}
