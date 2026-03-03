import React from 'react';
import { Mail, Phone, MessageCircle, Calendar } from 'lucide-react';
import { Lead } from '@/types/crm';

interface LeadCardProps {
    lead: Lead;
}

export default function LeadCard({ lead }: LeadCardProps) {
    const renderContactIcon = () => {
        const iconProps = { className: "w-4 h-4 text-slate-500" };
        switch (lead.contactPreference) {
            case 'tel': return <Phone {...iconProps} />;
            case 'email': return <Mail {...iconProps} />;
            case 'chat': return <MessageCircle {...iconProps} />;
            default: return null;
        }
    };

    return (
        <div className="bg-[#15201D] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 hover:border-white/10 hover:bg-[#15201D]/80 transition-all cursor-grab active:cursor-grabbing">
            <div className="flex items-center justify-between">
                <h4 className="text-white font-bold text-[15px] truncate pr-2">{lead.clientName}</h4>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    {renderContactIcon()}
                </div>
            </div>

            <div className="flex flex-col gap-0.5 mt-[-4px]">
                <span className="text-teal-400 font-medium text-sm">{lead.vehicleModel}</span>
                <span className="text-slate-400 text-xs">{lead.budgetRange}</span>
            </div>

            <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>{lead.requestDate}</span>
            </div>
        </div>
    );
}
