'use client';

import { Printer } from 'lucide-react';

export function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors border border-slate-200 print:hidden"
        >
            <Printer className="w-4 h-4" />
            Imprimir / Guardar PDF
        </button>
    );
}
