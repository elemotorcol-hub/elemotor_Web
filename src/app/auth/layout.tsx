import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0A110F] font-sans flex items-center justify-center p-4 selection:bg-[#10B981]/30 relative overflow-hidden">
            {/* Volver a la Landing */}
            <div className="absolute top-8 left-8 z-50">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-slate-400 hover:text-[#10B981] transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/5 hover:border-[#10B981]/30 backdrop-blur-md group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Volver al inicio</span>
                </Link>
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#10B981]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#10B981]/5 blur-[120px] rounded-full pointer-events-none" />

            {children}
        </div>
    );
}
