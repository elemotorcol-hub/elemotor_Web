import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Bookmark, X, Info, Zap, Wrench, Navigation, Clock, Phone, MessageCircle, CalendarDays, BatteryCharging, CircleDot, Wifi, Coffee, Armchair, MapPin, Activity, Palette } from 'lucide-react';
import Image from 'next/image';
import { WorkshopResponse } from '@/services/workshop.service';

interface WorkshopDetailsModalProps {
    workshop: any; // Using any temporarily if types have minor mismatches, but aligning fields below
    onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
    'chargers': <Zap className="w-5 h-5 text-[#00D4AA]" />,
    'maintenance': <Wrench className="w-5 h-5 text-[#00D4AA]" />,
    'tires': <CircleDot className="w-5 h-5 text-[#00D4AA]" />,
    'electric_diagnostics': <Activity className="w-5 h-5 text-[#00D4AA]" />,
    'body_paint': <Palette className="w-5 h-5 text-[#00D4AA]" />,
    'brakes': <CircleDot className="w-5 h-5 text-[#00D4AA]" />,
    'general': <Wrench className="w-5 h-5 text-[#00D4AA]" />
};

const amenityIconMap: Record<string, React.ReactNode> = {
    'Wi-Fi Gratis': <Wifi className="w-3.5 h-3.5" />,
    'Cafetería': <Coffee className="w-3.5 h-3.5" />,
    'Sala de Espera VIP': <Armchair className="w-3.5 h-3.5" />,
    'Cajeros ATM': <CalendarDays className="w-3.5 h-3.5" />, // generic fallback
    'Minimarket': <CalendarDays className="w-3.5 h-3.5" />,
    'Baños': <Info className="w-3.5 h-3.5" />
};
export function WorkshopDetailsModal({ workshop, onClose }: WorkshopDetailsModalProps) {
    // Evitar propagación de clics al overlay para no cerrar accidentalmente al interactuar con el modal
    const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();
    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const mapInstanceRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (typeof window === 'undefined' || !workshop.latitude || !workshop.longitude || !mapContainerRef.current) return;

        const initMiniMap = async () => {
            const L = (await import('leaflet')).default;
            
            // Si ya existe una instancia en este contenedor, la removemos para evitar duplicados
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
            }

            const map = L.map(mapContainerRef.current!, {
                zoomControl: false,
                attributionControl: false,
                dragging: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                boxZoom: false,
                touchZoom: false
            }).setView([workshop.latitude, workshop.longitude], 15);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
                maxZoom: 20,
            }).addTo(map);

            const mapPane = map.getPane('tilePane');
            if (mapPane) {
                mapPane.style.filter = 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(105%) opacity(0.8)';
            }

            const iconHtml = `
                <div class="relative">
                    <svg viewBox="0 0 24 32" class="w-6 h-8 text-[#00D4AA]" fill="none">
                        <path d="M12 0C5.373 0 0 5.373 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.373 18.627 0 12 0Z" fill="currentColor" opacity="0.1" />
                        <path d="M12 2C6.477 2 2 6.477 2 12C2 19.5 12 29 12 29C12 29 22 19.5 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor" stroke="#00D4AA" stroke-width="2" />
                        <circle cx="12" cy="12" r="3" fill="#1e293b" />
                    </svg>
                </div>
            `;

            const icon = L.divIcon({
                className: 'mini-pin',
                html: iconHtml,
                iconSize: [24, 32],
                iconAnchor: [12, 32]
            });

            L.marker([workshop.latitude, workshop.longitude], { icon }).addTo(map);
            
            // Invalidate size after a bit to ensure it fits the container which might be animating
            setTimeout(() => map.invalidateSize(), 300);
            
            mapInstanceRef.current = map;
        };

        const timer = setTimeout(initMiniMap, 200);

        return () => {
            clearTimeout(timer);
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [workshop]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={handleContentClick}
                className="w-full max-w-5xl max-h-[90vh] bg-[#111618] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#1e293b] relative"
            >
                {/* --- HERO HEADER --- */}
                <div className="relative h-[250px] shrink-0">
                    <Image 
                        src={workshop.images && workshop.images.length > 0 ? (typeof workshop.images[0] === 'string' ? workshop.images[0] : workshop.images[0].url) : '/img/workshop-placeholder.jpg'} 
                        alt={workshop.name} 
                        fill 
                        className="object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111618] via-[#111618]/70 to-black/20" />

                    {/* Close Button X */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black text-white rounded-full transition-colors z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                {workshop.isVerified && (
                                    <span className="bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30 text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider">
                                        VERIFICADO
                                    </span>
                                )}
                                <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                                    <div className="flex text-[#FFC107]">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-3 h-3 ${i < Math.floor(workshop.rating) ? 'fill-current' : 'fill-none stroke-current'}`} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-white text-[11px] font-bold">({workshop.rating})</span>
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{workshop.name}</h2>
                            <p className="text-slate-300 text-sm flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-slate-400" /> {workshop.address}
                            </p>
                        </div>

                        {/* Header Action Buttons */}
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 bg-[#1A2327]/80 hover:bg-[#1A2327] border border-white/5 backdrop-blur-md px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
                                <Share2 className="w-4 h-4" /> Compartir
                            </button>
                            <button className="flex items-center gap-2 bg-[#1A2327]/80 hover:bg-[#1A2327] border border-white/5 backdrop-blur-md px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
                                <Bookmark className="w-4 h-4" /> Guardar
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- CONTENT COLUMNS --- */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col lg:flex-row gap-8 scrollbar-thin scrollbar-thumb-[#1e293b] scrollbar-track-transparent">

                    {/* LEFT COLUMN */}
                    <div className="flex-1 space-y-8">
                        {/* Descripción */}
                        <div>
                            <h3 className="text-[#00D4AA] font-bold text-lg mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 flex-shrink-0" /> Sobre el Taller
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed tracking-wide">
                                {workshop.description}
                            </p>
                        </div>

                        {/* Servicios Diferenciados */}
                        <div>
                            <h3 className="text-[#00D4AA] font-bold text-lg mb-4 flex items-center gap-2">
                                <Wrench className="w-5 h-5 flex-shrink-0" /> Servicios Ofrecidos
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {workshop.services?.map((service: any, idx: number) => (
                                    <div key={idx} className="bg-[#0A1114] border border-[#1e293b] p-4 rounded-xl flex gap-3 group hover:border-slate-700 transition-colors">
                                        <div className="bg-[#1A2327] w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                                            {service.icon ? iconMap[service.icon] : (iconMap[service] || <Wrench className="w-5 h-5 text-[#00D4AA]" />)}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm mb-1">{service.title || service}</h4>
                                            <p className="text-slate-500 text-xs">{service.description || 'Servicio especializado'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Amenidades */}
                        <div>
                            <h3 className="text-white font-bold text-base mb-4">Amenidades</h3>
                            <div className="flex flex-wrap gap-3">
                                {workshop.amenities?.map((amenity: any, idx: number) => (
                                    <div key={idx} className="bg-[#1A2327] px-4 py-2 rounded-full border border-white/5 flex items-center gap-2 text-slate-300 text-xs font-semibold">
                                        {amenityIconMap[amenity] || <CircleDot className="w-3.5 h-3.5" />} {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="w-full lg:w-[320px] flex flex-col gap-4 shrink-0">

                        {/* Mini Mapa Interactivo */}
                        <div className="bg-[#0A1114] border border-[#1e293b] rounded-xl overflow-hidden shadow-lg border-t-4 border-t-slate-800">
                            <div className="h-32 relative bg-slate-800">
                                {/* Mini-map container */}
                                <div ref={mapContainerRef} className="absolute inset-0" />
                                
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
                                    <button className="bg-[#0A1114] border border-[#1e293b] text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-xl pointer-events-auto hover:bg-[#1A2327]">
                                        <Navigation className="w-4 h-4" /> Cómo Llegar
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 flex gap-4 divide-x divide-[#1e293b]">
                                <div className="flex-1">
                                    <p className="text-slate-500 text-xs mb-1">Distancia</p>
                                    <p className="text-white font-bold text-sm">{workshop.estimatedDistance}</p>
                                </div>
                                <div className="flex-1 pl-4">
                                    <p className="text-slate-500 text-xs mb-1">Tiempo est.</p>
                                    <p className="text-white font-bold text-sm">{workshop.estimatedTime}</p>
                                </div>
                            </div>
                        </div>

                        {/* Horarios */}
                        <div className="bg-[#0A1114] border border-[#1e293b] rounded-xl p-5 shadow-lg">
                            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#00D4AA]" /> Horarios
                            </h3>
                            <div className="flex flex-col gap-3">
                                {workshop.hoursList?.map((h: any, idx: number) => (
                                    <div key={idx} className={`flex justify-between items-center text-xs ${idx !== workshop.hoursList!.length - 1 ? 'pb-3 border-b border-[#1e293b]' : ''}`}>
                                        <span className="text-slate-400">{h.day}</span>
                                        <span className={`font-bold ${!h.is_closed ? 'text-[#00D4AA]' : 'text-red-400'}`}>
                                            {!h.is_closed ? `${h.open_time} - ${h.close_time}` : 'Cerrado'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-[#1e293b] flex items-center gap-2 text-xs">
                                <div className={`w-2 h-2 rounded-full ${workshop.isOpen ? 'bg-[#00D4AA] shadow-[0_0_8px_#00D4AA]' : 'bg-red-500 shadow-[0_0_8px_red]'}`} />
                                <span className="text-slate-400">
                                    {workshop.isOpen ? 'Abierto ahora • Cierra a las 6:00 PM' : 'Cerrado ahora'}
                                </span>
                            </div>
                        </div>

                        {/* Teléfono Contacto */}
                        <div className="bg-[#0A1114] border border-[#1e293b] rounded-xl p-4 flex items-center gap-4 shadow-lg">
                            <div className="bg-[#1A2327] w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                                <Phone className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-[11px] mb-0.5">Teléfono</p>
                                <p className="text-white font-bold text-sm">{workshop.phone}</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- FOOTER ACTIONS --- */}
                <div className="border-t border-[#1e293b] p-6 bg-[#0A1114] shrink-0 flex justify-center">
                    <button className="w-full md:w-1/2 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] border border-[#1da851] text-[#0A1114] font-bold py-3.5 rounded-xl transition-colors shadow-[0_0_20px_rgba(37,211,102,0.3)]">
                        <MessageCircle className="w-5 h-5 text-[#0A1114]" /> Escribir por WhatsApp
                    </button>
                </div>

            </motion.div>
        </motion.div>
    );
}

