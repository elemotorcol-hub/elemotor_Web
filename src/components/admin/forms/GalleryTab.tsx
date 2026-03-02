'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';

export default function GalleryTab() {
    const [images, setImages] = useState<{ id: string, url: string, file: File }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files));
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const processFiles = (files: File[]) => {
        // Filter for images and limit to 20 total
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        const newImagesCount = Math.min(validFiles.length, 20 - images.length);
        const filesToAdd = validFiles.slice(0, newImagesCount);

        const newImagePreviews = filesToAdd.map(file => ({
            id: Math.random().toString(36).substring(7),
            url: URL.createObjectURL(file),
            file
        }));

        setImages(prev => [...prev, ...newImagePreviews]);
    };

    const removeImage = (idToRemove: string) => {
        setImages(prev => {
            const filtered = prev.filter(img => img.id !== idToRemove);
            // Clean up object URLs to avoid memory leaks
            const removedImg = prev.find(img => img.id === idToRemove);
            if (removedImg) {
                URL.revokeObjectURL(removedImg.url);
            }
            return filtered;
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    React.useEffect(() => {
        // Cleanup de las URLs al desmontar el componente para evitar memory leaks
        return () => {
            images.forEach(img => URL.revokeObjectURL(img.url));
        };
    }, [images]);

    return (
        <div className="flex flex-col gap-6">

            {/* Upload Dropzone */}
            <div
                className="w-full border-2 border-dashed border-slate-700/60 rounded-xl bg-slate-900/30 hover:bg-slate-900/50 transition-colors flex flex-col items-center justify-center py-20 gap-3 cursor-pointer group relative"
                onClick={triggerFileInput}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleFileChange}
                />

                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:bg-slate-800 transition-all shadow-md">
                    <UploadCloud size={28} />
                </div>
                <div className="text-center mt-2 pointer-events-none">
                    <p className="text-base font-semibold text-slate-200">Drag & drop vehicle images here</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB each &middot; Max 20 images</p>
                </div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        triggerFileInput();
                    }}
                    className="mt-4 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-colors border border-slate-700 z-10"
                >
                    Browse Files
                </button>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                    {images.map(image => (
                        <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden border border-slate-700/50 group bg-slate-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={image.url}
                                alt="Uploaded preview"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(image.id);
                                }}
                                className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                title="Remove image"
                            >
                                <X size={14} strokeWidth={2.5} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}
