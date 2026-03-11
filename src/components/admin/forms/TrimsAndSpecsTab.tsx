import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ChevronDown, ChevronUp, UploadCloud, Plus, Trash2 } from 'lucide-react';
import { InputWithUnit } from '../ui/InputWithUnit';
import { VehicleModelFormData } from '@/schemas/inventorySchema';

export default function TrimsAndSpecsTab() {
    const { register, control, formState: { errors } } = useFormContext<VehicleModelFormData>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'trims'
    });

    const [expandedTrim, setExpandedTrim] = useState<number | null>(null);

    const toggleTrim = (index: number) => {
        setExpandedTrim(expandedTrim === index ? null : index);
    };

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
        setExpandedTrim(fields.length); // Expand the newly added trim
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

            {fields.map((field, index) => {
                const trimError = errors?.trims?.[index];

                return (
                    <div key={field.id} className={`bg-[#1e293b]/40 border ${trimError ? 'border-red-500/50' : 'border-slate-800'} rounded-xl overflow-hidden transition-all relative`}>
                        {/* Header */}
                        <div className="flex w-full items-center bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                            <button
                                type="button"
                                onClick={() => toggleTrim(index)}
                                className="flex-1 flex items-center gap-4 p-4 text-left"
                            >
                                <div className="w-10 h-10 rounded-full bg-cyan-950/50 text-cyan-400 flex items-center justify-center font-bold text-sm border border-cyan-900 shrink-0">
                                    V{index + 1}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <h4 className="text-slate-200 font-semibold truncate">{field.name || 'Nueva Versión'}</h4>
                                    <p className="text-slate-500 text-xs mt-0.5">${field.price?.toLocaleString() || 0} - {field.status}</p>
                                </div>
                                <div className="text-slate-500 px-4">
                                    {expandedTrim === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); remove(index); }}
                                className="p-4 text-slate-500 hover:text-red-400 transition-colors"
                                title="Eliminar versión"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {/* Expanded Content */}
                        {expandedTrim === index && (
                            <div className="p-6 border-t border-slate-800 flex flex-col gap-8 bg-[#0f172a]/20">

                                {/* Configuración Básica */}
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

                                {/* Especificaciones Completas */}
                                <div className="flex flex-col gap-6 mt-4">
                                    <h5 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1 border-b border-slate-800 pb-2">Desempeño y Batería</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Batería (kWh)</label>
                                            <input type="number" step="0.1" {...register(`trims.${index}.specs.battery_kwh`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 77" />
                                            {trimError?.specs?.battery_kwh && <span className="text-red-400 text-[10px]">{trimError.specs.battery_kwh.message}</span>}
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Rango CLTC (km)</label>
                                            <input type="number" {...register(`trims.${index}.specs.range_cltc_km`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 520" />
                                            {trimError?.specs?.range_cltc_km && <span className="text-red-400 text-[10px]">{trimError.specs.range_cltc_km.message}</span>}
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Rango WLTP (km)</label>
                                            <input type="number" {...register(`trims.${index}.specs.range_wltp_km`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 450" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Acel. 0-100 (s)</label>
                                            <input type="number" step="0.1" {...register(`trims.${index}.specs.zero_to_100`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 3.8" />
                                            {trimError?.specs?.zero_to_100 && <span className="text-red-400 text-[10px]">{trimError.specs.zero_to_100.message}</span>}
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Potencia (HP)</label>
                                            <input type="number" {...register(`trims.${index}.specs.horsepower`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 300" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Torque (Nm)</label>
                                            <input type="number" {...register(`trims.${index}.specs.torque`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 400" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Velocidad Máx (km/h)</label>
                                            <input type="number" {...register(`trims.${index}.specs.top_speed`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 200" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Consumo (kWh/100km)</label>
                                            <input type="number" step="0.1" {...register(`trims.${index}.specs.kwh_per_100km`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 15.5" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Carga 30-80% (mins)</label>
                                            <input type="text" {...register(`trims.${index}.specs.charge_time_30_80`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 30" />
                                        </div>
                                    </div>

                                    <h5 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1 border-b border-slate-800 pb-2 mt-2">Dimensiones y Capacidad</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Largo (mm)</label>
                                            <input type="number" {...register(`trims.${index}.specs.length_mm`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 4750" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Ancho (mm)</label>
                                            <input type="number" {...register(`trims.${index}.specs.width_mm`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 1920" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Alto (mm)</label>
                                            <input type="number" {...register(`trims.${index}.specs.height_mm`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 1620" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Dist. Ejes (mm)</label>
                                            <input type="number" {...register(`trims.${index}.specs.wheelbase_mm`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 2890" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Baúl (Litros)</label>
                                            <input type="number" {...register(`trims.${index}.specs.trunk_liters`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 450" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Peso Vacío (kg)</label>
                                            <input type="number" {...register(`trims.${index}.specs.curb_weight_kg`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 1950" />
                                        </div>
                                    </div>

                                    <h5 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1 border-b border-slate-800 pb-2 mt-2">Tecnología</h5>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Nivel ADAS</label>
                                            <input type="text" {...register(`trims.${index}.specs.adas_level`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. L2+" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Pantalla (Pulgadas)</label>
                                            <input type="number" step="0.1" {...register(`trims.${index}.specs.screen_size`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 15.6" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-semibold text-slate-400">Versión Software</label>
                                            <input type="number" step="0.1" {...register(`trims.${index}.specs.software_version`)} className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]" placeholder="e.g. 3.0" />
                                        </div>
                                    </div>
                                </div>

                                {/* Colores de la versión */}
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

function TrimColors({ trimIndex }: { trimIndex: number }) {
    const { control, register } = useFormContext<VehicleModelFormData>();
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
                {fields.map((field, idx) => {
                    const colorImg = control._formValues?.trims?.[trimIndex]?.colors?.[idx]?.image_url;

                    return (
                        <div key={field.id} className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-[#0f172a]/40 p-3 rounded-lg border border-slate-700/50">
                            {/* Color Picker */}
                            <div className="shrink-0 w-8 h-8 rounded-full overflow-hidden border-2 border-slate-600 relative">
                                <input
                                    type="color"
                                    {...register(`trims.${trimIndex}.colors.${idx}.hex_code`)}
                                    className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-none"
                                />
                            </div>

                            {/* Name Input */}
                            <div className="flex-1 min-w-[120px]">
                                <input
                                    type="text"
                                    placeholder="Nombre (ej. Stellar Gray)"
                                    {...register(`trims.${trimIndex}.colors.${idx}.name`)}
                                    className="w-full bg-transparent border-b border-slate-700 pb-1 text-sm text-white focus:outline-none focus:border-[#10B981]"
                                />
                            </div>

                            {/* Upload Image Preview */}
                            <div className="flex items-center gap-2">
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    id={`color-upload-${idx}`} 
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            const file = e.target.files[0];
                                            const mockUrl = URL.createObjectURL(file);
                                            register(`trims.${trimIndex}.colors.${idx}.image_url`).onChange({ target: { value: mockUrl, name: `trims.${trimIndex}.colors.${idx}.image_url` } });
                                            // Register the raw file natively for multipart upload
                                            control._formValues.trims[trimIndex].colors[idx].rawFile = file;
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => document.getElementById(`color-upload-${idx}`)?.click()}
                                    className={`flex items-center justify-center w-8 h-8 rounded-md border ${colorImg ? 'border-[#10B981] bg-[#10B981]/10' : 'border-slate-600 text-slate-400 bg-slate-800 hover:text-[#10B981] hover:border-[#10B981]'} transition-colors relative group overflow-hidden`}
                                    title="Subir imagen del color"
                                >
                                    {colorImg ? (
                                        <>
                                            {/* Preview uploaded image as background cover if available */}
                                            <img src={colorImg} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen" />
                                            <svg className="w-4 h-4 text-white z-10 drop-shadow-md relative" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </>
                                    ) : (
                                        <UploadCloud size={16} />
                                    )}
                                </button>
                                {colorImg && <span className="text-[10px] text-[#10B981] font-semibold whitespace-nowrap">✔ Lista</span>}
                            </div>

                            {/* Type Select */}
                            <div className="w-24 sm:w-28">
                                <select
                                    {...register(`trims.${trimIndex}.colors.${idx}.type`)}
                                    className="w-full bg-[#1e293b]/60 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#10B981] appearance-none"
                                >
                                    <option value="exterior">Exterior</option>
                                    <option value="interior">Interior</option>
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={() => remove(idx)}
                                className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                })}
                {fields.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No hay colores configurados para esta versión.</p>
                )}
            </div>
        </div>
    );
}
