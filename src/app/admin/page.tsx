'use client';

import React, { useEffect, useState } from 'react';
import DashboardSummary from '@/components/admin/dashboard/DashboardSummary';
import DashboardChart from '@/components/admin/dashboard/DashboardChart';
import DashboardRecentQuotes from '@/components/admin/dashboard/DashboardRecentQuotes';
import DashboardActivityFeed from '@/components/admin/dashboard/DashboardActivityFeed';
import DashboardCRMMetrics from '@/components/admin/dashboard/DashboardCRMMetrics';
import DashboardAdvisors, { AdvisorStat } from '@/components/admin/dashboard/DashboardAdvisors';
import DashboardMaintenance, { MaintenanceStats } from '@/components/admin/dashboard/DashboardMaintenance';
import { dashboardService, DashboardSummary as DashboardData } from '@/services/dashboard.service';
import { quoteService } from '@/services/quote.service';
import { appointmentsAdminService, AppointmentStatus } from '@/services/appointments.service';
import { Quote } from '@/types/crm';

// ── helpers ──────────────────────────────────────────────────────────────────

interface CRMMetricsData {
    totalActive: number;
    assigned: number;
    inProcess: number;
    contacted: number;
}

function buildCRMMetrics(quotes: Quote[]): CRMMetricsData {
    const ACTIVE_STATUSES = new Set(['pending', 'contacted', 'responded', 'negotiation']);
    const active = quotes.filter((q) => ACTIVE_STATUSES.has(q.status));
    return {
        totalActive: active.length,
        assigned: active.filter((q) => q.assignedToId != null).length,
        inProcess: active.filter((q) => q.status === 'responded' || q.status === 'negotiation').length,
        contacted: active.filter((q) => q.status === 'contacted').length,
    };
}

function buildAdvisors(quotes: Quote[]): AdvisorStat[] {
    const map = new Map<number, AdvisorStat>();
    for (const q of quotes) {
        if (!q.assignedToId || !q.assignedTo) continue;
        const existing = map.get(q.assignedToId);
        const qDate = q.updatedAt ?? q.createdAt;
        if (existing) {
            existing.assignedCount += 1;
            if (qDate && (!existing.lastActivityAt || qDate > existing.lastActivityAt)) {
                existing.lastActivityAt = qDate;
            }
        } else {
            map.set(q.assignedToId, {
                id: q.assignedToId,
                name: q.assignedTo.name,
                email: '',
                assignedCount: 1,
                lastActivityAt: qDate,
            });
        }
    }
    return Array.from(map.values()).sort((a, b) => b.assignedCount - a.assignedCount);
}

const MANAGED_STATUSES: AppointmentStatus[] = ['completed', 'in_progress', 'confirmed'];

function buildMaintenanceStats(appointments: any[]): MaintenanceStats {
    const total = appointments.length;
    const managed = appointments.filter((a) => MANAGED_STATUSES.includes(a.status)).length;
    const pending = appointments.filter((a) => a.status === 'pending').length;
    return { total, managed, pending };
}

// ── component ─────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [crmMetrics, setCrmMetrics] = useState<CRMMetricsData | undefined>();
    const [advisors, setAdvisors] = useState<AdvisorStat[]>([]);
    const [maintenanceStats, setMaintenanceStats] = useState<MaintenanceStats | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [summary, quotesRes, appointmentsRes] = await Promise.allSettled([
                    dashboardService.getSummary(),
                    quoteService.fetchQuotes({ limit: 200 }),
                    appointmentsAdminService.getAll({ limit: 500 }),
                ]);

                if (summary.status === 'fulfilled') {
                    setData(summary.value);
                }

                if (quotesRes.status === 'fulfilled') {
                    const quotes: Quote[] = Array.isArray(quotesRes.value)
                        ? quotesRes.value
                        : quotesRes.value?.data ?? [];
                    setCrmMetrics(buildCRMMetrics(quotes));
                    setAdvisors(buildAdvisors(quotes));
                }

                if (appointmentsRes.status === 'fulfilled') {
                    const appts: any[] = Array.isArray(appointmentsRes.value)
                        ? appointmentsRes.value
                        : appointmentsRes.value?.data ?? [];
                    setMaintenanceStats(buildMaintenanceStats(appts));
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAll();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard General</h1>
                <p className="text-slate-400 mt-1">Resumen del sistema y métricas principales.</p>
            </div>

            {/* CRM Metrics — primero */}
            <DashboardCRMMetrics data={crmMetrics} />

            {/* Asesores + Mantenimiento */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <DashboardAdvisors advisors={advisors} />
                </div>
                <DashboardMaintenance stats={maintenanceStats} />
            </div>

            {/* KPIs principales */}
            <DashboardSummary metrics={data?.metrics} />

            {/* Gráfico + Actividad */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#15201D] border border-white/5 rounded-2xl p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-white mb-2">Tendencia de Leads (30 Días)</h2>
                    <div className="flex-1 w-full flex items-center justify-center">
                        <DashboardChart data={data?.chartData} />
                    </div>
                </div>
                <DashboardActivityFeed activities={data?.recentActivity} />
            </div>

            {/* Últimas Cotizaciones */}
            <DashboardRecentQuotes quotes={data?.recentQuotes} />
        </div>
    );
}
