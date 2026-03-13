'use client';

import React, { useState } from 'react';
import { Building2, Save } from 'lucide-react';

export default function GeneralSettings() {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Company Info */}
                <div className="bg-[#15201D] border border-white/5 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-[#10B981] border border-emerald-500/20">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold">Información del Negocio</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Datos públicos de la empresa</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Nombre de la Empresa</label>
                            <input 
                                type="text" 
                                defaultValue="Elemotor Colombia"
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/50 transition-all font-light"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">NIT / Documento</label>
                                <input 
                                    type="text" 
                                    defaultValue="901.234.567-8"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-[#10B981]/50 transition-all font-light"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">IVA (Por defecto %)</label>
                                <input 
                                    type="number" 
                                    defaultValue="19"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-[#10B981]/50 transition-all font-light"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Dirección Principal</label>
                            <input 
                                type="text" 
                                defaultValue="Cra 15 # 93-60, Bogotá, Colombia"
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-[#10B981]/50 transition-all font-light"
                            />
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex justify-start mt-2">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-[#10B981]/20 hover:-translate-y-0.5">
                    <Save size={18} />
                    Guardar Cambios
                </button>
            </div>
        </div>
    );
}

