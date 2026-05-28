import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, ArrowRight, MessageCircle, Phone, Mail } from 'lucide-react';
import { VehicleModel } from '@/types/inventory';
import { submitQuoteAction } from '../../actions/quote';

const quoteSchema = z.object({
    fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z.string().email('Ingresa un correo válido').min(1, 'Requerido'),
    phone: z.string().regex(/^\d{7,}$/, 'Debe contener al menos 7 números'),
    city: z.string().min(1, 'Selecciona una ciudad'),
    country: z.string().min(1, 'Selecciona un país'),
    trackingCode: z.string().optional(),
    model_id: z.string().min(1, 'Selecciona un modelo'),
    color: z.string().optional(),
    assigned_to: z.string().optional(),
    budget_range: z.string().min(1, 'Selecciona un presupuesto'),
    payment_method: z.string().min(1, 'Selecciona una forma de pago'),
    preferred_channel: z.enum(['whatsapp', 'call', 'email']),
    message: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

const inputClasses = "w-full bg-[#121c19] border border-white/5 rounded-xl px-4 py-3.5 text-[14px] text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition-all";
const labelClasses = "text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block";

interface Advisor {
    id: number;
    name: string;
}

interface Props {
    vehicles: VehicleModel[];
    advisors: Advisor[];
    initialModelId?: string;
    initialColor?: string;
    onModelChange: (modelId: string) => void;
}

export function QuoteForm({ vehicles, advisors, initialModelId, initialColor, onModelChange }: Props) {
    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<QuoteFormValues>({
        resolver: zodResolver(quoteSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            city: '',
            country: 'Colombia',
            trackingCode: '',
            model_id: initialModelId || vehicles[0]?.id || '',
            color: initialColor || '',
            assigned_to: '',
            budget_range: '',
            payment_method: '',
            preferred_channel: 'whatsapp',
            message: '',
        }
    });

    const selectedModelId = watch('model_id');
    const preferredChannel = watch('preferred_channel');
    const paymentMethod = watch('payment_method');
    const selectedColor = watch('color');

    // Colores únicos del modelo seleccionado (deduplicados por nombre)
    const availableColors = React.useMemo(() => {
        const vehicle = vehicles.find(v => String(v.id) === String(selectedModelId));
        if (!vehicle?.trims) return [];
        const seen = new Set<string>();
        return vehicle.trims
            .flatMap(t => t.colors ?? [])
            .filter(c => {
                if (seen.has(c.name)) return false;
                seen.add(c.name);
                return true;
            });
    }, [selectedModelId, vehicles]);

    useEffect(() => {
        onModelChange(selectedModelId);
    }, [selectedModelId, onModelChange]);

    const onSubmit = async (data: QuoteFormValues) => {
        try {

            const modelId = parseInt(data.model_id);
            const budgetRangeValue = data.budget_range ? parseInt(data.budget_range) : undefined;

            const backendData: any = {
                name: data.fullName,
                email: data.email,
                phone: data.phone ? `+57${data.phone}` : undefined,
                city: data.city || undefined,
                country: data.country,
                trackingCode: data.trackingCode || undefined,
                color: data.color || undefined,
                paymentMethod: data.payment_method || undefined,
                assignedToId: data.assigned_to ? parseInt(data.assigned_to) : undefined,
                preferredChannel: data.preferred_channel,
                message: data.message || undefined,
                source: 'web'
            };

            // Only add optional numeric fields if they are valid
            if (!isNaN(modelId)) backendData.modelId = modelId;
            if (budgetRangeValue && !isNaN(budgetRangeValue)) backendData.budgetRange = budgetRangeValue;

            const result = await submitQuoteAction(backendData);

            if (result.success) {
                alert('¡Cotización enviada con éxito! Un asesor te contactará pronto.');
                // En un caso real aquí se podría redirigir o limpiar el formulario
            } else {
                alert(result.error || 'Ocurrió un error al enviar tu cotización.');
            }
        } catch (error) {
            console.error('Error submitting quote:', error);
            alert('Error inesperado de red al conectar con el servidor.');
        }
    };

    return (
        <div className="bg-[#131f1c] rounded-2xl border border-white/10 p-8 shadow-[0_0_40px_-15px_rgba(16,185,129,0.15)] relative z-10 h-full flex flex-col">
            <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Solicita Tu Cotización</h2>
                <p className="text-slate-400 text-sm">Un asesor te contactará en menos de 2 horas</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 flex-1">
                {/* File 1: Nombre y Correo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClasses}>Nombre Completo</label>
                        <input {...register('fullName')} type="text" placeholder="Ej: Juan Pérez" className={inputClasses} />
                        {errors.fullName && <p className="text-xs text-red-500 mt-1 font-medium">{errors.fullName.message}</p>}
                    </div>
                    <div>
                        <label className={labelClasses}>Correo Electrónico</label>
                        <input {...register('email')} type="email" placeholder="ejemplo@correo.com" className={inputClasses} />
                        {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>}
                    </div>
                </div>

                {/* File 2: Teléfono y Ciudad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClasses}>Teléfono</label>
                        <div className="relative flex items-center">
                            <span className="absolute left-4 text-slate-400 text-[14px] font-medium">+57</span>
                            <input {...register('phone')} type="tel" placeholder="300 000 0000" className={`${inputClasses} pl-12`} />
                        </div>
                        {errors.phone && <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label className={labelClasses}>Ciudad de entrega del vehículo</label>
                        <div className="relative">
                            <select {...register('city')} className={`${inputClasses} appearance-none cursor-pointer`}>
                                <option value="" disabled>Selecciona una ciudad</option>
                                <option value="Bogota">Bogotá</option>
                                <option value="Medellin">Medellín</option>
                                <option value="Cali">Cali</option>
                                <option value="Barranquilla">Barranquilla</option>
                                <option value="Bucaramanga">Bucaramanga</option>
                                <option value="Cartagena">Cartagena</option>
                                <option value="Otra">Otra ciudad</option>
                            </select>
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                        {errors.city && <p className="text-xs text-red-500 mt-1 font-medium">{errors.city.message}</p>}
                    </div>
                </div>

                {/* Country and Tracking Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClasses}>País</label>
                        <div className="relative">
                            <select {...register('country')} className={`${inputClasses} appearance-none cursor-pointer`}>
                                <option value="Colombia">Colombia</option>
                                <option value="China">China</option>
                                <option value="Brasil">Brasil</option>
                                <option value="Mexico">México</option>
                                <option value="Panama">Panamá</option>
                                <option value="Otro">Otro</option>
                            </select>
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                        {errors.country && <p className="text-xs text-red-500 mt-1 font-medium">{errors.country.message}</p>}
                    </div>
                    <div>
                        <label className={labelClasses}>Código de Seguimiento (Opcional)</label>
                        <input 
                            {...register('trackingCode')} 
                            type="text" 
                            placeholder="Ej: ELE-2026-00001" 
                            className={inputClasses} 
                        />
                        <p className="text-[9px] text-slate-500 mt-1">Si ya tienes un pedido asignado por un asesor, ingrésalo aquí.</p>
                    </div>
                </div>

                {/* Modelo y Color */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClasses}>Modelo de interés</label>
                        <div className="relative">
                            <select {...register('model_id')} className={`${inputClasses} appearance-none cursor-pointer`}>
                                <option value="" disabled>Selecciona un modelo</option>
                                {vehicles.map(v => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                        {errors.model_id && <p className="text-xs text-red-500 mt-1 font-medium">{errors.model_id.message}</p>}
                    </div>
                    <div>
                        <label className={labelClasses}>Color de interés (Opcional)</label>
                        {availableColors.length > 0 ? (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {availableColors.map(c => (
                                    <button
                                        key={c.name}
                                        type="button"
                                        title={c.name}
                                        onClick={() => setValue('color', selectedColor === c.name ? '' : c.name)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[12px] font-semibold transition-all ${
                                            selectedColor === c.name
                                                ? 'border-[#00D4AA] bg-[#00D4AA]/10 text-white'
                                                : 'border-white/10 bg-[#121c19] text-slate-400 hover:border-white/20'
                                        }`}
                                    >
                                        <span
                                            className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                                            style={{ backgroundColor: `#${(c as any).hexCode ?? c.hex_code}` }}
                                        />
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <input
                                {...register('color')}
                                type="text"
                                placeholder="Ej: Blanco, Negro, Gris..."
                                className={inputClasses}
                            />
                        )}
                    </div>
                </div>

                {/* Asesor */}
                {advisors.length > 0 && (
                    <div>
                        <label className={labelClasses}>Asesor de preferencia (Opcional)</label>
                        <div className="relative">
                            <select {...register('assigned_to')} className={`${inputClasses} appearance-none cursor-pointer`}>
                                <option value="">Sin preferencia — se asignará automáticamente</option>
                                {advisors.map(a => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                )}

                {/* Presupuesto */}
                <div>
                    <label className={labelClasses}>Presupuesto aproximado</label>
                    <div className="relative">
                        <select {...register('budget_range')} className={`${inputClasses} appearance-none cursor-pointer`}>
                            <option value="" disabled>Selecciona tu presupuesto</option>
                            <option value="65000000">60M - 80M COP</option>
                            <option value="90000000">80M - 100M COP</option>
                            <option value="125000000">100M - 150M COP</option>
                            <option value="175000000">150M - 200M COP</option>
                            <option value="250000000">Más de 200M COP</option>
                        </select>
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                    {errors.budget_range && <p className="text-xs text-red-500 mt-1 font-medium">{errors.budget_range.message}</p>}
                </div>

                {/* Forma de pago */}
                <div>
                    <label className={labelClasses}>Forma de pago</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { value: 'credito_banco', label: 'Crédito banco' },
                            { value: 'recursos_propios', label: 'Recursos propios' },
                            { value: 'no_definido', label: 'No tengo claro todavía' },
                        ].map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setValue('payment_method', opt.value)}
                                className={`py-3 px-4 rounded-xl border text-[13px] font-bold transition-all text-center ${paymentMethod === opt.value ? 'bg-[#00D4AA] border-[#00D4AA] text-[#0A0F1C]' : 'bg-[#121c19] border-white/10 text-slate-300 hover:border-white/20'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    {errors.payment_method && <p className="text-xs text-red-500 mt-1 font-medium">{errors.payment_method.message}</p>}
                </div>

                {/* Preferencia de contacto */}
                <div>
                    <label className={labelClasses}>Preferencia de contacto</label>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            type="button"
                            onClick={() => setValue('preferred_channel', 'whatsapp')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-[13px] font-bold transition-all ${preferredChannel === 'whatsapp' ? 'bg-[#00D4AA] border-[#00D4AA] text-[#0A0F1C]' : 'bg-[#121c19] border-white/10 text-slate-300 hover:border-white/20'}`}
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">WhatsApp</span>
                            <span className="sm:hidden">WApp</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setValue('preferred_channel', 'call')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-[13px] font-bold transition-all ${preferredChannel === 'call' ? 'bg-[#00D4AA] border-[#00D4AA] text-[#0A0F1C]' : 'bg-[#121c19] border-white/10 text-slate-300 hover:border-white/20'}`}
                        >
                            <Phone className="w-4 h-4" />
                            Llamada
                        </button>
                        <button
                            type="button"
                            onClick={() => setValue('preferred_channel', 'email')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-[13px] font-bold transition-all ${preferredChannel === 'email' ? 'bg-[#00D4AA] border-[#00D4AA] text-[#0A0F1C]' : 'bg-[#121c19] border-white/10 text-slate-300 hover:border-white/20'}`}
                        >
                            <Mail className="w-4 h-4" />
                            Email
                        </button>
                    </div>
                </div>

                {/* Mensaje */}
                <div>
                    <label className={labelClasses}>Mensaje adicional (Opcional)</label>
                    <textarea
                        {...register('message')}
                        placeholder="¿Tienes alguna duda específica?"
                        rows={3}
                        className={`${inputClasses} resize-none`}
                    />
                </div>

                {/* Espaciador flexible para empujar botón abajo si hay espacio */}
                <div className="flex-1"></div>

                {/* Botón enviar */}
                <div className="mt-2 text-center">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#00D4AA] hover:bg-[#00B38F] text-[#0A0F1C] font-black text-[15px] py-4 rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(0,212,170,0.2)] hover:shadow-[0_6px_20px_rgba(0,212,170,0.3)] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar Cotización'}
                        {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                    </button>
                    <div className="flex items-center justify-center gap-1.5 mt-4">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Tus datos están protegidos</span>
                    </div>
                </div>
            </form>
        </div>
    );
}
