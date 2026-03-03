'use client';

import React, { useState } from 'react';
import { MOCK_LEADS } from '@/mocks/crmData';
import KanbanColumn from './KanbanColumn';

export default function LeadsKanbanBoard() {
    const [leads] = useState(MOCK_LEADS);

    // Agrupación de Leads por Estado
    const newLeads = leads.filter(lead => lead.status === 'Nuevos');
    const contactedLeads = leads.filter(lead => lead.status === 'Contactados');
    const negotiationLeads = leads.filter(lead => lead.status === 'En Negociación');
    const wonLeads = leads.filter(lead => lead.status === 'Ganados');

    return (
        <div className="w-full h-full overflow-x-auto pb-6 custom-scrollbar-horizontal flex items-start gap-6 px-1">
            {/* Nuevos */}
            <KanbanColumn
                title="Nuevos"
                count={newLeads.length}
                leads={newLeads}
                dotColor="bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
            />

            {/* Contactados */}
            <KanbanColumn
                title="Contactados"
                count={contactedLeads.length}
                leads={contactedLeads}
                dotColor="bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            />

            {/* En Negociación */}
            <KanbanColumn
                title="En Negociación"
                count={negotiationLeads.length}
                leads={negotiationLeads}
                dotColor="bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"
            />

            {/* Ganados */}
            <KanbanColumn
                title="Ganados"
                count={wonLeads.length}
                leads={wonLeads}
                dotColor="bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            />
        </div>
    );
}
