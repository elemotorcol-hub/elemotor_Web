'use client';

import { useEffect, useRef, useState } from 'react';
import { Navigation, Phone, MapPin, Loader2 } from 'lucide-react';
import type { MaintenanceRecord } from '@/types/maintenance';
import { workshopService } from '@/services/workshop.service';

interface Props {
    records: MaintenanceRecord[];
    focusedWorkshopId?: number | null;
}

interface WorkshopPin {
    id: number;
    name: string;
    address: string | null;
    city: string | null;
    latitude: number;
    longitude: number;
    googleMapsUrl: string | null;
    phone: string | null;
    visited: boolean;
    visitCount: number;
}

export function MaintenanceMap({ records, focusedWorkshopId }: Props) {
    const mapRef = useRef<any>(null);
    const markersRef = useRef<Record<number, any>>({});
    const [workshops, setWorkshops] = useState<WorkshopPin[]>([]);
    const [loading, setLoading] = useState(true);

    // Construir set de talleres visitados desde los registros
    const visitedMap = records.reduce<Record<number, number>>((acc, r) => {
        if (r.workshop?.id) {
            acc[r.workshop.id] = (acc[r.workshop.id] ?? 0) + 1;
        }
        return acc;
    }, {});

    // Cargar talleres desde la API
    useEffect(() => {
        workshopService
            .fetchWorkshops('?limit=100')
            .then((res) => {
                const pins: WorkshopPin[] = (res.data ?? [])
                    .filter((w: any) => w.latitude && w.longitude)
                    .map((w: any) => ({
                        id: w.id,
                        name: w.name,
                        address: w.address ?? null,
                        city: w.city ?? null,
                        latitude: w.latitude,
                        longitude: w.longitude,
                        googleMapsUrl: w.googleMapsUrl ?? null,
                        phone: w.phone ?? null,
                        visited: !!visitedMap[w.id],
                        visitCount: visitedMap[w.id] ?? 0,
                    }));
                setWorkshops(pins);
            })
            .catch(() => setWorkshops([]))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Inicializar mapa Leaflet
    useEffect(() => {
        if (typeof window === 'undefined' || workshops.length === 0) return;

        const init = async () => {
            const container = document.getElementById('maintenance-map-root');
            if (!container || (container as any)._leaflet_id) return;

            const L = (await import('leaflet')).default;

            const map = L.map('maintenance-map-root', {
                zoomControl: false,
                attributionControl: false,
            }).setView([4.6097, -74.0817], 6);

            L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
                { maxZoom: 20 }
            ).addTo(map);

            const tilePane = map.getPane('tilePane');
            if (tilePane) {
                tilePane.style.filter =
                    'invert(100%) hue-rotate(180deg) brightness(95%) contrast(105%) opacity(0.8)';
            }

            mapRef.current = map;

            // Dibujar marcadores
            for (const w of workshops) {
                const color = w.visited ? '#10B981' : '#00D4AA';
                const iconHtml = `
                    <div style="width:32px;height:40px;position:relative">
                        <svg viewBox="0 0 24 32" style="width:32px;height:40px" fill="none">
                            <path d="M12 0C5.373 0 0 5.373 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.373 18.627 0 12 0Z" fill="${color}" opacity="0.2"/>
                            <path d="M12 2C6.477 2 2 6.477 2 12C2 19.5 12 29 12 29C12 29 22 19.5 22 12C22 6.477 17.523 2 12 2Z" fill="${color}" stroke="${w.visited ? '#065f46' : '#007a61'}" stroke-width="1.5"/>
                            <circle cx="12" cy="12" r="4" fill="#0A110F"/>
                        </svg>
                        ${w.visited ? `<div style="position:absolute;top:-6px;right:-4px;width:14px;height:14px;border-radius:50%;background:#10B981;border:2px solid #0A110F;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:900;color:#0A110F">${w.visitCount}</div>` : ''}
                    </div>`;

                const icon = L.divIcon({
                    className: '',
                    html: iconHtml,
                    iconSize: [32, 40],
                    iconAnchor: [16, 40],
                });

                const popupContent = `
                    <div style="font-family:sans-serif;min-width:200px;max-width:240px;background:#15201D;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">
                        <div style="padding:12px 14px">
                            <p style="margin:0 0 4px;font-weight:700;font-size:13px;color:#fff">${w.name}</p>
                            ${w.city ? `<p style="margin:0 0 4px;font-size:11px;color:#94a3b8">📍 ${w.city}</p>` : ''}
                            ${w.address ? `<p style="margin:0 0 6px;font-size:11px;color:#94a3b8">${w.address}</p>` : ''}
                            ${w.phone ? `<p style="margin:0 0 8px;font-size:11px;color:#10B981">📞 ${w.phone}</p>` : ''}
                            ${w.visited ? `<p style="margin:0 0 8px;font-size:11px;color:#10B981;font-weight:700">✓ ${w.visitCount} visita${w.visitCount !== 1 ? 's' : ''} registrada${w.visitCount !== 1 ? 's' : ''}</p>` : ''}
                            ${w.googleMapsUrl
                                ? `<a href="${w.googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="display:block;text-align:center;background:#10B981;color:#0A110F;font-weight:700;font-size:11px;padding:7px 12px;border-radius:8px;text-decoration:none">Abrir en Maps</a>`
                                : ''}
                        </div>
                    </div>`;

                const popup = L.popup({
                    className: 'maintenance-map-popup',
                    closeButton: false,
                    maxWidth: 260,
                }).setContent(popupContent);

                const marker = L.marker([w.latitude, w.longitude], { icon })
                    .addTo(map)
                    .bindPopup(popup);

                markersRef.current[w.id] = marker;
            }

            // Ajustar bounds si hay varios talleres
            if (workshops.length > 1) {
                try {
                    const bounds = L.latLngBounds(
                        workshops.map((w) => [w.latitude, w.longitude] as [number, number])
                    );
                    map.fitBounds(bounds, { padding: [40, 40] });
                } catch {
                    // fallback al centro de Colombia
                }
            } else if (workshops.length === 1) {
                map.setView([workshops[0].latitude, workshops[0].longitude], 14);
            }
        };

        init();

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markersRef.current = {};
            }
        };
    }, [workshops]);

    // Enfocar marcador cuando cambia focusedWorkshopId
    useEffect(() => {
        if (!focusedWorkshopId || !mapRef.current) return;
        const w = workshops.find((x) => x.id === focusedWorkshopId);
        if (!w) return;
        mapRef.current.flyTo([w.latitude, w.longitude], 15, { duration: 1 });
        markersRef.current[focusedWorkshopId]?.openPopup();
    }, [focusedWorkshopId, workshops]);

    const visitedWorkshops = workshops.filter((w) => w.visited);

    return (
        <div className="bg-[#15201D] border border-white/5 rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">Red de Talleres</h3>
                        <p className="text-slate-500 text-xs">
                            {loading ? 'Cargando talleres...' : `${workshops.length} taller${workshops.length !== 1 ? 'es' : ''} disponible${workshops.length !== 1 ? 's' : ''}`}
                            {visitedWorkshops.length > 0 && ` · ${visitedWorkshops.length} visitado${visitedWorkshops.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Mapa */}
            {loading ? (
                <div className="w-full h-[340px] flex items-center justify-center bg-[#0A110F]">
                    <Loader2 className="w-6 h-6 text-[#10B981] animate-spin" />
                </div>
            ) : (
                <div id="maintenance-map-root" className="w-full h-[340px]" />
            )}

            {/* Lista de talleres visitados */}
            {visitedWorkshops.length > 0 && (
                <div className="px-6 py-4 border-t border-white/5 space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Talleres visitados</p>
                    {visitedWorkshops.map((w) => (
                        <div key={w.id} className="flex items-center justify-between gap-3 py-1.5">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-2 h-2 rounded-full bg-[#10B981] flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-white font-semibold text-sm truncate">{w.name}</p>
                                    {(w.city || w.address) && (
                                        <p className="text-slate-500 text-xs truncate">{w.address ?? w.city}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-xs text-slate-500 whitespace-nowrap">
                                    {w.visitCount} visita{w.visitCount !== 1 ? 's' : ''}
                                </span>
                                {w.phone && (
                                    <a href={`tel:${w.phone}`} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                        <Phone className="w-3.5 h-3.5" />
                                    </a>
                                )}
                                {w.googleMapsUrl && (
                                    <a href={w.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#10B981]/20 flex items-center justify-center text-slate-400 hover:text-[#10B981] transition-colors">
                                        <Navigation className="w-3.5 h-3.5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .maintenance-map-popup .leaflet-popup-content-wrapper {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                }
                .maintenance-map-popup .leaflet-popup-content { margin: 0 !important; }
                .maintenance-map-popup .leaflet-popup-tip-container { display: none !important; }
            `}</style>
        </div>
    );
}
