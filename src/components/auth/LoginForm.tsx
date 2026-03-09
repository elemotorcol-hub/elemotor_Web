'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { loginAction } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { hasAdminAccess } from '@/lib/roles';
import { useExternalAuth } from '@/hooks/useExternalAuth';
import ExternalAuth from './ExternalAuth';

const loginSchema = z.object({
    email: z.string().email('Por favor ingresa un email válido'),
    password: z.string().min(1, 'La contraseña es requerida')
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const router = useRouter();
    const externalAuth = useExternalAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit = async (data: LoginFormValues) => {
        setAuthError(null);
        const result = await loginAction(data.email, data.password);

        if (result?.error) {
            setAuthError(result.error);
        } else if (result?.success) {
            if (hasAdminAccess(result.role)) {
                router.push('/admin/inventory');
            } else {
                router.push('/dashboard');
            }
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
                <h1 className="text-2xl font-bold text-white mb-2">Bienvenido de vuelta</h1>
                <p className="text-sm text-slate-400 text-center">Ingresa tus credenciales para acceder al panel.</p>
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
                        </div>

                        {/* Recordarme & Olvidaste contraseña */}
                        <div className="flex items-center justify-between mt-1 mb-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        className="peer appearance-none w-4 h-4 border border-white/20 rounded-sm bg-[#121c19] checked:bg-[#10B981] checked:border-[#10B981] transition-all cursor-pointer"
                                    />
                                    <svg className="absolute w-3 h-3 text-[#0A110F] opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Recordarme</span>
                            </label>
                            <Link href="#" className="text-xs font-medium text-[#10B981] hover:text-emerald-400 hover:underline transition-colors">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#10B981] hover:bg-emerald-400 text-[#0A110F] font-semibold py-3 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
                        >
                            {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
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
                    ¿No tienes cuenta?{' '}
                    <Link href="/auth/register" className="text-[#10B981] font-medium hover:underline hover:text-emerald-400 transition-colors">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
}
