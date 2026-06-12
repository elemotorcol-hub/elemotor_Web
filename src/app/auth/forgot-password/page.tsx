'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { authService } from '@/services/auth.service';

const schema = z.object({
    email: z.string().email('Por favor ingresa un email válido'),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
    const [sent, setSent] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormValues) => {
        setServerError(null);
        try {
            await authService.forgotPassword({ email: data.email });
            setSent(true);
        } catch {
            // Mostramos mensaje genérico — el backend siempre responde 200 por seguridad
            setSent(true);
        }
    };

    return (
        <div className="w-full max-w-[420px] bg-[#131f1c] rounded-2xl border border-white/10 p-8 shadow-[0_0_40px_-15px_rgba(16,185,129,0.15)] relative z-10">
            {/* Logo */}
            <div className="flex justify-center mb-8">
                <div className="relative w-40 h-10">
                    <Image src="/logo-elementor1.avif" alt="Elemotor" fill className="object-contain brightness-125" priority />
                </div>
            </div>

            {sent ? (
                /* ── Estado: email enviado ── */
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-[#10B981]" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Revisa tu correo</h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Si <span className="text-white font-medium">{getValues('email')}</span> está registrado,
                        recibirás un enlace para restablecer tu contraseña en los próximos minutos.
                    </p>
                    <p className="text-xs text-slate-500">
                        Revisa también tu carpeta de spam.
                    </p>
                    <Link
                        href="/auth/login"
                        className="mt-2 w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-emerald-400 text-[#0A110F] font-semibold py-3 rounded-lg transition-colors text-sm"
                    >
                        Volver al inicio de sesión
                    </Link>
                </div>
            ) : (
                /* ── Formulario ── */
                <>
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-white mb-2">¿Olvidaste tu contraseña?</h1>
                        <p className="text-sm text-slate-400">
                            Ingresa tu email y te enviaremos un enlace para restablecerla.
                        </p>
                    </div>

                    {serverError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="nombre@ejemplo.com"
                                    className="w-full bg-[#121c19] border border-white/5 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all"
                                />
                            </div>
                            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#10B981] hover:bg-emerald-400 text-[#0A110F] font-semibold py-3 rounded-lg transition-colors disabled:opacity-70 text-sm"
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#10B981] transition-colors">
                            <ArrowLeft size={14} />
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
