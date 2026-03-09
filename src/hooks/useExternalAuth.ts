import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { googleAuthAction, sendOtpAction, verifyOtpAction } from '@/actions/auth';
import { hasAdminAccess } from '@/lib/roles';

export function useExternalAuth() {
    const router = useRouter();
    const [authError, setAuthError] = useState<string | null>(null);
    const [otpStep, setOtpStep] = useState<'none' | 'phone' | 'code'>('none');
    const [otpPhone, setOtpPhone] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [isOtpLoading, setIsOtpLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setAuthError(null);
        // TODO: Remover token estático e integrar Google SDK (@react-oauth/google)
        const mockIdToken = "mock_google_id_token_12345";
        const result = await googleAuthAction(mockIdToken);
        if (result?.error) {
            setAuthError(result.error);
        } else if (result?.success) {
            router.push(hasAdminAccess(result.role) ? '/admin/inventory' : '/dashboard');
        }
    };

    const handleOtpFlow = async () => {
        setAuthError(null);
        if (otpStep === 'phone') {
            if (!otpPhone || otpPhone.length < 10) return setAuthError('Ingresa un teléfono válido');
            setIsOtpLoading(true);
            const res = await sendOtpAction(otpPhone);
            setIsOtpLoading(false);
            if (res?.error) setAuthError(res.error);
            else setOtpStep('code');
        } else if (otpStep === 'code') {
            if (!otpCode || otpCode.length < 4) return setAuthError('Ingresa un código válido');
            setIsOtpLoading(true);
            const res = await verifyOtpAction(otpPhone, otpCode);
            setIsOtpLoading(false);
            if (res?.error) setAuthError(res.error);
            else {
                router.push(hasAdminAccess(res?.role) ? '/admin/inventory' : '/dashboard');
            }
        }
    };

    const resetOtpFlow = () => {
        setOtpStep('none');
        setAuthError(null);
    };

    return {
        authError,
        setAuthError,
        otpStep,
        setOtpStep,
        otpPhone,
        setOtpPhone,
        otpCode,
        setOtpCode,
        isOtpLoading,
        handleGoogleLogin,
        handleOtpFlow,
        resetOtpFlow,
    };
}
