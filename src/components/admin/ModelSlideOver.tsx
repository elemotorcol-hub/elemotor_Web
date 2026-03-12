'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleModelSchema, VehicleModelFormData } from '@/schemas/inventorySchema';
import { X, Loader2 } from 'lucide-react';
import { VehicleModel } from '@/types/inventory';
import { modelService } from '@/services/model.service';
import { trimService } from '@/services/trim.service';
import { uploadService } from '@/services/upload.service';
import { mediaService } from '@/services/media.service';
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

/** Maps the API response (camelCase from Prisma) → VehicleModelFormData (snake_case zod schema) */
function mapApiToFormData(apiModel: any): VehicleModelFormData {
    const formatModelType = (type: string): string => {
        const map: Record<string, string> = {
            'SUV': 'suv', 'Sedan': 'sedan', 'Hatchback': 'hatchback',
            'Pickup': 'pickup', 'Van': 'van', 'Coupe': 'coupe',
        };
        return map[type] || 'suv';
    };

    return {
        id: String(apiModel.id),
        brand_id: String(apiModel.brand?.id || apiModel.brandId || ''),
        name: apiModel.name || '',
        slug: apiModel.slug || '',
        type: formatModelType(apiModel.type) as any,
        year: Number(apiModel.year) || new Date().getFullYear(),
        description: apiModel.description || '',
        basePrice: Number(apiModel.basePrice) || 0,
        featured: apiModel.featured ?? false,
        active: apiModel.active ?? true,
        status: apiModel.active ? 'Active' : 'Draft',
        thumbnail: '',
        trims: (apiModel.trims || []).map((trim: any) => ({
            id: String(trim.id),
            dbId: trim.id,
            specDbId: trim.spec?.id,
            name: trim.name || '',
            price: Number(trim.price) || 0,
            available_quantity: Number(trim.availableQuantity) || 0,
            status: trim.status || 'stock',
            active: trim.active ?? true,
            specs: mapSpecFromApi(trim.spec),
            colors: (trim.colors || []).map((c: any) => ({
                id: String(c.id),
                dbId: c.id,
                name: c.name || '',
                hex_code: c.hexCode || c.hex_code || '#000000',
                type: c.type || 'exterior',
                image_url: c.imageUrl || c.image_url || '',
            })),
            images: (trim.images || []).map((img: any) => ({
                id: String(img.id),
                dbId: img.id,
                url: img.publicUrl || img.url || '',
                alt_text: img.altText || img.alt_text || '',
                type: img.type || 'gallery',
                sort_order: img.sortOrder ?? img.sort_order ?? 0,
            })),
            model_3d: trim.model3d ? {
                id: String(trim.model3d.id),
                dbId: trim.model3d.id,
                file_url: trim.model3d.fileUrl || trim.model3d.file_url || '',
                format: (trim.model3d.format || 'glb').toLowerCase() as any,
                draco_compressed: trim.model3d.dracoCompressed ?? true,
            } : undefined,
        })),
    };
}

function mapSpecFromApi(spec: any) {
    if (!spec) return {};
    return {
        battery_kwh: Number(spec.batteryKwh) || 0,
        range_cltc_km: Number(spec.rangeCltcKm) || 0,
        range_wltp_km: Number(spec.rangeWltpKm) || 0,
        horsepower: Number(spec.horsepower) || 0,
        torque: Number(spec.torque) || 0,
        zero_to_100: Number(spec.zeroTo100) || 0,
        top_speed: Number(spec.topSpeed) || 0,
        charge_time_30_80: spec.chargeTime3080 || '',
        trunk_liters: Number(spec.trunkLiters) || 0,
        length_mm: Number(spec.lengthMm) || 0,
        width_mm: Number(spec.widthMm) || 0,
        height_mm: Number(spec.heightMm) || 0,
        wheelbase_mm: Number(spec.wheelbaseMm) || 0,
        curb_weight_kg: Number(spec.curbWeightKg) || 0,
        kwh_per_100km: Number(spec.kwhPer100km) || 0,
        adas_level: spec.adasLevel !== undefined ? String(spec.adasLevel) : '',
        screen_size: Number(spec.screenSize) || 0,
        software_version: Number(spec.softwareVersion) || 0,
    };
}

const EMPTY_FORM: VehicleModelFormData = {
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
};

export default function ModelSlideOver({ isOpen, onClose, mode, initialData }: ModelSlideOverProps) {
    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const methods = useForm<VehicleModelFormData>({
        // @ts-ignore
        resolver: zodResolver(vehicleModelSchema),
        mode: 'onChange',
        defaultValues: EMPTY_FORM,
    });

    // ─── Data loading for EDIT mode ─────────────────────────────────
    useEffect(() => {
        if (!isOpen) return;

        if (mode === 'add') {
            methods.reset(EMPTY_FORM);
            setActiveTab('general');
            setErrorMsg(null);
            return;
        }

        if (mode === 'edit' && initialData?.id) {
            setIsLoadingData(true);
            setErrorMsg(null);
            setActiveTab('general');

            const loadEditData = async () => {
                try {
                    // 1. Fetch complete model with trims and specs
                    const apiModel = await modelService.getModelById(Number(initialData.id));
                    
                    // 2. For each trim, fetch colors, images, and 3D model in parallel
                    const trims = apiModel?.trims || [];
                    const trimMediaPromises = trims.map(async (trim: any) => {
                        const [colorsRes, imagesRes, model3dRes] = await Promise.allSettled([
                            mediaService.getColorsByTrim(trim.id),
                            mediaService.getImagesByTrim(trim.id),
                            mediaService.getModel3dByTrim(trim.id),
                        ]);

                        return {
                            ...trim,
                            colors: colorsRes.status === 'fulfilled' 
                                ? (colorsRes.value?.data || colorsRes.value || []) 
                                : [],
                            images: imagesRes.status === 'fulfilled' 
                                ? (imagesRes.value?.data || imagesRes.value || []) 
                                : [],
                            model3d: model3dRes.status === 'fulfilled' && model3dRes.value
                                ? (model3dRes.value?.data || model3dRes.value)
                                : null,
                        };
                    });

                    const trimsWithMedia = await Promise.all(trimMediaPromises);
                    const fullModel = { ...apiModel, trims: trimsWithMedia };

                    // 3. Map to form data and populate form
                    const formData = mapApiToFormData(fullModel);
                    methods.reset(formData);
                } catch (err: any) {
                    console.error('Error loading model for edit:', err);
                    setErrorMsg(`Error cargando datos: ${err.message}`);
                } finally {
                    setIsLoadingData(false);
                }
            };

            loadEditData();
        }
    }, [isOpen, mode, initialData?.id]);

    // ─── Format model type for API ──────────────────────────────────
    const formatModelType = (type: string): string => {
        const map: Record<string, string> = {
            'suv': 'SUV',
            'sedan': 'Sedan',
            'hatchback': 'Hatchback',
            'pickup': 'Pickup',
            // Aliases in case form still has these (will be removed from schema)
            'van': 'SUV',
            'coupe': 'Sedan',
        };
        return map[type.toLowerCase()] || 'SUV';
    };

    /** Removes keys with undefined or null values from an object */
    const stripUndefined = (obj: Record<string, any>) => {
        return Object.fromEntries(
            Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
        );
    };

    // ─── CREATE flow ────────────────────────────────────────────────
    const handleCreate = async (data: VehicleModelFormData) => {
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

        for (const trim of data.trims) {
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

            // Specs
            const specPayload: any = {
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
            Object.keys(specPayload).forEach(k => specPayload[k] === undefined && delete specPayload[k]);
            await trimService.createSpec(specPayload);

            // Colors
            for (const color of trim.colors) {
                let imageUrl = color.image_url;
                if (color.rawFile) {
                    const uploadRes = await uploadService.uploadImage(color.rawFile, 'elemotor/colors');
                    imageUrl = uploadRes.publicUrl;
                }
                await trimService.createColor({
                    trimId,
                    name: color.name,
                    hexCode: color.hex_code.startsWith('#') ? color.hex_code : `#${color.hex_code}`,
                    type: color.type,
                    imageUrl: imageUrl && !imageUrl.startsWith('blob:') ? imageUrl : undefined
                });
            }

            // Images
            if (trim.images && trim.images.length > 0) {
                for (const img of trim.images) {
                    if (img.rawFile) {
                        await uploadService.uploadTrimImages([img.rawFile], trimId, img.type, img.alt_text, img.sort_order);
                    }
                }
            }

            // 3D Model
            if (trim.model_3d?.rawFile) {
                await uploadService.uploadModel3d(trim.model_3d.rawFile, trimId);
            }
        }
    };

    // ─── EDIT flow ──────────────────────────────────────────────────
    const handleEdit = async (data: VehicleModelFormData) => {
        const modelId = Number(initialData!.id);

        // 1. Update model — only send defined fields
        const modelPayload = stripUndefined({
            brandId: Number(data.brand_id),
            name: data.name,
            slug: data.slug,
            type: formatModelType(data.type),
            year: Number(data.year),
            description: data.description || undefined,
            basePrice: data.basePrice != null ? Number(data.basePrice) : undefined,
            featured: data.featured,
        });
        await modelService.updateModel(modelId, modelPayload);

        // 2. For each trim in the form
        for (const trim of data.trims) {
            const isExistingTrim = !!trim.dbId;
            let trimId: number;

            if (isExistingTrim) {
                // Update existing trim
                trimId = Number(trim.dbId);
                await trimService.updateTrim(trimId, {
                    name: trim.name,
                    price: Number(trim.price),
                    availableQuantity: Number(trim.available_quantity),
                    status: trim.status,
                });

                // Update specs
                if (trim.specDbId) {
                    const specPayload: any = {
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
                    Object.keys(specPayload).forEach(k => specPayload[k] === undefined && delete specPayload[k]);
                    await mediaService.updateSpec(trim.specDbId, specPayload);
                }
            } else {
                // New trim — create it
                const createdTrim = await trimService.createTrim({
                    modelId,
                    name: trim.name,
                    price: Number(trim.price),
                    availableQuantity: Number(trim.available_quantity),
                    status: trim.status,
                    active: trim.active
                });
                trimId = createdTrim.id;

                const specPayload: any = {
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
                Object.keys(specPayload).forEach(k => specPayload[k] === undefined && delete specPayload[k]);
                await trimService.createSpec(specPayload);
            }

            // Handle colors
            for (const color of trim.colors) {
                if ((color as any)._deleted) {
                    if (color.dbId) await mediaService.deleteImage(color.dbId);
                    continue;
                }
                if (color.dbId) {
                    // Update existing color (name, hex, type)
                    await mediaService.updateColor(color.dbId, {
                        name: color.name,
                        hexCode: color.hex_code.startsWith('#') ? color.hex_code : `#${color.hex_code}`,
                        type: color.type,
                    });
                } else {
                    // New color
                    let imageUrl = color.image_url;
                    if (color.rawFile) {
                        const uploadRes = await uploadService.uploadImage(color.rawFile, 'elemotor/colors');
                        imageUrl = uploadRes.publicUrl;
                    }
                    await trimService.createColor({
                        trimId,
                        name: color.name,
                        hexCode: color.hex_code.startsWith('#') ? color.hex_code : `#${color.hex_code}`,
                        type: color.type,
                        imageUrl: imageUrl && !imageUrl.startsWith('blob:') ? imageUrl : undefined
                    });
                }
            }

            // Handle images
            for (const img of trim.images) {
                if ((img as any)._deleted) {
                    if (img.dbId) await mediaService.deleteImage(img.dbId);
                    continue;
                }
                if (!img.dbId && img.rawFile) {
                    // New image to upload
                    await uploadService.uploadTrimImages([img.rawFile], trimId, img.type, img.alt_text, img.sort_order);
                }
                // Existing images without rawFile → no change needed
            }

            // Handle 3D model
            if (trim.model_3d) {
                if ((trim.model_3d as any)._deleted && trim.model_3d.dbId) {
                    await mediaService.deleteModel3d(trim.model_3d.dbId);
                } else if (!trim.model_3d.dbId && trim.model_3d.rawFile) {
                    // New 3D model
                    await uploadService.uploadModel3d(trim.model_3d.rawFile, trimId);
                }
            }
        }
    };

    // ─── Submit orchestrator ─────────────────────────────────────────
    const onSubmit = async (data: VehicleModelFormData) => {
        setIsSubmitting(true);
        setErrorMsg(null);
        try {
            if (mode === 'add') {
                await handleCreate(data);
            } else {
                await handleEdit(data);
            }
            onClose();
        } catch (error: any) {
            console.error('Error saving model:', error);
            setErrorMsg(error.message || 'Error al guardar el modelo');
        } finally {
            setIsSubmitting(false);
        }
    };

    const onError = (errors: any) => {
        console.error('Form errors:', errors);
        const errorTabs = new Set<string>();
        if (errors.name || errors.brand_id || errors.slug || errors.type || errors.year || errors.basePrice || errors.status || errors.description) {
            errorTabs.add('General');
        }
        if (errors.trims) {
            errorTabs.add('Versiones y Especificaciones');
            if (Array.isArray(errors.trims)) {
                const hasGalleryError = errors.trims.some((t: any) => t?.images || t?.model_3d);
                if (hasGalleryError) errorTabs.add('Galería');
            }
        }
        if (errorTabs.size > 0) {
            setErrorMsg(`Faltan campos en: ${Array.from(errorTabs).join(', ')}`);
        } else {
            setErrorMsg('Revisa los campos con errores');
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
                                    <p className="text-[13px] text-slate-500 mt-1 font-medium">
                                        {isLoadingData ? 'Cargando datos del modelo...' : 'Edita los campos y guarda los cambios'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            <button
                                type="submit"
                                disabled={isSubmitting || isLoadingData}
                                className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#10B981]/50 text-[#0A110F] px-6 py-2.5 rounded-lg font-bold transition-all text-[14px] shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                            >
                                {(isSubmitting || isLoadingData) && <Loader2 size={16} className="animate-spin" />}
                                {isLoadingData ? 'Cargando...' : isSubmitting ? 'Guardando...' : (mode === 'add' ? 'Crear Modelo' : 'Guardar Cambios')}
                            </button>
                            {errorMsg && <p className="text-red-400 text-xs font-semibold max-w-xs text-right">{errorMsg}</p>}
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="shrink-0 px-8 border-b border-white/5 bg-[#0A110F]">
                        <div className="flex gap-8 -mb-px">
                            {(['general', 'trims', 'gallery'] as TabType[]).map((tab) => {
                                const labels: Record<TabType, string> = { general: 'General', trims: 'Versiones y Especificaciones', gallery: 'Galería' };
                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
                                        className={`py-4 text-[13px] font-bold border-b-2 transition-all ${activeTab === tab
                                            ? 'border-[#10B981] text-[#10B981]'
                                            : 'border-transparent text-slate-400 hover:text-slate-300'
                                        }`}
                                    >
                                        {labels[tab]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <FormProgressIndicator methods={methods} activeTab={activeTab} />

                    {/* Loading overlay */}
                    {isLoadingData && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0A110F]/70 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 size={36} className="animate-spin text-[#10B981]" />
                                <p className="text-slate-400 text-sm font-medium">Cargando datos del modelo...</p>
                            </div>
                        </div>
                    )}

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        <div className={activeTab === 'general' ? 'block' : 'hidden'}>
                            <GeneralTab mode={mode} />
                        </div>
                        <div className={activeTab === 'trims' ? 'block' : 'hidden'}>
                            <TrimsAndSpecsTab mode={mode} />
                        </div>
                        <div className={activeTab === 'gallery' ? 'block' : 'hidden'}>
                            <GalleryTab mode={mode} />
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

    const generalFields = ['brand_id', 'name', 'slug', 'type', 'year', 'basePrice', 'status'];
    const isGeneralTouchedOrFilled = generalFields.some(f => values[f] !== '' && values[f] !== undefined);
    const hasGeneralErrors = generalFields.some(f => errors[f]);
    const isGeneralComplete = generalFields.every(f => values[f] !== '' && values[f] !== undefined && values[f] !== null) && !hasGeneralErrors;

    let generalStatus = '⏳ Pendiente';
    if (isGeneralComplete) generalStatus = '✔ Completa';
    else if (hasGeneralErrors) generalStatus = '⚠ Incompleta';
    else if (isGeneralTouchedOrFilled) generalStatus = '⏳ En progreso';

    const trims = values.trims || [];
    const hasTrimsErrors = !!errors.trims;
    const isTrimsComplete = trims.length > 0 && !hasTrimsErrors;

    let trimsStatus = '⏳ Pendiente';
    if (isTrimsComplete) trimsStatus = '✔ Completa';
    else if (hasTrimsErrors) trimsStatus = '⚠ Incompleta';
    else if (trims.length > 0) trimsStatus = '⏳ En progreso';

    const hasGalleryErrors = Array.isArray(errors.trims) && errors.trims.some((t: any) => t?.images || t?.model_3d);
    const isGalleryComplete = trims.length > 0 && trims.every((t: any) => t.images && t.images.filter((i: any) => !i._deleted).length > 0) && !hasGalleryErrors;
    const isGalleryInProgress = trims.some((t: any) => (t.images && t.images.filter((i: any) => !i._deleted).length > 0) || t.model_3d);

    let galleryStatus = '⏳ Pendiente';
    if (isGalleryComplete) galleryStatus = '✔ Completa';
    else if (hasGalleryErrors) galleryStatus = '⚠ Incompleta';
    else if (isGalleryInProgress) galleryStatus = '⏳ En progreso';

    return (
        <div className="shrink-0 px-8 py-3 bg-[#0f172a] border-b border-white/5 flex flex-wrap gap-4 sm:gap-8 shadow-inner">
            {[
                { key: 'general', label: 'GENERAL', status: generalStatus },
                { key: 'trims', label: 'VERSIONES', status: trimsStatus },
                { key: 'gallery', label: 'GALERÍA', status: galleryStatus },
            ].map(({ key, label, status }) => (
                <div key={key} className={`flex items-center gap-2 text-[12px] font-bold tracking-wide transition-opacity ${activeTab === key ? 'opacity-100' : 'opacity-70'}`}>
                    <span className={`${status.includes('✔') ? 'text-[#10B981]' : status.includes('⚠') ? 'text-amber-400' : 'text-slate-500'}`}>{label}:</span>
                    <span className="text-slate-300">{status}</span>
                </div>
            ))}
        </div>
    );
}
