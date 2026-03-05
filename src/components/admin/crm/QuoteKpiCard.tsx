import React from 'react';

interface QuoteKpiCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    sub: string;
    accentClass?: string;
}

export function QuoteKpiCard({
    icon,
    label,
    value,
    sub,
    accentClass = 'text-slate-300'
}: QuoteKpiCardProps) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs font-bold tracking-wider uppercase">{label}</span>
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                    {icon}
                </div>
            </div>
            <div>
                <p className={`text-3xl font-black leading-none ${accentClass}`}>{value}</p>
                <p className="text-slate-500 text-xs mt-1.5">{sub}</p>
            </div>
        </div>
    );
}
