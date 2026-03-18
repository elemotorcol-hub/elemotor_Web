import { RotateCcw, ZoomIn, RefreshCw } from 'lucide-react';

// ─── Toolbar items ────────────────────────────────────────────────────────────

export interface ToolbarItem {
    icon: typeof RotateCcw;
    label: string;
    hint?: string;
}

export const TOOLBAR_ITEMS: ToolbarItem[] = [
    { icon: RotateCcw, label: 'ROTATE', hint: 'Arrastra para rotar' },
    { icon: ZoomIn, label: 'ZOOM', hint: 'Scroll / Pinch para zoom' },
    { icon: RefreshCw, label: 'RESET', hint: 'Resetear cámara' },
];
