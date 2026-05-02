import { fetchApi } from '../lib/api';

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    phone?: string;
    city?: string;
    role: string;
    avatarUrl?: string;
    createdAt: string;
}

export interface UsersResponse {
    data: AdminUser[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreateEmployeeData {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: string;
    cedula?: string;
    city?: string;
}

export const userAdminService = {
    /**
     * Listar usuarios con filtros (solo para admins)
     */
    getUsers: async (params: { search?: string; role?: string; page?: number; limit?: number }) => {
        const query = new URLSearchParams();
        if (params.search) query.append('search', params.search);
        if (params.role) query.append('role', params.role);
        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());

        return fetchApi<UsersResponse>(`/api/users?${query.toString()}`);
    },

    /**
     * Cambiar el rol de un usuario (solo para super_admins)
     */
    updateRole: async (userId: number, role: string) => {
        return fetchApi(`/api/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role }),
        });
    },

    /**
     * Crear un usuario empleado (solo para super_admins)
     */
    createEmployee: async (data: CreateEmployeeData) => {
        return fetchApi(`/api/users`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
};
