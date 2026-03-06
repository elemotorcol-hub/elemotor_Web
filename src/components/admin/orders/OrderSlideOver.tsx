'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Car, Shuffle } from 'lucide-react';
import { Order, OrderStatus } from '@/types/orders';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema, OrderFormValues } from '@/schemas/orderSchema';

interface OrderSlideOverProps {
    isOpen?: boolean; // Managed by parent rendering
    onClose: () => void;
    mode: 'add' | 'edit';
    initialData?: Order | null;
    onSave: (data: Partial<Order>) => void;
}

export default function OrderSlideOver({ onClose, mode, initialData, onSave }: OrderSlideOverProps) {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<OrderFormValues>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            trackingCode: '',
            clientName: '',
            status: 'Fabricación',
            vehicleModel: '',
            trimName: '',
            colorName: '',
            totalPrice: 0,
            estimatedDelivery: '',
            vin: '',
            notes: ''
        }
    });

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            reset(initialData);
        } else if (mode === 'add') {
            // Generate Mock Tracking Code
            const generateCode = () => `ELE-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
            setValue('trackingCode', generateCode());
        }
    }, [mode, initialData, reset, setValue]);

    const handleFormSubmit = (data: OrderFormValues) => {
        onSave(data as Partial<Order>);
    };

    const handleRegenerateCode = () => {
        const generateCode = () => `ELE-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
        setValue('trackingCode', generateCode());
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Slide-over Panel */}
            <form onSubmit={handleSubmit(handleFormSubmit)} className="fixed inset-y-0 right-0 z-50 w-full md:w-[500px] bg-[#0A110F] shadow-2xl border-l border-slate-800/60 flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0">

                {/* Header */}
                <div className="flex-shrink-0 px-8 py-6 border-b border-white/5 bg-[#0A110F] flex items-center justify-between">
                    <div className="flex items-start gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 mt-1 text-slate-500 hover:text-white transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                        <div>
                            <h2 className="text-[22px] font-bold text-white tracking-tight">
                                {mode === 'add' ? 'Registrar Pedido' : `Editar Pedido`}
                            </h2>
                            <p className="text-[13px] text-[#00D4AA] mt-1 font-mono">{watch('trackingCode') || 'Nuevo'}</p>
                        </div>
                    </div>

                    <button type="submit" className="bg-[#10B981] hover:bg-[#059669] text-[#0A110F] px-4 py-2 rounded-lg font-bold transition-all text-[13px] shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center gap-2">
                        <Save size={16} />
                        {mode === 'add' ? 'Crear' : 'Guardar'}
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">

                    {/* General Info */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-[11px] font-black tracking-widest text-[#00D4AA] uppercase mb-5 flex items-center gap-2">
                            <Car size={14} /> Información General
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2">Tracking Code</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        {...register('trackingCode')}
                                        readOnly
                                        className={`flex-1 bg-[#1e293b]/60 border rounded-lg px-4 py-2.5 text-sm text-[#00D4AA] font-mono focus:outline-none ${errors.trackingCode ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50'}`}
                                    />
                                    {mode === 'add' && (
                                        <button
                                            type="button"
                                            onClick={handleRegenerateCode}
                                            className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700/50 rounded-lg transition-colors cursor-pointer"
                                            title="Regenerar Código"
                                        >
                                            <Shuffle size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2">Cliente Asociado</label>
                                <input
                                    type="text"
                                    {...register('clientName')}
                                    placeholder="Nombre del cliente"
                                    className={`w-full bg-[#1e293b]/60 border rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${errors.clientName ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-[#00D4AA]'}`}
                                />
                                {errors.clientName && <p className="text-red-500 text-[11px] mt-1.5 font-medium">{errors.clientName.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2">Estado Inicial</label>
                                    <select
                                        {...register('status')}
                                        className="w-full bg-[#1e293b]/60 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#00D4AA] transition-colors"
                                    >
                                        <option value="Fabricación">Fabricación</option>
                                        <option value="En Puerto">En Puerto</option>
                                        <option value="En Tránsito">En Tránsito</option>
                                        <option value="Aduanas">Aduanas</option>
                                        <option value="Listo para Entrega">Listo para Entrega</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2">Fecha Estimada</label>
                                    <input
                                        type="text"
                                        {...register('estimatedDelivery')}
                                        placeholder="Ej: 15 Mar, 2026"
                                        className="w-full bg-[#1e293b]/60 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#00D4AA] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Especificaciones Logísticas */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-[11px] font-black tracking-widest text-[#00D4AA] uppercase mb-5">
                            Configuración Vehicular
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2">Modelo</label>
                                <input
                                    type="text"
                                    {...register('vehicleModel')}
                                    placeholder="Ej: Galaxy E8"
                                    className={`w-full bg-[#1e293b]/60 border rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${errors.vehicleModel ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-[#00D4AA]'}`}
                                />
                                {errors.vehicleModel && <p className="text-red-500 text-[11px] mt-1.5 font-medium">{errors.vehicleModel.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2">Versión (Trim)</label>
                                    <input
                                        type="text"
                                        {...register('trimName')}
                                        placeholder="Ej: Standard RWD"
                                        className={`w-full bg-[#1e293b]/60 border rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${errors.trimName ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-[#00D4AA]'}`}
                                    />
                                    {errors.trimName && <p className="text-red-500 text-[11px] mt-1.5 font-medium">{errors.trimName.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2">Color</label>
                                    <input
                                        type="text"
                                        {...register('colorName')}
                                        placeholder="Ej: Cosmic Black"
                                        className={`w-full bg-[#1e293b]/60 border rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none transition-colors ${errors.colorName ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-[#00D4AA]'}`}
                                    />
                                    {errors.colorName && <p className="text-red-500 text-[11px] mt-1.5 font-medium">{errors.colorName.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Finanzas y Documentos */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-[11px] font-black tracking-widest text-[#00D4AA] uppercase mb-5">
                            Facturación & Logística
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2">Precio Total (USD)</label>
                                    <input
                                        type="number"
                                        {...register('totalPrice', { valueAsNumber: true })}
                                        placeholder="0.00"
                                        className={`w-full bg-[#1e293b]/60 border rounded-lg px-4 py-2.5 text-sm text-[#10B981] font-bold focus:outline-none transition-colors ${errors.totalPrice ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-[#10B981]'}`}
                                    />
                                    {errors.totalPrice && <p className="text-red-500 text-[11px] mt-1.5 font-medium">{errors.totalPrice.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-2">VIN (Chasis)</label>
                                    <input
                                        type="text"
                                        {...register('vin')}
                                        placeholder="Dejar en blanco si no hay"
                                        className="w-full bg-[#1e293b]/60 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-[#00D4AA] transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-2">Notas / Observaciones</label>
                                <textarea
                                    {...register('notes')}
                                    rows={4}
                                    placeholder="Notas internas sobre el despacho, la aduana o el pago..."
                                    className="w-full bg-[#1e293b]/60 border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#00D4AA] transition-colors resize-none custom-scrollbar"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </>
    );
}
