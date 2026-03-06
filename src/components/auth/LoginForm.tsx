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

const loginSchema = z.object({
    email: z.string().email('Por favor ingresa un email válido'),
    password: z.string().min(1, 'La contraseña es requerida')
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const router = useRouter();

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
            const hasAdminAccess = ['admin', 'super_admin', 'advisor'].includes(result.role as string);
            if (hasAdminAccess) {
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

            <div className="mt-6 flex flex-col gap-3">
                <button type="button" className="w-full flex items-center justify-center gap-3 bg-[#121c19] hover:bg-[#1a2824] border border-white/5 text-slate-300 text-sm font-medium py-3 rounded-lg transition-colors">
                    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </button>
                <button type="button" className="w-full flex items-center justify-center gap-3 bg-[#121c19] hover:bg-[#1a2824] border border-white/5 text-slate-300 text-sm font-medium py-3 rounded-lg transition-colors">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#10B981]">
                        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                    </svg>
                    Ingreso rápido por WhatsApp
                </button>
            </div>

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
