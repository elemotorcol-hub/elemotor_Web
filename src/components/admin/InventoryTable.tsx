'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { VehicleModel } from '@/types/inventory';
import ModelSlideOver from './ModelSlideOver';
import { useInventory } from '@/hooks/useInventory';

export default function InventoryTable() {
    const {
        searchTerm, setSearchTerm,
        selectedBrand, setSelectedBrand,
        selectedType, setSelectedType,
        filteredModels, brands
    } = useInventory();
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [slideOverMode, setSlideOverMode] = useState<'add' | 'edit'>('add');
    const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null);

    const handleAddModel = () => {
        setSlideOverMode('add');
        setSelectedModel(null);
        setIsSlideOverOpen(true);
    };

    const handleEditModel = (model: VehicleModel) => {
        setSlideOverMode('edit');
        setSelectedModel(model);
        setIsSlideOverOpen(true);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Table Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Search Input */}
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar modelos, versiones..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 appearance-none flex-1 lg:w-40 cursor-pointer"
                    >
                        <option value="all">Todas las Marcas</option>
                        {brands.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 appearance-none flex-1 lg:w-40 cursor-pointer"
                    >
                        <option value="all">Todos los Tipos</option>
                        <option value="suv">SUV</option>
                        <option value="sedan">Sedán</option>
                        <option value="hatchback">Hatchback</option>
                        <option value="pickup">Pickup</option>
                        <option value="van">Van</option>
                        <option value="coupe">Coupé</option>
                    </select>
                </div>

                {/* Add Button */}
                <button
                    onClick={handleAddModel}
                    className="flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-[#0A110F] px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm w-full sm:w-auto shadow-lg shadow-[#10B981]/20"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    <span>Añadir Modelo</span>
                </button>
            </div>

            {/* Data Table */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/80">
                                <th className="p-4 pl-6 font-medium">Modelo</th>
                                <th className="p-4 font-medium">Precio Base</th>
                                <th className="p-4 font-medium">Estado</th>
                                <th className="p-4 text-right pr-6 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-sm">
                            {filteredModels.map((model) => (
                                <tr key={model.id} className="hover:bg-slate-800/40 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-20 bg-slate-800 rounded-lg overflow-hidden relative flex-shrink-0 border border-slate-700/50">
                                                <Image
                                                    src={model.thumbnail}
                                                    alt={model.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, 80px"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <div className="font-semibold text-slate-100">{model.name}</div>
                                                <div className="text-slate-500 text-xs mt-0.5">
                                                    {brands.find(b => b.id === model.brand_id)?.name || 'Sin Marca'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-semibold text-[#10B981]">
                                        ${model.basePrice.toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${model.status === 'Active'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                            }`}>
                                            {model.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right pr-6 align-middle">
                                        <div className="flex items-center justify-end gap-2 text-slate-400">
                                            <button
                                                onClick={() => handleEditModel(model)}
                                                className="p-2 hover:text-[#10B981] hover:bg-[#10B981]/10 rounded-md transition-all"
                                                title="Editar Modelo"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all" title="Eliminar Modelo">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredModels.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2 text-slate-600">
                                            <Search size={32} className="mb-2 opacity-50" />
                                            <p>No se encontraron modelos coincidiendo con &quot;{searchTerm}&quot;</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ModelSlideOver
                isOpen={isSlideOverOpen}
                onClose={() => setIsSlideOverOpen(false)}
                mode={slideOverMode}
                initialData={selectedModel}
            />
        </div>
    );
}
