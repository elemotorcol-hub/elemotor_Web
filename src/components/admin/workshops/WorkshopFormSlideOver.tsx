'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Search, MapPin, Map as MapIcon, Clock, CheckSquare, Image as ImageIcon, Save, CheckCircle2 } from 'lucide-react';
import { Workshop } from '@/mocks/workshopsData';
import LocationPicker from './LocationPicker';
import ScheduleGrid, { defaultSchedule, DaySchedule } from './ScheduleGrid';
import ServicesChecklist from './ServicesChecklist';
import ImageUploader from './ImageUploader';

// 1. DTO y Esquemas de Validación usando Zod
const scheduleSchema = z.object({
    day: z.string(),
    label: z.string(),
    isOpen: z.boolean(),
    openTime: z.string(),
    closeTime: z.string()
});

const workshopSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    phone: z.string().min(7, "El teléfono debe ser válido"),
    description: z.string().optional(),
    whatsapp: z.boolean(),
    isVerified: z.boolean(),
    status: z.enum(['active', 'inactive']),
    address: z.string().min(5, "Dirección requerida"),
    city: z.string().min(1, "Ciudad requerida"),
    location: z.object({
        lat: z.number(),
        lng: z.number()
    }),
    schedule: z.array(scheduleSchema),
    services: z.array(z.string()),
    amenities: z.array(z.string()),
    images: z.array(z.string())
});

type WorkshopDTO = z.infer<typeof workshopSchema>;

interface WorkshopFormSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    workshopToEdit: Workshop | null;
}

export default function WorkshopFormSlideOver({ isOpen, onClose, workshopToEdit }: WorkshopFormSlideOverProps) {
    const isEditing = !!workshopToEdit;
    const [activeTab, setActiveTab] = useState<'info' | 'location' | 'schedule' | 'services' | 'images'>('info');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // 2. Controladores robustos con React-Hook-Form
    const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<WorkshopDTO>({
        resolver: zodResolver(workshopSchema),
        defaultValues: {
            name: '',
            phone: '',
            description: '',
            whatsapp: false,
            isVerified: false,
            status: 'active',
            address: '',
            city: 'Bogotá',
            location: { lat: 4.6097, lng: -74.0817 },
            schedule: defaultSchedule,
            services: [],
            amenities: [],
            images: []
        }
    });

    // 3. Elevación de validez para deshabilitar botón principal
    const currentSchedule = watch('schedule');
    const hasInvalidSchedule = currentSchedule?.some(day => {
        if (!day.isOpen) return false;
        if (!day.openTime || !day.closeTime) return false;
        const [openH, openM] = day.openTime.split(':').map(Number);
        const [closeH, closeM] = day.closeTime.split(':').map(Number);
        return (openH * 60 + openM) >= (closeH * 60 + closeM);
    });

    useEffect(() => {
        if (isOpen) {
            if (workshopToEdit) {
                reset({
                    name: workshopToEdit.name,
                    phone: workshopToEdit.phone,
                    description: workshopToEdit.description,
                    whatsapp: workshopToEdit.whatsapp,
                    isVerified: workshopToEdit.isVerified,
                    status: workshopToEdit.status,
                    address: workshopToEdit.address,
                    city: workshopToEdit.city,
                    location: workshopToEdit.location || { lat: 4.6097, lng: -74.0817 },
                    schedule: defaultSchedule, // Map real schedule data here
                    services: workshopToEdit.services?.map(s => s.id) || [],
                    amenities: workshopToEdit.amenities || [],
                    images: workshopToEdit.images || []
                });
            } else {
                reset({
                    name: '',
                    phone: '',
                    description: '',
                    whatsapp: false,
                    isVerified: false,
                    status: 'active',
                    address: '',
                    city: 'Bogotá',
                    location: { lat: 4.6097, lng: -74.0817 },
                    schedule: defaultSchedule,
                    services: [],
                    amenities: [],
                    images: []
                });
            }
            setActiveTab('info');
            setSaveSuccess(false);
        }
    }, [isOpen, workshopToEdit, reset]);

    if (!isOpen) return null;

    const onSubmit = (data: WorkshopDTO) => {
        setIsSaving(true);
        console.log("Datos validados a enviar al Backend:", data);
        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1000);
        }, 1500);
    };

    const tabs = [
        { id: 'info', name: 'Info. Básica', icon: Search },
        { id: 'location', name: 'Ubicación', icon: MapIcon },
        { id: 'schedule', name: 'Horarios', icon: Clock },
        { id: 'services', name: 'Servicios', icon: CheckSquare },
        { id: 'images', name: 'Fotos', icon: ImageIcon },
    ] as const;

    return (
        <>
            <div 
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" 
                onClick={onClose} 
            />
            <div className="fixed inset-y-0 right-0 w-full md:w-[600px] lg:w-[700px] bg-slate-950 border-l border-white/10 z-50 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
                
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#15201D]">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {isEditing ? 'Editar Taller Aliado' : 'Registrar Nuevo Taller'}
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">
                            {isEditing ? `Modificando: ${watch('name')}` : 'Completa la información para agregar al ecosistema.'}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 border-b border-white/5 bg-[#15201D]">
                    <div className="flex gap-6 overflow-x-auto no-scrollbar">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const hasError = (tab.id === 'info' && (errors.name || errors.phone)) ||
                                           (tab.id === 'location' && (errors.address || errors.city));
                            
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                        activeTab === tab.id 
                                        ? 'border-[#10B981] text-[#10B981]' 
                                        : hasError ? 'border-transparent text-red-500 hover:text-red-400' 
                                        : 'border-transparent text-slate-400 hover:text-slate-300'
                                    }`}
                                >
                                    <Icon size={16} />
                                    {tab.name}
                                    {hasError && <div className="w-2 h-2 rounded-full bg-red-500" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <form id="workshop-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0f172a]">
                    
                    {activeTab === 'info' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                                <div>
                                    <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                                        <CheckCircle2 size={16} /> Emblema de Taller Verificado
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">Muestra un badge oficial en el portal de clientes.</p>
                                </div>
                                <Controller
                                    name="isVerified"
                                    control={control}
                                    render={({ field }) => (
                                        <button 
                                            type="button"
                                            onClick={() => field.onChange(!field.value)}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                field.value ? 'bg-[#10B981]' : 'bg-slate-700'
                                            }`}
                                        >
                                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                field.value ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                        </button>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-300 ml-1">Nombre del Taller</label>
                                    <input
                                        type="text"
                                        {...register('name')}
                                        className={`w-full mt-1.5 bg-slate-900 border rounded-xl py-2.5 px-4 text-slate-200 focus:outline-none focus:ring-1 transition-all ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-800 focus:ring-[#10B981] focus:border-[#10B981]'}`}
                                        placeholder="Ej: AutoVolt Center"
                                    />
                                    {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 ml-1">Teléfono</label>
                                        <input
                                            type="text"
                                            {...register('phone')}
                                            className={`w-full mt-1.5 bg-slate-900 border rounded-xl py-2.5 px-4 text-slate-200 focus:outline-none focus:ring-1 transition-all ${errors.phone ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-800 focus:ring-[#10B981] focus:border-[#10B981]'}`}
                                            placeholder="+57 320..."
                                        />
                                        {errors.phone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.phone.message}</p>}
                                    </div>
                                    <div className="flex flex-col justify-center pb-1">
                                        <Controller
                                            name="whatsapp"
                                            control={control}
                                            render={({ field }) => (
                                                <label className="flex items-center gap-3 cursor-pointer group mt-6">
                                                    <div className="relative flex items-center justify-center">
                                                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${field.value ? 'bg-[#10B981] border-[#10B981]' : 'bg-slate-900 border-slate-700 group-hover:border-[#10B981]'}`}>
                                                            {field.value && <CheckCircle2 size={14} className="text-slate-950" />}
                                                        </div>
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only"
                                                            checked={field.value}
                                                            onChange={(e) => field.onChange(e.target.checked)}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors select-none">Mostrar botón de WhatsApp</span>
                                                </label>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-300 ml-1">Descripción Pública</label>
                                    <textarea
                                        {...register('description')}
                                        className="w-full mt-1.5 bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all resize-none min-h-[120px]"
                                        placeholder="Describe la experiencia y certificación del taller..."
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-300 ml-1">Estado Operativo</label>
                                    <select
                                        {...register('status')}
                                        className="w-full mt-1.5 bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-slate-200 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all cursor-pointer"
                                    >
                                        <option value="active">Activo (Visible para clientes)</option>
                                        <option value="inactive">Inactivo (Oculto temporalmente)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'location' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <Controller
                                name="location"
                                control={control}
                                render={({ field }) => (
                                    <LocationPicker 
                                        initialLat={field.value.lat} 
                                        initialLng={field.value.lng} 
                                        onChange={(lat, lng) => field.onChange({ lat, lng })}
                                    />
                                )}
                            />
                            
                            <div className="w-full space-y-4 mt-8 border-t border-white/5 pt-6 text-left">
                                <div>
                                    <label className="text-sm font-medium text-slate-300 ml-1">Dirección Completa</label>
                                    <input
                                        type="text"
                                        {...register('address')}
                                        className={`w-full mt-1.5 bg-slate-900 border rounded-xl py-2.5 px-4 text-slate-200 focus:outline-none focus:ring-1 transition-all ${errors.address ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-800 focus:ring-[#10B981] focus:border-[#10B981]'}`}
                                        placeholder="Av. Carrera 15 #123-45"
                                    />
                                    {errors.address && <p className="text-xs text-red-500 mt-1 ml-1">{errors.address.message}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-300 ml-1">Ciudad / Municipio</label>
                                    <select
                                        {...register('city')}
                                        className="w-full mt-1.5 bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-slate-200 focus:outline-none focus:border-[#10B981] transition-all cursor-pointer"
                                    >
                                        <option value="Bogotá">Bogotá</option>
                                        <option value="Medellín">Medellín</option>
                                        <option value="Cali">Cali</option>
                                        <option value="Barranquilla">Barranquilla</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'schedule' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <Controller
                                name="schedule"
                                control={control}
                                render={({ field }) => (
                                    <ScheduleGrid 
                                        schedule={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    )}

                    {activeTab === 'services' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <Controller
                                name="services"
                                control={control}
                                render={({ field: servicesField }) => (
                                    <Controller
                                        name="amenities"
                                        control={control}
                                        render={({ field: amenitiesField }) => (
                                            <ServicesChecklist 
                                                selectedServices={servicesField.value}
                                                selectedAmenities={amenitiesField.value}
                                                onServicesChange={servicesField.onChange}
                                                onAmenitiesChange={amenitiesField.onChange}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </div>
                    )}

                    {activeTab === 'images' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <Controller
                                name="images"
                                control={control}
                                render={({ field }) => (
                                    <ImageUploader 
                                        images={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    )}

                </form>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 bg-[#15201D] flex gap-3">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        form="workshop-form"
                        disabled={isSaving || saveSuccess || hasInvalidSchedule}
                        className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                            saveSuccess 
                            ? 'bg-emerald-500 text-white' 
                            : hasInvalidSchedule
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            : 'bg-[#10B981] hover:bg-[#059669] text-white'
                        }`}
                        title={hasInvalidSchedule ? 'Corrige los errores en los horarios antes de guardar' : ''}
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : saveSuccess ? (
                            <>
                                <CheckCircle2 size={18} />
                                Guardado
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                {isEditing ? 'Guardar Cambios' : 'Registrar Taller'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
