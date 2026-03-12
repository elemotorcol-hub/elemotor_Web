'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface DaySchedule {
    day: string;
    label: string;
    isOpen: boolean;
    openTime: string; // HH:mm
    closeTime: string; // HH:mm
}

interface ScheduleGridProps {
    schedule: DaySchedule[];
    onChange: (schedule: DaySchedule[]) => void;
}

export const defaultSchedule: DaySchedule[] = [
    { day: 'monday', label: 'Lunes', isOpen: true, openTime: '08:00', closeTime: '18:00' },
    { day: 'tuesday', label: 'Martes', isOpen: true, openTime: '08:00', closeTime: '18:00' },
    { day: 'wednesday', label: 'Miércoles', isOpen: true, openTime: '08:00', closeTime: '18:00' },
    { day: 'thursday', label: 'Jueves', isOpen: true, openTime: '08:00', closeTime: '18:00' },
    { day: 'friday', label: 'Viernes', isOpen: true, openTime: '08:00', closeTime: '18:00' },
    { day: 'saturday', label: 'Sábado', isOpen: true, openTime: '09:00', closeTime: '14:00' },
    { day: 'sunday', label: 'Domingo', isOpen: false, openTime: '00:00', closeTime: '00:00' },
];

export default function ScheduleGrid({ schedule, onChange }: ScheduleGridProps) {
    
    const validateTimes = (open: string, close: string) => {
        if (!open || !close) return true; // Let basic HTML5 handle empty if we want, but usually HH:mm is fine
        const [openH, openM] = open.split(':').map(Number);
        const [closeH, closeM] = close.split(':').map(Number);
        
        const openTotal = openH * 60 + openM;
        const closeTotal = closeH * 60 + closeM;
        
        return openTotal < closeTotal;
    };

    const updateDay = (index: number, updates: Partial<DaySchedule>) => {
        const newSchedule = [...schedule];
        newSchedule[index] = { ...newSchedule[index], ...updates };
        onChange(newSchedule);
    };

    return (
        <div className="w-full space-y-4">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-sm text-slate-300">
                    <p className="font-medium text-emerald-400 mb-1">Horario Oficial de Operación</p>
                    <p className="text-xs text-slate-400">Define los días y horas exactas en los que el taller puede recibir vehículos. Asegúrate de que la hora de apertura sea menor a la de cierre.</p>
                </div>
            </div>

            <div className="space-y-3 mt-4">
                {/* Grid Header (Hidden on small screens) */}
                <div className="hidden sm:grid grid-cols-[120px_1fr_1fr_80px] gap-4 px-4 py-2 border-b border-white/5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <div>Día</div>
                    <div>Apertura</div>
                    <div>Cierre</div>
                    <div className="text-center">Estado</div>
                </div>

                {/* Rows */}
                {schedule.map((day, index) => {
                    const isValid = !day.isOpen || validateTimes(day.openTime, day.closeTime);

                    return (
                        <div key={day.day} className={`grid grid-cols-1 sm:grid-cols-[120px_1fr_1fr_80px] gap-3 sm:gap-4 items-center p-4 sm:py-3 sm:px-4 rounded-xl border transition-colors ${
                            day.isOpen ? 'bg-slate-900 border-slate-800' : 'bg-slate-950 border-white/5 opacity-70'
                        }`}>
                            {/* Day Label & Mobile Toggle */}
                            <div className="flex items-center justify-between sm:justify-start">
                                <span className={`font-medium ${day.isOpen ? 'text-slate-200' : 'text-slate-500'}`}>
                                    {day.label}
                                </span>
                                {/* Mobile Toggle */}
                                <div className="sm:hidden">
                                    <button 
                                        type="button"
                                        onClick={() => updateDay(index, { isOpen: !day.isOpen })}
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                            day.isOpen ? 'bg-[#10B981]' : 'bg-slate-700'
                                        }`}
                                    >
                                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            day.isOpen ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                    </button>
                                </div>
                            </div>

                            {/* Time Inputs */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 sm:hidden block w-16">Abre:</span>
                                <input 
                                    type="time" 
                                    value={day.openTime}
                                    disabled={!day.isOpen}
                                    onChange={(e) => updateDay(index, { openTime: e.target.value })}
                                    className={`w-full bg-slate-950 border rounded-lg py-2 px-3 text-sm font-mono focus:outline-none transition-colors ${
                                        !day.isOpen ? 'border-transparent text-slate-600' : 
                                        !isValid ? 'border-red-500/50 text-red-400 focus:border-red-500' : 
                                        'border-slate-800 text-slate-300 focus:border-[#10B981]'
                                    }`}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 sm:hidden block w-16">Cierra:</span>
                                <input 
                                    type="time" 
                                    value={day.closeTime}
                                    disabled={!day.isOpen}
                                    onChange={(e) => updateDay(index, { closeTime: e.target.value })}
                                    className={`w-full bg-slate-950 border rounded-lg py-2 px-3 text-sm font-mono focus:outline-none transition-colors ${
                                        !day.isOpen ? 'border-transparent text-slate-600' : 
                                        !isValid ? 'border-red-500/50 text-red-400 focus:border-red-500' : 
                                        'border-slate-800 text-slate-300 focus:border-[#10B981]'
                                    }`}
                                />
                            </div>

                            {/* Desktop Toggle & Status */}
                            <div className="hidden sm:flex flex-col items-center justify-center gap-1 border-l border-white/5 pl-4">
                                <button 
                                    type="button"
                                    onClick={() => updateDay(index, { isOpen: !day.isOpen })}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                        day.isOpen ? 'bg-[#10B981]' : 'bg-slate-700'
                                    }`}
                                >
                                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        day.isOpen ? 'translate-x-4' : 'translate-x-0'
                                    }`} />
                                </button>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${day.isOpen ? 'text-[#10B981]' : 'text-slate-500'}`}>
                                    {day.isOpen ? 'Abierto' : 'Cerrado'}
                                </span>
                            </div>

                            {/* Error Message */}
                            {!isValid && day.isOpen && (
                                <div className="sm:col-span-4 mt-1 text-[11px] text-red-400 font-medium">
                                    Error: La hora de apertura debe ser menor a la hora de cierre.
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
