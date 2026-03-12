'use client';

import React, { useState } from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { ChevronDown, ChevronUp, Plus, Trash2, Ban, RefreshCw, AlertCircle, UploadCloud, Loader2 } from 'lucide-react';
import { VehicleModelFormData } from '@/schemas/inventorySchema';
import { trimService } from '@/services/trim.service';

// ─────────────────────────────────────────────────────────────────────────────
// Main Tab
// ─────────────────────────────────────────────────────────────────────────────

export default function TrimsAndSpecsTab({ mode }: { mode?: 'add' | 'edit' }) {
    const { register, control, formState: { errors }, setValue } = useFormContext<VehicleModelFormData>();
    const { fields, append, remove } = useFieldArray({ control, name: 'trims' });

    const [expandedTrim, setExpandedTrim] = useState<number | null>(null);
    const [togglingTrimId, setTogglingTrimId] = useState<string | null>(null);
    const [trimToggleError, setTrimToggleError] = useState<string | null>(null);

    // Watch model active status to guard trim reactivation
    const modelActive = useWatch({ control, name: 'active' });

    const handleAddTrim = () => {
        append({
            id: crypto.randomUUID(),
            name: 'Nueva Versión',
            price: 0,
            available_quantity: 0,
            status: 'stock',
            active: true,
            specs: {},
            colors: [],
            images: []
        });
        setExpandedTrim(fields.length);
    };

    const handleToggleTrimActive = async (trimId: string, dbId: string | number, currentActive: boolean, index: number) => {
        // Guard: cannot activate trim if parent model is inactive
        if (!currentActive && !modelActive) {
            setTrimToggleError('El modelo está inactivo. Activa el modelo primero antes de activar sus versiones.');
            setTimeout(() => setTrimToggleError(null), 5000);
            return;
        }

        setTogglingTrimId(trimId);
        setTrimToggleError(null);
        try {
            if (currentActive) {
                await trimService.deleteTrim(Number(dbId));
            } else {
                await trimService.updateTrim(Number(dbId), { active: true });
            }
            // ⚡ Real-time update: setValue triggers useWatch re-render in TrimHeader
            setValue(`trims.${index}.active`, !currentActive, { shouldDirty: true });
        } catch (err: any) {
            console.error('Error toggling trim status:', err);
            setTrimToggleError(err.message || 'Error al cambiar el estado de la versión.');
            setTimeout(() => setTrimToggleError(null), 5000);
        } finally {
            setTogglingTrimId(null);
        }
    };

    return (
        <div className="flex flex-col gap-4">

            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-slate-200">Versiones Disponibles ({fields.length})</h3>
                <button
                    type="button"
                    onClick={handleAddTrim}
                    className="flex items-center gap-2 text-xs font-semibold bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 px-3 py-1.5 rounded-lg transition-colors border border-[#10B981]/20"
                >
                    <Plus size={14} strokeWidth={3} />
                    Añadir Versión
                </button>
            </div>

            {/* Trim toggle error/warning */}
            {trimToggleError && (
                <div className="flex items-start gap-2 bg-amber-950/40 border border-amber-800/50 rounded-lg px-4 py-3 text-amber-400 text-xs font-semibold">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{trimToggleError}</span>
                </div>
            )}

            {fields.map((field, index) => {
                const trimError = (errors?.trims as any)?.[index];

                return (
                    <div
                        key={field.id}
                        className={`bg-[#1e293b]/40 border ${trimError ? 'border-red-500/50' : 'border-slate-800'} rounded-xl overflow-hidden transition-all`}
                    >
                        {/* ── Header (uses TrimHeader sub-component so useWatch works) ── */}
                        <TrimHeader
                            trimIndex={index}
                            fieldId={field.id}
                            dbId={(field as any).dbId}
                            mode={mode}
                            isExpanded={expandedTrim === index}
                            isToggling={togglingTrimId === field.id}
                            onToggleExpand={() => setExpandedTrim(expandedTrim === index ? null : index)}
                            onToggleActive={(currentActive) =>
                                handleToggleTrimActive(field.id, (field as any).dbId, currentActive, index)
                            }
                            onRemove={() => remove(index)}
                        />

                        {/* ── Expanded body ── */}
                        {expandedTrim === index && (
                            <div className="p-6 border-t border-slate-800 flex flex-col gap-8 bg-[#0f172a]/20">

                                {/* Basic info */}
                                <div className="flex flex-col gap-4">
                                    <h5 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">Información Básica</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[12px] font-semibold text-slate-300">Nombre de Versión</label>
                                            <input
                                                type="text"
                                                {...register(`trims.${index}.name`)}
                                                className="w-full bg-[#0f172a]/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] transition-colors"
                                            />
                                            {trimError?.name && <span className="text-red-400 text-[10px]">{trimError.name.message}</span>}
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[12px] font-semibold text-[#10B981]">Precio (USD)</label>
                                            <input
                                                type="number"
                                                {...register(`trims.${index}.price`)}
                                                className="w-full bg-[#0f172a]/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] transition-colors"
                                            />
                                            {trimError?.price && <span className="text-red-400 text-[10px]">{trimError.price.message}</span>}
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[12px] font-semibold text-slate-300">Stock Disponible</label>
                                            <input
                                                type="number"
                                                {...register(`trims.${index}.available_quantity`)}
                                                className="w-full bg-[#0f172a]/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#10B981] transition-colors"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[12px] font-semibold text-slate-300">Estado de Inventario</label>
                                            <select
                                                {...register(`trims.${index}.status`)}
                                                className="w-full bg-[#0f172a]/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#10B981] transition-colors appearance-none"
                                            >
                                                <option value="stock">En Stock</option>
                                                <option value="transit">En Tránsito</option>
                                                <option value="order">Bajo Pedido</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Specs */}
                                <div className="flex flex-col gap-6 mt-4">
                                    <h5 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1 border-b border-slate-800 pb-2">Desempeño y Batería</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <SpecInput label="Batería (kWh)" name={`trims.${index}.specs.battery_kwh`} placeholder="e.g. 77" step="0.1" error={trimError?.specs?.battery_kwh} />
                                        <SpecInput label="Rango CLTC (km)" name={`trims.${index}.specs.range_cltc_km`} placeholder="e.g. 520" error={trimError?.specs?.range_cltc_km} />
                                        <SpecInput label="Rango WLTP (km)" name={`trims.${index}.specs.range_wltp_km`} placeholder="e.g. 450" />
                                        <SpecInput label="Acel. 0-100 (s)" name={`trims.${index}.specs.zero_to_100`} placeholder="e.g. 3.8" step="0.1" error={trimError?.specs?.zero_to_100} />
                                        <SpecInput label="Potencia (HP)" name={`trims.${index}.specs.horsepower`} placeholder="e.g. 300" />
                                        <SpecInput label="Torque (Nm)" name={`trims.${index}.specs.torque`} placeholder="e.g. 400" />
                                        <SpecInput label="Velocidad Máx (km/h)" name={`trims.${index}.specs.top_speed`} placeholder="e.g. 200" />
                                        <SpecInput label="Consumo (kWh/100km)" name={`trims.${index}.specs.kwh_per_100km`} placeholder="e.g. 15.5" step="0.1" />
                                        <SpecInput label="Carga 30-80% (mins)" name={`trims.${index}.specs.charge_time_30_80`} placeholder="e.g. 30" type="text" />
                                    </div>

                                    <h5 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1 border-b border-slate-800 pb-2 mt-2">Dimensiones y Capacidad</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <SpecInput label="Largo (mm)" name={`trims.${index}.specs.length_mm`} placeholder="e.g. 4750" />
                                        <SpecInput label="Ancho (mm)" name={`trims.${index}.specs.width_mm`} placeholder="e.g. 1920" />
                                        <SpecInput label="Alto (mm)" name={`trims.${index}.specs.height_mm`} placeholder="e.g. 1620" />
                                        <SpecInput label="Dist. Ejes (mm)" name={`trims.${index}.specs.wheelbase_mm`} placeholder="e.g. 2890" />
                                        <SpecInput label="Baúl (Litros)" name={`trims.${index}.specs.trunk_liters`} placeholder="e.g. 450" />
                                        <SpecInput label="Peso Vacío (kg)" name={`trims.${index}.specs.curb_weight_kg`} placeholder="e.g. 1950" />
                                    </div>

                                    <h5 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1 border-b border-slate-800 pb-2 mt-2">Tecnología</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <SpecInput label="Nivel ADAS" name={`trims.${index}.specs.adas_level`} placeholder="e.g. L2+" type="text" />
                                        <SpecInput label="Pantalla (Pulgadas)" name={`trims.${index}.specs.screen_size`} placeholder="e.g. 15.6" step="0.1" />
                                        <SpecInput label="Versión Software" name={`trims.${index}.specs.software_version`} placeholder="e.g. 3.0" step="0.1" />
                                    </div>
                                </div>

                                {/* Colors */}
                                <TrimColors trimIndex={index} />

                            </div>
                        )}
                    </div>
                );
            })}

            {fields.length === 0 && (
                <div className="text-center py-10 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
                    <p className="text-sm text-slate-400 mb-4">No hay versiones configuradas aún para este modelo.</p>
                    <button
                        type="button"
                        onClick={handleAddTrim}
                        className="inline-flex items-center gap-2 text-sm font-semibold bg-[#10B981] text-[#0A110F] hover:bg-[#059669] px-6 py-2.5 rounded-lg transition-colors shadow-lg shadow-[#10B981]/20"
                    >
                        <Plus size={16} strokeWidth={3} />
                        Crear la primera Versión
                    </button>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// TrimHeader — reactive using useWatch so badge/icon update without page reload
// ─────────────────────────────────────────────────────────────────────────────

interface TrimHeaderProps {
    trimIndex: number;
    fieldId: string;
    dbId?: string | number;
    mode?: 'add' | 'edit';
    isExpanded: boolean;
    isToggling: boolean;
    onToggleExpand: () => void;
    onToggleActive: (currentActive: boolean) => void;
    onRemove: () => void;
}

function TrimHeader({
    trimIndex, fieldId, dbId, mode,
    isExpanded, isToggling,
    onToggleExpand, onToggleActive, onRemove
}: TrimHeaderProps) {
    const { control } = useFormContext<VehicleModelFormData>();

    // These are reactive — they update immediately when setValue is called
    const trimName   = useWatch({ control, name: `trims.${trimIndex}.name` });
    const trimPrice  = useWatch({ control, name: `trims.${trimIndex}.price` });
    const trimStatus = useWatch({ control, name: `trims.${trimIndex}.status` });
    const isActive   = useWatch({ control, name: `trims.${trimIndex}.active` });

    return (
        <div className="flex w-full items-center bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
            {/* Expand toggle */}
            <button
                type="button"
                onClick={onToggleExpand}
                className="flex-1 flex items-center gap-4 p-4 text-left"
            >
                <div className="w-10 h-10 rounded-full bg-cyan-950/50 text-cyan-400 flex items-center justify-center font-bold text-sm border border-cyan-900 shrink-0">
                    V{trimIndex + 1}
                </div>
                <div className="text-left flex-1 min-w-0">
                    <h4 className="text-slate-200 font-semibold truncate">{trimName || 'Nueva Versión'}</h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                        ${Number(trimPrice)?.toLocaleString() || 0} · {trimStatus ?? 'stock'}
                    </p>
                </div>
                <div className="text-slate-500 px-4">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </button>

            {/* Edit mode: status badge + toggle button */}
            {mode === 'edit' && dbId && (
                <div className="flex items-center gap-2 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                        isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                        {isActive ? 'Activo' : 'Inactivo'}
                    </span>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onToggleActive(!!isActive); }}
                        disabled={isToggling}
                        className={`p-1.5 rounded-md transition-colors ${
                            isActive
                                ? 'text-slate-500 hover:text-amber-500 hover:bg-amber-500/10'
                                : 'text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10'
                        } disabled:opacity-40`}
                        title={isActive ? 'Desactivar Versión' : 'Reactivar Versión'}
                    >
                        {isToggling
                            ? <Loader2 size={14} className="animate-spin" />
                            : isActive ? <Ban size={14} /> : <RefreshCw size={14} />}
                    </button>
                </div>
            )}

            {/* Remove (only for new trims in edit, or all in add mode) */}
            {(!dbId || mode === 'add') && (
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    className="p-4 text-slate-500 hover:text-red-400 transition-colors"
                    title="Eliminar versión"
                >
                    <Trash2 size={18} />
                </button>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// TrimColors — list of colors for a trim
// ─────────────────────────────────────────────────────────────────────────────

function TrimColors({ trimIndex }: { trimIndex: number }) {
    const { control } = useFormContext<VehicleModelFormData>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: `trims.${trimIndex}.colors`
    });

    return (
        <div className="flex flex-col gap-4 mt-2 pt-6 border-t border-slate-800">
            <div className="flex justify-between items-center">
                <h5 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">Colores Disponibles</h5>
                <button
                    type="button"
                    onClick={() => append({ id: crypto.randomUUID(), name: '', hex_code: '#ffffff', type: 'exterior' })}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                    <Plus size={14} /> Añadir Color
                </button>
            </div>

            <div className="flex flex-col gap-3">
                {fields.map((field, idx) => (
                    <ColorRow
                        key={field.id}
                        trimIndex={trimIndex}
                        colorIndex={idx}
                        onRemove={() => remove(idx)}
                    />
                ))}
                {fields.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No hay colores configurados para esta versión.</p>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// ColorRow — reactive color circle + hex input
// ─────────────────────────────────────────────────────────────────────────────

function ColorRow({
    trimIndex,
    colorIndex,
    onRemove
}: {
    trimIndex: number;
    colorIndex: number;
    onRemove: () => void;
}) {
    const { control, register, setValue } = useFormContext<VehicleModelFormData>();

    // Reactive: updates immediately when the color picker or setValue() is called
    const hexCode  = useWatch({ control, name: `trims.${trimIndex}.colors.${colorIndex}.hex_code` }) as string;
    const colorImg = useWatch({ control, name: `trims.${trimIndex}.colors.${colorIndex}.image_url` }) as string | undefined;

    const safeHex = hexCode?.startsWith('#') ? hexCode : `#${hexCode || 'ffffff'}`;

    const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(`trims.${trimIndex}.colors.${colorIndex}.hex_code`, e.target.value, { shouldDirty: true });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setValue(`trims.${trimIndex}.colors.${colorIndex}.image_url`, objectUrl, { shouldDirty: true });
        setValue(`trims.${trimIndex}.colors.${colorIndex}.rawFile` as any, file);
    };

    return (
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-[#0f172a]/40 p-3 rounded-lg border border-slate-700/50">

            {/* ── Color circle (shows actual hex from DB or current picker value) ── */}
            <label
                className="shrink-0 w-9 h-9 rounded-full border-2 border-slate-500 shadow-md cursor-pointer relative overflow-hidden transition-transform hover:scale-110 group"
                style={{ backgroundColor: safeHex }}
                title={`Color: ${safeHex} — Clic para cambiar`}
            >
                <input
                    type="color"
                    value={safeHex}
                    onChange={handleColorPickerChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {/* Subtle hover overlay */}
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 text-white text-[8px] font-bold rounded-full">
                    ✏
                </span>
            </label>

            {/* Hex code display (read-only, updates as user picks) */}
            <span className="text-[11px] font-mono text-slate-400 shrink-0 select-all">{safeHex}</span>

            {/* Color name */}
            <div className="flex-1 min-w-[120px]">
                <input
                    type="text"
                    placeholder="Nombre (ej. Stellar Gray)"
                    {...register(`trims.${trimIndex}.colors.${colorIndex}.name`)}
                    className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]"
                />
            </div>

            {/* Image upload preview */}
            <div className="flex items-center gap-2">
                <input
                    type="file"
                    id={`color-img-${trimIndex}-${colorIndex}`}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <button
                    type="button"
                    onClick={() => document.getElementById(`color-img-${trimIndex}-${colorIndex}`)?.click()}
                    className={`flex items-center justify-center w-8 h-8 rounded-md border transition-colors relative overflow-hidden ${
                        colorImg
                            ? 'border-[#10B981] bg-[#10B981]/10'
                            : 'border-slate-600 text-slate-400 bg-slate-800 hover:text-[#10B981] hover:border-[#10B981]'
                    }`}
                    title="Subir imagen del color"
                >
                    {colorImg ? (
                        <>
                            <img src={colorImg} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                            <svg className="w-3.5 h-3.5 text-white z-10 relative drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </>
                    ) : (
                        <UploadCloud size={15} />
                    )}
                </button>
                {colorImg && <span className="text-[10px] text-[#10B981] font-semibold whitespace-nowrap">✔ Lista</span>}
            </div>

            {/* Type */}
            <div className="w-24 sm:w-28">
                <select
                    {...register(`trims.${trimIndex}.colors.${colorIndex}.type`)}
                    className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#10B981] appearance-none"
                >
                    <option value="exterior">Exterior</option>
                    <option value="interior">Interior</option>
                </select>
            </div>

            {/* Remove */}
            <button
                type="button"
                onClick={onRemove}
                className="text-slate-500 hover:text-red-400 p-1 transition-colors shrink-0"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SpecInput helper — avoids repetition in spec grid
// ─────────────────────────────────────────────────────────────────────────────

function SpecInput({
    label,
    name,
    placeholder,
    step,
    type = 'number',
    error
}: {
    label: string;
    name: string;
    placeholder?: string;
    step?: string;
    type?: string;
    error?: { message?: string };
}) {
    const { register } = useFormContext<VehicleModelFormData>();
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-400">{label}</label>
            <input
                type={type}
                step={step}
                {...register(name as any)}
                placeholder={placeholder}
                className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]"
            />
            {error && <span className="text-red-400 text-[10px]">{error.message}</span>}
        </div>
    );
}
