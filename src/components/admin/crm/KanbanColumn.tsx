import React from 'react';
import { Lead } from '@/types/crm';
import LeadCard from './LeadCard';

interface KanbanColumnProps {
    title: string;
    count: number;
    leads: Lead[];
    dotColor: string;
}

export default function KanbanColumn({ title, count, leads, dotColor }: KanbanColumnProps) {
    return (
        <div className="flex flex-col w-[320px] min-w-[320px] bg-transparent border border-white/5 rounded-2xl overflow-hidden shrink-0">
            {/* Header Column */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#0a110f]/50">
                <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
                    <h3 className="text-white font-bold text-[15px]">{title}</h3>
                </div>
                <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-slate-400 text-xs font-bold font-mono">
                    {count}
                </div>
            </div>

            {/* List Body */}
            <div className="flex flex-col gap-4 p-4 min-h-[500px] h-full overflow-y-auto custom-scrollbar">
                {leads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                ))}
            </div>
        </div>
    );
}
