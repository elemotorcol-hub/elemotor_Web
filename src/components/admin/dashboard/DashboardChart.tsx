'use client';

import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function DashboardChart() {
    // Generate 30 days of mock data
    const data = useMemo(() => {
        const today = new Date();
        const past30Days = [];
        let baseLeads = 15; // Starting point

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            // Generate realistic looking fluctuations
            const fluctuation = Math.floor(Math.random() * 10) - 4; 
            baseLeads = Math.max(5, baseLeads + fluctuation); // Keep it above 5

            past30Days.push({
                date: date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }),
                leads: baseLeads,
            });
        }
        return past30Days;
    }, []);

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
                        dataKey="date" 
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
