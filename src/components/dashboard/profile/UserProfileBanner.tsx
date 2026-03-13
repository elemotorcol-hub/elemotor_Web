import * as React from 'react';
import { Settings, ShieldCheck, Mail, Phone, CalendarDays } from 'lucide-react';
import Link from 'next/link';

interface UserProfileBannerProps {
    user: {
        name: string;
        role: string;
        email?: string;
        phone?: string;
        memberSince?: string;
        clientId?: string;
    }
}

export function UserProfileBanner({ user }: UserProfileBannerProps) {
    // Generate initials safely
    const generateInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return name.slice(0, 2).toUpperCase();
    }

    return (
        <div className="relative w-full rounded-[32px] overflow-hidden bg-[#15201D] border border-white/5 shadow-2xl">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#10B981]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                
                {/* Avatar / Initials Circle */}
                <div className="relative shrink-0">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#0A110F] to-[#15201D] border-2 border-white/10 p-1 flex items-center justify-center shadow-2xl overflow-hidden group">
                        <div className="w-full h-full bg-white/5 rounded-full flex items-center justify-center">
                            <span className="text-4xl md:text-5xl font-black text-white tracking-tighter shadow-sm group-hover:scale-110 transition-transform">
                                {generateInitials(user.name)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Info Text */}
                <div className="flex-1 text-center md:text-left pt-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                        <h2 className="text-3xl font-black text-white tracking-tight">{user.name}</h2>
                        
                        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-full self-center">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {user.role}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-4 md:mt-6 text-sm text-slate-400 font-medium">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-500" />
                            {user.email || 'Sin email registrado'}
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-500" />
                            {user.phone || 'Sin teléfono registrado'}
                        </div>
                    </div>
                </div>

                {/* Edit Button */}
                <div className="shrink-0 self-center md:self-start md:pt-4">
                    <Link href="/dashboard/configuracion" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-[#10B981]/10 border border-white/10 hover:border-[#10B981] text-slate-300 hover:text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all">
                        <Settings className="w-4 h-4" />
                        Editar Perfil
                    </Link>
                </div>

            </div>
            
            {/* Footer Bar */}
            <div className="bg-[#0A110F]/50 border-t border-white/5 px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-xs font-semibold text-slate-500 gap-3">
                <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-slate-400" />
                    Miembro Elemotor desde {user.memberSince || 'N/A'}
                </div>
                <div>ID Cliente: {user.clientId || 'N/A'}</div>
            </div>
        </div>
    );
}
