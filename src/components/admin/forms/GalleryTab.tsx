'use client';

import React, { useRef } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { UploadCloud, X, GripVertical } from 'lucide-react';
import Image from 'next/image';
import { VehicleModelFormData } from '@/schemas/inventorySchema';

export default function GalleryTab() {
    const { watch } = useFormContext<VehicleModelFormData>();
    const trims = watch('trims') || [];

    if (trims.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 rounded-xl border border-dashed border-slate-700 text-center px-6">
                <UploadCloud size={48} className="text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Galería de Imágenes</h3>
                <p className="text-sm text-slate-500">Debes crear al menos una versión en la pestaña "Versiones y Especificaciones" antes de poder subir imágenes o un modelo 3D.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Galerías y Modelos 3D por Versión</h3>
            {trims.map((trim: any, idx: number) => (
                <TrimGallerySection key={trim.id || idx} trimIndex={idx} trimName={trim.name} />
            ))}
        </div>
    );
}

function TrimGallerySection({ trimIndex, trimName }: { trimIndex: number, trimName: string }) {
    const { control, register, setValue, watch } = useFormContext<VehicleModelFormData>();

    const model3D = watch(`trims.${trimIndex}.model_3d`);
    const file3dInputRef = useRef<HTMLInputElement>(null);

    const { fields, append, remove } = useFieldArray({
        control,
        name: `trims.${trimIndex}.images`
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
                url: URL.createObjectURL(file), // Mock preview URL
                type: 'gallery',
                sort_order: fields.length + idx,
                rawFile: file
            });
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handle3DFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setValue(`trims.${trimIndex}.model_3d` as any, {
                id: crypto.randomUUID(),
                file_url: URL.createObjectURL(file),
                file_size_mb: parseFloat((file.size / (1024 * 1024)).toFixed(2)),
                format: file.name.toLowerCase().endsWith('.gltf') ? 'gltf' : 'glb',
                draco_compressed: true,
                rawFile: file
            }, { shouldValidate: true });
        }
    };

    const trigger3DFileInput = () => {
        file3dInputRef.current?.click();
    };

    const remove3DModel = () => {
        // @ts-ignore
        setValue(`trims.${trimIndex}.model_3d`, undefined, { shouldValidate: true });
    };

    return (
        <div className="bg-[#1e293b]/30 p-5 rounded-xl border border-slate-700/50 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b -mx-5 px-5 pb-3 border-slate-800">
                <h4 className="text-[13px] font-bold text-cyan-400">Versión: <span className="text-white">{trimName || `V${trimIndex + 1}`}</span></h4>
            </div>

            {/* Subida de Imágenes */}
            <div className="flex flex-col gap-4">
                <div
                    className="w-full border-2 border-dashed border-slate-700/60 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 transition-colors flex flex-col items-center justify-center py-10 gap-3 cursor-pointer group"
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

                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:bg-slate-800 shadow-md">
                        <UploadCloud size={24} />
                    </div>
                    <div className="text-center mt-1 pointer-events-none">
                        <p className="text-sm font-semibold text-slate-300">Arrastra imágenes o haz clic aquí</p>
                        <p className="text-[11px] text-slate-500 mt-1">PNG, JPG, WEBP hasta 5MB c/u &middot; Max 20 imágenes</p>
                    </div>
                </div>

                {/* Lista de Imágenes */}
                {fields.length > 0 && (
                    <div className="flex flex-col gap-3 mt-2">
                        <h5 className="text-xs font-semibold text-slate-400">Subidas ({fields.length}/20)</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                                    <div className="relative w-24 h-20 rounded-md overflow-hidden bg-slate-950 shrink-0">
                                        <Image
                                            src={field.url}
                                            alt="Preview"
                                            fill
                                            sizes="(max-width: 640px) 100px, 100px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center gap-2">
                                        <select
                                            {...register(`trims.${trimIndex}.images.${index}.type`)}
                                            className="w-full bg-[#0f172a]/60 border border-slate-700 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 appearance-none"
                                        >
                                            <option value="gallery">Galería</option>
                                            <option value="hero">Hero (Principal)</option>
                                            <option value="exterior">Exterior</option>
                                            <option value="interior">Interior</option>
                                            <option value="panoramic">Vista 360°</option>
                                        </select>
                                        <input
                                            type="text"
                                            {...register(`trims.${trimIndex}.images.${index}.alt_text`)}
                                            placeholder="Texto Alt (Opcional)"
                                            className="w-full bg-[#0f172a]/60 border border-slate-700 rounded-md px-2 py-1 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                                        />
                                    </div>
                                    <button
                                        onClick={() => remove(index)}
                                        className="text-slate-500 hover:text-red-400 self-center transition-colors px-1"
                                        title="Eliminar"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modelo 3D */}
            <div className="border-t border-slate-800 pt-5 mt-2">
                <h5 className="text-xs font-semibold text-slate-400 mb-3">Modelo 3D Tridimensional</h5>
                {model3D ? (
                    <div className="flex items-center justify-between bg-emerald-950/20 border border-emerald-900/50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-md font-bold text-[10px] uppercase">
                                {model3D.format}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-emerald-400">Archivo Creado e Integrado</span>
                                <span className="text-[10px] text-emerald-500/70">{model3D.file_size_mb} MB &middot; Optimizador Activo</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={remove3DModel}
                            className="text-slate-500 hover:text-red-400 px-2 transition-colors"
                            title="Eliminar 3D"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ) : (
                    <div
                        className="w-full border border-dashed border-slate-700 hover:border-cyan-700/50 rounded-lg bg-slate-900/20 hover:bg-slate-900/40 py-5 text-center transition-colors cursor-pointer"
                        onClick={trigger3DFileInput}
                    >
                        <input
                            type="file"
                            ref={file3dInputRef}
                            className="hidden"
                            accept=".glb"
                            onChange={handle3DFileChange}
                        />
                        <span className="text-xs font-semibold text-slate-300 border border-slate-600 px-3 py-1.5 rounded-md hover:bg-slate-800 pointer-events-none">
                            Seleccionar Archivo .GLB
                        </span>
                        <p className="text-[10px] text-slate-500 mt-2">El tamaño máximo admitido es 15MB. Solo formato .glb</p>
                    </div>
                )}
            </div>
            
        </div>
    );
}
