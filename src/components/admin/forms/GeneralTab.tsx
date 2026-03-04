import React from 'react';
import { useFormContext } from 'react-hook-form';
import { VehicleModelFormData } from '@/schemas/inventorySchema';

export default function GeneralTab() {
    const { register, formState: { errors } } = useFormContext<VehicleModelFormData>();

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
                    <input
                        type="text"
                        {...register('brand')}
                        placeholder="e.g. Elemotor"
                        className={`w-full bg-[#0f172a]/40 border ${errors.brand ? 'border-red-500' : 'border-[#1e293b]'} rounded-lg px-4 py-3 text-[14px] font-medium text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] transition-all focus:shadow-[0_0_10px_rgba(16,185,129,0.1)]`}
                    />
                    {errors.brand && <span className="text-red-500 text-xs mt-1">{errors.brand.message}</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-[#10B981]">Precio Base (USD)</label>
                    <input
                        type="text"
                        {...register('basePrice')}
                        placeholder="e.g. 45000"
                        className={`w-full bg-[#0f172a]/40 border ${errors.basePrice ? 'border-red-500' : 'border-[#1e293b]'} rounded-lg px-4 py-3 text-[14px] font-medium text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] transition-all focus:shadow-[0_0_10px_rgba(16,185,129,0.1)]`}
                    />
                    {errors.basePrice && <span className="text-red-500 text-xs mt-1">{errors.basePrice.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-slate-300">Estado</label>
                    <div className="relative">
                        <select
                            {...register('status')}
                            className={`w-full bg-[#0f172a]/40 border ${errors.status ? 'border-red-500' : 'border-[#1e293b]'} rounded-lg pl-4 pr-10 py-3 text-[14px] font-medium text-white focus:outline-none focus:border-[#10B981] transition-all appearance-none cursor-pointer focus:shadow-[0_0_10px_rgba(16,185,129,0.1)]`}
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
                    className={`w-full bg-[#0f172a]/40 border ${errors.description ? 'border-red-500' : 'border-[#1e293b]'} rounded-lg px-4 py-3 text-[14px] font-medium text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] transition-all min-h-[140px] resize-y focus:shadow-[0_0_10px_rgba(16,185,129,0.1)]`}
                />
                {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>}
            </div>
        </div>
    );
}
