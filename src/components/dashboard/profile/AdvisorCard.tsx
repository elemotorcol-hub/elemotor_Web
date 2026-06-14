import { Phone, MessageCircle, Mail, BadgeCheck } from 'lucide-react';

export interface AdvisorInfo {
    name: string;
    role?: string;
    phone?: string;
    email?: string;
}

const DEFAULT_ADVISOR: AdvisorInfo = {
    name: 'Equipo Elemotor',
    role: 'Asesor de Ventas',
    phone: '573117762260',
};

function getInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

interface AdvisorCardProps {
    advisor?: AdvisorInfo | null;
}

export function AdvisorCard({ advisor }: AdvisorCardProps) {
    const data: AdvisorInfo = advisor ?? DEFAULT_ADVISOR;
    const whatsappPhone = data.phone ?? DEFAULT_ADVISOR.phone!;
    const whatsappHref = `https://wa.me/${whatsappPhone.replace(/\D/g, '')}`;
    const initials = getInitials(data.name);

    return (
        <div className="bg-[#15201D] border border-[#10B981]/20 rounded-[32px] overflow-hidden flex flex-col h-full shadow-xl relative isolate">
            {/* Backdrop glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#10B981]/20 rounded-full blur-[60px] pointer-events-none" />

            <div className="px-8 pt-8 pb-4 relative z-10 flex flex-col items-center flex-grow">
                <span className="text-[10px] text-[#10B981] font-black uppercase tracking-[0.2em] mb-6">Tu Asesor Personal</span>

                {/* Initials Avatar */}
                <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full border-4 border-[#0A110F] shadow-2xl relative z-10 bg-[#10B981]/20 flex items-center justify-center">
                        <span className="text-3xl font-black text-[#10B981] select-none">{initials}</span>
                    </div>
                    {/* Verified Badge */}
                    <div className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-1 border-2 border-[#15201D] z-20 shadow-lg">
                        <BadgeCheck className="w-5 h-5" />
                    </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-1 text-center">{data.name}</h3>
                <p className="text-sm font-medium text-slate-400 mb-4">{data.role ?? 'Asesor de Ventas'}</p>

                {data.email && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium bg-[#0A110F] px-4 py-2 rounded-full mb-4 max-w-full">
                        <Mail className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                        <span className="truncate">{data.email}</span>
                    </div>
                )}
            </div>

            {/* CTAs */}
            <div className="bg-[#0A110F]/50 p-6 flex flex-col gap-3 relative z-10 border-t border-white/5 mt-auto">
                <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#10B981] hover:bg-[#0E9F6E] text-slate-900 font-bold inline-flex items-center justify-center gap-2 rounded-xl py-4 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-colors"
                >
                    <MessageCircle className="w-5 h-5" fill="currentColor" />
                    Contactar por WhatsApp
                </a>

                {data.phone && (
                    <a
                        href={`tel:${data.phone.replace(/\D/g, '')}`}
                        className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold inline-flex items-center justify-center gap-2 rounded-xl py-4 transition-colors"
                    >
                        <Phone className="w-4 h-4" />
                        Llamar al Asesor
                    </a>
                )}
            </div>
        </div>
    );
}
