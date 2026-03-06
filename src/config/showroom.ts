import { LucideIcon, RotateCcw, ZoomIn, LayoutGrid, RefreshCw, Film } from 'lucide-react';

/* ─── Type definitions ────────────────────────────── */

export type TrimKey = 'performance' | 'longrange';
export type ColorKey = 'teal' | 'white' | 'navy' | 'red';
export type InteriorKey = 'carbon' | 'walnut' | 'alcantara';

export type InteriorPrice =
    | { type: 'included' }
    | { type: 'extra'; amount: string };

export interface ColorOption {
    label: string;
    hex: string;
    tw: string;
}

export interface TrimOption {
    key: TrimKey;
    name: string;
    sub: string;
}

export interface SpecItem {
    value: string;
    unit: string;
    label: string;
}

export interface InteriorOption {
    key: InteriorKey;
    name: string;
    price: InteriorPrice;
}

export interface TrimConfig {
    name: string;
    sub: string;
    specs: SpecItem[];
    price: string;
    originalPrice: string;
    delivery: string;
}

export interface ToolbarItem {
    icon: LucideIcon;
    label: string;
}

/* ─── Data ────────────────────────────────────────── */

export const COLORS: Record<ColorKey, ColorOption> = {
    teal: { label: 'Aurora Teal', hex: '#10B981', tw: 'bg-emerald-500' },
    white: { label: 'Arctic White', hex: '#E8EDF2', tw: 'bg-slate-200' },
    navy: { label: 'Midnight Navy', hex: '#1E3A8A', tw: 'bg-blue-800' },
    red: { label: 'Crimson Red', hex: '#DC2626', tw: 'bg-red-600' },
};

export const INTERIORS: InteriorOption[] = [
    { key: 'carbon', name: 'Carbon Fiber / Vegan Leather', price: { type: 'included' } },
    { key: 'walnut', name: 'Walnut / Cream Leather', price: { type: 'extra', amount: '+$2.400' } },
    { key: 'alcantara', name: 'Full Alcantara Sport', price: { type: 'extra', amount: '+$4.900' } },
];

export const TRIMS: Record<TrimKey, TrimConfig> = {
    performance: {
        name: 'Performance',
        sub: 'Tri-Motor AWD',
        specs: [
            { value: '620', unit: 'km', label: 'RANGE (WLTP)' },
            { value: '2.1', unit: 's', label: '0–100 KM/H' },
            { value: '322', unit: 'km/h', label: 'TOP SPEED' },
        ],
        price: '$189.900.000',
        originalPrice: '$210.000.000',
        delivery: 'Oct – Dec 2025',
    },
    longrange: {
        name: 'Long Range',
        sub: 'Dual-Motor AWD',
        specs: [
            { value: '780', unit: 'km', label: 'RANGE (WLTP)' },
            { value: '3.4', unit: 's', label: '0–100 KM/H' },
            { value: '250', unit: 'km/h', label: 'TOP SPEED' },
        ],
        price: '$169.900.000',
        originalPrice: '$185.000.000',
        delivery: 'Oct – Dec 2025',
    },
};

export const TOOLBAR_ITEMS: ToolbarItem[] = [
    { icon: RotateCcw, label: 'ROTATE' },
    { icon: ZoomIn, label: 'ZOOM' },
    { icon: LayoutGrid, label: 'INTERIOR' },
    { icon: RefreshCw, label: 'RESET' },
    { icon: Film, label: 'CINEMA' },
];
