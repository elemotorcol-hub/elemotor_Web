import React from 'react';
import { useFormContext } from 'react-hook-form';
import { VehicleModelFormData } from '@/schemas/inventorySchema';

export default function GeneralTab() {
    const { register, watch, setValue, formState: { errors, touchedFields } } = useFormContext<VehicleModelFormData>();

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
                            <option value="b1">Deepal</option>
                            <option value="b2">Elemotor</option>
                            <option value="b3">Avatr</option>
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
                            <option value="van">Van</option>
                            <option value="coupe">Coupé</option>
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
                        {...register('year')}
                        placeholder="2025"
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
                        {...register('basePrice')}
                        placeholder="e.g. 45000"
                        className={`w-full bg-[#0f172a]/40 border ${errors.basePrice ? 'border-red-500' : 'border-[#1e293b]'} rounded-lg px-4 py-3 text-[14px] font-medium text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] transition-all`}
                    />
                    {errors.basePrice && <span className="text-red-500 text-xs mt-1">{errors.basePrice.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-slate-300">Estado</label>
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
        </div>
    );
}
