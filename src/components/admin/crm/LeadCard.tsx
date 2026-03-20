import React from 'react';
import { Mail, Phone, MessageCircle, Calendar } from 'lucide-react';
import { Lead } from '@/types/crm';

interface LeadCardProps {
    lead: Lead;
    onClick?: () => void;
}

export default function LeadCard({ lead, onClick }: LeadCardProps) {
    const renderContactIcon = () => {
        const iconProps = { className: "w-4 h-4 text-slate-500" };
        switch (lead.preferredChannel) {
            case 'call': return <Phone {...iconProps} />;
            case 'email': return <Mail {...iconProps} />;
            case 'whatsapp': return <MessageCircle {...iconProps} />;
            default: return null;
        }
    };

    const formatDate = (iso: string) => {
        if (!iso) return '—';
        try {
            return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch {
            return iso;
        }
    };

    const formatCurrency = (val?: number) => {
        if (!val) return '—';
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div 
            onClick={onClick}
            className="group bg-[#15201D] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 hover:border-cyan-500/40 hover:bg-[#1A2824] transition-all duration-300 cursor-pointer relative overflow-hidden"
        >
            <div className="flex items-center justify-between">
                <div className="flex flex-col truncate pr-2">
                    <span className="text-[10px] text-slate-500 font-mono tracking-tighter mb-0.5">{lead.referenceCode}</span>
                    <h4 className="text-white font-bold text-[15px] truncate">{lead.name}</h4>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    {renderContactIcon()}
                </div>
            </div>

            <div className="flex flex-col gap-0.5 mt-[-4px]">
                <span className="text-teal-400 font-medium text-sm">{lead.modelInterest}</span>
                <span className="text-slate-400 text-xs">{formatCurrency(lead.budgetRange)}</span>
            </div>

            <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(lead.createdAt)}</span>
            </div>
        </div>
    );
}
