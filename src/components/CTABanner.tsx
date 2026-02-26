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
                href="https://wa.me/573208930578?text=Hola,%20quiero%20dar%20el%20salto%20eléctrico.%20¿Me%20ayudan%20con%20una%20cotización?"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl shadow-[#25D366]/20 hover:scale-110 transition-transform hover:bg-[#128C7E] group"
            >
                {/* SVG Oficial de WhatsApp */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="text-white"
                    viewBox="0 0 16 16"
                >
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c-.003 1.396.366 2.76 1.056 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                </svg>

                <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                    Contáctanos por WhatsApp
                </span>
            </a>
        </section>
    );
}
