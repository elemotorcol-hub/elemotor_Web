'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';

const schema = z.object({
    newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});
type FormValues = z.infer<typeof schema>;

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormValues) => {
        setServerError(null);
        if (!token) {
            setServerError('Token de recuperación inválido o expirado. Solicita uno nuevo.');
            return;
        }
        try {
            await authService.resetPassword({ token, newPassword: data.newPassword });
            setSuccess(true);
            setTimeout(() => router.push('/auth/login'), 3000);
        } catch (err: any) {
            setServerError(
                err?.message ?? 'El enlace de recuperación es inválido o ha expirado. Solicita uno nuevo.'
            );
        }
    };

    if (!token) {
        return (
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Enlace inválido</h2>
                <p className="text-sm text-slate-400">Este enlace de recuperación no es válido o ha expirado.</p>
                <Link href="/auth/forgot-password" className="w-full flex items-center justify-center bg-[#10B981] hover:bg-emerald-400 text-[#0A110F] font-semibold py-3 rounded-lg transition-colors text-sm">
                    Solicitar nuevo enlace
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-[#10B981]" />
                </div>
                <h2 className="text-xl font-bold text-white">¡Contraseña actualizada!</h2>
                <p className="text-sm text-slate-400">Tu contraseña ha sido restablecida. Redirigiendo al inicio de sesión...</p>
                <Link href="/auth/login" className="w-full flex items-center justify-center bg-[#10B981] hover:bg-emerald-400 text-[#0A110F] font-semibold py-3 rounded-lg transition-colors text-sm">
                    Iniciar sesión
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Nueva contraseña</h1>
                <p className="text-sm text-slate-400">Elige una contraseña segura para tu cuenta.</p>
            </div>

            {serverError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
                    {serverError}
                    {serverError.includes('expirado') && (
                        <div className="mt-2">
                            <Link href="/auth/forgot-password" className="text-[#10B981] underline text-xs">
                                Solicitar nuevo enlace
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* Nueva contraseña */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-300">Nueva contraseña</label>
                    <div className="relative">
                        <input
                            {...register('newPassword')}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Mínimo 8 caracteres"
                            className="w-full bg-[#121c19] border border-white/5 rounded-lg pl-4 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.newPassword && <span className="text-xs text-red-500">{errors.newPassword.message}</span>}
                </div>

                {/* Confirmar contraseña */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-300">Confirmar contraseña</label>
                    <div className="relative">
                        <input
                            {...register('confirmPassword')}
                            type={showConfirm ? 'text' : 'password'}
                            placeholder="Repite la contraseña"
                            className="w-full bg-[#121c19] border border-white/5 rounded-lg pl-4 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#10B981] hover:bg-emerald-400 text-[#0A110F] font-semibold py-3 rounded-lg transition-colors disabled:opacity-70 text-sm mt-2"
                >
                    {isSubmitting ? 'Guardando...' : 'Restablecer contraseña'}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="w-full max-w-[420px] bg-[#131f1c] rounded-2xl border border-white/10 p-8 shadow-[0_0_40px_-15px_rgba(16,185,129,0.15)] relative z-10">
            <div className="flex justify-center mb-8">
                <div className="relative w-40 h-10">
                    <Image src="/logo-elementor1.avif" alt="Elemotor" fill className="object-contain brightness-125" priority />
                </div>
            </div>
            <Suspense fallback={<div className="text-slate-400 text-sm text-center">Cargando...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
