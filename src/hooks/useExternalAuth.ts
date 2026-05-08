import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { googleAuthAction } from '@/actions/auth';
import { hasAdminAccess } from '@/lib/roles';

export function useExternalAuth() {
    const router = useRouter();
    const [authError, setAuthError] = useState<string | null>(null);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleGoogleLogin = async (idToken: string) => {
        setAuthError(null);
        setIsGoogleLoading(true);
        const result = await googleAuthAction(idToken);
        setIsGoogleLoading(false);
        if (result?.error) {
            setAuthError(result.error);
        } else if (result?.success) {
            router.push(hasAdminAccess(result.role) ? '/admin/inventory' : '/dashboard');
        }
    };

    return {
        authError,
        setAuthError,
        isGoogleLoading,
        handleGoogleLogin,
    };
}
