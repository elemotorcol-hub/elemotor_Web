'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, UploadCloud, Loader2 } from 'lucide-react';
import { Brand } from '@/types/inventory';
import { brandSchema, BrandFormData } from '@/schemas/inventorySchema';
import { useBrands } from '@/hooks/useBrands';
import { uploadService } from '@/services/upload.service';

interface BrandSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'add' | 'edit';
    initialData?: Brand | null;
    onSuccess?: () => void;
}

export default function BrandSlideOver({ isOpen, onClose, mode, initialData, onSuccess }: BrandSlideOverProps) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, touchedFields }
    } = useForm<BrandFormData>({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            name: '',
            slug: '',
            country: '',
            active: true,
            logo_url: '',
        }
    });

    useEffect(() => {
        if (isOpen && initialData) {
            reset({
                id: initialData.id,
                name: initialData.name,
                slug: initialData.slug,
                country: initialData.country || '',
                active: initialData.active,
                logo_url: initialData.logo_url || '',
            });
            setPreviewUrl(initialData.logo_url || null);
            setSelectedFile(null);
        } else if (isOpen) {
            reset({
                name: '',
                slug: '',
                country: '',
                active: true,
                logo_url: '',
            });
            setPreviewUrl(null);
            setSelectedFile(null);
        }
    }, [isOpen, initialData, reset]);

    const name = watch('name');
    useEffect(() => {
        if (name && !touchedFields.slug && mode === 'add') {
            const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            setValue('slug', generatedSlug, { shouldValidate: true });
        }
    }, [name, setValue, touchedFields.slug, mode]);

    const { createBrand, updateBrand, isLoading } = useBrands();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        
        if (fileInputRef.current) fileInputRef.current.value = '';
    };



    const onSubmit = async (data: BrandFormData) => {
        try {
            setIsUploading(true);
            let finalLogoUrl = data.logo_url;

            if (selectedFile) {
                try {
                    const result = await uploadService.uploadImage(selectedFile);
                    finalLogoUrl = result.publicUrl;
                    setValue('logo_url', finalLogoUrl || '', { shouldValidate: true });
                } catch (error: any) {
                    alert(`Error subiendo la imagen: ${error.message}`);
                    setIsUploading(false);
                    return;
                }
            }

            const payload: any = {
                name: data.name,
                slug: data.slug,
                country: data.country || undefined,
                active: data.active,
                logoUrl: finalLogoUrl || undefined
            };

            let res;
            if (mode === 'add') {
                res = await createBrand(payload);
            } else {
                res = await updateBrand(String(data.id), payload);
            }
            
            if (res.success) {
                if (onSuccess) onSuccess();
                onClose();
            } else {
                alert(`Error: ${res.error}`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-[#0A110F] border-l border-slate-800 h-full flex flex-col shadow-2xl transform transition-transform duration-300">
                <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-100">
                            {mode === 'add' ? 'Nueva Marca' : 'Editar Marca'}
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">
                            {mode === 'add' ? 'Agrega una nueva marca al catálogo' : 'Modifica los detalles de la marca'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <form id="brand-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

                        {/* Logo Upload Mockup */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-300">Logotipo</label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`w-full h-32 border-2 border-dashed ${errors.logo_url ? 'border-red-500' : 'border-slate-700/60'} rounded-xl bg-slate-900/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-900/50 transition-colors group relative overflow-hidden`}
                            >
                                {isUploading ? (
                                    <div className="flex flex-col items-center gap-2 z-10">
                                        <Loader2 className="animate-spin text-cyan-400" size={24} />
                                        <span className="text-xs text-slate-400">Subiendo imagen...</span>
                                    </div>
                                ) : (
                                    <>
                                        {previewUrl ? (
                                            <div className="absolute inset-0 w-full h-full group/img bg-slate-900 z-20 flex items-center justify-center">
                                                <img src={previewUrl} className="w-full h-full object-contain p-2" alt="preview" />
                                                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer backdrop-blur-[2px]">
                                                    <UploadCloud size={24} className="mb-2" />
                                                    <span className="text-xs font-bold">Cambiar logotipo</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="p-2 bg-slate-800 rounded-full text-slate-400 group-hover:text-cyan-400 transition-colors z-10">
                                                    <UploadCloud size={20} />
                                                </div>
                                                <span className="text-xs text-slate-400 font-medium z-10">Subir imagen PNG/SVG transparente</span>
                                            </>
                                        )}
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    ref={fileInputRef} 
                                    accept="image/*" 
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-300">Nombre de la Marca</label>
                            <input
                                type="text"
                                {...register('name')}
                                placeholder="e.g. Elemotor"
                                className={`w-full bg-[#0f172a]/40 border ${errors.name ? 'border-red-500' : 'border-[#1e293b]'} rounded-lg px-4 py-3 text-[14px] font-medium text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] transition-all`}
                            />
                            {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-300">Slug</label>
                            <input
                                type="text"
                                {...register('slug')}
                                placeholder="e.g. elemotor"
                                className={`w-full bg-[#0f172a]/40 border ${errors.slug ? 'border-red-500' : 'border-[#1e293b]'} rounded-lg px-4 py-3 text-[14px] font-medium text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] transition-all`}
                            />
                            {errors.slug && <span className="text-red-500 text-xs mt-1">{errors.slug.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-300">País de Origen</label>
                            <input
                                type="text"
                                {...register('country')}
                                placeholder="e.g. China"
                                className={`w-full bg-[#0f172a]/40 border ${errors.country ? 'border-red-500' : 'border-[#1e293b]'} rounded-lg px-4 py-3 text-[14px] font-medium text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] transition-all`}
                            />
                        </div>

                    </form>
                </div>

                <div className="p-6 border-t border-slate-800 bg-slate-900/80 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="brand-form"
                        disabled={isLoading || isUploading}
                        className="flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-[#0A110F] px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-[#10B981]/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} strokeWidth={2.5} />}
                        <span>{isLoading ? 'Guardando...' : 'Guardar Marca'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
