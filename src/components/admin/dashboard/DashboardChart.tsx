'use client';

import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartDataPoint } from '@/services/dashboard.service';

export default function DashboardChart({ data: rawData }: { data?: ChartDataPoint[] }) {
    const data = useMemo(() => {
        if (!rawData || rawData.length === 0) return [];
        
        return rawData.map(item => ({
            ...item,
            displayDate: new Date(item.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
        }));
    }, [rawData]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-white/10 rounded-lg p-3 shadow-xl">
                    <p className="text-slate-300 text-xs mb-1 font-medium">{label}</p>
                    <p className="text-[#10B981] font-bold text-lg">
                        {payload[0].value} <span className="text-sm font-normal text-slate-400">Leads</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                        dataKey="displayDate" 
                        stroke="rgba(255,255,255,0.2)" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickMargin={10}
                        minTickGap={20}
                    />
                    <YAxis 
                        stroke="rgba(255,255,255,0.2)" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                    <Line 
                        type="monotone" 
                        dataKey="leads" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: '#10B981', stroke: '#0f172a', strokeWidth: 3 }}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
