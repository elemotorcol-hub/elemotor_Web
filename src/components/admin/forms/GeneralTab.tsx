import React from 'react';
import { VehicleModel } from '@/types/inventory';

interface GeneralTabProps {
    initialData?: VehicleModel | null;
}

export default function GeneralTab({ initialData }: GeneralTabProps) {
    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Model Name</label>
                    <input
                        type="text"
                        defaultValue={initialData?.name || ''}
                        placeholder="e.g. Elemotor X5"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Brand</label>
                    <input
                        type="text"
                        defaultValue={initialData?.brand || ''}
                        placeholder="e.g. Elemotor"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Base Price (USD)</label>
                    <input
                        type="text"
                        defaultValue={initialData?.basePrice || ''}
                        placeholder="e.g. 45000"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Status</label>
                    <div className="relative">
                        <select
                            defaultValue={initialData?.status || 'Draft'}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Active">Active</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Description</label>
                <textarea
                    defaultValue={initialData?.description || ''}
                    placeholder="Describe the vehicle model, its key features, target audience, and unique selling points..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all min-h-[120px] resize-y"
                />
            </div>
        </div>
    );
}
