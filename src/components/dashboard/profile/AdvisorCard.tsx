import Image from 'next/image';
import { Phone, MessageCircle, MapPin, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/Button';

export function AdvisorCard() {
    return (
        <div className="bg-[#15201D] border border-[#10B981]/20 rounded-[32px] overflow-hidden flex flex-col h-full shadow-xl relative isolate">
            {/* Backdrop glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#10B981]/20 rounded-full blur-[60px] pointer-events-none" />

            <div className="px-8 pt-8 pb-4 relative z-10 flex flex-col items-center flex-grow">
                <span className="text-[10px] text-[#10B981] font-black uppercase tracking-[0.2em] mb-6">Tu Asesor Personal</span>
                
                {/* Advisor Avatar */}
                <div className="relative mb-6 group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#0A110F] shadow-2xl relative z-10">
                        {/* Avatar Image using Unsplash placeholder */}
                        <Image 
                            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&auto=format&fit=crop"
                            alt="Carlos Mendoza - Asesor Elemotor"
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    {/* Verified Badge */}
                    <div className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-1 border-2 border-[#15201D] z-20 shadow-lg">
                        <BadgeCheck className="w-5 h-5" />
                    </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-1">Carlos Mendoza</h3>
                <p className="text-sm font-medium text-slate-400 mb-4">Especialista en Ventas Senior</p>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold bg-[#0A110F] px-4 py-2 rounded-full mb-8">
                    <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                    Concesionario Principal Bogotá
                </div>
            </div>

            {/* CTAs */}
            <div className="bg-[#0A110F]/50 p-6 flex flex-col gap-3 relative z-10 border-t border-white/5 mt-auto">
                <Button className="w-full bg-[#10B981] hover:bg-[#0E9F6E] text-slate-900 font-bold flex items-center justify-center gap-2 rounded-xl py-6 h-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <MessageCircle className="w-5 h-5" fill="currentColor" />
                    Contactar por WhatsApp
                </Button>
                
                <Button variant="ghost" className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold flex items-center justify-center gap-2 rounded-xl py-6 h-auto transition-colors">
                    <Phone className="w-4 h-4" />
                    Agendar Llamada
                </Button>
            </div>
        </div>
    );
}
