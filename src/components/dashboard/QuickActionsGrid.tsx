'use client';

import { MapPin, Download, MessageSquare } from 'lucide-react';

export function QuickActionsGrid() {
    const actions = [
        {
            icon: MapPin,
            title: 'Ver Tracking Detallado',
            description: 'Sigue la ubicación de tu vehículo en tiempo real en el mapa.',
            action: () => alert('Tracking Detallado - En Desarrollo')
        },
        {
            icon: Download,
            title: 'Descargar Documentos',
            description: 'Accede a facturas, manuales y garantía de tu vehículo.',
            action: () => alert('Descargar Documentos - En Desarrollo')
        },
        {
            icon: MessageSquare,
            title: 'Contactar Asesor',
            description: 'Habla directamente con tu especialista de ventas asignado.',
            action: () => alert('Contactar Asesor - En Desarrollo')
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {actions.map((action, idx) => {
                const Icon = action.icon;
                return (
                    <button
                        key={idx}
                        onClick={action.action}
                        className="bg-[#15201D] border border-white/5 hover:border-white/10 p-6 md:p-8 rounded-[24px] text-left transition-all duration-300 group hover:bg-white/[0.02]"
                    >
                        <div className="w-12 h-12 bg-[#0A110F] border border-white/5 rounded-2xl flex items-center justify-center mb-6 text-slate-400 group-hover:text-[#10B981] transition-colors">
                            <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                        <p className="text-sm font-medium text-slate-400 leading-relaxed pr-4">
                            {action.description}
                        </p>
                    </button>
                );
            })}
        </div>
    );
}
