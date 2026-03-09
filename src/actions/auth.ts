'use server';

import { createSession, deleteSession } from '@/lib/auth';
import { authService } from '@/services/auth.service';

export async function loginAction(email: string, password: string) {
    try {
        const response = await authService.login({ email, password });
        
        const { accessToken, refreshToken, user } = response;

        if (!user || !accessToken) {
            return { error: 'Credenciales inválidas' };
        }

        await createSession({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }, accessToken, refreshToken);

        return { success: true, role: user.role };
    } catch (error: any) {
        return { error: error.message || 'Error al iniciar sesión' };
    }
}

export async function registerAction(name: string, email: string, phone: string, password: string) {
    try {
        const response = await authService.register({ name, email, phone, password });

        const { accessToken, refreshToken, user } = response;

        if (!user || !accessToken) {
            return { error: 'Error en el registro' };
        }

        await createSession({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }, accessToken, refreshToken);

        return { success: true, role: user.role };
    } catch (error: any) {
        return { error: error.message || 'Error al registrar usuario' };
    }
}

export async function logoutAction() {
    try {
        await authService.logout();
    } catch (error) {
        // Ignorar error de red si el token ya expiró o backend cae
    } finally {
        await deleteSession();
    }
}

export async function sendOtpAction(phoneOrEmail: string) {
    try {
        await authService.sendOtp({ phoneOrEmail });
        return { success: true };
    } catch (error: any) {
        return { error: error.message || 'Error al enviar código' };
    }
}

export async function verifyOtpAction(phoneOrEmail: string, code: string) {
    try {
        const response = await authService.verifyOtp({ phoneOrEmail, code });
        const { accessToken, refreshToken, user } = response;

        if (!user || !accessToken) {
            return { error: 'Código inválido' };
        }

        await createSession({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }, accessToken, refreshToken);

        return { success: true, role: user.role };
    } catch (error: any) {
        return { error: error.message || 'Error al verificar código' };
    }
}

export async function googleAuthAction(idToken: string) {
    try {
        const response = await authService.googleLogin({ idToken });
        const { accessToken, refreshToken, user } = response;

        if (!user || !accessToken) {
            return { error: 'Autenticación con Google fallida' };
        }

        await createSession({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }, accessToken, refreshToken);

        return { success: true, role: user.role };
    } catch (error: any) {
        return { error: error.message || 'Error en Google Auth' };
    }
}

export async function forgotPasswordAction(email: string) {
    try {
        await authService.forgotPassword({ email });
        return { success: true };
    } catch (error: any) {
        return { error: error.message || 'Error al solicitar recuperación' };
    }
}

export async function resetPasswordAction(token: string, newPassword: string) {
    try {
        await authService.resetPassword({ token, newPassword });
        return { success: true };
    } catch (error: any) {
        return { error: error.message || 'Error al restablecer contraseña' };
    }
}
