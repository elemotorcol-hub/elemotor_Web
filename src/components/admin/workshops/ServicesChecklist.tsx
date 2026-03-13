'use client';

import React from 'react';
import { Zap, Wrench, Disc, BatteryCharging, ShieldCheck, Car } from 'lucide-react';

export const availableServices = [
    { id: 'srv-1', title: 'Diagnóstico Eléctrico', description: 'Escaneo completo de sistemas HV', icon: <Zap size={20} /> },
    { id: 'srv-2', title: 'Mantenimiento General', description: 'Frenos, suspensión y filtros', icon: <Wrench size={20} /> },
    { id: 'srv-3', title: 'Llantas y Alineación', description: 'Especial para peso EV', icon: <Disc size={20} /> },
    { id: 'srv-4', title: 'Estación de Carga', description: 'Carga rápida nivel 3 disponible', icon: <BatteryCharging size={20} /> },
    { id: 'srv-5', title: 'Revisión Técnico Mecánica', description: 'Certificación oficial para EV/PHEV', icon: <ShieldCheck size={20} /> },
    { id: 'srv-6', title: 'Latonería y Pintura', description: 'Reparación estética de carrocería', icon: <Car size={20} /> },
];

export const availableAmenities = [
    'Wi-Fi Gratis',
    'Cafetería',
    'Sala de Espera VIP',
    'Tienda de Accesorios',
    'Transporte Alternativo',
    'Parqueadero Techado'
];

interface ServicesChecklistProps {
    selectedServices: string[];
    selectedAmenities: string[];
    onServicesChange: (services: string[]) => void;
    onAmenitiesChange: (amenities: string[]) => void;
}

export default function ServicesChecklist({ 
    selectedServices, 
    selectedAmenities, 
    onServicesChange, 
    onAmenitiesChange 
}: ServicesChecklistProps) {

    const toggleService = (id: string) => {
        if (selectedServices.includes(id)) {
            onServicesChange(selectedServices.filter(s => s !== id));
        } else {
            onServicesChange([...selectedServices, id]);
        }
    };

    const toggleAmenity = (name: string) => {
        if (selectedAmenities.includes(name)) {
            onAmenitiesChange(selectedAmenities.filter(a => a !== name));
        } else {
            onAmenitiesChange([...selectedAmenities, name]);
        }
    };

    return (
        <div className="w-full space-y-8">
            
            {/* Services Section */}
            <div>
                <h4 className="text-sm font-bold text-white mb-4">Servicios Especializados Ofrecidos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableServices.map(service => {
                        const isSelected = selectedServices.includes(service.id);
                        return (
                            <div 
                                key={service.id}
                                onClick={() => toggleService(service.id)}
                                className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer group select-none ${
                                    isSelected 
                                    ? 'bg-[#10B981]/10 border-[#10B981]/50 shadow-[0_4px_20px_-5px_rgba(16,185,129,0.1)]' 
                                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                <div className={`mt-0.5 p-2 rounded-lg transition-colors ${
                                    isSelected ? 'bg-[#10B981] text-slate-950' : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                                }`}>
                                    {service.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`text-sm font-semibold transition-colors ${
                                        isSelected ? 'text-[#10B981]' : 'text-slate-200 group-hover:text-white'
                                    }`}>
                                        {service.title}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5 pr-2">
                                        {service.description}
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                                    isSelected ? 'border-[#10B981] bg-[#10B981]' : 'border-slate-700'
                                }`}>
                                    {isSelected && <div className="w-2 h-2 bg-slate-950 rounded-full" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Amenities Section */}
            <div>
                <h4 className="text-sm font-bold text-white mb-4">Amenidades y Comodidades</h4>
                <div className="flex flex-wrap gap-2">
                    {availableAmenities.map(amenity => {
                        const isSelected = selectedAmenities.includes(amenity);
                        return (
                            <button
                                key={amenity}
                                type="button"
                                onClick={() => toggleAmenity(amenity)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all select-none border ${
                                    isSelected 
                                    ? 'bg-[#10B981] text-slate-950 border-[#10B981] shadow-lg shadow-[#10B981]/20' 
                                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'
                                }`}
                            >
                                {amenity}
                            </button>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
