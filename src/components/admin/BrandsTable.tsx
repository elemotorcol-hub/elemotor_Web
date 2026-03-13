'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Loader2, X } from 'lucide-react';
import { Brand } from '@/types/inventory';
import BrandSlideOver from './BrandSlideOver';
import { useBrands } from '@/hooks/useBrands';
import { BrandTableRow } from './BrandTableRow';

export default function BrandsTable() {
    const { brands, fetchBrands, deleteBrand, updateBrand, isLoading } = useBrands();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [slideOverMode, setSlideOverMode] = useState<'add' | 'edit'>('add');
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const activeBrandsList = Array.isArray(brands) ? brands : [];

    const filteredBrands = useMemo(() => {
        return activeBrandsList.filter(brand =>
            brand?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [activeBrandsList, searchTerm]);

    const handleAddBrand = () => {
        setSlideOverMode('add');
        setSelectedBrand(null);
        setIsSlideOverOpen(true);
    };

    const handleEditBrand = (brand: Brand) => {
        setSlideOverMode('edit');
        setSelectedBrand(brand);
        setIsSlideOverOpen(true);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Table Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Buscar marcas..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Add Button */}
                <button
                    onClick={handleAddBrand}
                    className="flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-[#0A110F] px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm w-full sm:w-auto shadow-lg shadow-[#10B981]/20"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    <span>Añadir Marca</span>
                </button>
            </div>

            {/* Error Message */}
            {deleteError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg flex items-start justify-between gap-4">
                    <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">{deleteError}</p>
                    <button 
                        onClick={() => setDeleteError(null)} 
                        className="text-red-400 hover:text-red-300 transition-colors p-1 shrink-0 bg-red-500/10 rounded-md"
                        title="Cerrar"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
                <div className="flex items-center justify-center py-4">
                    <Loader2 className="animate-spin text-[#10B981]" size={24} />
                    <span className="ml-2 text-slate-400 text-sm">Cargando datos...</span>
                </div>
            )}

            {/* Data Table */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/80">
                                <th className="p-4 pl-6 font-medium">Marca</th>
                                <th className="p-4 font-medium">País Original</th>
                                <th className="p-4 font-medium">Estado</th>
                                <th className="p-4 text-right pr-6 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 text-sm">
                            {filteredBrands.map((brand) => (
                                <BrandTableRow
                                    key={brand.id}
                                    brand={brand}
                                    onEdit={handleEditBrand}
                                    onDeactivate={async (id) => {
                                        if (window.confirm('¿Seguro que deseas desactivar esta marca?')) {
                                            setDeleteError(null);
                                            const res = await deleteBrand(id);
                                            if (!res.success) {
                                                setDeleteError(res.error || 'Ocurrió un error inesperado al desactivar la marca.');
                                            }
                                        }
                                    }}
                                    onReactivate={async (id) => {
                                        if (window.confirm('¿Seguro que deseas reactivar esta marca?')) {
                                            setDeleteError(null);
                                            const res = await updateBrand(id, { active: true });
                                            if (!res.success) {
                                                setDeleteError(res.error || 'Ocurrió un error inesperado al reactivar la marca.');
                                            }
                                        }
                                    }}
                                />
                            ))}
                            {filteredBrands.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2 text-slate-600">
                                            <Search size={32} className="mb-2 opacity-50" />
                                            <p>No se encontraron marcas coincidiendo con &quot;{searchTerm}&quot;</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <BrandSlideOver
                isOpen={isSlideOverOpen}
                onClose={() => setIsSlideOverOpen(false)}
                mode={slideOverMode}
                initialData={selectedBrand}
                onSuccess={fetchBrands}
            />
        </div>
    );
}
