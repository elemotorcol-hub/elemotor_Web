'use client';

import React from 'react';

interface ExternalAuthProps {
    authError: string | null;
    otpStep: 'none' | 'phone' | 'code';
    otpPhone: string;
    otpCode: string;
    isOtpLoading: boolean;
    setOtpStep: (step: 'none' | 'phone' | 'code') => void;
    setOtpPhone: (val: string) => void;
    setOtpCode: (val: string) => void;
    handleGoogleLogin: () => void;
    handleOtpFlow: () => void;
    resetOtpFlow: () => void;
}

export default function ExternalAuth({
    authError,
    otpStep,
    otpPhone,
    otpCode,
    isOtpLoading,
    setOtpStep,
    setOtpPhone,
    setOtpCode,
    handleGoogleLogin,
    handleOtpFlow,
    resetOtpFlow
}: ExternalAuthProps) {

    if (otpStep !== 'none') {
        return (
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-white mb-2">{otpStep === 'phone' ? 'Ingresa tu número' : 'Verifica tu código'}</h2>
                {authError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-lg text-center mb-2">
                        {authError}
                    </div>
                )}
                
                {otpStep === 'phone' ? (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-300">Número de teléfono</label>
                        <input type="text" value={otpPhone} onChange={e => setOtpPhone(e.target.value)} placeholder="+57 300 000 0000" className="w-full bg-[#121c19] border border-white/5 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all" />
                        <button type="button" onClick={handleOtpFlow} disabled={isOtpLoading} className="w-full mt-4 bg-[#10B981] hover:bg-emerald-400 text-[#0A110F] font-semibold py-3 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2 text-sm">
                            {isOtpLoading ? 'Enviando...' : 'Enviar Código OTP'}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-300">Código OTP</label>
                        <input type="text" value={otpCode} onChange={e => setOtpCode(e.target.value)} placeholder="Ej: 123456" className="w-full text-center tracking-widest bg-[#121c19] border border-white/5 rounded-lg px-4 py-3 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all" />
                        <button type="button" onClick={handleOtpFlow} disabled={isOtpLoading} className="w-full mt-4 bg-[#10B981] hover:bg-emerald-400 text-[#0A110F] font-semibold py-3 rounded-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2 text-sm">
                            {isOtpLoading ? 'Verificando...' : 'Verificar Código'}
                        </button>
                    </div>
                )}

                <button type="button" onClick={resetOtpFlow} className="text-xs text-slate-400 mt-2 hover:text-white transition-colors text-center w-full">
                    Volver
                </button>
            </div>
        );
    }

    return (
        <div className="mt-6 flex flex-col gap-3">
            <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 bg-[#121c19] hover:bg-[#1a2824] border border-white/5 text-slate-300 text-sm font-medium py-3 rounded-lg transition-colors">
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
            </button>
            <button type="button" onClick={() => setOtpStep('phone')} className="w-full flex items-center justify-center gap-3 bg-[#121c19] hover:bg-[#1a2824] border border-white/5 text-slate-300 text-sm font-medium py-3 rounded-lg transition-colors">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#10B981]">
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                </svg>
                Ingreso rápido por WhatsApp
            </button>
        </div>
    );
}
