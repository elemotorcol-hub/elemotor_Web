'use client';

import React, { useState } from 'react';
import { UploadCloud, X, GripVertical, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);

    // Simulate drag & drop behavior for adding
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        // For simulation, just add a placeholder image
        const newMockImage = `/taller-${Math.floor(Math.random() * 5) + 1}.jpg`;
        onChange([...images, newMockImage]);
    };

    const removeImage = (indexToRemove: number) => {
        onChange(images.filter((_, index) => index !== indexToRemove));
    };

    const moveImage = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) || 
            (direction === 'down' && index === images.length - 1)
        ) return;

        const newImages = [...images];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        // Swap
        [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
        onChange(newImages);
    };

    return (
        <div className="w-full space-y-6">
            
            {/* Dropzone */}
            <div 
                className={`w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isDragging 
                    ? 'border-[#10B981] bg-[#10B981]/5 text-[#10B981]' 
                    : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-500 hover:bg-slate-900'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                    const newMockImage = `/taller-${Math.floor(Math.random() * 5) + 1}.jpg`;
                    onChange([...images, newMockImage]);
                }}
            >
                <div className={`p-4 rounded-full mb-3 ${isDragging ? 'bg-[#10B981]/20' : 'bg-slate-800'}`}>
                    <UploadCloud size={28} className={isDragging ? 'text-[#10B981]' : 'text-slate-400'} />
                </div>
                <p className="text-sm font-semibold">Haz clic o arrastra fotos aquí</p>
                <p className="text-xs opacity-70 mt-1">Soporta JPG, PNG hasta 5MB (Simulado)</p>
            </div>

            {/* Uploaded List */}
            {images.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center justify-between">
                        Galería del Taller
                        <span className="text-xs font-normal text-slate-500">{images.length} imágenes</span>
                    </h4>
                    
                    <div className="space-y-2">
                        {images.map((imgSrc, index) => (
                            <div 
                                key={`${imgSrc}-${index}`} 
                                className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl group"
                            >
                                {/* Drag Handle (Simulated arrows for click ordering instead of complex D&D list) */}
                                <div className="flex flex-col gap-1 text-slate-600">
                                    <button 
                                        type="button"
                                        onClick={() => moveImage(index, 'up')}
                                        disabled={index === 0}
                                        className="hover:text-slate-300 disabled:opacity-30 disabled:hover:text-slate-600"
                                    >
                                        <GripVertical size={16} />
                                    </button>
                                </div>

                                {/* Preview Thumbnail */}
                                <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                    <div className="w-full h-full bg-slate-700 flex flex-col items-center justify-center text-slate-500 text-xs">
                                        <ImageIcon size={20} className="mb-1" />
                                        Foto {index + 1}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-slate-300 truncate">
                                        imagen_{index + 1}_taller.jpg
                                    </div>
                                    <div className="text-xs text-slate-500 flex gap-2">
                                        <span>✓ 1080x1080</span>
                                        {index === 0 && <span className="text-emerald-500 font-medium">Portada Principal</span>}
                                    </div>
                                </div>

                                {/* Remove */}
                                <button 
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                    title="Eliminar imagen"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
