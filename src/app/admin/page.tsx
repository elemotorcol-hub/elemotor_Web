'use client';

import React from 'react';
import DashboardSummary from '@/components/admin/dashboard/DashboardSummary';
import DashboardChart from '@/components/admin/dashboard/DashboardChart';
import DashboardRecentQuotes from '@/components/admin/dashboard/DashboardRecentQuotes';
import DashboardActivityFeed from '@/components/admin/dashboard/DashboardActivityFeed';

export default function AdminDashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard General</h1>
                <p className="text-slate-400 mt-1">Resumen del sistema y métricas principales.</p>
            </div>

            {/* KPIs */}
            <DashboardSummary />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Area */}
                <div className="lg:col-span-2 bg-[#15201D] border border-white/5 rounded-2xl p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-white mb-2">Tendencia de Leads (30 Días)</h2>
                    <div className="flex-1 w-full flex items-center justify-center">
                        <DashboardChart />
                    </div>
                </div>

                {/* Activity Feed */}
                <DashboardActivityFeed />
            </div>

            {/* Quotes Table */}
            <DashboardRecentQuotes />
        </div>
    );
}
