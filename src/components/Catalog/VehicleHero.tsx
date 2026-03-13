'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Vehicle } from '@/data/models';
import { Button } from '@/components/Button';
import { CalendarDays, View } from 'lucide-react';
import { VehicleGallery } from '@/components/Catalog/VehicleGallery';

export function VehicleHero({ vehicle }: { vehicle: Vehicle }) {
    // Estado para gestionar la imagen activa de la galería
    const [selectedImage, setSelectedImage] = useState<string>(vehicle.image);

    // Mock temporal de la galería hasta que tu Backend o models.ts traiga un array de imágenes
    // Sustituido por imágenes confiables de alta fidelidad para reactivar el demo del selector
    const mockGalleryImages = [
        vehicle.image,
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop', // Interior Detail
        'https://images.unsplash.com/photo-1620882813809-f9c316719b35?q=80&w=2070&auto=format&fit=crop', // Wheel Detail
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2070&auto=format&fit=crop', // Lucid Action Shot
    ];

    return (
        <section className="relative w-full min-h-[90vh] lg:min-h-[85vh] flex flex-col items-center overflow-hidden border-b border-white/5 pt-20 lg:pt-0 z-0">

            {/* 1. Base Dark Solid Background */}
            <div className="absolute inset-0 bg-[#060B14] z-0" />

            {/* 2. Car Image as Section Background (Anchored Left) */}
            <div className="absolute top-0 left-0 w-full h-[55vh] lg:h-[90%] lg:w-[65%] flex items-center justify-center z-10 mt-16 lg:mt-0">

                {/* Spotlight strictly behind the car to highlight silhouette */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] lg:w-[700px] lg:h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(0,212,170,0.15)_0%,transparent_60%)] z-0 pointer-events-none transition-all duration-700" />

                {/* Floor Line */}
                <div className="absolute bottom-[20%] w-full h-[1px] bg-gradient-to-r from-transparent via-slate-500/20 to-transparent z-0" />

                {/* Intense Contact Shadows (Grounding the vehicle) - Replaced blurs with gradients for mobile performance */}
                <div className="absolute bottom-[15%] lg:bottom-[22%] left-1/2 -translate-x-1/2 w-[70%] lg:w-[65%] h-[40px] lg:h-[50px] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.8)_0%,transparent_70%)] z-0" />
                <div className="absolute bottom-[18%] lg:bottom-[24%] left-1/2 -translate-x-1/2 w-[50%] lg:w-[45%] h-[20px] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.95)_0%,transparent_70%)] z-0" />

                {/* The vehicle wrapper - Cambia con estado */}
                <div className="relative w-full h-full lg:h-[80%] max-w-6xl z-10">
                    <Image
                        src={selectedImage}
                        alt={`Vista del ${vehicle.brand} ${vehicle.model} en EleMotor`}
                        fill
                        className="object-contain drop-shadow-2xl transition-opacity duration-500"
                        priority={true}
                        sizes="(max-width: 1024px) 100vw, 65vw"
                    />
                </div>
            </div>

            {/* 3. Gradient Overlay (Blends car edge smoothly into the dark right panel) */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#060B14]/90 via-[#060B14]/40 to-[#060B14] lg:from-transparent lg:via-[#060B14]/70 lg:to-[#060B14] pointer-events-none z-20" />

            {/* 4. Text Content Container (Floating over background) */}
            <div className="container mx-auto px-6 relative z-30 w-full flex-[1] flex flex-col lg:flex-row items-center justify-end pb-16 lg:pb-0">

                {/* Spacer for Desktop (occupies left side to push text right) */}
                <div className="hidden lg:block lg:flex-[1.3]" />

                {/* Text Area (Right side overlay) */}
                <div className="flex-1 w-full lg:max-w-2xl flex flex-col items-center lg:items-start text-center lg:text-left mt-[45vh] lg:mt-0 pt-8 lg:pt-0">
                    <span className="text-sm font-black text-[#00D4AA] tracking-[0.2em] uppercase mb-4 block drop-shadow-md">
                        {vehicle.brand}
                    </span>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-black text-white uppercase tracking-tighter leading-[1.0] mb-6 drop-shadow-2xl">
                        {vehicle.model}
                    </h1>
                    <p className="text-2xl md:text-3xl lg:text-4xl text-slate-300 font-bold mb-10 drop-shadow-md">
                        Desde <span className="text-[#00D4AA]">${vehicle.price.toLocaleString('en-US')} USD</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto">
                        <Button className="bg-[#00D4AA] hover:bg-[#00B38F] text-slate-900 font-black tracking-widest uppercase py-4 px-8 rounded-lg shadow-[0_0_20px_rgba(0,212,170,0.2)] hover:shadow-[0_0_40px_rgba(0,212,170,0.5)] transition-shadow w-full sm:w-auto h-[60px]">
                            <CalendarDays className="w-5 h-5 mr-3 inline" />
                            Cotizar este modelo
                        </Button>
                        <Button variant="ghost" className="border border-white/20 hover:border-[#00D4AA]/50 bg-white/5 hover:bg-[#00D4AA]/10 text-white font-bold tracking-widest uppercase py-4 px-8 rounded-lg backdrop-blur-md w-full sm:w-auto h-[60px] transition-all">
                            <View className="w-5 h-5 mr-3 inline text-slate-300" />
                            Ver en 3D
                        </Button>
                    </div>

                    {/* Specs badges under CTA buttons */}
                    <div className="mt-14 w-full grid grid-cols-3 gap-2 md:gap-4 border-t border-white/10 pt-8 opacity-90">
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3 group cursor-default">
                            <div className="w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#00D4AA] group-hover:scale-110 group-hover:border-[#00D4AA]/50 transition-all duration-300 shadow-lg">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h16" /><path d="M4 14h16" /><path d="M4 18h16" /><path d="M4 6h16" /></svg>
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 group-hover:text-slate-300 transition-colors">Importación<br />Directa</span>
                        </div>
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3 group cursor-default">
                            <div className="w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#00D4AA] group-hover:scale-110 group-hover:border-[#00D4AA]/50 transition-all duration-300 shadow-lg">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 group-hover:text-slate-300 transition-colors">Garantía<br />Total</span>
                        </div>
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3 group cursor-default">
                            <div className="w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#00D4AA] group-hover:scale-110 group-hover:border-[#00D4AA]/50 transition-all duration-300 shadow-lg">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 group-hover:text-slate-300 transition-colors">Financiamiento<br />Disponible</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Miniaturas de Galería Inferior (Intersecta con la sección de abajo) */}
            <div className="w-full relative z-40 transform translate-y-1/2 shrink-0">
                <VehicleGallery
                    images={mockGalleryImages}
                    selectedImage={selectedImage}
                    onImageSelect={setSelectedImage}
                />
            </div>

        </section>
    );
}
