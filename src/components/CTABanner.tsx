'use client';

import * as React from 'react';
import { MessageCircle } from 'lucide-react';

export function CTABanner() {
    return (
        <section className="py-24 bg-[#0A110F] px-6 relative flex justify-center items-center">

            <div className="container mx-auto px-6 relative flex items-center justify-center">

                {/* Banner Principal */}
                <div className="w-full max-w-5xl bg-gradient-to-r from-[#131f1c] via-[#0d2a24] to-[#04473b] rounded-[40px] p-10 md:p-14 relative overflow-hidden shadow-2xl border border-white/5">

                    {/* Número gigante de fondo */}
                    <span
                        className="absolute -right-6 -bottom-16 text-[18rem] md:text-[22rem] font-black text-[#00D4AA]/20 select-none pointer-events-none italic leading-none"
                    >
                        4
                    </span>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] mb-8 uppercase tracking-tight max-w-xl">
                            ¿LISTO PARA DAR EL <br /> SALTO ELÉCTRICO?
                        </h2>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <a
                                href="/cotizar"
                                className="bg-[#00D4AA] hover:bg-[#00B38F] text-[#0A0F1C] font-black text-sm md:text-base px-8 py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:shadow-[0_0_30px_rgba(0,212,170,0.5)] hover:-translate-y-1 w-full sm:w-auto text-center"
                            >
                                COTIZAR AHORA
                            </a>
                            <a
                                href="#modelos"
                                className="border border-white/20 text-white hover:bg-white/10 font-bold text-sm md:text-base px-8 py-4 rounded-xl transition-all duration-300 w-full sm:w-auto text-center"
                            >
                                VER SHOWROOM 3D
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
