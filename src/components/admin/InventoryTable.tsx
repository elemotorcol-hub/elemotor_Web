'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Plus, Edit2, Trash2, Ban, RefreshCw, X, AlertTriangle, Info } from 'lucide-react';
import { VehicleModel } from '@/types/inventory';
import ModelSlideOver from './ModelSlideOver';
import TrimGalleryPreview from './TrimGalleryPreview';
import { useInventory } from '@/hooks/useInventory';

export default function InventoryTable() {
    const {
        searchTerm, setSearchTerm,
        selectedBrand, setSelectedBrand,
        selectedType, setSelectedType,
        selectedStatus, setSelectedStatus,
        models, filteredModels, brands,
        isLoading, page, setPage, totalPages, totalItems, refreshModels, deleteModel, updateModel
    } = useInventory();
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [slideOverMode, setSlideOverMode] = useState<'add' | 'edit'>('add');
    const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(null);

    const [previewModelId, setPreviewModelId] = useState<number | null>(null);
    const [previewModelName, setPreviewModelName] = useState<string>('');
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [reactivationInfo, setReactivationInfo] = useState<string | null>(null);
    
    // Modal de Confirmación de Desactivación
    const [modelToDelete, setModelToDelete] = useState<VehicleModel | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Cache of resolved thumbnail URLs keyed by modelId — populated lazily when gallery opens
    const [thumbnailCache, setThumbnailCache] = useState<Record<number, string>>({});

    const handleFirstImageResolved = (modelId: number, url: string) => {
        setThumbnailCache((prev) => ({ ...prev, [modelId]: url }));
    };

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
                        <option value="SUV">SUV</option>
                        <option value="Sedan">Sedán</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Pickup">Pickup</option>
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 appearance-none flex-1 lg:w-40 cursor-pointer"
                    >
                        <option value="all">Todos los Estados</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
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

            {/* Information Message (Reactivation) */}
            {reactivationInfo && (
                <div className="bg-sky-500/10 border border-sky-500/20 text-sky-200 px-4 py-3 rounded-lg flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                        <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">{reactivationInfo}</p>
                    </div>
                    <button 
                        onClick={() => setReactivationInfo(null)} 
                        className="text-sky-400 hover:text-sky-300 transition-colors p-1 shrink-0 bg-sky-500/10 rounded-md"
                        title="Cerrar"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

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
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                                            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                            <p>Cargando modelos...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : models.map((model: any) => (
                                <tr key={model.id} className={`hover:bg-slate-800/40 transition-colors group ${model.active === false ? 'opacity-60' : ''}`}>
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <button 
                                                onClick={() => {
                                                    setPreviewModelId(model.id);
                                                    setPreviewModelName(model.name);
                                                }}
                                                className="h-12 w-20 bg-slate-800 rounded-lg overflow-hidden relative shrink-0 border border-slate-700/50 flex items-center justify-center text-slate-500 font-bold text-xs group/img cursor-pointer transition-all hover:ring-2 hover:ring-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20"
                                                title="Ver Galería de Versiones"
                                            >
                                                {thumbnailCache[model.id] ? (
                                                    <Image
                                                        src={thumbnailCache[model.id]}
                                                        alt={model.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover/img:scale-110"
                                                        sizes="80px"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    // Clean placeholder: shows camera icon + trim count
                                                    <div className="flex flex-col items-center justify-center gap-1 w-full h-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                                                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                                                            <circle cx="12" cy="13" r="3"/>
                                                        </svg>
                                                        {model._count?.trims > 0 && (
                                                            <span className="text-[9px] text-slate-600 font-medium">{model._count.trims}v</span>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                                                </div>
                                            </button>
                                            <div className="flex flex-col justify-center">
                                                <div className="font-semibold text-slate-100">{model.name}</div>
                                                <div className="text-slate-500 text-xs mt-0.5">
                                                    {model.brand?.name || 'Sin Marca'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-semibold text-[#10B981]">
                                        ${Number(model.basePrice || 0).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${model.active !== false
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                            }`}>
                                            {model.active !== false ? 'Activo' : 'Inactivo'}
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
                                            {model.active !== false ? (
                                                <button 
                                                    onClick={() => setModelToDelete(model)}
                                                    className="p-2 hover:text-amber-500 hover:bg-amber-500/10 rounded-md transition-all" 
                                                    title="Desactivar Modelo"
                                                >
                                                    <Ban size={16} />
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={async () => {
                                                        if (window.confirm('¿Seguro que deseas reactivar este modelo?')) {
                                                            setDeleteError(null);
                                                            setReactivationInfo(null);
                                                            const res = await updateModel(model.id, true);
                                                            if (!res.success) {
                                                                setDeleteError(res.error || 'Ocurrió un error inesperado al reactivar el modelo.');
                                                            } else {
                                                                setReactivationInfo('El modelo ha sido reactivado.\n\nTen en cuenta que las versiones asociadas permanecen inactivas.\n\nPara reactivarlas debes ir a: Editar modelo → Versiones y Especificaciones y activar manualmente las versiones que deseas habilitar.');
                                                            }
                                                        }
                                                    }}
                                                    className="p-2 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-md transition-all" 
                                                    title="Reactivar Modelo"
                                                >
                                                    <RefreshCw size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {models.length === 0 && (
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
                
                {/* Pagination Controls */}
                {!isLoading && models.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/40">
                        <div className="text-sm text-slate-400">
                            Mostrando <span className="font-semibold text-slate-200">{models.length}</span> resultados de <span className="font-semibold text-slate-200">{totalItems}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 text-sm font-medium rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Anterior
                            </button>
                            <span className="text-sm text-slate-400 px-3">
                                Página {page} de {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 text-sm font-medium rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ModelSlideOver
                key={isSlideOverOpen ? (slideOverMode === 'add' ? 'add-mode' : `edit-${selectedModel?.id}`) : 'closed'}
                isOpen={isSlideOverOpen}
                onClose={() => {
                    setIsSlideOverOpen(false);
                    refreshModels();
                }}
                mode={slideOverMode}
                initialData={selectedModel}
            />

            <TrimGalleryPreview 
                modelId={previewModelId!} 
                modelName={previewModelName} 
                isOpen={previewModelId !== null} 
                onClose={() => setPreviewModelId(null)}
                onFirstImageResolved={handleFirstImageResolved}
            />

            {/* Custom Delete Confirmation Modal */}
            {modelToDelete && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-100 flex items-center justify-between">
                                        Desactivar Modelo
                                        <button 
                                            onClick={() => !isDeleting && setModelToDelete(null)}
                                            className="text-slate-500 hover:text-slate-300 transition-colors"
                                            disabled={isDeleting}
                                        >
                                            <X size={18} />
                                        </button>
                                    </h3>
                                    <div className="mt-3 text-sm text-slate-300 space-y-3">
                                        <p>
                                            Estás a punto de desactivar el modelo <strong>{modelToDelete.name}</strong>.
                                        </p>
                                        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                                            <p className="font-medium text-amber-400">
                                                Este modelo tiene {modelToDelete._count?.trims || 0} versión(es) asociada(s).
                                            </p>
                                        </div>
                                        <p>
                                            Si desactivas este modelo, todas sus versiones también se desactivarán automáticamente.
                                        </p>
                                        <p className="font-medium">¿Deseas continuar?</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700/50 flex justify-end gap-3">
                            <button
                                onClick={() => setModelToDelete(null)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={async () => {
                                    setIsDeleting(true);
                                    setDeleteError(null);
                                    setReactivationInfo(null);
                                    const res = await deleteModel(Number(modelToDelete.id));
                                    if (!res.success) {
                                        setDeleteError(res.error || 'Ocurrió un error inesperado al desactivar el modelo.');
                                    }
                                    setIsDeleting(false);
                                    setModelToDelete(null);
                                }}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Desactivando...
                                    </>
                                ) : (
                                    <>Desactivar modelo</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
