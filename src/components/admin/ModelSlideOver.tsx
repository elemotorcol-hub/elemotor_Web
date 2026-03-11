'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleModelSchema, VehicleModelFormData } from '@/schemas/inventorySchema';
import { X, Loader2 } from 'lucide-react';
import { VehicleModel } from '@/types/inventory';
import { modelService } from '@/services/model.service';
import { trimService } from '@/services/trim.service';
import { uploadService } from '@/services/upload.service';
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const methods = useForm<VehicleModelFormData>({
        // @ts-ignore - Ignorar incompatibilidad entre zod coerce y hookform strict types
        resolver: zodResolver(vehicleModelSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            brand_id: '',
            slug: '',
            type: 'suv',
            year: new Date().getFullYear(),
            basePrice: 0,
            status: 'Draft',
            featured: false,
            active: true,
            description: '',
            thumbnail: '',
            trims: []
        },
    });

    React.useEffect(() => {
        if (isOpen) {
            methods.reset(initialData || {
                name: '',
                brand_id: '',
                slug: '',
                type: 'suv',
                year: new Date().getFullYear(),
                basePrice: 0,
                status: 'Draft',
                featured: false,
                active: true,
                description: '',
                thumbnail: '',
                trims: []
            });
        }
    }, [isOpen, initialData, methods]);

    const onSubmit = async (data: VehicleModelFormData) => {
        setIsSubmitting(true);
        setErrorMsg(null);
        try {
            console.log('Model data ready for API:', data);

            // Función para formatear el tipo de modelo al enum de Prisma
            const formatModelType = (type: string) => {
                const map: Record<string, string> = {
                    'suv': 'SUV',
                    'sedan': 'Sedan',
                    'hatchback': 'Hatchback',
                    'pickup': 'Pickup',
                    'van': 'SUV', // Fallback as Prisma enum doesn't support Van yet
                    'coupe': 'Sedan' // Fallback
                };
                return map[type.toLowerCase()] || 'SUV';
            };

            // 1. Crear Modelo
            const modelPayload = {
                brandId: Number(data.brand_id),
                name: data.name,
                slug: data.slug,
                type: formatModelType(data.type),
                year: Number(data.year),
                description: data.description || undefined,
                basePrice: Number(data.basePrice) || 0,
                featured: data.featured,
                active: data.status === 'Active'
            };

            const createdModel = await modelService.createModel(modelPayload);
            const modelId = createdModel.id;

            // 2. Iterar Trims
            for (const [index, trim] of data.trims.entries()) {
                // a. Crear Trim
                const trimPayload = {
                    modelId,
                    name: trim.name,
                    price: Number(trim.price),
                    availableQuantity: Number(trim.available_quantity),
                    status: trim.status,
                    active: trim.active
                };
                const createdTrim = await trimService.createTrim(trimPayload);
                const trimId = createdTrim.id;

                // b. Crear Specs
                const specPayload = {
                    trimId,
                    batteryKwh: Number(trim.specs.battery_kwh) || undefined,
                    rangeCltcKm: Number(trim.specs.range_cltc_km) || undefined,
                    rangeWltpKm: Number(trim.specs.range_wltp_km) || undefined,
                    horsepower: Number(trim.specs.horsepower) || undefined,
                    torque: Number(trim.specs.torque) || undefined,
                    zeroTo100: Number(trim.specs.zero_to_100) || undefined,
                    topSpeed: Number(trim.specs.top_speed) || undefined,
                    chargeTime3080: trim.specs.charge_time_30_80 || undefined,
                    trunkLiters: Number(trim.specs.trunk_liters) || undefined,
                    lengthMm: Number(trim.specs.length_mm) || undefined,
                    widthMm: Number(trim.specs.width_mm) || undefined,
                    heightMm: Number(trim.specs.height_mm) || undefined,
                    wheelbaseMm: Number(trim.specs.wheelbase_mm) || undefined,
                    curbWeightKg: Number(trim.specs.curb_weight_kg) || undefined,
                    kwhPer100km: Number(trim.specs.kwh_per_100km) || undefined,
                    adasLevel: Number(trim.specs.adas_level) || undefined,
                    screenSize: Number(trim.specs.screen_size) || undefined,
                    softwareVersion: Number(trim.specs.software_version) || undefined,
                };
                
                // Cleanup undefined fields so backend handles nulls properly if needed
                Object.keys(specPayload).forEach(key => specPayload[key as keyof typeof specPayload] === undefined && delete specPayload[key as keyof typeof specPayload]);
                
                await trimService.createSpec(specPayload);

                // c. Subir y Crear Colores
                for (const color of trim.colors) {
                    let imageUrl = color.image_url;
                    
                    // Si hay un archivo raw, súbelo a Cloudinary
                    if (color.rawFile) {
                        const uploadRes = await uploadService.uploadImage(color.rawFile, 'elemotor/colors');
                        imageUrl = uploadRes.publicUrl;
                    }

                    const colorPayload = {
                        trimId,
                        name: color.name,
                        hexCode: color.hex_code.startsWith('#') ? color.hex_code : `#${color.hex_code}`,
                        type: color.type,
                        imageUrl: imageUrl && !imageUrl.startsWith('blob:') ? imageUrl : undefined
                    };
                    await trimService.createColor(colorPayload);
                }

                // d. Subir Imágenes a la Galería (ahora iterativo para cada trim)
                if (trim.images && trim.images.length > 0) {
                    for (const img of trim.images) {
                        if (img.rawFile) {
                            // Subir una a una para respetar los metadatos individuales
                            await uploadService.uploadTrimImages(
                                [img.rawFile],
                                trimId,
                                img.type,
                                img.alt_text,
                                img.sort_order
                            );
                        }
                    }
                }

                // e. Subir Modelo 3D (ahora iterativo para cada trim)
                if (trim.model_3d?.rawFile) {
                    await uploadService.uploadModel3d(trim.model_3d.rawFile, trimId);
                }
            }

            onClose();
        } catch (error: any) {
            console.error("Error creating model:", error);
            setErrorMsg(error.message || "Error al crear el modelo");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onError = (errors: any) => {
        console.error("Form errors:", errors);
        const errorTabs = new Set<string>();
        if (errors.name || errors.brand_id || errors.slug || errors.type || errors.year || errors.basePrice || errors.status || errors.description) {
            errorTabs.add('General');
        }
        if (errors.trims) {
            errorTabs.add('Versiones y Especificaciones');
            // Check if gallery specifically has errors deep inside the trims array
            if (Array.isArray(errors.trims)) {
                const hasGalleryError = errors.trims.some((t: any) => t?.images || t?.model_3d);
                if (hasGalleryError) errorTabs.add('Galería');
            }
        }
        if (errorTabs.size > 0) {
            setErrorMsg(`Faltan campos en: ${Array.from(errorTabs).join(', ')}`);
        } else {
            setErrorMsg("Revisa los campos con errores");
        }
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
                <form onSubmit={methods.handleSubmit(onSubmit as any, onError)} className="fixed inset-y-0 right-0 z-50 w-full md:w-[65vw] max-w-[1200px] bg-[#0A110F] shadow-2xl border-l border-slate-800/60 flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0">

                    {/* Header */}
                    <div className="shrink-0 px-8 py-6 border-b border-white/5 bg-[#0A110F] flex items-center justify-between">
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

                        <div className="flex flex-col items-end gap-1">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#10B981]/50 text-[#0A110F] px-6 py-2.5 rounded-lg font-bold transition-all text-[14px] shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                            >
                                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                                {isSubmitting ? 'Guardando...' : (mode === 'add' ? 'Crear Modelo' : 'Guardar Cambios')}
                            </button>
                            {errorMsg && <p className="text-red-400 text-xs font-semibold">{errorMsg}</p>}
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="shrink-0 px-8 border-b border-white/5 bg-[#0A110F]">
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

                    {/* Progress Indicator */}
                    <FormProgressIndicator methods={methods} activeTab={activeTab} />

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        <div className={activeTab === 'general' ? 'block' : 'hidden'}>
                            <GeneralTab />
                        </div>
                        <div className={activeTab === 'trims' ? 'block' : 'hidden'}>
                            <TrimsAndSpecsTab />
                        </div>
                        <div className={activeTab === 'gallery' ? 'block' : 'hidden'}>
                            <GalleryTab />
                        </div>
                    </div>

                </form>
            </FormProvider>
        </>
    );
}

function FormProgressIndicator({ methods, activeTab }: { methods: any; activeTab: TabType }) {
    const { formState: { errors }, watch } = methods;
    const values = watch();
    
    // Check General Tab
    const generalFields = ['brand_id', 'name', 'slug', 'type', 'year', 'basePrice', 'status'];
    const isGeneralTouchedOrFilled = generalFields.some(f => values[f] !== '' && values[f] !== undefined);
    const hasGeneralErrors = generalFields.some(f => errors[f]);
    const isGeneralComplete = generalFields.every(f => values[f] !== '' && values[f] !== undefined && values[f] !== null) && !hasGeneralErrors;

    let generalStatus = '⏳ Pendiente';
    if (isGeneralComplete) generalStatus = '✔ Completa';
    else if (hasGeneralErrors) generalStatus = '⚠ Incompleta';
    else if (isGeneralTouchedOrFilled) generalStatus = '⏳ En progreso';

    // Check Trims Tab
    const trims = values.trims || [];
    const hasTrimsErrors = !!errors.trims;
    const isTrimsComplete = trims.length > 0 && !hasTrimsErrors;
    
    let trimsStatus = '⏳ Pendiente';
    if (isTrimsComplete) trimsStatus = '✔ Completa';
    else if (hasTrimsErrors) trimsStatus = '⚠ Incompleta';
    else if (trims.length > 0) trimsStatus = '⏳ En progreso';
    
    // Check Gallery Tab
    // Check Gallery Tab (Progress based on ALL trims having at least some interaction)
    const hasGalleryErrors = Array.isArray(errors.trims) && errors.trims.some((t: any) => t?.images || t?.model_3d);
    
    // Consider gallery complete if ALL trims have at least 1 image
    const isGalleryComplete = trims.length > 0 && trims.every((t: any) => t.images && t.images.length > 0) && !hasGalleryErrors;
    // Consider in progress if AT LEAST ONE trim has an image or 3d model
    const isGalleryInProgress = trims.some((t: any) => (t.images && t.images.length > 0) || t.model_3d);

    let galleryStatus = '⏳ Pendiente';
    if (isGalleryComplete) galleryStatus = '✔ Completa';
    else if (hasGalleryErrors) galleryStatus = '⚠ Incompleta';
    else if (isGalleryInProgress) galleryStatus = '⏳ En progreso';

    return (
        <div className="shrink-0 px-8 py-3 bg-[#0f172a] border-b border-white/5 flex flex-wrap gap-4 sm:gap-8 shadow-inner">
             <div className={`flex items-center gap-2 text-[12px] font-bold tracking-wide transition-opacity ${activeTab === 'general' ? 'opacity-100' : 'opacity-70'}`}>
                 <span className={`${generalStatus.includes('✔') ? 'text-[#10B981]' : generalStatus.includes('⚠') ? 'text-amber-400' : 'text-slate-500'}`}>GENERAL:</span>
                 <span className="text-slate-300">{generalStatus}</span>
             </div>
             <div className={`flex items-center gap-2 text-[12px] font-bold tracking-wide transition-opacity ${activeTab === 'trims' ? 'opacity-100' : 'opacity-70'}`}>
                 <span className={`${trimsStatus.includes('✔') ? 'text-[#10B981]' : trimsStatus.includes('⚠') ? 'text-amber-400' : 'text-slate-500'}`}>VERSIONES:</span>
                 <span className="text-slate-300">{trimsStatus}</span>
             </div>
             <div className={`flex items-center gap-2 text-[12px] font-bold tracking-wide transition-opacity ${activeTab === 'gallery' ? 'opacity-100' : 'opacity-70'}`}>
                 <span className={`${galleryStatus.includes('✔') ? 'text-[#10B981]' : galleryStatus.includes('⚠') ? 'text-amber-400' : 'text-slate-500'}`}>GALERÍA:</span>
                 <span className="text-slate-300">{galleryStatus}</span>
             </div>
        </div>
    );
}
