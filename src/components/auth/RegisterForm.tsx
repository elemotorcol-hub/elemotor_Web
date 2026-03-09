'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { registerAction } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { useExternalAuth } from '@/hooks/useExternalAuth';
import ExternalAuth from './ExternalAuth';

const registerSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Por favor ingresa un email válido'),
    phone: z.string().min(10, 'El teléfono debe tener al menos 10 caracteres'),
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, 'La contraseña no cumple los requisitos de seguridad')
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const PASSWORD_REQUIREMENTS = [
    { regex: /.{8,}/, label: 'Mínimo 8 caracteres' },
    { regex: /[A-Z]/, label: 'Al menos una mayúscula' },
    { regex: /[a-z]/, label: 'Al menos una minúscula' },
    { regex: /\d/, label: 'Al menos un número' },
    { regex: /[\W_]/, label: 'Al menos un símbolo' },
];

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const router = useRouter();
    const externalAuth = useExternalAuth();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: ''
        }
    });

    const currentPassword = watch('password') || '';

    const onSubmit = async (data: RegisterFormValues) => {
        setAuthError(null);
        const result = await registerAction(data.name, data.email, data.phone, data.password);

        if (result?.error) {
            setAuthError(result.error);
        } else if (result?.success) {
            // Un usuario recién registrado siempre es CUSTOMER en este flow
            router.push('/dashboard');
        }
    };

    return (
        <div className="w-full max-w-[420px] bg-[#131f1c] rounded-2xl border border-white/10 p-8 shadow-[0_0_40px_-15px_rgba(16,185,129,0.15)] relative z-10">
            {/* Header / Logo */}
            <div className="flex flex-col items-center mb-8">
                <div className="flex justify-center mb-6 w-full">
                    <div className="relative w-40 h-10">
                        <Image
                            src="/logo-elementor1.avif"
                            alt="Elemotor Logo"
                            fill
                            className="object-contain brightness-125"
                            priority
                        />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Crea tu cuenta</h1>
                <p className="text-sm text-slate-400 text-center">Únete a la revolución de la movilidad eléctrica.</p>
            </div>

            {/* Form */}
            {externalAuth.otpStep === 'none' ? (
                <>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                        {authError && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-lg text-center mb-2">
                                {authError}
                            </div>
                        )}

                        {/* Nombre completo */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-300">Nombre completo</label>
                            <input
                                {...register('name')}
                                type="text"
                                placeholder="Juan Pérez"
                                className="w-full bg-[#121c19] border border-white/5 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                            />
                            {errors.name && <span className="text-xs text-red-500 mt-0.5">{errors.name.message}</span>}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-300">Email</label>
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="nombre@ejemplo.com"
                                className="w-full bg-[#121c19] border border-white/5 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                            />
                            {errors.email && <span className="text-xs text-red-500 mt-0.5">{errors.email.message}</span>}
                        </div>

                        {/* Teléfono */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-300">Teléfono</label>
                            <input
                                {...register('phone')}
                                type="text"
                                placeholder="+57 300 000 0000"
                                className="w-full bg-[#121c19] border border-white/5 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                            />
                            {errors.phone && <span className="text-xs text-red-500 mt-0.5">{errors.phone.message}</span>}
                        </div>

                        {/* Contraseña */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-300">Contraseña</label>
                            <div className="relative">
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="w-full bg-[#121c19] border border-white/5 rounded-lg pl-4 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <span className="text-xs text-red-500 mt-0.5">{errors.password.message}</span>}
                            
                            {/* Visual Password Feedback */}
                            <div className="flex flex-col gap-1 mt-1.5 p-3 rounded-lg bg-black/20 border border-white/5">
                                <span className="text-xs font-medium text-slate-300 mb-1">Tu contraseña debe contener:</span>
                                {PASSWORD_REQUIREMENTS.map((req, index) => {
                                    const isMet = req.regex.test(currentPassword);
                                    return (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className={`flex items-center justify-center w-3 h-3 rounded-full transition-colors ${isMet ? 'bg-[#10B981]' : 'bg-slate-700'}`}>
                                                {isMet && <svg className="w-2 h-2 text-[#0A110F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <span className={`text-[11px] transition-colors ${isMet ? 'text-slate-300' : 'text-slate-500'}`}>{req.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#10B981] hover:bg-emerald-400 text-[#0A110F] font-semibold py-3 rounded-lg transition-colors mt-2 disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
                        >
                            {isSubmitting ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-center gap-4">
                        <div className="h-px bg-white/5 flex-1"></div>
                        <span className="text-xs text-slate-500">o continúa con</span>
                        <div className="h-px bg-white/5 flex-1"></div>
                    </div>

                    <ExternalAuth {...externalAuth} />
                </>
            ) : (
                <ExternalAuth {...externalAuth} />
            )}

            <div className="mt-8 text-center border-t border-white/5 pt-6">
                <p className="text-sm text-slate-400">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/auth/login" className="text-[#10B981] font-medium hover:underline hover:text-emerald-400 transition-colors">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
