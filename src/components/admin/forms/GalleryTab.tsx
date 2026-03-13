'use client';

import React, { useRef } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { UploadCloud, X, GripVertical } from 'lucide-react';
import Image from 'next/image';
import { VehicleModelFormData } from '@/schemas/inventorySchema';

export default function GalleryTab() {
    const { control, register, setValue, watch } = useFormContext<VehicleModelFormData>();

    const model3D = watch('trims.0.model_3d');
    const file3dInputRef = useRef<HTMLInputElement>(null);

    // Instead of a global gallery, we'll map these to the first trim for now, 
    // or as a general model thumbnail if there are no trims.
    // For a fully robust system, each Trim has its own images, but for the mockup's
    // generic "Gallery Tab", we can bind it to trims.0.images
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: 'trims.0.images'
    });

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
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        const newImagesCount = Math.min(validFiles.length, 20 - fields.length);
        const filesToAdd = validFiles.slice(0, newImagesCount);

        filesToAdd.forEach((file, idx) => {
            append({
                id: crypto.randomUUID(),
                url: URL.createObjectURL(file), // Storing object URL temporarily
                type: 'gallery',
                sort_order: fields.length + idx
            });
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handle3DFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setValue('trims.0.model_3d', {
                id: crypto.randomUUID(),
                file_url: URL.createObjectURL(file), // Mocking local URL
                file_size_mb: parseFloat((file.size / (1024 * 1024)).toFixed(2)),
                format: file.name.toLowerCase().endsWith('.gltf') ? 'gltf' : 'glb',
                draco_compressed: true,
            }, { shouldValidate: true });
        }
    };

    const trigger3DFileInput = () => {
        file3dInputRef.current?.click();
    };

    const remove3DModel = () => {
        setValue('trims.0.model_3d', undefined, { shouldValidate: true });
    };

    // Note: URL.revokeObjectURL normally happens on unmount or remove
    // but in this mock form setup, we keep it simple.

    return (
        <div className="flex flex-col gap-6">

            {/* Upload Dropzone */}
            <div
                className="w-full border-2 border-dashed border-slate-700/60 rounded-xl bg-slate-900/30 hover:bg-slate-900/50 transition-colors flex flex-col items-center justify-center py-16 gap-3 cursor-pointer group relative"
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
                    <p className="text-base font-semibold text-slate-200">Arrastra y suelta imágenes del vehículo</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP hasta 10MB c/u &middot; Max 20 imágenes</p>
                </div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        triggerFileInput();
                    }}
                    className="mt-2 px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#0A110F] text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-[#10B981]/10 z-10"
                >
                    Examinar Archivos
                </button>
            </div>

            {/* Image Preview List */}
            {fields.length > 0 && (
                <div className="flex flex-col gap-3 mt-2">
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">Imágenes Subidas ({fields.length})</h3>
                    <div className="flex flex-col gap-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 group">

                                <button className="cursor-grab hover:text-cyan-400 text-slate-600 hidden sm:block">
                                    <GripVertical size={20} />
                                </button>

                                <div className="relative w-full sm:w-32 aspect-video rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
                                    <Image
                                        src={field.url}
                                        alt="Uploaded preview"
                                        fill
                                        sizes="(max-width: 640px) 100vw, 128px"
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-semibold text-slate-400 uppercase">Tipo de Imagen</label>
                                        <select
                                            {...register(`trims.0.images.${index}.type`)}
                                            className="w-full bg-[#0f172a]/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
                                        >
                                            <option value="gallery">Galería General</option>
                                            <option value="hero">Hero (Principal)</option>
                                            <option value="exterior">Exterior</option>
                                            <option value="interior">Interior</option>
                                            <option value="360">Vista 360°</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-semibold text-slate-400 uppercase">Texto Alternativo (Alt)</label>
                                        <input
                                            type="text"
                                            {...register(`trims.0.images.${index}.alt_text`)}
                                            placeholder="Ej. Vista lateral del modelo"
                                            className="w-full bg-[#0f172a]/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => remove(index)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-shrink-0 self-end sm:self-center w-full sm:w-auto mt-2 sm:mt-0"
                                    title="Eliminar imagen"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 3D Model Upload */}
            <div className="mt-6 border-t border-slate-800 pt-8 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-200">Modelo 3D (.glb, .gltf)</h3>
                        <p className="text-xs text-slate-500 mt-1">Sube el modelo 3D para el visor interactivo.</p>
                    </div>
                </div>

                {model3D ? (
                    <div className="flex items-center justify-between bg-[#1e293b]/40 border border-cyan-900/50 rounded-xl p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-cyan-950/50 flex items-center justify-center text-cyan-400">
                                <span className="text-xs font-bold uppercase">{model3D.format}</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-200 truncate max-w-[200px]">modelo_3d.{model3D.format}</h4>
                                <p className="text-xs text-slate-400">{model3D.file_size_mb} MB &middot; {model3D.draco_compressed ? 'Compresión Draco' : 'Sin comprimir'}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={remove3DModel}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Eliminar modelo 3D"
                        >
                            <X size={20} />
                        </button>
                    </div>
                ) : (
                    <div
                        className="w-full border border-dashed border-slate-700 hover:border-cyan-700/50 rounded-xl bg-slate-900/20 hover:bg-slate-900/40 py-8 px-6 text-center transition-colors cursor-pointer"
                        onClick={trigger3DFileInput}
                    >
                        <input
                            type="file"
                            ref={file3dInputRef}
                            className="hidden"
                            accept=".glb,.gltf"
                            onChange={handle3DFileChange}
                        />
                        <button
                            type="button"
                            className="text-xs font-semibold bg-slate-800 text-slate-300 px-4 py-2 rounded-lg pointer-events-none border border-slate-600"
                        >
                            Seleccionar Archivo 3D
                        </button>
                        <p className="text-[11px] text-slate-500 mt-3">* El analizador 3D validará polígonos y texturas antes de guardar.</p>
                    </div>
                )}
            </div>

        </div>
    );
}
