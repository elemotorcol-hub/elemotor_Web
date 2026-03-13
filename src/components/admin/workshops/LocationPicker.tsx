'use client';

import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface LocationPickerProps {
    initialLat?: number;
    initialLng?: number;
    onChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({ initialLat, initialLng, onChange }: LocationPickerProps) {
    // Default to Bogota if no initial location
    const [lat, setLat] = useState<number>(initialLat || 4.6097);
    const [lng, setLng] = useState<number>(initialLng || -74.0817);
    const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Simulate picking a point on a map (just randomizing slightly around center for demo)
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Rough visual to coordinate translation simulation
        const newLat = lat + ((rect.height / 2 - y) * 0.001);
        const newLng = lng + ((x - rect.width / 2) * 0.001);
        
        updateLocation(newLat, newLng);
    };

    const updateLocation = (newLat: number, newLng: number) => {
        setLat(newLat);
        setLng(newLng);
        onChange(newLat, newLng);
    };

    const getCurrentLocation = () => {
        setIsSimulatingLoad(true);
        setTimeout(() => {
            // Simulate getting current GPS
            updateLocation(4.6983, -74.0321);
            setIsSimulatingLoad(false);
        }, 1000);
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-bold text-white">Coordenadas del Taller</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Usa el mapa o ingresa manualmente Lat/Lng.</p>
                </div>
                <button 
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isSimulatingLoad}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 rounded-lg transition-colors border border-slate-700"
                >
                    {isSimulatingLoad ? (
                        <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Navigation size={14} />
                    )}
                    Mi Ubicación
                </button>
            </div>

            {/* Simulated Map Area */}
            <div 
                className="w-full h-[300px] bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden cursor-crosshair group"
                onClick={handleMapClick}
            >
                {/* Map Grid Pattern (Simulated) */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
                
                {/* Simulated Map UI Elements */}
                <div className="absolute top-4 left-4 flex flex-col gap-1">
                    <div className="w-8 h-8 bg-slate-800/80 backdrop-blur rounded shadow-lg flex items-center justify-center font-bold text-slate-400 text-lg border border-white/5">+</div>
                    <div className="w-8 h-8 bg-slate-800/80 backdrop-blur rounded shadow-lg flex items-center justify-center font-bold text-slate-400 text-lg border border-white/5">-</div>
                </div>

                {/* The Pin */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative -top-4 w-10 h-10 flex flex-col items-center animate-bounce-short">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10">
                            <MapPin size={16} className="text-slate-950 fill-emerald-500" />
                        </div>
                        <div className="w-1.5 h-4 bg-emerald-600 -mt-1 z-0" />
                        <div className="w-4 h-1 bg-black/40 blur-sm rounded-full mt-1" /> {/* Pin Shadow */}
                    </div>
                </div>
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono text-emerald-400 shadow-lg">
                        Click para reposicionar
                    </div>
                </div>
            </div>

            {/* Manual Inputs */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-medium text-slate-400 ml-1">Latitud</label>
                    <input
                        type="number"
                        step="any"
                        value={lat}
                        onChange={(e) => updateLocation(parseFloat(e.target.value) || 0, lng)}
                        className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-sm font-mono text-slate-300 focus:outline-none focus:border-[#10B981] transition-colors"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-400 ml-1">Longitud</label>
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
