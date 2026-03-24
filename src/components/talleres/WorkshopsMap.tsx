'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, Navigation, X, Target, Layers } from 'lucide-react';
import Image from 'next/image';
import { workshopService } from '@/services/workshop.service';
import { WorkshopDetailsModal } from '@/components/talleres/WorkshopDetailsModal';

// ── Module-level constants — defined ONCE, not re-created on every render ──

const WORKSHOP_FILTERS = ['Todos', 'Mantenimiento', 'Cargadores', 'Frenos', 'General'];

/** Maps backend ServiceType enum values to UI metadata */
const SERVICE_TYPE_MAP: Record<string, { id: string; icon: string; title: string; description: string }> = {
    maintenance:          { id: 'm',  icon: 'wrench',     title: 'Mantenimiento General',   description: 'Servicio preventivo'     },
    chargers:             { id: 'c',  icon: 'zap',        title: 'Estación de Carga',       description: 'Carga rápida disponible' },
    body_paint:           { id: 'b',  icon: 'palette',    title: 'Carrocería y Pintura',    description: 'Pintura especializada'   },
    electric_diagnostics: { id: 'e',  icon: 'activity',   title: 'Diagnóstico Eléctrico',   description: 'Sistemas HV'             },
    tires:                { id: 't',  icon: 'tire',       title: 'Llantas y Alineación',   description: 'Especial EVs'            },
    brakes:               { id: 'br', icon: 'circle-dot', title: 'Frenos y Suspensión',    description: 'Seguridad garantizada'   },
    general:              { id: 'g',  icon: 'wrench',     title: 'Mecánica General',        description: 'Servicio integral'       },
};

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
const mapDays = (dayOfWeek: number): string => DAY_NAMES[dayOfWeek % 7];

// ── Strict types ────────────────────────────────────────────────────────────

interface WorkshopHour {
    day: string;
    open_time: string;
    close_time: string;
    is_closed: boolean;
}

interface MappedWorkshop {
    id: string;
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
    type: string;
    rating: number;
    reviews: number;
    isOpen: boolean;
    images: { url: string }[] | string[];
    services: { id: string; icon: string; title: string; description: string }[];
    hoursList: WorkshopHour[];
}

// ── Component ───────────────────────────────────────────────────────────────

export function WorkshopsMap() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('Todos');
    const [activeWorkshopId, setActiveWorkshopId] = useState<string | null>(null);
    const [modalWorkshopId, setModalWorkshopId] = useState<string | null>(null);
    const [workshops, setWorkshops] = useState<MappedWorkshop[]>([]);
    const [loading, setLoading] = useState(true);

    const mapRef = React.useRef<any>(null);
    const markersRef = React.useRef<Record<string, any>>({});

    // Initialize Leaflet Map
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initMap = async () => {
            const L = (await import('leaflet')).default;

            const container = document.getElementById('workshops-map-root');
            if (!container || (container as any)._leaflet_id) return;

            const map = L.map('workshops-map-root', {
                zoomControl: false,
                attributionControl: false
            }).setView([4.6097, -74.0817], 6);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
                maxZoom: 20,
            }).addTo(map);

            // Filtro CSS para modo oscuro premium
            const mapPane = map.getPane('tilePane');
            if (mapPane) {
                mapPane.style.filter = 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(105%) opacity(0.8)';
            }

            mapRef.current = map;
        };

        initMap();

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Load Workshops Data
    useEffect(() => {
        const loadWorkshops = async () => {
            try {
                const response = await workshopService.fetchWorkshops();
                if (response && response.data) {
                    const mapped = response.data.map((w: any) => {
                        const serviceTypes = w.services.map((s: any) => s.serviceType || s);

                        let derivedType = 'General';
                        if (serviceTypes.includes('chargers')) derivedType = 'Cargadores';
                        else if (serviceTypes.includes('brakes')) derivedType = 'Frenos';
                        else if (serviceTypes.includes('maintenance')) derivedType = 'Mantenimiento';
                        else if (serviceTypes.includes('general')) derivedType = 'General';

                        return {
                            ...w,
                            id: String(w.id),
                            type: derivedType,
                            services: serviceTypes.map((type: string) => SERVICE_TYPE_MAP[type] ?? SERVICE_TYPE_MAP.maintenance),
                            hoursList: w.hours.map((h: any) => ({
                                day: mapDays(h.dayOfWeek),
                                open_time: h.openTime || '--:--',
                                close_time: h.closeTime || '--:--',
                                is_closed: h.isClosed
                            })),
                            reviews: w.reviewsCount || 0,
                            rating: w.rating || 0,
                            isOpen: true
                        };
                    });
                    setWorkshops(mapped);
                }
            } catch (error) {
                console.error('Error loading workshops:', error);
            } finally {
                setLoading(false);
            }
        };
        loadWorkshops();
    }, []);

    // Render Markers on Map
    useEffect(() => {
        if (!mapRef.current || workshops.length === 0) return;

        const renderMarkers = async () => {
            const L = (await import('leaflet')).default;
            
            Object.values(markersRef.current).forEach(m => m.remove());
            markersRef.current = {};

            workshops.forEach(w => {
                if (!w.latitude || !w.longitude) return;

                const isCharger = w.type === 'Cargadores';
                const iconHtml = `
                    <div class="relative group">
                        <div class="w-8 h-10 transition-transform hover:scale-110">
                            <svg viewBox="0 0 24 32" class="w-8 h-10 drop-shadow-xl text-slate-500 hover:text-[#00D4AA]" fill="none">
                                <path d="M12 0C5.373 0 0 5.373 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.373 18.627 0 12 0Z" fill="currentColor" opacity="0.1" />
                                <path d="M12 2C6.477 2 2 6.477 2 12C2 19.5 12 29 12 29C12 29 22 19.5 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor" stroke="#00D4AA" stroke-width="2" />
                                <circle cx="12" cy="12" r="4" fill="#1e293b" />
                            </svg>
                            <div class="absolute top-[8px] left-[10px] z-20 text-white pointer-events-none">
                                ${isCharger 
                                    ? '<svg viewBox="0 0 24 24" class="w-3 h-3" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' 
                                    : '<svg viewBox="0 0 24 24" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'}
                            </div>
                        </div>
                    </div>
                `;

                const icon = L.divIcon({
                    className: 'custom-pin',
                    html: iconHtml,
                    iconSize: [32, 40],
                    iconAnchor: [16, 40]
                });

                const marker = L.marker([w.latitude, w.longitude], { icon })
                    .addTo(mapRef.current)
                    .on('click', () => {
                        setActiveWorkshopId(w.id);
                        mapRef.current.flyTo([w.latitude, w.longitude], 14);
                    });
                
                markersRef.current[w.id] = marker;
            });
        };

        renderMarkers();
    }, [workshops]);

    // Pan to active workshop from outer state
    useEffect(() => {
        if (activeWorkshopId && mapRef.current && markersRef.current[activeWorkshopId]) {
            const workshop = workshops.find(w => w.id === activeWorkshopId);
            if (workshop && workshop.latitude && workshop.longitude) {
                mapRef.current.flyTo([workshop.latitude, workshop.longitude], 15);
            }
        }
    }, [activeWorkshopId, workshops]);

    // Filter Logic
    const filteredWorkshops = useMemo(() => {
        const filtered = workshops.filter(workshop => {
            const matchesSearch = workshop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (workshop.address || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = selectedFilter === 'Todos' || workshop.type === selectedFilter;
            return matchesSearch && matchesFilter;
        });

        Object.keys(markersRef.current).forEach(id => {
            const isVisible = filtered.some(w => w.id === id);
            if (isVisible) {
                markersRef.current[id].addTo(mapRef.current);
            } else {
                markersRef.current[id].remove();
            }
        });

        return filtered;
    }, [searchQuery, selectedFilter, workshops]);

    const activeWorkshop = useMemo(() => {
        return workshops.find(w => w.id === activeWorkshopId);
    }, [activeWorkshopId, workshops]);

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

                    {/* Filtros Horizontales */}
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
                            {activeWorkshopId === workshop.id && (
                                <motion.div layoutId="activeBorder" className="absolute left-0 top-0 bottom-0 w-1 bg-[#00D4AA]" />
                            )}

                            <div className="flex gap-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative bg-slate-800">
                                    <Image
                                        src={workshop.images && workshop.images.length > 0 ? (typeof workshop.images[0] === 'string' ? workshop.images[0] : workshop.images[0].url) : '/img/workshop-placeholder.jpg'}
                                        alt={workshop.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-white font-bold text-sm mb-1">{workshop.name}</h3>
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

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider
                                                ${workshop.isOpen ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                                                {workshop.isOpen ? 'Abierto Ahora' : 'Cerrado'}
                                            </span>
                                            <span className="text-[10px] text-slate-400">• {workshop.type}</span>
                                        </div>
                                    </div>

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
            <div className="flex-1 h-full min-h-[500px] bg-[#111618] relative overflow-hidden" onClick={() => setActiveWorkshopId(null)}>
                <div id="workshops-map-root" className="absolute inset-0 z-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111618] via-transparent to-[#111618]/50 pointer-events-none z-[5]" />

                {/* Controles flotantes */}
                <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
                    <button onClick={(e) => { e.stopPropagation(); mapRef.current?.zoomIn(); }} className="w-10 h-10 bg-[#0A1114] border border-[#2b3a42] rounded-lg flex items-center justify-center text-white hover:bg-[#1e293b] transition-colors shadow-lg">
                        <span className="text-xl">+</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); mapRef.current?.zoomOut(); }} className="w-10 h-10 bg-[#0A1114] border border-[#2b3a42] rounded-lg flex items-center justify-center text-white hover:bg-[#1e293b] transition-colors shadow-lg">
                        <span className="text-xl">-</span>
                    </button>
                    <div className="w-10 h-[10px]"></div>
                    <button className="w-10 h-10 bg-[#0A1114] border border-[#2b3a42] rounded-lg flex items-center justify-center text-white hover:bg-[#1e293b] transition-colors shadow-lg">
                        <Layers className="w-5 h-5" />
                    </button>
                </div>

                {/* Popup de Detalle */}
                <AnimatePresence>
                    {activeWorkshop && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute z-20 w-[280px] bg-[#0A1114] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden"
                            style={{ left: '50%', bottom: '40px', transform: 'translateX(-50%)' }}
                        >
                            <button onClick={(e) => { e.stopPropagation(); setActiveWorkshopId(null); }} className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/80">
                                <X className="w-3 h-3" />
                            </button>

                            <div className="h-32 relative bg-slate-800">
                                <Image 
                                    src={activeWorkshop.images && activeWorkshop.images.length > 0 ? (typeof activeWorkshop.images[0] === 'string' ? activeWorkshop.images[0] : activeWorkshop.images[0].url) : '/img/workshop-placeholder.jpg'} 
                                    alt={activeWorkshop.name} 
                                    fill 
                                    className="object-cover" 
                                />
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

                {/* Modal */}
                <AnimatePresence>
                    {modalWorkshopId && (
                        <WorkshopDetailsModal
                            workshop={workshops.find(w => w.id === modalWorkshopId)!}
                            onClose={() => setModalWorkshopId(null)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function WrenchIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
    );
}
