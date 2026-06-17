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
    total: number;
    active: number;
    assigned: number;
    unassigned: number;
    closedWon: number;
    closedLost: number;
    inProcess: number;
    contacted: number;
}

function buildCRMMetrics(quotes: Quote[]): CRMMetricsData {
    const ACTIVE_STATUSES = new Set(['pending', 'contacted', 'responded', 'negotiation']);
    const active = quotes.filter((q) => ACTIVE_STATUSES.has(q.status));
    return {
        total:      quotes.length,
        active:     active.length,
        assigned:   active.filter((q) => q.assignedTo != null).length,
        unassigned: active.filter((q) => q.assignedTo == null).length,
        closedWon:  quotes.filter((q) => q.status === 'closed_won').length,
        closedLost: quotes.filter((q) => q.status === 'closed_lost').length,
        inProcess:  active.filter((q) => q.status === 'responded' || q.status === 'negotiation').length,
        contacted:  active.filter((q) => q.status === 'contacted').length,
    };
}

function buildAdvisors(quotes: Quote[]): AdvisorStat[] {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const map = new Map<number, AdvisorStat>();

    for (const q of quotes) {
        if (!q.assignedTo) continue;
        const { id, name } = q.assignedTo;
        const qDate = q.updatedAt ?? q.createdAt;
        const isThisMonth = q.createdAt ? new Date(q.createdAt) >= startOfMonth : false;
        const existing = map.get(id);

        if (existing) {
            existing.assignedCount += 1;
            if (q.status === 'closed_won')  existing.closedWon  += 1;
            if (q.status === 'closed_lost') existing.closedLost += 1;
            if (isThisMonth) existing.thisMonth += 1;
            if (qDate && (!existing.lastActivityAt || qDate > existing.lastActivityAt)) {
                existing.lastActivityAt = qDate;
            }
        } else {
            map.set(id, {
                id,
                name,
                email: '',
                assignedCount: 1,
                closedWon:  q.status === 'closed_won'  ? 1 : 0,
                closedLost: q.status === 'closed_lost' ? 1 : 0,
                thisMonth:  isThisMonth ? 1 : 0,
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
