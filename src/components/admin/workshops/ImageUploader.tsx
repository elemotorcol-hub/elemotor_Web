'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, GripVertical, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadService } from '@/services/upload.service';

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        const validFiles = Array.from(files).filter(file => {
            if (file.size > MAX_SIZE) {
                alert(`El archivo ${file.name} es demasiado grande. El máximo permitido es 10MB.`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) {
            setIsUploading(false);
            return;
        }
        
        try {
            const uploadPromises = validFiles.map(file => 
                uploadService.uploadImage(file, 'workshops')
            );
            
            const results = await Promise.all(uploadPromises);
            const newUrls = results.map(res => res.publicUrl);
            onChange([...images, ...newUrls]);
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Error al subir las imágenes. Inténtalo de nuevo.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        await handleUpload(e.dataTransfer.files);
    };

    const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await handleUpload(e.target.files);
        if (fileInputRef.current) fileInputRef.current.value = '';
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
                onClick={() => fileInputRef.current?.click()}
            >
                <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef}
                    multiple 
                    accept="image/*"
                    onChange={onFileSelect}
                />
                <div className={`p-4 rounded-full mb-3 ${isDragging ? 'bg-[#10B981]/20' : 'bg-slate-800'}`}>
                    {isUploading ? (
                        <Loader2 size={28} className="text-[#10B981] animate-spin" />
                    ) : (
                        <UploadCloud size={28} className={isDragging ? 'text-[#10B981]' : 'text-slate-400'} />
                    )}
                </div>
                <p className="text-sm font-semibold">
                    {isUploading ? 'Subiendo imágenes...' : 'Haz clic o arrastra fotos aquí'}
                </p>
                <p className="text-xs opacity-70 mt-1">Soporta JPG, PNG, WebP hasta 5MB</p>
            </div>

            {/* Uploaded List */}
            {images.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center justify-between">
                        Galería del Taller
                        <span className="text-xs font-normal text-slate-500">{images.length} imágenes</span>
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-2">
                        {images.map((imgSrc, index) => (
                            <div 
                                key={imgSrc} 
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
                                    <img 
                                        src={imgSrc} 
                                        alt={`Foto ${index + 1}`} 
                                        className="w-full h-full object-cover"
                                    />
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
