'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { KeyRound, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/Button';

const securitySchema = z.object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z.string()
        .min(8, 'Debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número')
        .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
    confirmPassword: z.string().min(1, 'Confirmación requerida'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type SecurityFormValues = z.infer<typeof securitySchema>;

export function SecurityForm() {
    const [isSaving, setIsSaving] = React.useState(false);
    const [savedSuccess, setSavedSuccess] = React.useState(false);
    
    const [showCurrent, setShowCurrent] = React.useState(false);
    const [showNew, setShowNew] = React.useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<SecurityFormValues>({
        resolver: zodResolver(securitySchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: SecurityFormValues) => {
        setIsSaving(true);
        setSavedSuccess(false);
        // Simulate API call
        setTimeout(() => {
            console.log('Password updated', data);
            setIsSaving(false);
            setSavedSuccess(true);
            reset(); // Clear form
            
            setTimeout(() => setSavedSuccess(false), 3000);
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
            
            <div className="p-5 rounded-2xl bg-[#10B981]/5 border border-[#10B981]/10 flex gap-5 mb-8">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-[#10B981]" />
                </div>
                <div>
                    <h4 className="text-base font-bold text-white mb-2">Protección de Cuenta</h4>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                        Para garantizar la máxima seguridad de tus datos y rastreos, tu nueva contraseña debe cumplir con:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        <li className="flex items-center gap-2 text-xs text-slate-400">
                            <div className="w-1 h-1 rounded-full bg-[#10B981]" />
                            Mínimo 8 caracteres
                        </li>
                        <li className="flex items-center gap-2 text-xs text-slate-400">
                            <div className="w-1 h-1 rounded-full bg-[#10B981]" />
                            Una letra mayúscula
                        </li>
                        <li className="flex items-center gap-2 text-xs text-slate-400">
                            <div className="w-1 h-1 rounded-full bg-[#10B981]" />
                            Al menos un número
                        </li>
                        <li className="flex items-center gap-2 text-xs text-slate-400">
                            <div className="w-1 h-1 rounded-full bg-[#10B981]" />
                            Un carácter especial (!@#$%^&*)
                        </li>
                    </ul>
                </div>
            </div>

            <div className="space-y-6">
                
                {/* Current Password */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">
                        Contraseña Actual
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                            <KeyRound className="h-4 w-4" />
                        </div>
                        <input
                            type={showCurrent ? "text" : "password"}
                            {...register('currentPassword')}
                            className={`w-full bg-[#15201D] border ${errors.currentPassword ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#10B981]'} text-white rounded-xl py-3 pl-11 pr-12 outline-none transition-all placeholder:text-slate-600 focus:bg-[#0A110F]`}
                            placeholder="••••••••"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                        >
                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.currentPassword && <p className="text-xs text-red-400 ml-1">{errors.currentPassword.message}</p>}
                </div>

                <div className="border-t border-white/5 py-2"></div>

                {/* New Password */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">
                        Nueva Contraseña
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <input
                            type={showNew ? "text" : "password"}
                            {...register('newPassword')}
                            className={`w-full bg-[#15201D] border ${errors.newPassword ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#10B981]'} text-white rounded-xl py-3 pl-11 pr-12 outline-none transition-all placeholder:text-slate-600 focus:bg-[#0A110F]`}
                            placeholder="••••••••"
                        />
                        <button 
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                        >
                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.newPassword && <p className="text-xs text-red-400 ml-1">{errors.newPassword.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-slate-400 ml-1">
                        Confirmar Nueva Contraseña
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                        <input
                            type="password"
                            {...register('confirmPassword')}
                            className={`w-full bg-[#15201D] border ${errors.confirmPassword ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#10B981]'} text-white rounded-xl py-3 pl-11 pr-4 outline-none transition-all placeholder:text-slate-600 focus:bg-[#0A110F]`}
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-400 ml-1">{errors.confirmPassword.message}</p>}
                </div>
            </div>

            <div className="pt-6 flex items-center gap-4">
                <Button 
                    type="submit" 
                    disabled={!isDirty || isSaving}
                    className="bg-white hover:bg-slate-200 disabled:bg-white/10 disabled:text-slate-500 text-slate-900 font-bold px-8 py-3 h-auto"
                >
                    {isSaving ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                            Actualizando...
                        </div>
                    ) : (
                        "Actualizar Contraseña"
                    )}
                </Button>
                
                {savedSuccess && (
                    <span className="text-sm font-bold text-[#10B981] animate-in fade-in">
                        ¡Contraseña actualizada!
                    </span>
                )}
            </div>
        </form>
    );
}
