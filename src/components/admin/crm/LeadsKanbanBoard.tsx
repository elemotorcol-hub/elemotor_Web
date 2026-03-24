'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { quoteService } from '@/services/quote.service';
import { Quote } from '@/types/crm';
import KanbanColumn from './KanbanColumn';
import { QuoteSlideOver } from './QuoteSlideOver';

export default function LeadsKanbanBoard() {
    const [leads, setLeads] = useState<Quote[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

    const handleUpdateLead = async (id: number, data: any) => {
        try {
            const updated = await quoteService.updateQuote(id, data);
            const result = (updated as any).data || updated;
            setLeads(prev => prev.map(l => l.id === id ? { ...l, ...result } : l));
            if (selectedQuote?.id === id) {
                setSelectedQuote(prev => prev ? { ...prev, ...result } : null);
            }
        } catch (error) {
            console.error('Error updating lead from Kanban:', error);
        }
    };

    useEffect(() => {
        const loadLeads = async () => {
            try {
                const data = await quoteService.fetchQuotes();
                if (Array.isArray(data)) {
                    setLeads(data);
                } else if (data?.data && Array.isArray(data.data)) {
                    setLeads(data.data);
                }
            } catch (error) {
                console.error('Error loading Kanban leads:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadLeads();
    }, []);

    // Agrupación de Leads por Estado (Backend enums)
    const newLeads = leads.filter(lead => lead.status === 'pending');
    const contactedLeads = leads.filter(lead => lead.status === 'contacted' || lead.status === 'responded');
    const negotiationLeads = leads.filter(lead => lead.status === 'negotiation');
    const wonLeads = leads.filter(lead => lead.status === 'closed_won');

    if (isLoading) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center text-slate-500 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                <p className="text-sm font-medium">Cargando tablero...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-x-auto pb-6 custom-scrollbar-horizontal flex items-start gap-6 px-1">
            {/* Nuevos */}
            <KanbanColumn
                title="Nuevos"
                count={newLeads.length}
                leads={newLeads}
                onLeadClick={setSelectedQuote}
                dotColor="bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
            />

            {/* Contactados / Responden */}
            <KanbanColumn
                title="En Contacto"
                count={contactedLeads.length}
                leads={contactedLeads}
                onLeadClick={setSelectedQuote}
                dotColor="bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            />

            {/* En Negociación */}
            <KanbanColumn
                title="En Negociación"
                count={negotiationLeads.length}
                leads={negotiationLeads}
                onLeadClick={setSelectedQuote}
                dotColor="bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"
            />

            {/* Ganados */}
            <KanbanColumn
                title="Ganados"
                count={wonLeads.length}
                leads={wonLeads}
                onLeadClick={setSelectedQuote}
                dotColor="bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            />

            {selectedQuote && (
                <QuoteSlideOver
                    quote={selectedQuote}
                    onClose={() => setSelectedQuote(null)}
                    onUpdate={(data) => handleUpdateLead(selectedQuote.id, data)}
                />
            )}
        </div>
    );
}
