import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, X, Map as MapIcon, Check, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationPickerProps {
    initialLat?: number;
    initialLng?: number;
    onChange: (lat: number, lng: number) => void;
    selectedCity?: string; // Nuevo prop para pre-llenar la búsqueda
}

export default function LocationPicker({ initialLat, initialLng, onChange, selectedCity }: LocationPickerProps) {
    const [lat, setLat] = useState<number>(initialLat || 4.6097);
    const [lng, setLng] = useState<number>(initialLng || -74.0817);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const updateLocation = (newLat: number, newLng: number) => {
        setLat(newLat);
        setLng(newLng);
        onChange(newLat, newLng);
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h4 className="text-sm font-bold text-white">Ubicación Geográfica</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Define las coordenadas exactas para el mapa público.</p>
                </div>
            </div>

            <div 
                onClick={() => setIsModalOpen(true)}
                className="group relative w-full p-4 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-[#10B981]/50 hover:bg-slate-900 transition-all cursor-pointer overflow-hidden"
            >
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform">
                        <MapIcon size={24} />
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-200">Seleccionar en el Mapa</div>
                        <div className="flex gap-4 mt-1 text-xs font-mono text-slate-500">
                            <span>Lat: {lat.toFixed(6)}</span>
                            <span>Lng: {lng.toFixed(6)}</span>
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-600 group-hover:text-[#10B981] group-hover:translate-x-1 transition-all" />
                </div>
                
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] bg-[#10B981] text-white px-2 py-0.5 rounded-full font-bold">Abrir Editor</span>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <MapPickerModal 
                        lat={lat} 
                        lng={lng} 
                        cityContext={selectedCity}
                        onClose={() => setIsModalOpen(false)} 
                        onSave={(newLat, newLng) => {
                            updateLocation(newLat, newLng);
                            setIsModalOpen(false);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Manual Inputs for quick tweaks */}
            <div className="grid grid-cols-2 gap-4 opacity-70 hover:opacity-100 transition-opacity">
                <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Latitud</label>
                    <input
                        type="number"
                        step="any"
                        value={lat}
                        onChange={(e) => updateLocation(parseFloat(e.target.value) || 0, lng)}
                        className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm font-mono text-slate-300 focus:outline-none focus:border-[#10B981] transition-colors"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Longitud</label>
                    <input
                        type="number"
                        step="any"
                        value={lng}
                        onChange={(e) => updateLocation(lat, parseFloat(e.target.value) || 0)}
                        className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm font-mono text-slate-300 focus:outline-none focus:border-[#10B981] transition-colors"
                    />
                </div>
            </div>
        </div>
    );
}

interface MapPickerModalProps {
    lat: number;
    lng: number;
    cityContext?: string;
    onClose: () => void;
    onSave: (lat: number, lng: number) => void;
}

interface NominatimResult { lat: string; lon: string; display_name: string; }
interface WorkshopMapItem { id: number; name: string; latitude: number | null; longitude: number | null; }

function MapPickerModal({ lat: initialLat, lng: initialLng, cityContext, onClose, onSave }: MapPickerModalProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    
    const [currentLat, setCurrentLat] = useState(initialLat);
    const [currentLng, setCurrentLng] = useState(initialLng);
    const [isLocating, setIsLocating] = useState(false);
    const [searchAddress, setSearchAddress] = useState('');
    const [searchCity, setSearchCity] = useState(cityContext || 'Bogotá');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
    const [noResults, setNoResults] = useState(false);
    const [existingWorkshops, setExistingWorkshops] = useState<WorkshopMapItem[]>([]);

    useEffect(() => {
        const loadExisting = async () => {
            try {
                const { data } = await (await import('@/services/workshop.service')).workshopService.fetchWorkshops();
                if (data) setExistingWorkshops(data);
            } catch (e) { console.error('Error loading context workshops:', e); }
        };
        loadExisting();

        const initMap = async () => {
            if (typeof window === 'undefined' || !containerRef.current) return;
            if (mapRef.current || (containerRef.current as any)._leaflet_id) return;

            const L = (await import('leaflet')).default;
            if (mapRef.current || (containerRef.current as any)._leaflet_id) return;

            const currentIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="background-color: #10B981; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #fff; box-shadow: 0 0 15px rgba(16,185,129,0.4); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background: white; border-radius: 50%; transform: rotate(45deg);"></div></div>`,
                iconSize: [28, 28],
                iconAnchor: [14, 28]
            });

            const otherIcon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div style="background-color: #3B82F6; width: 18px; height: 18px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 1.5px solid #fff; box-shadow: 0 0 8px rgba(59,130,246,0.3);"></div>`,
                iconSize: [18, 18],
                iconAnchor: [9, 18]
            });

            const map = L.map(containerRef.current, { zoomControl: true }).setView([currentLat, currentLng], 15);
            mapRef.current = map;
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 20 }).addTo(map);

            const marker = L.marker([currentLat, currentLng], { draggable: true, icon: currentIcon, zIndexOffset: 1000 }).addTo(map);
            markerRef.current = marker;
            
            marker.on('dragend', () => { const pos = marker.getLatLng(); setCurrentLat(pos.lat); setCurrentLng(pos.lng); });
            map.on('click', (e) => { const { lat, lng } = e.latlng; marker.setLatLng([lat, lng]); setCurrentLat(lat); setCurrentLng(lng); });

            existingWorkshops.forEach((w) => {
                if (w.latitude && w.longitude && (Math.abs(w.latitude - initialLat) > 0.0001 || Math.abs(w.longitude - initialLng) > 0.0001)) {
                    L.marker([w.latitude, w.longitude], { icon: otherIcon, interactive: true }).addTo(map)
                     .bindTooltip(w.name, { direction: 'top', offset: [0, -15], className: 'custom-tooltip' });
                }
            });
            setTimeout(() => map.invalidateSize(), 300);
        };
        initMap();
        return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
    }, []);

    const handleSearch = async (e?: any) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (!searchAddress.trim()) return;

        setIsSearching(true);
        setNoResults(false);
        setSearchResults([]);
        
        try {
            // Normalización de nomenclatura colombiana para mejorar Nominatim
            let normalizedAddress = searchAddress
                .replace(/^Ak\s+/i, 'Carrera ')
                .replace(/^Cr\s+/i, 'Carrera ')
                .replace(/^Cl\s+/i, 'Calle ')
                .replace(/^Dg\s+/i, 'Diagonal ')
                .replace(/^Tv\s+/i, 'Transversal ')
                .replace(/^Av\s+/i, 'Avenida ');

            // Construimos query: Dirección + Ciudad + Colombia
            const query = `${normalizedAddress}, ${searchCity}, Colombia`;
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=co&limit=8&addressdetails=1`,
                { headers: { 'User-Agent': 'EleMotorApp/1.0 (contacto@elemotor.co)', 'Referer': 'https://elemotor.co' } }
            );
            const data = await res.json();
            
            if (data && data.length > 0) {
                setSearchResults(data);
                // No auto-seleccionamos para que el usuario valide en la lista
            } else {
                setNoResults(true);
            }
        } catch (e) { console.error(e); }
        setIsSearching(false);
    };

    const selectResult = (res: any) => {
        const nl = parseFloat(res.lat);
        const nln = parseFloat(res.lon);
        setCurrentLat(nl);
        setCurrentLng(nln);
        
        if (mapRef.current && markerRef.current) {
            mapRef.current.setView([nl, nln], 18);
            markerRef.current.setLatLng([nl, nln]);
        }
        setSearchResults([]); // Ocultamos la lista al seleccionar
    };

    const detectLocation = () => {
        if (!navigator.geolocation) return;
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            setCurrentLat(latitude); setCurrentLng(longitude);
            if (mapRef.current && markerRef.current) {
                mapRef.current.setView([latitude, longitude], 17);
                markerRef.current.setLatLng([latitude, longitude]);
            }
            setIsLocating(false);
        }, () => setIsLocating(false));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#10B981]/10 text-[#10B981] rounded-lg"><MapPin size={20} /></div>
                        <div><h3 className="text-lg font-bold text-white">Selector de Ubicación</h3><p className="text-xs text-slate-400">Busca por parámetros y elige de la lista desplegable</p></div>
                    </div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"><X size={20} /></button>
                </div>

                {/* Structured Search Area - Higher Z to show list over map */}
                <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 shrink-0 relative z-[100]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 mb-1 block">Ciudad / Municipio</label>
                            <input 
                                type="text"
                                value={searchCity}
                                onChange={(e) => setSearchCity(e.target.value)}
                                placeholder="Ej: Bogotá, Cali..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-[#10B981] transition-all"
                            />
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                            <div className="flex-1 relative">
                                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 mb-1 block">Dirección Específica</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input 
                                        type="text"
                                        value={searchAddress}
                                        onChange={(e) => {
                                            setSearchAddress(e.target.value);
                                            if (noResults) setNoResults(false);
                                        }}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch(); } }}
                                        placeholder="Ej: Carrera 15 #55-15..."
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#10B981] transition-all"
                                    />
                                </div>

                                {/* Results Dropdown - Fixed CSS clipping */}
                                <AnimatePresence>
                                    {(searchResults.length > 0 || noResults) && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                            className="absolute top-[calc(100%+8px)] left-0 right-0 bg-slate-900 border border-[#10B981]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[999] p-1 ring-1 ring-[#10B981]/20 backdrop-blur-xl"
                                        >
                                            <div className="p-2 flex justify-between items-center bg-slate-950/50 rounded-t-xl mb-1">
                                                <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest pl-2">
                                                    {noResults ? 'Sin resultados' : `${searchResults.length} Resultados encontrados`}
                                                </span>
                                                <button onClick={() => { setSearchResults([]); setNoResults(false); }} className="text-slate-500 hover:text-white p-1 hover:bg-slate-800 rounded-lg">
                                                    <X size={12} />
                                                </button>
                                            </div>

                                            <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-1">
                                                {noResults ? (
                                                    <div className="p-8 text-center">
                                                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-500"><Search size={20} /></div>
                                                        <p className="text-sm text-slate-400">No encontramos esa dirección en {searchCity}.</p>
                                                        <p className="text-[10px] text-slate-600 mt-2">Prueba quitando el # o simplificando.</p>
                                                    </div>
                                                ) : (
                                                    searchResults.map((res: any, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => selectResult(res)}
                                                            className="w-full text-left p-4 hover:bg-[#10B981]/10 rounded-xl transition-all border-b border-white/5 last:border-0 group relative overflow-hidden active:scale-[0.98]"
                                                        >
                                                            <div className="flex items-start gap-4">
                                                                <div className="mt-1 p-2 bg-slate-800 text-slate-400 group-hover:text-[#10B981] group-hover:bg-[#10B981]/20 rounded-xl transition-all"><MapPin size={16} /></div>
                                                                <div className="flex-1">
                                                                    <div className="text-sm font-bold text-white group-hover:text-[#10B981] transition-colors leading-tight">
                                                                        {res.display_name.split(',')[0]}
                                                                    </div>
                                                                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                                                        {res.display_name.split(',').slice(1).join(',').trim()}
                                                                    </div>
                                                                </div>
                                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center">
                                                                    <ChevronRight size={16} className="text-[#10B981]" />
                                                                </div>
                                                            </div>
                                                        </button>
                                                    )
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <button 
                                type="button"
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="mt-5 bg-[#10B981] hover:bg-[#059669] text-white px-8 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 h-[42px] flex items-center gap-2 active:scale-95 disabled:opacity-50"
                            >
                                {isSearching ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Search size={16} />}
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Map Container */}
                <div className="flex-1 relative bg-slate-950">
                    <div ref={containerRef} className="w-full h-full" />
                    <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
                        <button type="button" onClick={(e) => { e.stopPropagation(); detectLocation(); }} disabled={isLocating} className="w-12 h-12 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl flex items-center justify-center text-white hover:bg-slate-800 hover:border-[#10B981] transition-all shadow-xl">
                            {isLocating ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Navigation size={20} />}
                        </button>
                    </div>
                    <div className="absolute bottom-6 left-6 z-20 flex gap-2 p-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl shadow-xl font-mono text-xs">
                        <div className="px-2 py-1 bg-slate-800 rounded-lg"><span className="text-slate-500 mr-2">LAT</span> <span className="text-emerald-400 font-bold">{currentLat.toFixed(6)}</span></div>
                        <div className="px-2 py-1 bg-slate-800 rounded-lg"><span className="text-slate-500 mr-2">LNG</span> <span className="text-emerald-400 font-bold">{currentLng.toFixed(6)}</span></div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 flex gap-3 bg-slate-900/50 shrink-0">
                    <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors">Cancelar</button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); onSave(currentLat, currentLng); }} className="flex-1 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10"><Check size={18} />Confirmar Ubicación</button>
                </div>
            </motion.div>
        </div>
    );
}


