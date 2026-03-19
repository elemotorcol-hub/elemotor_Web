'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Droplets, Save, Plus, Edit2, X, Trash2, Loader2 } from 'lucide-react';
import { settingsService, ElectricityRate, FuelPrice } from '@/services/settings.service';

export default function SystemVariables() {
    // State
    const [energyRates, setEnergyRates] = useState<ElectricityRate[]>([]);
    const [fuelPrices, setFuelPrices] = useState<FuelPrice[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial load
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [rates, fuel] = await Promise.all([
                settingsService.getElectricityRates(),
                settingsService.getFuelPrices()
            ]);
            setEnergyRates(rates);
            setFuelPrices(fuel);
        } catch (error) {
            console.error("Error fetching system variables:", error);
        } finally {
            setLoading(false);
        }
    };

    // Modals state
    const [isEnergyModalOpen, setIsEnergyModalOpen] = useState(false);
    const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
    const [editingEnergy, setEditingEnergy] = useState<ElectricityRate | null>(null);
    const [editingFuel, setFuelEditingItem] = useState<FuelPrice | null>(null);

    // Form states
    const [energyForm, setEnergyForm] = useState<Partial<ElectricityRate>>({});
    const [fuelForm, setFuelForm] = useState<Partial<FuelPrice>>({ fuelType: 'regular' });

    // Handlers Energy
    const openEnergyModal = (rate?: ElectricityRate) => {
        if (rate) {
            setEditingEnergy(rate);
            setEnergyForm(rate);
        } else {
            setEditingEnergy(null);
            setEnergyForm({ city: '', pricePerKwhCop: 0, source: '' });
        }
        setIsEnergyModalOpen(true);
    };

    const saveEnergyRate = async () => {
        try {
            if (editingEnergy) {
                await settingsService.updateElectricityRate(editingEnergy.id, energyForm as ElectricityRate);
            } else {
                await settingsService.createElectricityRate(energyForm as ElectricityRate);
            }
            fetchData();
            setIsEnergyModalOpen(false);
        } catch (error) {
            alert("Error al guardar la tarifa de energía");
        }
    };

    const deleteEnergyRate = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if(confirm("¿Estás seguro de eliminar esta tarifa?")) {
            try {
                await settingsService.deleteElectricityRate(id);
                fetchData();
            } catch (error) {
                alert("Error al eliminar la tarifa");
            }
        }
    }

    // Handlers Fuel
    const openFuelModal = (fuel?: FuelPrice) => {
        if (fuel) {
            setFuelEditingItem(fuel);
            setFuelForm(fuel);
        } else {
            setFuelEditingItem(null);
            setFuelForm({ city: '', fuelType: 'regular', pricePerGallonCop: 0, source: '' });
        }
        setIsFuelModalOpen(true);
    };

    const saveFuelPrice = async () => {
        try {
            if (editingFuel) {
                await settingsService.updateFuelPrice(editingFuel.id, fuelForm as FuelPrice);
            } else {
                await settingsService.createFuelPrice(fuelForm as FuelPrice);
            }
            fetchData();
            setIsFuelModalOpen(false);
        } catch (error) {
            alert("Error al guardar el precio del combustible");
        }
    };

    const deleteFuelPrice = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if(confirm("¿Estás seguro de eliminar esta tarifa?")) {
            try {
                await settingsService.deleteFuelPrice(id);
                fetchData();
            } catch (error) {
                alert("Error al eliminar el precio");
            }
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
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-10 text-center">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-500 mb-2" />
                                            <span className="text-xs text-slate-500">Cargando tarifas...</span>
                                        </td>
                                    </tr>
                                ) : (
                                    energyRates.map((rate) => (
                                        <tr key={rate.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-4 py-4 text-sm font-medium text-slate-200">{rate.city}</td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm font-medium text-[#10B981]">${Number(rate.pricePerKwhCop).toLocaleString()}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm text-slate-400">{rate.source || 'N/A'}</span>
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
                                    ))
                                )}
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
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-10 text-center">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
                                            <span className="text-xs text-slate-500">Cargando precios...</span>
                                        </td>
                                    </tr>
                                ) : (
                                    fuelPrices.map((fuel) => (
                                        <tr key={fuel.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-4 py-4">
                                                <div className="text-sm font-medium text-slate-200">{fuel.city}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">{fuel.fuelType}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm font-medium text-blue-400">${Number(fuel.pricePerGallonCop).toLocaleString()}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm text-slate-400">{fuel.source || 'N/A'}</span>
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
                                    ))
                                )}
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
                                    value={energyForm.pricePerKwhCop || ''}
                                    onChange={e => setEnergyForm({...energyForm, pricePerKwhCop: Number(e.target.value)})}
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
                                    value={fuelForm.fuelType}
                                    onChange={e => setFuelForm({...fuelForm, fuelType: e.target.value as any})}
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#10B981]/50 transition-all font-light"
                                >
                                    <option value="regular">Corriente</option>
                                    <option value="premium">Extra</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">Precio por Galón (COP)</label>
                                <input 
                                    type="number" 
                                    value={fuelForm.pricePerGallonCop || ''}
                                    placeholder="15000"
                                    onChange={e => setFuelForm({...fuelForm, pricePerGallonCop: Number(e.target.value)})}
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
