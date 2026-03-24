import { fetchApi } from '../lib/api';

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone?: string;
    cedula?: string;
    city?: string;
    role: string;
    avatarUrl?: string;
    avatarPublicId?: string;
    createdAt: string;
}

export interface UpdateProfileDto {
    name?: string;
    phone?: string;
    cedula?: string;
    city?: string;
    avatarUrl?: string | null;
    avatarPublicId?: string | null;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export const userService = {
    getProfile: async (): Promise<UserProfile> => {
        return fetchApi<UserProfile>('/api/users/me');
    },

    updateProfile: async (data: UpdateProfileDto): Promise<UserProfile> => {
        return fetchApi<UserProfile>('/api/users/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    changePassword: async (data: ChangePasswordPayload): Promise<{ message: string }> => {
        return fetchApi<{ message: string }>('/api/users/me/password', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
};
