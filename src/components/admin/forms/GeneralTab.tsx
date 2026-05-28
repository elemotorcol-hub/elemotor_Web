import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { VehicleModelFormData } from '@/schemas/inventorySchema';
import { brandService } from '@/services/brand.service';
import { uploadService } from '@/services/upload.service';
import { Brand } from '@/types/inventory';
import { FileText, Upload, X, Loader2 } from 'lucide-react';

export default function GeneralTab({ mode }: { mode?: 'add' | 'edit' }) {
    const { register, watch, setValue, formState: { errors, touchedFields } } = useFormContext<VehicleModelFormData>();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [datasheetUploading, setDatasheetUploading] = useState(false);
    const [datasheetError, setDatasheetError] = useState<string | null>(null);
    const datasheetInputRef = useRef<HTMLInputElement>(null);
    const datasheet = watch('datasheet');

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await brandService.getBrands({ limit: '100' });
                if (response?.data) {
                    setBrands(response.data);
                }
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        };
        fetchBrands();
    }, []);

    // Auto-generate slug when name changes, if string hasn't been manually touched
    const name = watch('name');
    React.useEffect(() => {
        if (name && !touchedFields.slug) {
            const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            setValue('slug', generatedSlug, { shouldValidate: true });
        }
    }, [name, setValue, touchedFields.slug]);

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-slate-300">Nombre del Modelo</label>
                    <input
                        type="text"
                        {...register('name')}
                        placeholder="e.g. Elemotor X5"
                        className={`w-full bg-[#0f172a]/40 border ${errors.name ? 'border-red-500' : 'border-[#1e293b]'} rounded-lg px-4 py-3 text-[14px] font-medium text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] transition-all focus:shadow-[0_0_10px_rgba(16,185,129,0.1)]`}
                    />
                    {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-slate-300">Marca</label>
                    <div className="relative">
                        <select
                            {...register('brand_id')}
                            className={`w-full bg-[#0f172a]/40 border ${errors.brand_id ? 'border-red-500' : 'border-[#1e293b]'} rounded-lg px-4 py-3 text-[14px] font-medium text-white focus:outline-none focus:border-[#10B981] transition-all appearance-none cursor-pointer`}
                        >
                            <option value="">Selecciona una marca</option>
                            {brands.map(brand => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    {errors.brand_id && <span className="text-red-500 text-xs mt-1">{errors.brand_id.message}</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-slate-300">Slug</label>
                    <input
                        type="text"
                        {...register('slug')}
                        placeholder="e.g. elemotor-x5"
                        className={`w-full bg-[#0f172a]/40 border ${errors.slug ? 'border-red-500' : 'border-[#1e293b]'} rounded-lg px-4 py-3 text-[14px] font-medium text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] transition-all`}
                    />
                    {errors.slug && <span className="text-red-500 text-xs mt-1">{errors.slug.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-slate-300">Tipo de Vehículo</label>
                    <div className="relative">
                        <select
                            {...register('type')}
                            className={`w-full bg-[#0f172a]/40 border ${errors.type ? 'border-red-500' : 'border-[#1e293b]'} rounded-lg px-4 py-3 text-[14px] font-medium text-white focus:outline-none focus:border-[#10B981] transition-all appearance-none cursor-pointer`}
                        >
                            <option value="suv">SUV</option>
                            <option value="sedan">Sedán</option>
                            <option value="hatchback">Hatchback</option>
                            <option value="pickup">Pickup</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    {errors.type && <span className="text-red-500 text-xs mt-1">{errors.type.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-slate-300">Año</label>
                    <input
                        type="number"
                        {...register('year', { valueAsNumber: true })}
                        placeholder="2025"
                        onKeyDown={(e) => {
                            if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                        }}
                        className={`w-full bg-[#0f172a]/40 border ${errors.year ? 'border-red-500' : 'border-[#1e293b]'} rounded-lg px-4 py-3 text-[14px] font-medium text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] transition-all`}
                    />
                    {errors.year && <span className="text-red-500 text-xs mt-1">{errors.year.message}</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-[#10B981]">Precio Base (USD)</label>
                    <input
                        type="number"
                        {...register('basePrice', { valueAsNumber: true })}
                        placeholder="e.g. 45000"
                        onKeyDown={(e) => {
                            if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                        }}
                        className={`w-full bg-[#0f172a]/40 border ${errors.basePrice ? 'border-red-500' : 'border-[#1e293b]'} rounded-lg px-4 py-3 text-[14px] font-medium text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] transition-all`}
                    />
                    {errors.basePrice && <span className="text-red-500 text-xs mt-1">{errors.basePrice.message}</span>}
                </div>
                {mode !== 'edit' && (
                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-bold text-slate-300">Estado Inicial</label>
                        <div className="relative">
                            <select
                                {...register('status')}
                                className={`w-full bg-[#0f172a]/40 border ${errors.status ? 'border-red-500' : 'border-[#1e293b]'} rounded-lg pl-4 pr-10 py-3 text-[14px] font-medium text-white focus:outline-none focus:border-[#10B981] transition-all appearance-none cursor-pointer`}
                            >
                                <option value="Draft">Borrador</option>
                                <option value="Active">Activo</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                        {errors.status && <span className="text-red-500 text-xs mt-1">{errors.status.message}</span>}
                    </div>
                )}
            </div>

            {/* Destacado toggle */}
            <div className="flex items-center justify-between bg-[#0f172a]/40 border border-[#1e293b] rounded-lg px-4 py-3">
                <div>
                    <p className="text-[13px] font-bold text-slate-300">Modelo Destacado</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Aparece en la sección "Modelos Destacados" de la página principal</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                    <input type="checkbox" {...register('featured')} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]" />
                </label>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-slate-300">Descripción</label>
                <textarea
                    {...register('description')}
                    placeholder="Describe el modelo del vehículo, sus características principales, público objetivo y propuesta de valor..."
                    className={`w-full bg-[#0f172a]/40 border ${errors.description ? 'border-red-500' : 'border-[#1e293b]'} rounded-lg px-4 py-3 text-[14px] font-medium text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] transition-all min-h-[140px] resize-y`}
                />
                {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>}
            </div>

            {/* Ficha técnica (PDF) */}
            <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-slate-300">Ficha Técnica (PDF)</label>
                {datasheet?.file_url && !datasheet._deleted ? (
                    <div className="flex items-center gap-3 bg-[#0f172a]/40 border border-[#10B981]/40 rounded-lg px-4 py-3">
                        <FileText className="w-5 h-5 text-[#10B981] shrink-0" />
                        <a
                            href={datasheet.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] text-[#10B981] hover:underline truncate flex-1"
                        >
                            Ver ficha técnica
                        </a>
                        {datasheet.file_size_mb && (
                            <span className="text-[11px] text-slate-500 shrink-0">
                                {(datasheet.file_size_mb).toFixed(1)} MB
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => setValue('datasheet', { ...datasheet, file_url: datasheet!.file_url, _deleted: true })}
                            className="text-slate-500 hover:text-red-400 transition-colors shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : datasheetUploading ? (
                    <div className="flex items-center gap-3 bg-[#0f172a]/40 border border-dashed border-[#10B981]/40 rounded-lg px-4 py-4">
                        <Loader2 className="w-5 h-5 text-[#10B981] animate-spin shrink-0" />
                        <span className="text-[13px] text-slate-400">Subiendo PDF...</span>
                    </div>
                ) : (
                    <div
                        onClick={() => datasheetInputRef.current?.click()}
                        className="flex items-center gap-3 bg-[#0f172a]/40 border border-dashed border-[#1e293b] hover:border-[#10B981]/50 rounded-lg px-4 py-4 cursor-pointer transition-all group"
                    >
                        <Upload className="w-5 h-5 text-slate-600 group-hover:text-[#10B981] transition-colors shrink-0" />
                        <span className="text-[13px] text-slate-600 group-hover:text-slate-400 transition-colors">
                            Haz clic para subir la ficha técnica en PDF (máx. 10 MB)
                        </span>
                    </div>
                )}
                {datasheetError && (
                    <p className="text-red-400 text-[12px]">{datasheetError}</p>
                )}
                <input
                    ref={datasheetInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        e.target.value = '';
                        setDatasheetError(null);
                        setDatasheetUploading(true);
                        try {
                            const result = await uploadService.uploadFile(file, 'document');
                            setValue('datasheet', {
                                file_url: result.publicUrl,
                                public_id: result.publicId,
                                file_size_mb: file.size / (1024 * 1024),
                            });
                        } catch (err: any) {
                            setDatasheetError('Error al subir el PDF. Intenta de nuevo.');
                        } finally {
                            setDatasheetUploading(false);
                        }
                    }}
                />
            </div>
        </div>
    );
}
