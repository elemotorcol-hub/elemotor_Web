'use client';

import { useState } from 'react';
import Image from 'next/image';

interface VehicleGalleryProps {
    images: string[];
    onImageSelect: (image: string) => void;
    selectedImage: string;
}

export function VehicleGallery({ images, onImageSelect, selectedImage }: VehicleGalleryProps) {
    if (!images || images.length <= 1) return null;

    return (
        <div className="w-full max-w-4xl mx-auto mt-[-40px] lg:mt-[-60px] relative z-40 bg-[#0A0F1C]/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-2xl">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 hide-scrollbar scroll-smooth">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => onImageSelect(img)}
                        className={`relative w-28 h-20 md:w-32 md:h-24 shrink-0 snap-center rounded-xl overflow-hidden cursor-pointer transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4AA] ${selectedImage === img
                                ? 'ring-2 ring-[#00D4AA] scale-105 opacity-100'
                                : 'opacity-60 hover:opacity-100 hover:scale-105 grayscale-[50%] hover:grayscale-0'
                            }`}
                        aria-label={`Seleccionar vista ${idx + 1}`}
                        aria-pressed={selectedImage === img}
                    >
                        {/* Placeholder fallback for un-optimized external SVGs, 
                            ideally these should be reliable URLs or local references */}
                        <Image
                            src={img}
                            alt={`Miniatura de vista ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 112px, 128px"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
