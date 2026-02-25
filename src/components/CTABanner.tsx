'use client';

import * as React from 'react';
import { Button } from '@/components/Button';
import { MessageCircle } from 'lucide-react';

export function CTABanner() {
    return (
        <section className="py-24 bg-slate-900 px-6 overflow-hidden relative">
            <div className="container mx-auto">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900/50 rounded-[3rem] p-12 md:p-20 relative overflow-hidden border border-white/5">
                    {/* Giant background number */}
                    <span className="absolute -right-10 -bottom-20 text-[20rem] font-black text-cyan-400/5 select-none pointer-events-none italic">
                        4
                    </span>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="max-w-2xl text-center lg:text-left">
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">
                                ¿LISTO PARA DAR EL <br />
                                <span className="text-cyan-400">SALTO ELÉCTRICO?</span>
                            </h2>
                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Button
                                    size="lg"
                                    className="bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-bold px-10 py-7 min-w-[220px]"
                                >
                                    COTIZAR AHORA
                                </Button>
                                <Button
                                    size="lg"
                                    variant="ghost"
                                    className="border-2 border-white text-white hover:bg-white/10 font-bold px-10 py-7 min-w-[220px]"
                                >
                                    VER SHOWROOM 3D
                                </Button>
                            </div>
                        </div>

                        {/* Feature small bullets */}
                        <div className="hidden lg:grid grid-cols-1 gap-6 text-white/60">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                                <span>Reserva online en 5 minutos</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                                <span>Financiamiento preferencial</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                                <span>Entrega garantizada</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating WhatsApp Button */}
            <a
                href="https://wa.me/something"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-400/20 hover:scale-110 transition-transform hover:bg-cyan-500 group"
            >
                <MessageCircle className="w-8 h-8 text-slate-900 fill-current" />
                <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                    Contáctanos por WhatsApp
                </span>
            </a>
        </section>
    );
}
