'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleModelSchema, VehicleModelFormData } from '@/schemas/inventorySchema';
import { X } from 'lucide-react';
import { VehicleModel } from '@/types/inventory';
import GeneralTab from './forms/GeneralTab';
import TrimsAndSpecsTab from './forms/TrimsAndSpecsTab';
import GalleryTab from './forms/GalleryTab';

interface ModelSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'add' | 'edit';
    initialData?: VehicleModel | null;
}

type TabType = 'general' | 'trims' | 'gallery';

export default function ModelSlideOver({ isOpen, onClose, mode, initialData }: ModelSlideOverProps) {
    const [activeTab, setActiveTab] = useState<TabType>('general');

    const methods = useForm<VehicleModelFormData>({
        // @ts-ignore - Ignorar incompatibilidad entre zod coerce y hookform strict types
        resolver: zodResolver(vehicleModelSchema),
        defaultValues: {
            name: '',
            brand: '',
            basePrice: 0,
            status: 'Draft',
            description: '',
            thumbnail: ''
        },
    });

    React.useEffect(() => {
        if (isOpen) {
            methods.reset(initialData || {
                name: '',
                brand: '',
                basePrice: 0,
                status: 'Draft',
                description: '',
                thumbnail: ''
            });
        }
    }, [isOpen, initialData, methods]);

    const onSubmit = (data: VehicleModelFormData) => {
        // Todo: Connect with Backend / Server Action
        console.log('Form data to save:', data);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Slide-over Panel */}
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit as any)} className="fixed inset-y-0 right-0 z-50 w-full md:w-[65vw] max-w-[1200px] bg-[#0A110F] shadow-2xl border-l border-slate-800/60 flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0">

                    {/* Header */}
                    <div className="flex-shrink-0 px-8 py-6 border-b border-white/5 bg-[#0A110F] flex items-center justify-between">
                        <div className="flex items-start gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1.5 mt-1 text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div>
                                <h2 className="text-[22px] font-bold text-white tracking-tight">
                                    {mode === 'add' ? 'Añadir Nuevo Modelo' : `Editar Modelo: ${initialData?.name}`}
                                </h2>
                                {mode === 'add' ? (
                                    <p className="text-[13px] text-slate-500 mt-1 font-medium">Completa los detalles para el nuevo vehículo</p>
                                ) : (
                                    <p className="text-[13px] text-slate-500 mt-1 font-medium">Última actualización hace 2 horas</p>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="bg-[#10B981] hover:bg-[#059669] text-[#0A110F] px-6 py-2.5 rounded-lg font-bold transition-all text-[14px] shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                            {mode === 'add' ? 'Crear Modelo' : 'Guardar Cambios'}
                        </button>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex-shrink-0 px-8 border-b border-white/5 bg-[#0A110F]">
                        <div className="flex gap-8 -mb-px">
                            <button
                                type="button"
                                onClick={() => setActiveTab('general')}
                                className={`py-4 text-[13px] font-bold border-b-2 transition-all ${activeTab === 'general'
                                    ? 'border-[#10B981] text-[#10B981]'
                                    : 'border-transparent text-slate-400 hover:text-slate-300'
                                    }`}
                            >
                                General
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('trims')}
                                className={`py-4 text-[13px] font-bold border-b-2 transition-all ${activeTab === 'trims'
                                    ? 'border-[#10B981] text-[#10B981]'
                                    : 'border-transparent text-slate-400 hover:text-slate-300'
                                    }`}
                            >
                                Versiones y Especificaciones
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('gallery')}
                                className={`py-4 text-[13px] font-bold border-b-2 transition-all ${activeTab === 'gallery'
                                    ? 'border-[#10B981] text-[#10B981]'
                                    : 'border-transparent text-slate-400 hover:text-slate-300'
                                    }`}
                            >
                                Galería
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {activeTab === 'general' && <GeneralTab />}
                        {activeTab === 'trims' && <TrimsAndSpecsTab />}
                        {activeTab === 'gallery' && <GalleryTab />}
                    </div>

                </form>
            </FormProvider>
        </>
    );
}
