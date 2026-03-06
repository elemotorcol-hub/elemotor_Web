'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, UploadCloud } from 'lucide-react';
import { Brand } from '@/types/inventory';
import { brandSchema, BrandFormData } from '@/schemas/inventorySchema';

interface BrandSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'add' | 'edit';
    initialData?: Brand | null;
}

export default function BrandSlideOver({ isOpen, onClose, mode, initialData }: BrandSlideOverProps) {
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
        } else if (isOpen) {
            reset({
                name: '',
                slug: '',
                country: '',
                active: true,
                logo_url: '',
            });
        }
    }, [isOpen, initialData, reset]);

    const name = watch('name');
    useEffect(() => {
        if (name && !touchedFields.slug && mode === 'add') {
            const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            setValue('slug', generatedSlug, { shouldValidate: true });
        }
    }, [name, setValue, touchedFields.slug, mode]);

    const onSubmit = (data: BrandFormData) => {
        console.log('Brand data ready for API:', data);
        // Dispatch to API
        onClose();
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
                            <div className="w-full h-32 border-2 border-dashed border-slate-700/60 rounded-xl bg-slate-900/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-900/50 transition-colors group relative overflow-hidden">
                                {watch('logo_url') && (
                                    <img src={watch('logo_url')} className="absolute inset-0 w-full h-full object-contain p-4 opacity-50 group-hover:opacity-20 transition-opacity" alt="preview" />
                                )}
                                <div className="p-2 bg-slate-800 rounded-full text-slate-400 group-hover:text-cyan-400 transition-colors z-10">
                                    <UploadCloud size={20} />
                                </div>
                                <span className="text-xs text-slate-400 font-medium z-10">Subir imagen PNG/SVG transparente</span>
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

                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-bold text-slate-300">Estado</label>
                            <div className="relative">
                                <select
                                    {...register('active', { setValueAs: v => String(v) === 'true' })}
                                    className={`w-full bg-[#0f172a]/40 border border-[#1e293b] rounded-lg pl-4 pr-10 py-3 text-[14px] font-medium text-white focus:outline-none focus:border-[#10B981] transition-all appearance-none cursor-pointer`}
                                >
                                    <option value="true">Activa</option>
                                    <option value="false">Inactiva</option>
                                </select>
                            </div>
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
                        className="flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-[#0A110F] px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-[#10B981]/20 active:scale-[0.98]"
                    >
                        <Save size={18} strokeWidth={2.5} />
                        <span>Guardar Marca</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
