'use client';

import React, { useEffect, useState } from 'react';
import DashboardSummary from '@/components/admin/dashboard/DashboardSummary';
import DashboardChart from '@/components/admin/dashboard/DashboardChart';
import DashboardRecentQuotes from '@/components/admin/dashboard/DashboardRecentQuotes';
import DashboardActivityFeed from '@/components/admin/dashboard/DashboardActivityFeed';
import { dashboardService, DashboardSummary as DashboardData } from '@/services/dashboard.service';

export default function AdminDashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const summary = await dashboardService.getSummary();
                setData(summary);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard General</h1>
                <p className="text-slate-400 mt-1">Resumen del sistema y métricas principales.</p>
            </div>

            {/* KPIs */}
            <DashboardSummary metrics={data?.metrics} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Area */}
                <div className="lg:col-span-2 bg-[#15201D] border border-white/5 rounded-2xl p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-white mb-2">Tendencia de Leads (30 Días)</h2>
                    <div className="flex-1 w-full flex items-center justify-center">
                        <DashboardChart data={data?.chartData} />
                    </div>
                </div>

                {/* Activity Feed */}
                <DashboardActivityFeed activities={data?.recentActivity} />
            </div>

            {/* Quotes Table */}
            <DashboardRecentQuotes quotes={data?.recentQuotes} />
        </div>
    );
}
