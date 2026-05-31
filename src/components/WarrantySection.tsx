import Link from 'next/link';
import { ShieldCheck, Headphones, Star, Shield } from 'lucide-react';

const ITEMS = [
    { icon: ShieldCheck, label: 'Garantía de fábrica' },
    { icon: Headphones, label: 'Soporte posventa' },
    { icon: Star, label: 'Respaldo Elemotor' },
];

export function WarrantySection() {
    return (
        <div className="bg-gradient-to-br from-[#060B14] via-[#0a1f18] to-[#060B14] py-24 border-t border-[#00D4AA]/20">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-[3fr_2fr] gap-12 items-center">

                    {/* Left column */}
                    <div>
                        <div className="inline-flex items-center gap-2 border border-[#00D4AA]/40 text-[#00D4AA] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
                            Tranquilidad garantizada
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
                            Garantía<br />Elemotor
                        </h2>

                        <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                            Respaldamos cada vehículo con garantía directa. Tu inversión protegida desde el primer día.
                        </p>

                        <div className="flex flex-wrap gap-6 mt-8">
                            {ITEMS.map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-[#00D4AA]" />
                                    </div>
                                    <span className="text-white font-bold text-sm">{label}</span>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/garantias"
                            className="inline-block mt-10 bg-[#00D4AA] hover:bg-[#00bfa0] text-[#060B14] font-bold px-8 py-4 rounded-xl transition-colors"
                        >
                            Conoce nuestra política completa →
                        </Link>
                    </div>

                    {/* Right column — decorative shield stack */}
                    <div className="hidden lg:flex items-center justify-center relative">
                        <div className="absolute w-64 h-64 rounded-full bg-[#00D4AA]/10 blur-3xl" />
                        <Shield className="w-48 h-48 text-[#00D4AA] opacity-20 absolute" strokeWidth={1} />
                        <Shield className="w-32 h-32 text-[#00D4AA] opacity-80 relative z-10" strokeWidth={1.5} />
                    </div>

                </div>
            </div>
        </div>
    );
}
