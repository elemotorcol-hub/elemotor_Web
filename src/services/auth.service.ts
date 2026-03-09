import { fetchApi } from '../lib/api';

export const authService = {
    login: async (credentials: any) => {
        return fetchApi('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },
    register: async (userData: any) => {
        return fetchApi('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },
    googleLogin: async (tokenData: any) => {
        return fetchApi('/api/auth/google', {
            method: 'POST',
            body: JSON.stringify(tokenData),
        });
    },
    sendOtp: async (data: any) => {
        return fetchApi('/api/auth/otp/send', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    verifyOtp: async (data: any) => {
        return fetchApi('/api/auth/otp/verify', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    refreshToken: async (data: { refreshToken: string }) => {
        return fetchApi('/api/auth/refresh', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    forgotPassword: async (data: { email: string }) => {
        return fetchApi('/api/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    resetPassword: async (data: any) => {
        return fetchApi('/api/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    logout: async () => {
        // fetchApi inyecta automáticamente el accessToken de la sesión
        return fetchApi('/api/auth/logout', {
            method: 'POST',
        });
    }
};
