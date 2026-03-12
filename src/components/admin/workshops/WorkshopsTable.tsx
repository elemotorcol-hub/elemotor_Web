'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, MapPin, Star, MoreVertical, Edit2, CheckCircle2, XCircle } from 'lucide-react';
import { mockWorkshops, Workshop } from '@/mocks/workshopsData';
import WorkshopFormSlideOver from './WorkshopFormSlideOver';

export default function WorkshopsTable() {
    const [workshops, setWorkshops] = useState<Workshop[]>(mockWorkshops);
    const [searchQuery, setSearchQuery] = useState('');
    const [cityFilter, setCityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Extract unique cities for filter
    const cities = useMemo(() => {
        const unique = new Set(workshops.map(w => w.city));
        return Array.from(unique);
    }, [workshops]);

    const filteredWorkshops = useMemo(() => {
        return workshops.filter(workshop => {
            const matchesSearch = workshop.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCity = cityFilter === 'all' || workshop.city === cityFilter;
            const matchesStatus = statusFilter === 'all' || workshop.status === statusFilter;
            return matchesSearch && matchesCity && matchesStatus;
        });
    }, [workshops, searchQuery, cityFilter, statusFilter]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, cityFilter, statusFilter]);

    const paginatedWorkshops = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredWorkshops.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredWorkshops, currentPage]);

    const totalPages = Math.ceil(filteredWorkshops.length / itemsPerPage);

    const handleToggleStatus = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setWorkshops(workshops.map(w => 
            w.id === id ? { ...w, status: w.status === 'active' ? 'inactive' : 'active' } : w
        ));
    };

    const handleEdit = (workshop: Workshop) => {
        setSelectedWorkshop(workshop);
        setIsSlideOverOpen(true);
    };

    const handleCreateNew = () => {
        setSelectedWorkshop(null);
        setIsSlideOverOpen(true);
    };

    return (
        <div className="bg-[#15201D] border border-white/5 rounded-2xl overflow-hidden mt-2">
            
            {/* Toolbar */}
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex flex-1 w-full sm:w-auto items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-slate-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar taller por nombre..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                        />
                    </div>
                    
                    <select
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-[#10B981] cursor-pointer"
                    >
                        <option value="all">Todas las ciudades</option>
                        {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-[#10B981] cursor-pointer"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                    </select>
                </div>
                
                <button 
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-medium transition-colors text-sm"
                >
                    <Plus size={16} />
                    Nuevo Taller
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/[0.02] border-b border-white/5">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Taller</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ubicación</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Calificación</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right pr-10">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {paginatedWorkshops.length > 0 ? (
                            paginatedWorkshops.map((workshop) => (
                                <tr 
                                    key={workshop.id} 
                                    onClick={() => handleEdit(workshop)}
                                    className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold overflow-hidden">
                                                {workshop.images.length > 0 ? (
                                                    <img src={workshop.images[0]} alt={workshop.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    workshop.name.charAt(0)
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-200 group-hover:text-[#10B981] transition-colors flex items-center gap-2">
                                                    {workshop.name}
                                                    {workshop.isVerified && <span title="Verificado"><CheckCircle2 size={14} className="text-[#10B981]" /></span>}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-0.5">{workshop.phone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-slate-300 font-medium">{workshop.city}</span>
                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                <MapPin size={12} />
                                                <span className="truncate max-w-[150px]">{workshop.address}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Star size={14} className="text-amber-400 fill-amber-400" />
                                            <span className="text-sm font-bold text-white">{workshop.rating.toFixed(1)}</span>
                                            <span className="text-xs text-slate-500">({workshop.reviewsCount})</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                                            workshop.status === 'active' 
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                        }`}>
                                            {workshop.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right pr-6">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleEdit(workshop); }}
                                                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" 
                                                title="Editar Taller"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            
                                            {/* Toggle switch for status */}
                                            <button 
                                                onClick={(e) => handleToggleStatus(workshop.id, e)}
                                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                    workshop.status === 'active' ? 'bg-[#10B981]' : 'bg-slate-700'
                                                }`}
                                                role="switch"
                                                title={workshop.status === 'active' ? "Desactivar" : "Activar"}
                                            >
                                                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                    workshop.status === 'active' ? 'translate-x-4' : 'translate-x-0'
                                                }`} />
                                            </button>
                                            
                                            <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No se encontraron talleres que coincidan con la búsqueda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-slate-950/50">
                    <div className="text-sm text-slate-400">
                        Mostrando <span className="font-medium text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium text-slate-200">{Math.min(currentPage * itemsPerPage, filteredWorkshops.length)}</span> de <span className="font-medium text-slate-200">{filteredWorkshops.length}</span> resultados
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-sm font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Anterior
                        </button>
                        <button 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 text-sm font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}

            {isSlideOverOpen && (
                <WorkshopFormSlideOver 
                    isOpen={isSlideOverOpen}
                    onClose={() => setIsSlideOverOpen(false)}
                    workshopToEdit={selectedWorkshop}
                />
            )}
        </div>
    );
}
