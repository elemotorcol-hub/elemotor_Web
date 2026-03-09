'use client';

import { useState } from 'react';
import Image from 'next/image';
import { HelpCircle, Share2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { TrimSelector, ColorSelector } from '@/components/showroom/ShowroomSelectors';
import { SpecsGrid, InteriorPicker, CTAFooter } from '@/components/showroom/ShowroomConfig';
import { COLORS, TOOLBAR_ITEMS, type TrimKey, type ColorKey, type InteriorKey } from '@/config/showroom';

export default function ShowroomPage() {
    const [activeTrim, setActiveTrim] = useState<TrimKey>('performance');
    const [activeColor, setActiveColor] = useState<ColorKey>('teal');
    const [activeInterior, setActiveInterior] = useState<InteriorKey>('carbon');

    const activeHex = COLORS[activeColor].hex;

    return (
        <>
            <Navbar />

            {/* ══════════════════════════════════════
          MOBILE LAYOUT  (< lg) — vertical scroll
      ══════════════════════════════════════ */}
            <div className="lg:hidden min-h-screen bg-[#050B09] font-sans select-none pt-16">

                {/* Vehicle image hero */}
                <div className="relative bg-[#050B09] px-6 pt-6 pb-4">
                    <div className="flex items-center gap-1.5 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-500 text-[9px] font-bold tracking-[0.15em]">SHOWROOM VIRTUAL</span>
                    </div>

                    {/* glow */}
                    <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-12 blur-3xl opacity-25 rounded-full transition-colors duration-700"
                        style={{ backgroundColor: activeHex }}
                    />
                    <Image
                        src="/showroom-car.png"
                        alt="Elemotor GT"
                        width={400}
                        height={250}
                        className="w-full max-w-sm mx-auto h-auto object-contain"
                        style={{ filter: `drop-shadow(0 20px 40px ${activeHex}44)` }}
                        priority
                    />

                    <div className="flex items-center justify-between mt-3 px-1">
                        <div>
                            <p className="text-emerald-500 text-[9px] font-bold tracking-[0.15em]">CONNECTION SECURE LINK</p>
                            <p className="text-slate-500 text-[9px] font-semibold tracking-[0.1em]">LATENCY 12ms</p>
                        </div>
                        <div className="flex gap-2">
                            <button aria-label="Ayuda" className="w-8 h-8 rounded-full bg-[#15201D]/80 border border-white/5 flex items-center justify-center text-slate-400">
                                <HelpCircle className="w-3.5 h-3.5" />
                            </button>
                            <button aria-label="Compartir" className="w-8 h-8 rounded-full bg-[#15201D]/80 border border-white/5 flex items-center justify-center text-slate-400">
                                <Share2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile toolbar */}
                <div className="flex justify-center px-4 py-3 bg-[#050B09]">
                    <div className="flex items-center bg-[#15201D]/90 backdrop-blur-md border border-white/5 rounded-full px-2 py-1.5 w-full max-w-xs justify-around">
                        {TOOLBAR_ITEMS.map(({ icon: Icon, label }) => (
                            <button key={label} className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-full hover:bg-white/10 transition-colors group">
                                <Icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                                <span className="text-[7px] text-slate-600 group-hover:text-slate-300 tracking-widest font-semibold">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile configurator */}
                <div className="bg-[#0A110F] border-t border-white/5">
                    <div className="px-5 pt-6 pb-4 border-b border-white/5">
                        <p className="text-[10px] font-bold tracking-[0.25em] text-emerald-500/80 mb-1">MODEL SELECTION</p>
                        <h1 className="text-2xl font-light text-white">Elemotor <span className="font-black">GT</span></h1>
                    </div>
                    <div className="px-5 py-5 space-y-6">
                        <TrimSelector activeTrim={activeTrim} onSelect={setActiveTrim} />
                        <ColorSelector activeColor={activeColor} onSelect={setActiveColor} />
                        <SpecsGrid activeTrim={activeTrim} />
                        <InteriorPicker activeInterior={activeInterior} onSelect={setActiveInterior} />
                    </div>
                    <CTAFooter activeTrim={activeTrim} />
                </div>
            </div>

            {/* ══════════════════════════════════════
          DESKTOP LAYOUT  (≥ lg) — 70/30 split
      ══════════════════════════════════════ */}
            <div className="hidden lg:flex h-screen w-screen overflow-hidden bg-[#050B09] font-sans select-none pt-[72px]">

                {/* LEFT — 3D Viewer */}
                <div className="relative flex-[7] flex flex-col overflow-hidden">

                    <div className="absolute top-4 left-8 z-20 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-500 text-[9px] font-bold tracking-[0.15em]">SHOWROOM VIRTUAL</span>
                    </div>

                    <div className="flex-1 flex items-center justify-center px-16 py-24">
                        <div className="relative w-full max-w-2xl">
                            <div
                                className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[70%] h-16 blur-3xl opacity-30 rounded-full transition-colors duration-700"
                                style={{ backgroundColor: activeHex }}
                            />
                            <Image
                                src="/showroom-car.png"
                                alt="Elemotor GT"
                                width={800}
                                height={500}
                                className="w-full h-auto object-contain drop-shadow-2xl transition-all duration-500"
                                style={{ filter: `drop-shadow(0 30px 60px ${activeHex}33)` }}
                                priority
                            />
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-8 z-20">
                        <p className="text-emerald-500 text-[9px] font-bold tracking-[0.2em]">CONNECTION SECURE LINK</p>
                        <p className="text-slate-500 text-[9px] font-semibold tracking-[0.15em] mt-0.5">LATENCY 12ms</p>
                    </div>

                    {/* Desktop toolbar */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                        <div className="flex items-center gap-1 bg-[#15201D]/80 backdrop-blur-md border border-white/5 rounded-full px-3 py-2 shadow-2xl">
                            {TOOLBAR_ITEMS.map(({ icon: Icon, label }) => (
                                <button key={label} className="flex flex-col items-center gap-1 px-4 py-2 rounded-full hover:bg-white/10 transition-colors group">
                                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                                    <span className="text-[8px] text-slate-500 group-hover:text-slate-300 tracking-widest font-semibold transition-colors">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-3">
                        <button aria-label="Ayuda" className="w-10 h-10 rounded-full bg-[#15201D]/80 backdrop-blur-md border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            <HelpCircle className="w-4 h-4" />
                        </button>
                        <button aria-label="Compartir" className="w-10 h-10 rounded-full bg-[#15201D]/80 backdrop-blur-md border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Background radial glow */}
                    <div
                        className="absolute inset-0 pointer-events-none transition-all duration-1000"
                        style={{ background: `radial-gradient(ellipse 60% 50% at 50% 60%, ${activeHex}0A 0%, transparent 70%)` }}
                    />
                </div>

                {/* RIGHT — Configurator */}
                <div className="flex-[3] bg-[#0A110F] border-l border-white/5 flex flex-col overflow-hidden">
                    <div className="px-8 pt-8 pb-6 border-b border-white/5 flex-shrink-0">
                        <p className="text-[10px] font-bold tracking-[0.25em] text-emerald-500/80 mb-3">MODEL SELECTION</p>
                        <h1 className="text-3xl font-light text-white">Elemotor <span className="font-black">GT</span></h1>
                    </div>

                    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                        <TrimSelector activeTrim={activeTrim} onSelect={setActiveTrim} />
                        <ColorSelector activeColor={activeColor} onSelect={setActiveColor} />
                        <SpecsGrid activeTrim={activeTrim} />
                        <InteriorPicker activeInterior={activeInterior} onSelect={setActiveInterior} />
                    </div>

                    <CTAFooter activeTrim={activeTrim} />
                </div>
            </div>
        </>
    );
}
