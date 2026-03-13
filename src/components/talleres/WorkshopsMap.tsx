'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Zap, Navigation, X, Target, Layers } from 'lucide-react';
import Image from 'next/image';
import { WORKSHOPS_DATA, WORKSHOP_FILTERS, Workshop } from '@/mocks/talleresData';
import { WorkshopDetailsModal } from '@/components/talleres/WorkshopDetailsModal';

export function WorkshopsMap() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('Todos');
    const [activeWorkshopId, setActiveWorkshopId] = useState<string | null>(null);
    const [modalWorkshopId, setModalWorkshopId] = useState<string | null>(null);

    // Filter Logic
    const filteredWorkshops = useMemo(() => {
        return WORKSHOPS_DATA.filter(workshop => {
            const matchesSearch = workshop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                workshop.address.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = selectedFilter === 'Todos' || workshop.type === selectedFilter;
            return matchesSearch && matchesFilter;
        });
    }, [searchQuery, selectedFilter]);

    const activeWorkshop = useMemo(() => {
        return WORKSHOPS_DATA.find(w => w.id === activeWorkshopId);
    }, [activeWorkshopId]);

    // Handle map pin click
    const handlePinClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveWorkshopId(id);
    };

    return (
        <div className="w-full h-screen bg-[#111618] flex flex-col md:flex-row relative overflow-hidden font-sans pt-[72px]">
            {/* --- SIDEBAR IZQUIERDA --- */}
            <div className="w-full md:w-[450px] lg:w-[480px] h-full bg-[#0A1114] border-r border-[#1e293b] flex flex-col z-20 shadow-2xl relative">

                {/* Header / Buscador */}
                <div className="p-6 border-b border-[#1e293b] shrink-0">
                    <div className="flex items-center gap-2 mb-6 text-white font-bold text-xl">
                        <span>Talleres Aliados</span>
                    </div>
                    <p className="text-slate-400 text-xs mb-4">Red de servicio técnico certificado por Elemotor</p>

                    <div className="flex gap-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar talleres o cargadores..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#1A2327] border border-[#2b3a42] rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D4AA] transition-colors"
                            />
                        </div>
                        <button className="w-12 h-12 bg-[#1A2327] border border-[#2b3a42] rounded-lg flex items-center justify-center hover:bg-[#202b30] transition-colors">
                            <Target className="w-5 h-5 text-[#00D4AA]" />
                        </button>
                    </div>

                    {/* Filtros Horizontales Scrollables */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {WORKSHOP_FILTERS.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all
                                ${selectedFilter === filter
                                        ? 'bg-[#00D4AA] text-[#0A1114]'
                                        : 'bg-[#1A2327] text-slate-300 hover:bg-[#202b30]'
                                    }`}
                            >
                                {filter === 'Cargadores' && <Zap className="w-3 h-3" />}
                                {filter === 'Mantenimiento' && <WrenchIcon className="w-3 h-3" />}
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lista de Tarjetas */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 scrollbar-thin scrollbar-thumb-[#1e293b] scrollbar-track-transparent">
                    {filteredWorkshops.map(workshop => (
                        <div
                            key={workshop.id}
                            onClick={() => setActiveWorkshopId(workshop.id)}
                            className={`p-4 rounded-xl cursor-pointer transition-all border relative overflow-hidden group
                            ${activeWorkshopId === workshop.id
                                    ? 'bg-[#15242b] border-[#00D4AA] shadow-[0_0_15px_rgba(0,212,170,0.1)]'
                                    : 'bg-[#111A1F] border-[#1e293b] hover:border-slate-600'
                                }`}
                        >
                            {/* Borde activo lateral */}
                            {activeWorkshopId === workshop.id && (
                                <motion.div layoutId="activeBorder" className="absolute left-0 top-0 bottom-0 w-1 bg-[#00D4AA]" />
                            )}

                            <div className="flex gap-4">
                                {/* Imagen miniatura */}
                                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative bg-slate-800">
                                    <Image
                                        src={workshop.images[0]}
                                        alt={workshop.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-white font-bold text-sm mb-1">{workshop.name}</h3>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-2">
                                        <div className="flex text-[#00D4AA]">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-3 h-3 ${i < Math.floor(workshop.rating) ? 'fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-slate-500">({workshop.reviews} reviews)</span>
                                    </div>

                                    {/* Estado y Tipo */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider
                                                ${workshop.isOpen ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                                                {workshop.isOpen ? 'Abierto Ahora' : 'Cerrado'}
                                            </span>
                                            <span className="text-[10px] text-slate-400">• {workshop.type}</span>
                                        </div>
                                    </div>

                                    {/* Botón Acción Card */}
                                    <div className="mt-3 flex justify-end">
                                        <button className="text-[#00D4AA] text-[10px] font-bold flex items-center gap-1 hover:text-white transition-colors">
                                            <Navigation className="w-3 h-3" /> Cómo Llegar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredWorkshops.length === 0 && (
                        <div className="text-center text-slate-500 py-10 text-sm">
                            No se encontraron talleres con esos criterios.
                        </div>
                    )}
                </div>
            </div>

            {/* --- MAPA AREA DERECHA --- */}
            <div
                className="flex-1 h-full min-h-[500px] bg-[#111618] relative overflow-hidden"
                onClick={() => setActiveWorkshopId(null)}
            >
                {/* Mapa Real de Fondo (Con filtros CSS para Dark Mode Premium) */}
                <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(105%) opacity(0.8)' }}
                        src="https://www.openstreetmap.org/export/embed.html?bbox=-82.0%2C-4.5%2C-66.5%2C13.5&amp;layer=mapnik"
                        title="Mapa de Colombia Talleres"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111618] via-transparent to-[#111618]/50" />
                </div>
                {/* Controles flotantes en el mapa */}
                <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
                    <button className="w-10 h-10 bg-[#0A1114] border border-[#2b3a42] rounded-lg flex items-center justify-center text-white hover:bg-[#1e293b] transition-colors shadow-lg">
                        <span className="text-xl">+</span>
                    </button>
                    <button className="w-10 h-10 bg-[#0A1114] border border-[#2b3a42] rounded-lg flex items-center justify-center text-white hover:bg-[#1e293b] transition-colors shadow-lg">
                        <span className="text-xl">-</span>
                    </button>
                    <div className="w-10 h-[10px]"></div>
                    <button className="w-10 h-10 bg-[#0A1114] border border-[#2b3a42] rounded-lg flex items-center justify-center text-white hover:bg-[#1e293b] transition-colors shadow-lg">
                        <Layers className="w-5 h-5" />
                    </button>
                </div>

                {/* Marcadores / Pines (Mock con posiciones % relativas) */}
                {WORKSHOPS_DATA.map(workshop => {
                    const isActive = activeWorkshopId === workshop.id;
                    const isFiltered = filteredWorkshops.some(w => w.id === workshop.id);

                    if (!isFiltered && !isActive) return null;

                    return (
                        <div
                            key={`pin-${workshop.id}`}
                            className="absolute z-10 transform -translate-x-1/2 -translate-y-full cursor-pointer"
                            style={{ left: `${workshop.x}%`, top: `${workshop.y}%` }}
                            onClick={(e) => handlePinClick(workshop.id, e)}
                        >
                            {/* Pin Graphics */}
                            <div className="relative group">
                                {/* Glow radar if active */}
                                {isActive && (
                                    <>
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 2.5, opacity: [0.5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="absolute inset-0 bg-[#00D4AA] rounded-full z-0"
                                        />
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 3.5, opacity: [0.3, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                                            className="absolute inset-0 border border-[#00D4AA] rounded-full z-0"
                                        />
                                    </>
                                )}

                                <div className={`relative z-10 w-8 h-10 transition-transform ${isActive ? 'scale-125' : 'group-hover:scale-110'}`}>
                                    {/* Icono Custom SVG Pin invertido */}
                                    <svg viewBox="0 0 24 32" className={`w-8 h-10 drop-shadow-xl ${isActive ? 'text-[#00D4AA]' : 'text-slate-500 group-hover:text-[#00D4AA]'}`} fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 0C5.373 0 0 5.373 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.373 18.627 0 12 0Z" fill="currentColor" opacity="0.1" />
                                        <path d="M12 2C6.477 2 2 6.477 2 12C2 19.5 12 29 12 29C12 29 22 19.5 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor" stroke="#00D4AA" strokeWidth="2" />
                                        <circle cx="12" cy="12" r="4" fill={isActive ? '#0A1114' : '#1e293b'} />
                                    </svg>

                                    {/* Inner icon depending on type */}
                                    <div className="absolute top-[8px] left-[10px] z-20 pointer-events-none">
                                        {workshop.type === 'Cargadores' ? (
                                            <Zap className={`w-3 h-3 ${isActive ? 'text-[#00D4AA]' : 'text-white'}`} fill="currentColor" />
                                        ) : (
                                            <WrenchIcon className={`w-3 h-3 ${isActive ? 'text-[#00D4AA]' : 'text-white'}`} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Popup de Detalle (Absolute sobre el pin) */}
                <AnimatePresence>
                    {activeWorkshop && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute z-20 w-[280px] bg-[#0A1114] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden"
                            style={{
                                // Posicionar sobre el pin activo (heurística simple para este mockup)
                                left: `calc(${activeWorkshop.x}% - 140px)`,
                                top: `calc(${activeWorkshop.y}% - 220px)`,
                                // Evitar que se salga por arriba si el pin está muy alto
                                marginTop: activeWorkshop.y < 30 ? '250px' : '0'
                            }}
                        >
                            <button
                                onClick={() => setActiveWorkshopId(null)}
                                className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/80"
                            >
                                <X className="w-3 h-3" />
                            </button>

                            <div className="h-32 relative bg-slate-800">
                                <Image src={activeWorkshop.images[0]} alt={activeWorkshop.name} fill className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1114] via-transparent to-transparent" />
                            </div>

                            <div className="p-4 -mt-6 relative z-10">
                                <h4 className="text-white font-bold text-sm mb-1 drop-shadow-md">{activeWorkshop.name}</h4>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[#00D4AA] text-xs font-bold">{activeWorkshop.rating} ✩</span>
                                    <span className="text-slate-400 text-xs truncate">• {activeWorkshop.address}</span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setModalWorkshopId(activeWorkshop.id);
                                    }}
                                    className="w-full bg-[#00D4AA] hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-lg text-xs transition-colors shadow-[0_0_10px_rgba(0,212,170,0.3)]"
                                >
                                    Ver Detalles
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Modal de Detalles a Pantalla Completa */}
                <AnimatePresence>
                    {modalWorkshopId && (
                        <WorkshopDetailsModal
                            workshop={WORKSHOPS_DATA.find(w => w.id === modalWorkshopId)!}
                            onClose={() => setModalWorkshopId(null)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Simple custom Wrench icon since lucide might render differently
function WrenchIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
    );
}

