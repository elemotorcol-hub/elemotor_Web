'use client';

import { useEffect, useRef } from 'react';
import { Navigation, Phone, MapPin, ExternalLink } from 'lucide-react';
import type { MaintenanceRecord } from '@/types/maintenance';

interface Props {
    records: MaintenanceRecord[];
    /** ID del workshop a enfocar (viene del historial al hacer clic en "ver en mapa") */
    focusedWorkshopId?: number | null;
}

export function MaintenanceMap({ records, focusedWorkshopId }: Props) {
    const mapRef = useRef<any>(null);
    const markersRef = useRef<Record<number, any>>({});
    const popupsRef = useRef<Record<number, any>>({});

    // Workshops únicos con coordenadas
    const workshopsWithCoords = (() => {
        const seen = new Set<number>();
        const result: NonNullable<MaintenanceRecord['workshop']>[] = [];
        for (const r of records) {
            if (r.workshop?.latitude && r.workshop?.longitude && !seen.has(r.workshop.id)) {
                seen.add(r.workshop.id);
                result.push(r.workshop);
            }
        }
        return result;
    })();

    // Inicializar mapa
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const init = async () => {
            const container = document.getElementById('maintenance-map-root');
            if (!container || (container as any)._leaflet_id) return;

            const L = (await import('leaflet')).default;

            const center: [number, number] =
                workshopsWithCoords.length > 0
                    ? [workshopsWithCoords[0].latitude!, workshopsWithCoords[0].longitude!]
                    : [4.6097, -74.0817];

            const map = L.map('maintenance-map-root', {
                zoomControl: false,
                attributionControl: false,
            }).setView(center, workshopsWithCoords.length === 1 ? 14 : 6);

            L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
                { maxZoom: 20 }
            ).addTo(map);

            // Filtro oscuro igual que WorkshopsMap
            const tilePane = map.getPane('tilePane');
            if (tilePane) {
                tilePane.style.filter =
                    'invert(100%) hue-rotate(180deg) brightness(95%) contrast(105%) opacity(0.8)';
            }

            mapRef.current = map;

            // Dibujar marcadores
            for (const w of workshopsWithCoords) {
                const iconHtml = `
                    <div style="width:32px;height:40px;position:relative">
                        <svg viewBox="0 0 24 32" style="width:32px;height:40px;color:#10B981;drop-shadow:0 2px 6px rgba(0,0,0,.5)" fill="none">
                            <path d="M12 0C5.373 0 0 5.373 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.373 18.627 0 12 0Z" fill="currentColor" opacity="0.15"/>
                            <path d="M12 2C6.477 2 2 6.477 2 12C2 19.5 12 29 12 29C12 29 22 19.5 22 12C22 6.477 17.523 2 12 2Z" fill="#10B981" stroke="#065f46" stroke-width="1.5"/>
                            <circle cx="12" cy="12" r="4" fill="#0A110F"/>
                        </svg>
                    </div>`;

                const icon = L.divIcon({
                    className: '',
                    html: iconHtml,
                    iconSize: [32, 40],
                    iconAnchor: [16, 40],
                });

                // Visitas a ese taller
                const visits = records.filter((r) => r.workshop?.id === w.id).length;

                const popupContent = `
                    <div style="font-family:sans-serif;min-width:200px;max-width:240px;background:#15201D;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">
                        <div style="padding:12px 14px">
                            <p style="margin:0 0 4px;font-weight:700;font-size:13px;color:#fff">${w.name}</p>
                            ${w.city ? `<p style="margin:0 0 6px;font-size:11px;color:#94a3b8">📍 ${w.city}${w.state ? ', ' + w.state : ''}</p>` : ''}
                            ${w.address ? `<p style="margin:0 0 6px;font-size:11px;color:#94a3b8">${w.address}</p>` : ''}
                            ${w.phone ? `<p style="margin:0 0 8px;font-size:11px;color:#10B981">📞 ${w.phone}</p>` : ''}
                            <p style="margin:0 0 10px;font-size:11px;color:#64748b">${visits} visita${visits !== 1 ? 's' : ''} registrada${visits !== 1 ? 's' : ''}</p>
                            ${w.googleMapsUrl
                                ? `<a href="${w.googleMapsUrl}" target="_blank" rel="noopener noreferrer"
                                    style="display:block;text-align:center;background:#10B981;color:#0A110F;font-weight:700;font-size:11px;padding:7px 12px;border-radius:8px;text-decoration:none">
                                    Abrir en Maps
                                   </a>`
                                : ''}
                        </div>
                    </div>`;

                const popup = L.popup({
                    className: 'maintenance-map-popup',
                    closeButton: false,
                    maxWidth: 260,
                }).setContent(popupContent);

                const marker = L.marker([w.latitude!, w.longitude!], { icon })
                    .addTo(map)
                    .bindPopup(popup);

                markersRef.current[w.id] = marker;
                popupsRef.current[w.id] = popup;
            }

            // Si hay múltiples, ajustar bounds
            if (workshopsWithCoords.length > 1) {
                const bounds = L.latLngBounds(
                    workshopsWithCoords.map((w) => [w.latitude!, w.longitude!] as [number, number])
                );
                map.fitBounds(bounds, { padding: [40, 40] });
            }
        };

        init();

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markersRef.current = {};
                popupsRef.current = {};
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Enfocar marcador cuando cambia focusedWorkshopId
    useEffect(() => {
        if (!focusedWorkshopId || !mapRef.current) return;
        const workshop = workshopsWithCoords.find((w) => w.id === focusedWorkshopId);
        if (!workshop) return;
        mapRef.current.flyTo([workshop.latitude!, workshop.longitude!], 15, { duration: 1 });
        markersRef.current[focusedWorkshopId]?.openPopup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusedWorkshopId]);

    if (workshopsWithCoords.length === 0) {
        return (
            <div className="bg-[#15201D] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[280px] text-center">
                <MapPin className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-slate-400 font-semibold text-sm">Sin ubicaciones disponibles</p>
                <p className="text-slate-600 text-xs mt-1">Los talleres aparecerán aquí cuando registres mantenimientos con taller asignado.</p>
            </div>
        );
    }

    return (
        <div className="bg-[#15201D] border border-white/5 rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">Talleres Visitados</h3>
                        <p className="text-slate-500 text-xs">
                            {workshopsWithCoords.length} taller{workshopsWithCoords.length !== 1 ? 'es' : ''} con ubicación
                        </p>
                    </div>
                </div>
            </div>

            {/* Mapa */}
            <div id="maintenance-map-root" className="w-full h-[340px] z-0" />

            {/* Lista de talleres */}
            <div className="px-6 py-4 border-t border-white/5 space-y-2">
                {workshopsWithCoords.map((w) => {
                    const visits = records.filter((r) => r.workshop?.id === w.id).length;
                    return (
                        <div
                            key={w.id}
                            className="flex items-center justify-between gap-3 py-2"
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-2 h-2 rounded-full bg-[#10B981] flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-white font-semibold text-sm truncate">{w.name}</p>
                                    {(w.city || w.address) && (
                                        <p className="text-slate-500 text-xs truncate">
                                            {w.address ?? w.city}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-xs text-slate-500 whitespace-nowrap">
                                    {visits} visita{visits !== 1 ? 's' : ''}
                                </span>
                                <div className="flex items-center gap-1">
                                    {w.phone && (
                                        <a
                                            href={`tel:${w.phone}`}
                                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                            title={w.phone}
                                        >
                                            <Phone className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                    {w.googleMapsUrl && (
                                        <a
                                            href={w.googleMapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#10B981]/20 flex items-center justify-center text-slate-400 hover:text-[#10B981] transition-colors"
                                            title="Abrir en Maps"
                                        >
                                            <Navigation className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Inyectar estilo para popups de Leaflet */}
            <style>{`
                .maintenance-map-popup .leaflet-popup-content-wrapper {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                }
                .maintenance-map-popup .leaflet-popup-content {
                    margin: 0 !important;
                }
                .maintenance-map-popup .leaflet-popup-tip-container {
                    display: none !important;
                }
            `}</style>
        </div>
    );
}
