'use client';

import React, { useState } from 'react';
import { Zap, Droplets, Save, Plus, Edit2, X, Trash2 } from 'lucide-react';

interface EnergyRate {
    id: string;
    city: string;
    priceKwh: number;
    source: string;
}

interface FuelPrice {
    id: string;
    city: string;
    type: 'Corriente' | 'Extra' | 'Diesel';
    priceGallon: number;
    source: string;
}

export default function SystemVariables() {
    // State
    const [energyRates, setEnergyRates] = useState<EnergyRate[]>([
        { id: '1', city: 'Bogotá', priceKwh: 850, source: 'Enel Colombia' },
        { id: '2', city: 'Medellín', priceKwh: 810, source: 'EPM' },
        { id: '3', city: 'Cali', priceKwh: 890, source: 'Emcali' },
    ]);

    const [fuelPrices, setFuelPrices] = useState<FuelPrice[]>([
        { id: '1', city: 'Bogotá', type: 'Corriente', priceGallon: 15400, source: 'MinMinas' },
        { id: '2', city: 'Medellín', type: 'Corriente', priceGallon: 15300, source: 'MinMinas' },
        { id: '3', city: 'Cali', type: 'Corriente', priceGallon: 15500, source: 'MinMinas' },
    ]);

    // Modals state
    const [isEnergyModalOpen, setIsEnergyModalOpen] = useState(false);
    const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
    const [editingEnergy, setEditingEnergy] = useState<EnergyRate | null>(null);
    const [editingFuel, setEditingFuel] = useState<FuelPrice | null>(null);

    // Form states
    const [energyForm, setEnergyForm] = useState<Partial<EnergyRate>>({});
    const [fuelForm, setFuelForm] = useState<Partial<FuelPrice>>({ type: 'Corriente' });

    // Handlers Energy
    const openEnergyModal = (rate?: EnergyRate) => {
        if (rate) {
            setEditingEnergy(rate);
            setEnergyForm(rate);
        } else {
            setEditingEnergy(null);
            setEnergyForm({ city: '', priceKwh: 0, source: '' });
        }
        setIsEnergyModalOpen(true);
    };

    const saveEnergyRate = () => {
        if (editingEnergy) {
            setEnergyRates(rates => rates.map(r => r.id === editingEnergy.id ? { ...r, ...energyForm } as EnergyRate : r));
        } else {
            setEnergyRates([...energyRates, { ...energyForm, id: Date.now().toString() } as EnergyRate]);
        }
        setIsEnergyModalOpen(false);
    };

    const deleteEnergyRate = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if(confirm("¿Estás seguro de eliminar esta tarifa?")) {
            setEnergyRates(rates => rates.filter(r => r.id !== id));
        }
    }

    // Handlers Fuel
    const openFuelModal = (fuel?: FuelPrice) => {
        if (fuel) {
            setEditingFuel(fuel);
            setFuelForm(fuel);
        } else {
            setEditingFuel(null);
            setFuelForm({ city: '', type: 'Corriente', priceGallon: 0, source: '' });
        }
        setIsFuelModalOpen(true);
    };

    const saveFuelPrice = () => {
        if (editingFuel) {
            setFuelPrices(prices => prices.map(p => p.id === editingFuel.id ? { ...p, ...fuelForm } as FuelPrice : p));
        } else {
            setFuelPrices([...fuelPrices, { ...fuelForm, id: Date.now().toString() } as FuelPrice]);
        }
        setIsFuelModalOpen(false);
    };

    const deleteFuelPrice = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if(confirm("¿Estás seguro de eliminar esta tarifa?")) {
            setFuelPrices(prices => prices.filter(p => p.id !== id));
        }
    }

    return (
        <div className="flex flex-col gap-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Energy Rates Card */}
                <div className="bg-[#15201D] border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
                    <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/20">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Tarifas de Energía (kWh)</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Valores para calculadora de ahorro</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => openEnergyModal()}
                            className="flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-auto custom-scrollbar p-2">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="sticky top-0 bg-[#15201D] z-10 border-b border-white/5 shadow-sm">
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ciudad</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Precio COP</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Fuente</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {energyRates.map((rate) => (
                                    <tr key={rate.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-4 py-4 text-sm font-medium text-slate-200">{rate.city}</td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm font-medium text-[#10B981]">${rate.priceKwh.toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-slate-400">{rate.source}</span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => openEnergyModal(rate)}
                                                    className="p-1.5 text-slate-400 hover:text-[#10B981] hover:bg-[#10B981]/10 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={(e) => deleteEnergyRate(rate.id, e)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Fuel Prices Card */}
                <div className="bg-[#15201D] border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
                    <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 border border-blue-500/20">
                                <Droplets size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Precios de Combustible</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Precio por galón en COP</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => openFuelModal()}
                            className="flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-auto custom-scrollbar p-2">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="sticky top-0 bg-[#15201D] z-10 border-b border-white/5 shadow-sm">
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ubicación / Tipo</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Precio COP</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Fuente</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {fuelPrices.map((fuel) => (
                                    <tr key={fuel.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-4 py-4">
                                            <div className="text-sm font-medium text-slate-200">{fuel.city}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{fuel.type}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm font-medium text-blue-400">${fuel.priceGallon.toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-slate-400">{fuel.source}</span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => openFuelModal(fuel)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={(e) => deleteFuelPrice(fuel.id, e)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Modals */}
            {isEnergyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEnergyModalOpen(false)}></div>
                    <div className="relative bg-[#15201D] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500" />
                                {editingEnergy ? 'Editar Tarifa' : 'Nueva Tarifa'}
                            </h3>
                            <button onClick={() => setIsEnergyModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Ciudad / Región</label>
                                <input 
                                    type="text" 
                                    value={energyForm.city}
                                    placeholder="Ej. Bogotá"
                                    onChange={e => setEnergyForm({...energyForm, city: e.target.value})}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/50 transition-all font-light"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Precio por kWh (COP)</label>
                                <input 
                                    type="number" 
                                    value={energyForm.priceKwh || ''}
                                    onChange={e => setEnergyForm({...energyForm, priceKwh: Number(e.target.value)})}
                                    placeholder="850"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/50 transition-all font-light"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Empresa / Fuente</label>
                                <input 
                                    type="text" 
                                    value={energyForm.source}
                                    placeholder="Ej. Enel Colombia"
                                    onChange={e => setEnergyForm({...energyForm, source: e.target.value})}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/50 transition-all font-light"
                                />
                            </div>
                        </div>
                        <div className="p-5 border-t border-white/5 bg-black/20 flex justify-end gap-3 rounded-b-2xl">
                            <button onClick={() => setIsEnergyModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors focus:outline-none">
                                Cancelar
                            </button>
                            <button onClick={saveEnergyRate} className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-medium rounded-xl transition-colors shadow-lg focus:outline-none">
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isFuelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFuelModalOpen(false)}></div>
                    <div className="relative bg-[#15201D] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Droplets className="w-5 h-5 text-blue-500" />
                                {editingFuel ? 'Editar Precio' : 'Nuevo Precio'}
                            </h3>
                            <button onClick={() => setIsFuelModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Ciudad / Región</label>
                                <input 
                                    type="text" 
                                    value={fuelForm.city}
                                    placeholder="Ej. Medellín"
                                    onChange={e => setFuelForm({...fuelForm, city: e.target.value})}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#10B981]/50 transition-all font-light"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Tipo de Combustible</label>
                                <select 
                                    value={fuelForm.type}
                                    onChange={e => setFuelForm({...fuelForm, type: e.target.value as any})}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#10B981]/50 transition-all font-light"
                                >
                                    <option value="Corriente">Corriente</option>
                                    <option value="Extra">Extra</option>
                                    <option value="Diesel">Diesel</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Precio por Galón (COP)</label>
                                <input 
                                    type="number" 
                                    value={fuelForm.priceGallon || ''}
                                    placeholder="15000"
                                    onChange={e => setFuelForm({...fuelForm, priceGallon: Number(e.target.value)})}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#10B981]/50 transition-all font-light"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Fuente</label>
                                <input 
                                    type="text" 
                                    value={fuelForm.source}
                                    placeholder="Ej. MinMinas"
                                    onChange={e => setFuelForm({...fuelForm, source: e.target.value})}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#10B981]/50 transition-all font-light"
                                />
                            </div>
                        </div>
                        <div className="p-5 border-t border-white/5 bg-black/20 flex justify-end gap-3 rounded-b-2xl">
                            <button onClick={() => setIsFuelModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors focus:outline-none">
                                Cancelar
                            </button>
                            <button onClick={saveFuelPrice} className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-medium rounded-xl transition-colors shadow-lg focus:outline-none">
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
