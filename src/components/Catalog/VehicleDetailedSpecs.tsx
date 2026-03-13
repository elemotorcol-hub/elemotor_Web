'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Ruler, BatteryCharging, ShieldCheck, MonitorPlay, Zap, Car } from 'lucide-react';
import { Vehicle } from '@/data/models';

export function VehicleDetailedSpecs({ vehicle }: { vehicle: Vehicle }) {
    const specsGroups = [
        {
            title: 'Motor y Rendimiento',
            icon: Zap,
            items: [
                { label: 'Velocidad Máxima', value: `${vehicle.top_speed} km/h` },
                { label: 'Aceleración (0-100)', value: `${vehicle.zero_to_100}s` },
                { label: 'Potencia Total', value: `${vehicle.horsepower} Caballos de Fuerza (hp)` },
                { label: 'Torque Máximo', value: `${vehicle.torque} N·m` },
            ]
        },
        {
            title: 'Batería y Eficiencia',
            icon: BatteryCharging,
            items: [
                { label: 'Capacidad Batería', value: `${vehicle.battery_kwh} kWh` },
                { label: 'Autonomía (WLTP / CLTC)', value: `${vehicle.range_wltp_km} km / ${vehicle.range_cltc_km} km` },
                { label: 'Tiempo Carga (30%-80%)', value: vehicle.charge_time_30_80 },
                { label: 'Consumo Promedio', value: `${vehicle.kwh_per_100km} kWh/100km` },
            ]
        },
        {
            title: 'Dimensiones y Capacidad',
            icon: Ruler,
            items: [
                { label: 'Largo / Ancho / Alto', value: `${vehicle.length_mm} x ${vehicle.width_mm} x ${vehicle.height_mm} mm` },
                { label: 'Distancia entre ejes', value: `${vehicle.wheelbase_mm} mm` },
                { label: 'Peso en Vacío', value: `${vehicle.curb_weight_kg} kg` },
                { label: 'Capacidad Baúl (Maletero)', value: `${vehicle.trunk_liters} Litros` },
            ]
        },
        {
            title: 'Tecnología y Software',
            icon: MonitorPlay,
            items: [
                { label: 'Nivel Asistencia (ADAS)', value: vehicle.adas_level },
                { label: 'Pantalla Central', value: vehicle.screen_size },
                { label: 'Versión Software', value: vehicle.software_version },
                { label: 'Identificador Trim', value: vehicle.trim_id },
            ]
        }
    ];

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'center',
        loop: true,
        skipSnaps: false,
    });

    const scrollPrev = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = React.useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <section className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Car className="text-[#00D4AA]" /> Características Técnicas
                </h2>
                
                <div className="flex gap-2">
                    <button
                        onClick={scrollPrev}
                        className="p-2 rounded-full border border-white/10 text-slate-300 hover:bg-[#00D4AA] hover:text-slate-900 transition-colors bg-slate-900/50"
                        aria-label="Anterior Grupo"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="p-2 rounded-full border border-white/10 text-slate-300 hover:bg-[#00D4AA] hover:text-slate-900 transition-colors bg-slate-900/50"
                        aria-label="Siguiente Grupo"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
            
            <div className="embla overflow-hidden rounded-2xl bg-black/50 border border-white/5 shadow-2xl backdrop-blur-sm" ref={emblaRef}>
                <div className="embla__container flex">
                    {specsGroups.map((group, groupIdx) => {
                        const Icon = group.icon;
                        return (
                            <div key={groupIdx} className="embla__slide flex-[0_0_100%] md:flex-[0_0_60%] lg:flex-[0_0_50%] min-w-0 p-6 sm:p-8">
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center text-center gap-3 pb-6 border-b border-white/10">
                                        <div className="p-4 bg-[#0A0F1C] shadow-inner border border-white/5 rounded-2xl">
                                            <Icon size={28} className="text-[#00D4AA]" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-200">{group.title}</h3>
                                    </div>
                                    
                                    <ul className="space-y-4">
                                        {group.items.map((item, itemIdx) => (
                                            <li key={itemIdx} className="flex flex-col sm:flex-row sm:items-center justify-between group gap-2">
                                                <span className="text-sm font-medium uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors bg-white/5 px-2 py-1 rounded-md">
                                                    {item.label}
                                                </span>
                                                <span className="text-lg sm:text-base font-black text-white sm:text-right">
                                                    {item.value}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
