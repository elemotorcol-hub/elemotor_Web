'use client';

/**
 * ViewToggle.tsx
 *
 * Minimal toggle button to switch between Exterior and Interior view.
 */

import { Car, Armchair } from 'lucide-react';
import type { ViewMode } from '@/types/showroom';

interface ViewToggleProps {
    viewMode: ViewMode;
    onToggle: () => void;
}

export function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
    return (
        <div className="flex items-center bg-[#15201D]/90 backdrop-blur-md border border-white/5 rounded-full p-1 shadow-lg">
            <button
                onClick={viewMode !== 'exterior' ? onToggle : undefined}
                aria-label="Vista exterior"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest transition-all duration-300 ${
                    viewMode === 'exterior'
                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                }`}
            >
                <Car className="w-3 h-3" />
                EXT
            </button>
            <button
                onClick={viewMode !== 'interior' ? onToggle : undefined}
                aria-label="Vista interior"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest transition-all duration-300 ${
                    viewMode === 'interior'
                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                }`}
            >
                <Armchair className="w-3 h-3" />
                INT
            </button>
        </div>
    );
}
